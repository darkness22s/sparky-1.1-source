/**
 * CheckpointStore - Repository interface for filesystem-backed workspace checkpoints.
 *
 * Owns hidden Git-ref checkpoint capture/restore and diff computation for a
 * workspace thread timeline. It does not store user-facing checkpoint metadata
 * and does not coordinate provider conversation rollback.
 *
 * The live adapter resolves the active VCS driver once per checkpoint operation
 * and delegates to the driver's optional checkpoint capability.
 *
 * Uses Effect `Context.Service` for dependency injection and exposes typed
 * domain errors for checkpoint storage operations.
 *
 * @module CheckpointStore
 */
import { VcsRepositoryDetectionError, type CheckpointRef } from "@sparky/contracts";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";

import type { CheckpointStoreError } from "./Errors.ts";
import { SnapshotEngine } from "./SnapshotEngine.ts";
import * as ServerConfig from "../config.ts";
import { isGitRepository as detectGitRepository } from "../git/Utils.ts";

function omitWhitespaceOnlyDiffLines(diff: string): string {
  const lines = diff.split("\n");
  const removed = new Map<string, number>();
  const added = new Map<string, number>();
  for (const line of lines) {
    if (line.startsWith("-") && !line.startsWith("---")) {
      const key = line.slice(1).trim();
      removed.set(key, (removed.get(key) ?? 0) + 1);
    } else if (line.startsWith("+") && !line.startsWith("+++")) {
      const key = line.slice(1).trim();
      added.set(key, (added.get(key) ?? 0) + 1);
    }
  }
  const matched = new Map<string, number>();
  for (const [key, count] of removed) {
    matched.set(key, Math.min(count, added.get(key) ?? 0));
  }
  const removedMatches = new Map<string, number>();
  const addedMatches = new Map<string, number>();
  return lines
    .filter((line) => {
      const isRemoved = line.startsWith("-") && !line.startsWith("---");
      const isAdded = line.startsWith("+") && !line.startsWith("+++");
      if (!isRemoved && !isAdded) return true;
      const key = line.slice(1).trim();
      const limit = matched.get(key) ?? 0;
      const seen = isRemoved ? removedMatches : addedMatches;
      const next = (seen.get(key) ?? 0) + 1;
      seen.set(key, next);
      return next > limit;
    })
    .join("\n");
}

export interface CaptureCheckpointInput {
  readonly cwd: string;
  readonly checkpointRef: CheckpointRef;
}

export interface RestoreCheckpointInput {
  readonly cwd: string;
  readonly checkpointRef: CheckpointRef;
  readonly fallbackToHead?: boolean;
}

export interface DiffCheckpointsInput {
  readonly cwd: string;
  readonly fromCheckpointRef: CheckpointRef;
  readonly toCheckpointRef: CheckpointRef;
  readonly fallbackFromToHead?: boolean;
  readonly ignoreWhitespace: boolean;
}

export interface DeleteCheckpointRefsInput {
  readonly cwd: string;
  readonly checkpointRefs: ReadonlyArray<CheckpointRef>;
}

/** Service tag for checkpoint persistence and restore operations. */
export class CheckpointStore extends Context.Service<
  CheckpointStore,
  {
    /** Check whether cwd is inside a Git worktree. */
    readonly isGitRepository: (cwd: string) => Effect.Effect<boolean, CheckpointStoreError>;

    /**
     * Capture a checkpoint commit and store it at the provided checkpoint ref.
     *
     * Uses an isolated temporary Git index and writes a hidden ref.
     */
    readonly captureCheckpoint: (
      input: CaptureCheckpointInput,
    ) => Effect.Effect<void, CheckpointStoreError>;

    /** Check whether a checkpoint ref exists. */
    readonly hasCheckpointRef: (
      input: Omit<RestoreCheckpointInput, "fallbackToHead">,
    ) => Effect.Effect<boolean, CheckpointStoreError>;

    /**
     * Restore workspace and staging state to a checkpoint.
     *
     * Optionally falls back to current `HEAD` when the checkpoint ref is missing.
     */
    readonly restoreCheckpoint: (
      input: RestoreCheckpointInput,
    ) => Effect.Effect<boolean, CheckpointStoreError>;

    /**
     * Compute a patch diff between two checkpoint refs.
     *
     * Can optionally treat a missing "from" ref as `HEAD`.
     */
    readonly diffCheckpoints: (
      input: DiffCheckpointsInput,
    ) => Effect.Effect<string, CheckpointStoreError>;

    /**
     * Delete the provided checkpoint refs.
     *
     * Best-effort delete: missing refs are tolerated.
     */
    readonly deleteCheckpointRefs: (
      input: DeleteCheckpointRefsInput,
    ) => Effect.Effect<void, CheckpointStoreError>;
  }
>()("t3/checkpointing/CheckpointStore") {}

export const make = Effect.gen(function* () {
  const config = yield* ServerConfig.ServerConfig;
  const engine = new SnapshotEngine({
    storageRoot: config.checkpointsDir,
  });

  const run = <T>(operation: string, cwd: string, promise: () => Promise<T>) =>
    Effect.tryPromise({
      try: promise,
      catch: (cause) =>
        new VcsRepositoryDetectionError({
          operation,
          cwd,
          detail: cause instanceof Error ? cause.message : String(cause),
          cause,
        }),
    });

  const isGitRepository: CheckpointStore["Service"]["isGitRepository"] = (cwd) =>
    Effect.sync(() => detectGitRepository(cwd));

  const captureCheckpoint: CheckpointStore["Service"]["captureCheckpoint"] = Effect.fn(
    "captureCheckpoint",
  )(function* (input) {
    yield* run("CheckpointStore.captureCheckpoint", input.cwd, () =>
      engine.capture(input.cwd, input.checkpointRef),
    );
  });

  const hasCheckpointRef: CheckpointStore["Service"]["hasCheckpointRef"] = Effect.fn(
    "hasCheckpointRef",
  )((input) =>
    run("CheckpointStore.hasCheckpointRef", input.cwd, () =>
      engine.has(input.cwd, input.checkpointRef),
    ),
  );

  const restoreCheckpoint: CheckpointStore["Service"]["restoreCheckpoint"] = Effect.fn(
    "restoreCheckpoint",
  )((input) =>
    run("CheckpointStore.restoreCheckpoint", input.cwd, () =>
      engine.restore(input.cwd, input.checkpointRef).then((result) => result !== null),
    ),
  );

  const diffCheckpoints: CheckpointStore["Service"]["diffCheckpoints"] = Effect.fn(
    "diffCheckpoints",
  )((input) =>
    run("CheckpointStore.diffCheckpoints", input.cwd, async () => {
      const result = await engine.diff(
        input.cwd,
        input.fromCheckpointRef,
        input.toCheckpointRef,
      );
      return input.ignoreWhitespace
        ? omitWhitespaceOnlyDiffLines(result.unifiedDiff)
        : result.unifiedDiff;
    }),
  );

  const deleteCheckpointRefs: CheckpointStore["Service"]["deleteCheckpointRefs"] = Effect.fn(
    "deleteCheckpointRefs",
  )(function* (input) {
    yield* run("CheckpointStore.deleteCheckpointRefs", input.cwd, () =>
      engine.deleteRefs(input.cwd, input.checkpointRefs),
    );
  });

  return CheckpointStore.of({
    isGitRepository,
    captureCheckpoint,
    hasCheckpointRef,
    restoreCheckpoint,
    diffCheckpoints,
    deleteCheckpointRefs,
  });
});

export const layer = Layer.effect(CheckpointStore, make);
