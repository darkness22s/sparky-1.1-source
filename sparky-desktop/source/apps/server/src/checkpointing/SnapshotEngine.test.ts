// @effect-diagnostics nodeBuiltinImport:off globalDate:off
import { mkdtemp, mkdir, readFile, rename, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import * as NodePath from "node:path";

import { afterEach, describe, expect, it } from "vite-plus/test";

import { SnapshotEngine } from "./SnapshotEngine.ts";

const temporaryDirectories: string[] = [];

async function temporaryDirectory(label: string): Promise<string> {
  const path = await mkdtemp(NodePath.join(tmpdir(), `${label}-`));
  temporaryDirectories.push(path);
  return path;
}

async function makeHarness(options: { readonly maxFileSizeBytes?: number } = {}) {
  const parent = await temporaryDirectory("sparky-checkpoint-test");
  const project = NodePath.join(parent, "project with spaces");
  const storage = NodePath.join(parent, "app-data", "checkpoints");
  await mkdir(project, { recursive: true });
  return {
    project,
    storage,
    engine: new SnapshotEngine({ storageRoot: storage, ...options }),
  };
}

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map((path) => rm(path, { recursive: true, force: true })),
  );
});

describe("SnapshotEngine", () => {
  it("captures, compares, and restores created, modified, deleted, renamed, spaced, and Unicode files", async () => {
    const { project, engine } = await makeHarness();
    await writeFile(NodePath.join(project, "alpha.txt"), "alpha\n");
    await writeFile(NodePath.join(project, "deleted.txt"), "delete me\n");
    await writeFile(NodePath.join(project, "renamed.txt"), "same bytes\n");
    await writeFile(NodePath.join(project, "مرحبا world.txt"), "unicode\n");
    await engine.capture(project, "checkpoint:before");

    await writeFile(NodePath.join(project, "alpha.txt"), "changed\n");
    await rm(NodePath.join(project, "deleted.txt"));
    await rename(NodePath.join(project, "renamed.txt"), NodePath.join(project, "moved.txt"));
    await writeFile(NodePath.join(project, "created.txt"), "created\n");
    await engine.capture(project, "checkpoint:after");

    const diff = await engine.diff(project, "checkpoint:before", "checkpoint:after");
    expect(diff.files.map(({ path, kind }) => ({ path, kind }))).toEqual([
      { path: "alpha.txt", kind: "modified" },
      { path: "created.txt", kind: "added" },
      { path: "deleted.txt", kind: "deleted" },
      { path: "moved.txt", kind: "renamed" },
    ]);
    expect(diff.unifiedDiff).toContain("rename from renamed.txt");
    expect(diff.unifiedDiff).toContain("+changed");

    const restored = await engine.restore(project, "checkpoint:before");
    expect(restored).not.toBeNull();
    expect(await readFile(NodePath.join(project, "alpha.txt"), "utf8")).toBe("alpha\n");
    expect(await readFile(NodePath.join(project, "deleted.txt"), "utf8")).toBe("delete me\n");
    await expect(readFile(NodePath.join(project, "created.txt"), "utf8")).rejects.toThrow();
    await expect(readFile(NodePath.join(project, "moved.txt"), "utf8")).rejects.toThrow();
    expect(await readFile(NodePath.join(project, "renamed.txt"), "utf8")).toBe("same bytes\n");
  });

  it("works without Git and never changes an existing Git metadata directory", async () => {
    const { project, engine } = await makeHarness();
    await writeFile(NodePath.join(project, "plain.txt"), "one\n");
    await engine.capture(project, "plain:one");
    await writeFile(NodePath.join(project, "plain.txt"), "two\n");
    await engine.restore(project, "plain:one");
    expect(await readFile(NodePath.join(project, "plain.txt"), "utf8")).toBe("one\n");

    await mkdir(NodePath.join(project, ".git", "refs"), { recursive: true });
    await writeFile(NodePath.join(project, ".git", "HEAD"), "ref: refs/heads/main\n");
    await writeFile(NodePath.join(project, ".git", "refs", "sentinel"), "untouched\n");
    await engine.capture(project, "git:before");
    await writeFile(NodePath.join(project, ".git", "HEAD"), "user changed git metadata\n");
    await writeFile(NodePath.join(project, "plain.txt"), "three\n");
    await engine.restore(project, "git:before");
    expect(await readFile(NodePath.join(project, ".git", "HEAD"), "utf8")).toBe(
      "user changed git metadata\n",
    );
    expect(await readFile(NodePath.join(project, ".git", "refs", "sentinel"), "utf8")).toBe(
      "untouched\n",
    );
  });

  it("honors default ignores, checkpoint ignore negation, and the large-file limit", async () => {
    const { project, engine } = await makeHarness({ maxFileSizeBytes: 8 });
    await mkdir(NodePath.join(project, "node_modules", "package"), { recursive: true });
    await writeFile(NodePath.join(project, "node_modules", "package", "index.js"), "ignored");
    await writeFile(NodePath.join(project, "large.txt"), "larger than eight bytes");
    await writeFile(NodePath.join(project, "ignored.log"), "ignored");
    await writeFile(NodePath.join(project, "keep.log"), "keep");
    await writeFile(NodePath.join(project, ".sparkycheckpointignore"), "*.log\n!keep.log\n");

    const capture = await engine.capture(project, "ignore:test");
    const paths = capture.manifest.entries.map((entry) => entry.path);
    expect(paths).toContain("keep.log");
    expect(paths).not.toContain("ignored.log");
    expect(paths).not.toContain("large.txt");
    expect(paths.some((path) => path.startsWith("node_modules/"))).toBe(false);
    expect(capture.manifest.excluded).toContainEqual({
      path: "large.txt",
      reason: "file-size-limit",
    });
  });

  it("deduplicates unchanged manifests and serializes concurrent captures", async () => {
    const { project, storage, engine } = await makeHarness();
    await writeFile(NodePath.join(project, "same.txt"), "same\n");
    const [first, second] = await Promise.all([
      engine.capture(project, "concurrent:first"),
      engine.capture(project, "concurrent:second"),
    ]);
    expect(first.manifestHash).toBe(second.manifestHash);
    expect(await engine.has(project, "concurrent:first")).toBe(true);
    expect(await engine.has(project, "concurrent:second")).toBe(true);
    expect(NodePath.relative(project, storage).startsWith("..")).toBe(true);
  });

  it("recovers incomplete temporary metadata on the next capture", async () => {
    const { project, storage, engine } = await makeHarness();
    await writeFile(NodePath.join(project, "file.txt"), "one\n");
    await engine.capture(project, "recovery:first");
    const projectId = engine.projectId(project);
    const incomplete = NodePath.join(storage, "projects", projectId, "orphan.tmp");
    await writeFile(incomplete, "partial");
    await engine.capture(project, "recovery:second");
    await expect(readFile(incomplete, "utf8")).rejects.toThrow();
  });

  it("prevents project boundary confusion and unsafe symlink traversal", async () => {
    const { project, engine } = await makeHarness();
    const other = await temporaryDirectory("sparky-other-project");
    await writeFile(NodePath.join(project, "inside.txt"), "inside\n");
    await writeFile(NodePath.join(other, "outside.txt"), "outside\n");
    let symlinkCreated = true;
    try {
      await symlink(NodePath.join(other, "outside.txt"), NodePath.join(project, "escape-link"));
    } catch {
      symlinkCreated = false;
    }
    const capture = await engine.capture(project, "boundary:test");
    if (symlinkCreated) {
      expect(capture.manifest.entries.some((entry) => entry.path === "escape-link")).toBe(false);
      expect(capture.manifest.excluded).toContainEqual({
        path: "escape-link",
        reason: "symlink-target-outside-project",
      });
    }
    expect(await readFile(NodePath.join(other, "outside.txt"), "utf8")).toBe("outside\n");
    await expect(engine.restore(other, "boundary:test")).resolves.toBeNull();
  });

  it("retains pinned, manual, and newest task boundary checkpoints during cleanup", async () => {
    const { project, engine } = await makeHarness();
    await writeFile(NodePath.join(project, "state.txt"), "one\n");
    await engine.capture(project, "task:start:old", {
      automatic: true,
      reason: "task-start",
    });
    await writeFile(NodePath.join(project, "state.txt"), "two\n");
    await engine.capture(project, "automatic:old", { automatic: true, reason: "after-tool" });
    await writeFile(NodePath.join(project, "state.txt"), "three\n");
    await engine.capture(project, "manual", { automatic: false, label: "Keep me" });
    await writeFile(NodePath.join(project, "state.txt"), "four\n");
    await engine.capture(project, "pinned", { automatic: true, pinned: true });
    await writeFile(NodePath.join(project, "state.txt"), "five\n");
    await engine.capture(project, "task:start:new", {
      automatic: true,
      reason: "task-start",
    });
    await writeFile(NodePath.join(project, "state.txt"), "six\n");
    await engine.capture(project, "task:complete", {
      automatic: true,
      reason: "task-complete",
    });

    const cleaned = await engine.cleanup(project, 3);
    expect(cleaned.deletedCheckpointRefs).toContain("automatic:old");
    expect(cleaned.deletedCheckpointRefs).toContain("task:start:old");
    expect(await engine.has(project, "manual")).toBe(true);
    expect(await engine.has(project, "pinned")).toBe(true);
    expect(await engine.has(project, "task:start:new")).toBe(true);
    expect(await engine.has(project, "task:complete")).toBe(true);
    expect(cleaned.bytesFreed).toBeGreaterThan(0);
  });
});
