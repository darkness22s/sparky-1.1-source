// @effect-diagnostics nodeBuiltinImport:off globalDate:off
import { createHash, randomUUID } from "node:crypto";
import {
  chmod,
  copyFile,
  lstat,
  mkdir,
  open,
  readFile,
  readdir,
  readlink,
  realpath,
  rename,
  rm,
  stat,
  symlink,
  writeFile,
} from "node:fs/promises";
import * as NodePath from "node:path";

const DEFAULT_EXCLUDED_NAMES = new Set([
  ".git",
  "node_modules",
  ".next",
  "dist",
  "build",
  "target",
  "coverage",
  ".cache",
  ".tmp",
  "temp",
  "venv",
  ".venv",
  "__pycache__",
  ".gradle",
  "DerivedData",
  ".DS_Store",
  "Thumbs.db",
]);
const DEFAULT_BINARY_EXTENSIONS = new Set([
  ".7z",
  ".a",
  ".app",
  ".avi",
  ".bin",
  ".dmg",
  ".dll",
  ".exe",
  ".iso",
  ".mov",
  ".mp4",
  ".o",
  ".obj",
  ".pdf",
  ".so",
  ".tar",
  ".wasm",
  ".zip",
]);

export type SnapshotEntry =
  | {
      readonly path: string;
      readonly type: "file";
      readonly hash: string;
      readonly size: number;
      readonly mode: number;
    }
  | { readonly path: string; readonly type: "directory"; readonly mode: number }
  | { readonly path: string; readonly type: "symlink"; readonly target: string; readonly mode: number };

export interface SnapshotManifest {
  readonly version: 1;
  readonly projectId: string;
  readonly projectRoot: string;
  readonly createdAt: string;
  readonly entries: ReadonlyArray<SnapshotEntry>;
  readonly excluded: ReadonlyArray<{ readonly path: string; readonly reason: string }>;
  readonly approximateSize: number;
}

interface SnapshotRefRecord {
  readonly version: 1;
  readonly checkpointRef: string;
  readonly manifestHash: string;
  readonly projectId: string;
  readonly projectRoot: string;
  readonly updatedAt: string;
}

interface HashCacheRecord {
  readonly size: number;
  readonly mtimeMs: number;
  readonly hash: string;
}

interface IgnoreRule {
  readonly negated: boolean;
  readonly directoryOnly: boolean;
  readonly pattern: RegExp;
}

export interface SnapshotEngineOptions {
  readonly storageRoot: string;
  readonly maxFileSizeBytes?: number;
  readonly concurrency?: number;
  readonly ignoredPaths?: ReadonlyArray<string>;
}

export interface SnapshotCaptureResult {
  readonly manifest: SnapshotManifest;
  readonly manifestHash: string;
  readonly reusedManifest: boolean;
}

export interface SnapshotRestoreResult {
  readonly created: ReadonlyArray<string>;
  readonly modified: ReadonlyArray<string>;
  readonly deleted: ReadonlyArray<string>;
  readonly restored: ReadonlyArray<string>;
}

export interface SnapshotDiffFile {
  readonly path: string;
  readonly previousPath?: string;
  readonly kind: "added" | "modified" | "deleted" | "renamed";
  readonly binary: boolean;
  readonly oldText?: string;
  readonly newText?: string;
}

export interface SnapshotDiff {
  readonly files: ReadonlyArray<SnapshotDiffFile>;
  readonly unifiedDiff: string;
}

function sha256(value: string | Uint8Array): string {
  return createHash("sha256").update(value).digest("hex");
}

function normalizeRelativePath(value: string): string {
  return value.split(NodePath.sep).join("/").replace(/^\.\//, "");
}

function escapeRegex(value: string): string {
  return value.replace(/[|\\{}()[\]^$+?.]/g, "\\$&");
}

function compileGlob(pattern: string): RegExp {
  const normalized = pattern.replaceAll("\\", "/").replace(/^\//, "");
  let output = "";
  for (let index = 0; index < normalized.length; index += 1) {
    const character = normalized[index]!;
    if (character === "*") {
      if (normalized[index + 1] === "*") {
        output += ".*";
        index += 1;
      } else {
        output += "[^/]*";
      }
    } else if (character === "?") {
      output += "[^/]";
    } else {
      output += escapeRegex(character);
    }
  }
  return new RegExp(normalized.includes("/") ? `^${output}$` : `(^|/)${output}$`);
}

function parseIgnoreRules(contents: string, configured: ReadonlyArray<string>): ReadonlyArray<IgnoreRule> {
  return [...contents.split(/\r?\n/u), ...configured]
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("#"))
    .map((line) => {
      const negated = line.startsWith("!");
      const raw = negated ? line.slice(1) : line;
      const directoryOnly = raw.endsWith("/");
      return {
        negated,
        directoryOnly,
        pattern: compileGlob(directoryOnly ? raw.slice(0, -1) : raw),
      };
    });
}

function isIgnoredByRules(path: string, isDirectory: boolean, rules: ReadonlyArray<IgnoreRule>): boolean {
  let ignored = false;
  for (const rule of rules) {
    if ((!rule.directoryOnly || isDirectory) && rule.pattern.test(path)) {
      ignored = !rule.negated;
    }
  }
  return ignored;
}

function isInside(root: string, candidate: string): boolean {
  const relative = NodePath.relative(root, candidate);
  return relative === "" || (!relative.startsWith("..") && !NodePath.isAbsolute(relative));
}

function isBinary(contents: Uint8Array): boolean {
  const sample = contents.subarray(0, Math.min(contents.byteLength, 8_000));
  return sample.includes(0);
}

function lineCount(text: string): number {
  if (text.length === 0) return 0;
  return text.split("\n").length - (text.endsWith("\n") ? 1 : 0);
}

function unifiedFileDiff(file: SnapshotDiffFile): string {
  const oldPath = file.previousPath ?? file.path;
  const header = [`diff --git a/${oldPath} b/${file.path}`];
  if (file.kind === "renamed") {
    header.push("similarity index 100%", `rename from ${oldPath}`, `rename to ${file.path}`);
    return `${header.join("\n")}\n`;
  }
  if (file.kind === "added") header.push("new file mode 100644");
  if (file.kind === "deleted") header.push("deleted file mode 100644");
  if (file.binary) {
    header.push(`Binary files a/${oldPath} and b/${file.path} differ`);
    return `${header.join("\n")}\n`;
  }
  const oldText = file.oldText ?? "";
  const newText = file.newText ?? "";
  header.push(`--- ${file.kind === "added" ? "/dev/null" : `a/${oldPath}`}`);
  header.push(`+++ ${file.kind === "deleted" ? "/dev/null" : `b/${file.path}`}`);
  header.push(`@@ -1,${lineCount(oldText)} +1,${lineCount(newText)} @@`);
  for (const line of oldText.split("\n").slice(0, oldText.endsWith("\n") ? -1 : undefined)) {
    header.push(`-${line}`);
  }
  for (const line of newText.split("\n").slice(0, newText.endsWith("\n") ? -1 : undefined)) {
    header.push(`+${line}`);
  }
  return `${header.join("\n")}\n`;
}

async function writeAtomically(path: string, contents: string | Uint8Array): Promise<void> {
  await mkdir(NodePath.dirname(path), { recursive: true });
  const temporary = `${path}.${process.pid}.${randomUUID()}.tmp`;
  const handle = await open(temporary, "wx");
  try {
    await handle.writeFile(contents);
    await handle.sync();
  } finally {
    await handle.close();
  }
  try {
    await rename(temporary, path);
  } catch (error) {
    await rm(path, { force: true });
    await rename(temporary, path).catch(async (renameError) => {
      await rm(temporary, { force: true });
      throw renameError ?? error;
    });
  }
}

export class SnapshotEngine {
  readonly #storageRoot: string;
  readonly #maxFileSizeBytes: number;
  readonly #concurrency: number;
  readonly #ignoredPaths: ReadonlyArray<string>;
  readonly #queues = new Map<string, Promise<unknown>>();

  constructor(options: SnapshotEngineOptions) {
    this.#storageRoot = NodePath.resolve(options.storageRoot);
    this.#maxFileSizeBytes = options.maxFileSizeBytes ?? 50 * 1024 * 1024;
    this.#concurrency = Math.max(1, Math.min(options.concurrency ?? 8, 32));
    this.#ignoredPaths = options.ignoredPaths ?? [];
  }

  projectId(cwd: string): string {
    const canonical = NodePath.resolve(cwd);
    return sha256(process.platform === "win32" ? canonical.toLowerCase() : canonical).slice(0, 24);
  }

  async capture(cwd: string, checkpointRef: string): Promise<SnapshotCaptureResult> {
    const root = await realpath(NodePath.resolve(cwd));
    if (isInside(root, this.#storageRoot) || isInside(this.#storageRoot, root)) {
      throw new Error("Checkpoint storage and project root must not contain one another.");
    }
    const projectId = this.projectId(root);
    return this.#serialize(projectId, async () => this.#captureUnlocked(root, projectId, checkpointRef));
  }

  async has(cwd: string, checkpointRef: string): Promise<boolean> {
    const root = await realpath(NodePath.resolve(cwd));
    return this.#readRef(this.projectId(root), checkpointRef)
      .then(() => true)
      .catch(() => false);
  }

  async restore(cwd: string, checkpointRef: string): Promise<SnapshotRestoreResult | null> {
    const root = await realpath(NodePath.resolve(cwd));
    const projectId = this.projectId(root);
    return this.#serialize(projectId, async () => {
      const record = await this.#readRef(projectId, checkpointRef).catch(() => null);
      if (!record) return null;
      const manifest = await this.#readManifest(record.manifestHash);
      this.#assertManifestMatchesRoot(manifest, root, projectId);
      const safetyRef = `refs/sparky/safety/${Date.now()}-${randomUUID()}`;
      await this.#captureUnlocked(root, projectId, safetyRef);
      return this.#restoreUnlocked(root, manifest);
    });
  }

  async diff(cwd: string, fromRef: string, toRef: string): Promise<SnapshotDiff> {
    const root = await realpath(NodePath.resolve(cwd));
    const projectId = this.projectId(root);
    const [from, to] = await Promise.all([
      this.#readRef(projectId, fromRef),
      this.#readRef(projectId, toRef),
    ]);
    const [fromManifest, toManifest] = await Promise.all([
      this.#readManifest(from.manifestHash),
      this.#readManifest(to.manifestHash),
    ]);
    this.#assertManifestMatchesRoot(fromManifest, root, projectId);
    this.#assertManifestMatchesRoot(toManifest, root, projectId);
    return this.#diffManifests(fromManifest, toManifest);
  }

  async deleteRefs(cwd: string, refs: ReadonlyArray<string>): Promise<void> {
    const root = await realpath(NodePath.resolve(cwd));
    const projectId = this.projectId(root);
    await Promise.all(refs.map((ref) => rm(this.#refPath(projectId, ref), { force: true })));
  }

  async #captureUnlocked(
    root: string,
    projectId: string,
    checkpointRef: string,
  ): Promise<SnapshotCaptureResult> {
    const projectDir = NodePath.join(this.#storageRoot, "projects", projectId);
    await mkdir(NodePath.join(projectDir, "refs"), { recursive: true });
    await this.#recoverTemporaryFiles(projectDir);
    const ignoreContents = await readFile(NodePath.join(root, ".sparkycheckpointignore"), "utf8").catch(
      () => "",
    );
    const rules = parseIgnoreRules(ignoreContents, this.#ignoredPaths);
    const cachePath = NodePath.join(projectDir, "metadata-cache.json");
    const previousCache: Record<string, HashCacheRecord> = await readFile(cachePath, "utf8")
      .then((value) => JSON.parse(value) as Record<string, HashCacheRecord>)
      .catch(() => ({}));
    const nextCache: Record<string, HashCacheRecord> = {};
    const entries: SnapshotEntry[] = [];
    const excluded: Array<{ path: string; reason: string }> = [];
    const files: Array<{ absolute: string; relative: string; size: number; mode: number; mtimeMs: number }> = [];

    const visit = async (directory: string): Promise<void> => {
      const children = await readdir(directory, { withFileTypes: true });
      if (directory !== root && children.length === 0) {
        const info = await lstat(directory);
        entries.push({ path: normalizeRelativePath(NodePath.relative(root, directory)), type: "directory", mode: info.mode });
      }
      for (const child of children) {
        const absolute = NodePath.join(directory, child.name);
        const relative = normalizeRelativePath(NodePath.relative(root, absolute));
        const defaultExcluded = DEFAULT_EXCLUDED_NAMES.has(child.name);
        const explicitlyIncluded = rules.some((rule) => rule.negated && rule.pattern.test(relative));
        if ((defaultExcluded && !explicitlyIncluded) || isIgnoredByRules(relative, child.isDirectory(), rules)) {
          excluded.push({ path: relative, reason: defaultExcluded ? "default-ignore" : "checkpoint-ignore" });
          continue;
        }
        const info = await lstat(absolute);
        if (info.isSymbolicLink()) {
          const target = await readlink(absolute);
          const resolvedTarget = NodePath.resolve(NodePath.dirname(absolute), target);
          if (!isInside(root, resolvedTarget)) {
            excluded.push({ path: relative, reason: "symlink-target-outside-project" });
            continue;
          }
          entries.push({ path: relative, type: "symlink", target, mode: info.mode });
          continue;
        }
        if (info.isDirectory()) {
          await visit(absolute);
          continue;
        }
        if (!info.isFile()) {
          excluded.push({ path: relative, reason: "unsupported-file-type" });
          continue;
        }
        if (info.size > this.#maxFileSizeBytes) {
          excluded.push({ path: relative, reason: "file-size-limit" });
          continue;
        }
        if (DEFAULT_BINARY_EXTENSIONS.has(NodePath.extname(child.name).toLowerCase()) && info.size > 1024 * 1024) {
          excluded.push({ path: relative, reason: "large-generated-binary" });
          continue;
        }
        files.push({ absolute, relative, size: info.size, mode: info.mode, mtimeMs: info.mtimeMs });
      }
    };
    await visit(root);

    let cursor = 0;
    const workers = Array.from({ length: Math.min(this.#concurrency, Math.max(files.length, 1)) }, async () => {
      while (cursor < files.length) {
        const file = files[cursor++]!;
        const cached = previousCache[file.relative];
        const hash =
          cached && cached.size === file.size && cached.mtimeMs === file.mtimeMs
            ? cached.hash
            : sha256(await readFile(file.absolute));
        const objectPath = this.#objectPath(hash);
        await stat(objectPath).catch(async () => {
          await mkdir(NodePath.dirname(objectPath), { recursive: true });
          const temporary = `${objectPath}.${process.pid}.${randomUUID()}.tmp`;
          await copyFile(file.absolute, temporary);
          await rename(temporary, objectPath).catch(async () => {
            await rm(temporary, { force: true });
          });
        });
        nextCache[file.relative] = { size: file.size, mtimeMs: file.mtimeMs, hash };
        entries.push({ path: file.relative, type: "file", hash, size: file.size, mode: file.mode });
      }
    });
    await Promise.all(workers);
    entries.sort((left, right) => left.path.localeCompare(right.path));
    excluded.sort((left, right) => left.path.localeCompare(right.path));
    const manifest: SnapshotManifest = {
      version: 1,
      projectId,
      projectRoot: root,
      createdAt: new Date().toISOString(),
      entries,
      excluded,
      approximateSize: entries.reduce((total, entry) => total + (entry.type === "file" ? entry.size : 0), 0),
    };
    const manifestIdentity = JSON.stringify({ ...manifest, createdAt: undefined });
    const manifestHash = sha256(manifestIdentity);
    const manifestPath = this.#manifestPath(manifestHash);
    const reusedManifest = await stat(manifestPath).then(() => true).catch(() => false);
    if (!reusedManifest) await writeAtomically(manifestPath, JSON.stringify(manifest));
    const refRecord: SnapshotRefRecord = {
      version: 1,
      checkpointRef,
      manifestHash,
      projectId,
      projectRoot: root,
      updatedAt: new Date().toISOString(),
    };
    await writeAtomically(this.#refPath(projectId, checkpointRef), JSON.stringify(refRecord));
    await writeAtomically(cachePath, JSON.stringify(nextCache));
    return { manifest, manifestHash, reusedManifest };
  }

  async #restoreUnlocked(root: string, manifest: SnapshotManifest): Promise<SnapshotRestoreResult> {
    const current = await this.#scanIncludedPaths(root);
    const target = new Map(manifest.entries.map((entry) => [entry.path, entry]));
    const created: string[] = [];
    const modified: string[] = [];
    const deleted: string[] = [];
    const restored: string[] = [];

    const targetDirectories = manifest.entries.filter((entry) => entry.type === "directory");
    for (const entry of targetDirectories) {
      const absolute = this.#safeTarget(root, entry.path);
      await mkdir(absolute, { recursive: true });
      await chmod(absolute, entry.mode).catch(() => undefined);
    }
    for (const entry of manifest.entries) {
      if (entry.type === "directory") continue;
      const absolute = this.#safeTarget(root, entry.path);
      await mkdir(NodePath.dirname(absolute), { recursive: true });
      const existing = current.get(entry.path);
      if (!existing) created.push(entry.path);
      else if (
        existing.type !== entry.type ||
        (entry.type === "file" && existing.type === "file" && existing.hash !== entry.hash) ||
        (entry.type === "symlink" && existing.type === "symlink" && existing.target !== entry.target)
      ) {
        modified.push(entry.path);
      }
      if (entry.type === "symlink") {
        await rm(absolute, { recursive: true, force: true });
        const resolvedTarget = NodePath.resolve(NodePath.dirname(absolute), entry.target);
        if (!isInside(root, resolvedTarget)) {
          throw new Error(`Refusing to restore escaping symlink: ${entry.path}`);
        }
        await symlink(entry.target, absolute);
      } else {
        const temporary = `${absolute}.${process.pid}.${randomUUID()}.sparky-restore`;
        await copyFile(this.#objectPath(entry.hash), temporary);
        await rm(absolute, { recursive: true, force: true });
        await rename(temporary, absolute);
        await chmod(absolute, entry.mode).catch(() => undefined);
      }
      restored.push(entry.path);
    }
    const removable = [...current.keys()]
      .filter((path) => !target.has(path))
      .sort((left, right) => right.length - left.length);
    for (const path of removable) {
      await rm(this.#safeTarget(root, path), { recursive: true, force: true });
      deleted.push(path);
    }
    return { created, modified, deleted, restored };
  }

  async #diffManifests(from: SnapshotManifest, to: SnapshotManifest): Promise<SnapshotDiff> {
    const before = new Map(from.entries.filter((entry) => entry.type === "file").map((entry) => [entry.path, entry]));
    const after = new Map(to.entries.filter((entry) => entry.type === "file").map((entry) => [entry.path, entry]));
    const files: SnapshotDiffFile[] = [];
    const deleted = [...before.values()].filter((entry) => !after.has(entry.path));
    const added = [...after.values()].filter((entry) => !before.has(entry.path));
    const renamedAdded = new Set<string>();
    const renamedDeleted = new Set<string>();
    for (const oldEntry of deleted) {
      const renamed = added.find((entry) => entry.hash === oldEntry.hash && !renamedAdded.has(entry.path));
      if (renamed) {
        renamedAdded.add(renamed.path);
        renamedDeleted.add(oldEntry.path);
        files.push({ path: renamed.path, previousPath: oldEntry.path, kind: "renamed", binary: false });
      }
    }
    for (const entry of deleted) {
      if (renamedDeleted.has(entry.path)) continue;
      const contents = await readFile(this.#objectPath(entry.hash));
      const binary = isBinary(contents);
      files.push({
        path: entry.path,
        kind: "deleted",
        binary,
        ...(binary ? {} : { oldText: contents.toString("utf8") }),
      });
    }
    for (const entry of added) {
      if (renamedAdded.has(entry.path)) continue;
      const contents = await readFile(this.#objectPath(entry.hash));
      const binary = isBinary(contents);
      files.push({
        path: entry.path,
        kind: "added",
        binary,
        ...(binary ? {} : { newText: contents.toString("utf8") }),
      });
    }
    for (const [path, oldEntry] of before) {
      const newEntry = after.get(path);
      if (!newEntry || newEntry.hash === oldEntry.hash) continue;
      const [oldContents, newContents] = await Promise.all([
        readFile(this.#objectPath(oldEntry.hash)),
        readFile(this.#objectPath(newEntry.hash)),
      ]);
      const binary = isBinary(oldContents) || isBinary(newContents);
      files.push({
        path,
        kind: "modified",
        binary,
        ...(binary
          ? {}
          : {
              oldText: oldContents.toString("utf8"),
              newText: newContents.toString("utf8"),
            }),
      });
    }
    files.sort((left, right) => left.path.localeCompare(right.path));
    return { files, unifiedDiff: files.map(unifiedFileDiff).join("") };
  }

  async #scanIncludedPaths(root: string): Promise<Map<string, SnapshotEntry>> {
    const temporaryRef = `refs/sparky/internal/scan-${randomUUID()}`;
    const projectId = this.projectId(root);
    const captured = await this.#captureUnlocked(root, projectId, temporaryRef);
    await rm(this.#refPath(projectId, temporaryRef), { force: true });
    return new Map(captured.manifest.entries.map((entry) => [entry.path, entry]));
  }

  #assertManifestMatchesRoot(manifest: SnapshotManifest, root: string, projectId: string): void {
    if (manifest.projectId !== projectId || NodePath.resolve(manifest.projectRoot) !== NodePath.resolve(root)) {
      throw new Error("Checkpoint belongs to a different project root.");
    }
  }

  #safeTarget(root: string, relative: string): string {
    const normalized = normalizeRelativePath(relative);
    if (normalized === "" || normalized.startsWith("../") || NodePath.isAbsolute(normalized)) {
      throw new Error(`Invalid checkpoint path: ${relative}`);
    }
    const target = NodePath.resolve(root, ...normalized.split("/"));
    if (!isInside(root, target)) throw new Error(`Checkpoint path escapes project root: ${relative}`);
    return target;
  }

  async #readRef(projectId: string, checkpointRef: string): Promise<SnapshotRefRecord> {
    return JSON.parse(await readFile(this.#refPath(projectId, checkpointRef), "utf8")) as SnapshotRefRecord;
  }

  async #readManifest(hash: string): Promise<SnapshotManifest> {
    const contents = await readFile(this.#manifestPath(hash), "utf8");
    const manifest = JSON.parse(contents) as SnapshotManifest;
    if (manifest.version !== 1 || sha256(JSON.stringify({ ...manifest, createdAt: undefined })) !== hash) {
      throw new Error(`Checkpoint manifest is missing or corrupt: ${hash}`);
    }
    return manifest;
  }

  #objectPath(hash: string): string {
    return NodePath.join(this.#storageRoot, "objects", hash.slice(0, 2), hash.slice(2));
  }

  #manifestPath(hash: string): string {
    return NodePath.join(this.#storageRoot, "manifests", `${hash}.json`);
  }

  #refPath(projectId: string, checkpointRef: string): string {
    return NodePath.join(this.#storageRoot, "projects", projectId, "refs", `${sha256(checkpointRef)}.json`);
  }

  async #recoverTemporaryFiles(directory: string): Promise<void> {
    const children = await readdir(directory, { recursive: true }).catch(() => [] as string[]);
    await Promise.all(
      children
        .filter((path) => path.endsWith(".tmp") || path.endsWith(".sparky-restore"))
        .map((path) => rm(NodePath.join(directory, path), { force: true })),
    );
  }

  #serialize<T>(key: string, operation: () => Promise<T>): Promise<T> {
    const previous = this.#queues.get(key) ?? Promise.resolve();
    const current = previous.catch(() => undefined).then(operation);
    this.#queues.set(key, current);
    return current.finally(() => {
      if (this.#queues.get(key) === current) this.#queues.delete(key);
    });
  }
}
