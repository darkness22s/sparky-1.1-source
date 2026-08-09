/**
 * CheckpointStore - Repository interface for filesystem-backed workspace checkpoints.
 *
 * Owns content-addressed workspace checkpoint capture, restore, and diff
 * computation. Snapshot objects and metadata live in Sparky application data,
 * never in the workspace or the user's Git repository.
 *
 * Uses Effect `Context.Service` for dependency injection and exposes typed
 * domain errors for checkpoint storage operations.
 *
 * @module CheckpointStore
 */
import { type CheckpointRef } from "@sparky/contracts";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";

import { CheckpointStoreOperationError, type CheckpointStoreError } from "./Errors.ts";
import {
  SnapshotEngine,
  type CheckpointMetadata,
  type SnapshotCleanupResult,
  type SnapshotDiff,
  type SnapshotRefRecord,
  type SnapshotRestoreResult,
} from "./SnapshotEngine.ts";
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
  const seenRemoved = new Map<string, number>();
  const seenAdded = new Map<string, number>();
  return lines
    .filter((line) => {
      const isRemoved = line.startsWith("-") && !line.startsWith("---");
      const isAdded = line.startsWith("+") && !line.startsWith("+++");
      if (!isRemoved && !isAdded) return true;
      const key = line.slice(1).trim();
      const seen = isRemoved ? seenRemoved : seenAdded;
      const next = (seen.get(key) ?? 0) + 1;
      seen.set(key, next);
      return next > (matched.get(key) ?? 0);
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

export interface CreateDetailedCheckpointInput extends CaptureCheckpointInput {
  readonly metadata: CheckpointMetadata;
  readonly maxFileSizeBytes?: number;
  readonly ignoredPaths?: ReadonlyArray<string>;
}

export interface DetailedCheckpointResult {
  readonly record: SnapshotRefRecord;
  readonly approximateSize: number;
  readonly diff: SnapshotDiff | null;
}

/** Service tag for checkpoint persistence and restore operations. */
export class CheckpointStore extends Context.Service<
  CheckpointStore,
  {
    /** Check whether cwd is inside a repository; retained for status compatibility. */
    readonly isGitRepository: (cwd: string) => Effect.Effect<boolean, CheckpointStoreError>;

    /**
     * Capture a checkpoint and store it at the provided ref.
     *
     * Uses the application-data snapshot store and never touches repository metadata.
     */
    readonly captureCheckpoint: (
      input: CaptureCheckpointInput,
    ) => Effect.Effect<void, CheckpointStoreError>;

    /** Check whether a checkpoint ref exists. */
    readonly hasCheckpointRef: (
      input: Omit<RestoreCheckpointInput, "fallbackToHead">,
    ) => Effect.Effect<boolean, CheckpointStoreError>;

    /**
     * Restore workspace files to a checkpoint.
     *
     * Missing refs return `false` when fallback is disabled.
     */
    readonly restoreCheckpoint: (
      input: RestoreCheckpointInput,
    ) => Effect.Effect<boolean, CheckpointStoreError>;

    /**
     * Compute a patch diff between two checkpoint refs.
     *
     * Missing baseline refs are handled by the caller when necessary.
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

    /** Extended local snapshot APIs used by automatic action checkpoints. */
    readonly createDetailedCheckpoint?: (
      input: CreateDetailedCheckpointInput,
    ) => Effect.Effect<DetailedCheckpointResult, CheckpointStoreError>;
    readonly getCheckpointRecord?: (
      input: Omit<RestoreCheckpointInput, "fallbackToHead">,
    ) => Effect.Effect<SnapshotRefRecord | null, CheckpointStoreError>;
    readonly listCheckpointRecords?: (
      cwd: string,
    ) => Effect.Effect<ReadonlyArray<SnapshotRefRecord>, CheckpointStoreError>;
    readonly restoreCheckpointDetailed?: (
      input: RestoreCheckpointInput,
    ) => Effect.Effect<SnapshotRestoreResult | null, CheckpointStoreError>;
    readonly pinCheckpoint?: (
      input: Omit<RestoreCheckpointInput, "fallbackToHead"> & { readonly pinned?: boolean },
    ) => Effect.Effect<boolean, CheckpointStoreError>;
    readonly cleanup?: (input: {
      readonly cwd: string;
      readonly maximumCheckpoints: number;
      readonly maximumTotalStorageBytes?: number;
    }) => Effect.Effect<SnapshotCleanupResult, CheckpointStoreError>;
  }
>()("t3/checkpointing/CheckpointStore") {}

export const make = Effect.gen(function* () {
  const config = yield* ServerConfig.ServerConfig;
  const engine = new SnapshotEngine({ storageRoot: config.checkpointsDir });

  const run = <T>(operation: string, cwd: string, promise: () => Promise<T>) =>
    Effect.tryPromise({
      try: promise,
      catch: (cause) =>
        new CheckpointStoreOperationError({
          operation,
          cwd,
          detail: cause instanceof Error ? cause.message : String(cause),
        }),
    });

  // Retained for compatibility with callers that display repository status;
  // snapshot support itself does not require Git.
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
      const result = await engine.diff(input.cwd, input.fromCheckpointRef, input.toCheckpointRef);
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

  const createDetailedCheckpoint = Effect.fn("createDetailedCheckpoint")(function* (
    input: CreateDetailedCheckpointInput,
  ) {
    return yield* run("CheckpointStore.createDetailedCheckpoint", input.cwd, async () => {
      engine.configure({
        ...(input.maxFileSizeBytes !== undefined
          ? { maxFileSizeBytes: input.maxFileSizeBytes }
          : {}),
        ...(input.ignoredPaths !== undefined ? { ignoredPaths: input.ignoredPaths } : {}),
      });
      const captured = await engine.capture(input.cwd, input.checkpointRef, input.metadata);
      const parent = input.metadata.parentCheckpointRef;
      const parentExists = parent ? await engine.has(input.cwd, parent) : false;
      const diff =
        parent && parentExists ? await engine.diff(input.cwd, parent, input.checkpointRef) : null;
      const changedFiles = diff?.files.map(({ path, previousPath, kind, binary }) => ({
        path,
        ...(previousPath ? { previousPath } : {}),
        kind,
        binary,
      }));
      const metadata = { ...input.metadata, ...(changedFiles ? { changedFiles } : {}) };
      if (changedFiles) {
        await engine.updateMetadata(input.cwd, input.checkpointRef, metadata);
      }
      return {
        record: { ...captured.record, metadata },
        approximateSize: captured.manifest.approximateSize,
        diff,
      } satisfies DetailedCheckpointResult;
    });
  });

  const getCheckpointRecord = Effect.fn("getCheckpointRecord")(
    (input: Omit<RestoreCheckpointInput, "fallbackToHead">) =>
      run("CheckpointStore.getCheckpointRecord", input.cwd, () =>
        engine.getRecord(input.cwd, input.checkpointRef),
      ),
  );
  const listCheckpointRecords = Effect.fn("listCheckpointRecords")((cwd: string) =>
    run("CheckpointStore.listCheckpointRecords", cwd, () => engine.listRecords(cwd)),
  );
  const restoreCheckpointDetailed = Effect.fn("restoreCheckpointDetailed")(
    (input: RestoreCheckpointInput) =>
      run("CheckpointStore.restoreCheckpointDetailed", input.cwd, () =>
        engine.restore(input.cwd, input.checkpointRef),
      ),
  );
  const pinCheckpoint = Effect.fn("pinCheckpoint")(
    (input: Omit<RestoreCheckpointInput, "fallbackToHead"> & { readonly pinned?: boolean }) =>
      run("CheckpointStore.pinCheckpoint", input.cwd, () =>
        engine.pin(input.cwd, input.checkpointRef, input.pinned ?? true),
      ),
  );
  const cleanup = Effect.fn("cleanup")(
    (input: {
      readonly cwd: string;
      readonly maximumCheckpoints: number;
      readonly maximumTotalStorageBytes?: number;
    }) =>
      run("CheckpointStore.cleanup", input.cwd, () =>
        engine.cleanup(input.cwd, input.maximumCheckpoints, input.maximumTotalStorageBytes),
      ),
  );

  return CheckpointStore.of({
    isGitRepository,
    captureCheckpoint,
    hasCheckpointRef,
    restoreCheckpoint,
    diffCheckpoints,
    deleteCheckpointRefs,
    createDetailedCheckpoint,
    getCheckpointRecord,
    listCheckpointRecords,
    restoreCheckpointDetailed,
    pinCheckpoint,
    cleanup,
  });
});

export const layer = Layer.effect(CheckpointStore, make);
