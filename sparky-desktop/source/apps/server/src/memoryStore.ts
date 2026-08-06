// @effect-diagnostics nodeBuiltinImport:off globalDateInEffect:off
import * as NodeFS from "node:fs/promises";
import * as NodePath from "node:path";
import { randomUUID } from "node:crypto";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import {
  Memory,
  MemoryAddInput,
  MemoryDeleteInput,
  MemoryError,
  MemoryListInput,
  MemoryListResult,
  MemoryUpdateInput,
} from "@sparky/contracts";
import * as ServerConfig from "./config.ts";

const MEMORY_FILE_NAME = "memories.json";
const MAX_MEMORY_CONTENT_CHARS = 12_000;
const SENSITIVE_VALUE =
  /(?:api[_ -]?key|token|password|secret|private[_ -]?key)\s*[:=]|-----BEGIN [A-Z ]*PRIVATE KEY-----|\b(?:sk|ghp|xoxb|AKIA)[A-Za-z0-9_-]{12,}\b/i;

type StoredMemory = {
  id: string;
  scope: "global" | "project";
  title: string;
  content: string;
  category: string;
  importance: number;
  created_at: string;
  updated_at: string;
};

type MemoryFile = { readonly version: number; readonly memories: ReadonlyArray<StoredMemory> };

interface LoadedStore {
  readonly globalFile: string;
  readonly projectFile: string;
  readonly memories: StoredMemory[];
}

export class MemoryStoreService extends Context.Service<
  MemoryStoreService,
  {
    readonly list: (input: MemoryListInput) => Effect.Effect<MemoryListResult>;
    readonly add: (input: MemoryAddInput) => Effect.Effect<Memory, MemoryError>;
    readonly update: (input: MemoryUpdateInput) => Effect.Effect<Memory, MemoryError>;
    readonly remove: (
      input: MemoryDeleteInput,
    ) => Effect.Effect<{ readonly deleted: boolean }, MemoryError>;
  }
>()("t3/memoryStore/MemoryStoreService") {}

const make = Effect.gen(function* () {
  const config = yield* ServerConfig.ServerConfig;
  const store = yield* Effect.promise(() => loadStore(config.cwd));

  const list = (input: MemoryListInput) =>
    Effect.sync(() => ({ memories: search(store, input.query ?? "") }) satisfies MemoryListResult);

  const add = (input: MemoryAddInput) =>
    Effect.tryPromise({
      try: async () => {
        const now = new Date().toISOString();
        const memory: StoredMemory = {
          id: randomUUID(),
          scope: input.scope,
          title: input.title,
          content: input.content,
          category: input.category ?? "general",
          importance: input.importance ?? 3,
          created_at: now,
          updated_at: now,
        };
        validate(memory.title, memory.content);
        store.memories.push(memory);
        await persistStore(store, memory.scope);
        return toContract(memory);
      },
      catch: (cause) => memoryError("add", cause),
    });

  const update = (input: MemoryUpdateInput) =>
    Effect.tryPromise({
      try: async () => {
        const index = store.memories.findIndex((memory) => memory.id === input.id);
        if (index < 0) throw new Error(`Memory '${input.id}' was not found.`);
        const existing = store.memories[index]!;
        const next: StoredMemory = {
          ...existing,
          title: input.title,
          content: input.content,
          category: input.category ?? existing.category,
          importance: input.importance ?? existing.importance,
          updated_at: new Date().toISOString(),
        };
        validate(next.title, next.content);
        store.memories[index] = next;
        await persistStore(store, next.scope);
        return toContract(next);
      },
      catch: (cause) => memoryError("update", cause),
    });

  const remove = (input: MemoryDeleteInput) =>
    Effect.tryPromise({
      try: async () => {
        const index = store.memories.findIndex((memory) => memory.id === input.id);
        if (index < 0) return { deleted: false };
        const [deleted] = store.memories.splice(index, 1);
        await persistStore(store, deleted!.scope);
        return { deleted: true };
      },
      catch: (cause) => memoryError("delete", cause),
    });

  return { list, add, update, remove };
});

export const layer = Layer.effect(MemoryStoreService, make);

async function loadStore(cwd: string): Promise<LoadedStore> {
  const globalFile = NodePath.join(cwd, ".sparky", "global", MEMORY_FILE_NAME);
  const projectFile = NodePath.join(cwd, ".sparky", MEMORY_FILE_NAME);
  const [global, project] = await Promise.all([readFile(globalFile), readFile(projectFile)]);
  return { globalFile, projectFile, memories: [...global, ...project] };
}

async function readFile(path: string): Promise<ReadonlyArray<StoredMemory>> {
  try {
    const parsed = JSON.parse(await NodeFS.readFile(path, "utf8")) as MemoryFile;
    return Array.isArray(parsed.memories) ? parsed.memories : [];
  } catch (error) {
    if (isNotFound(error)) return [];
    throw error;
  }
}

async function persistStore(store: LoadedStore, scope: StoredMemory["scope"]): Promise<void> {
  const path = scope === "global" ? store.globalFile : store.projectFile;
  const memories = store.memories.filter((memory) => memory.scope === scope);
  await NodeFS.mkdir(NodePath.dirname(path), { recursive: true });
  const temporary = `${path}.${randomUUID()}.tmp`;
  await NodeFS.writeFile(
    temporary,
    `${JSON.stringify({ version: 1, memories }, null, 2)}\n`,
    "utf8",
  );
  await NodeFS.rename(temporary, path);
}

function search(store: LoadedStore, query: string): ReadonlyArray<Memory> {
  const terms = query.trim().toLocaleLowerCase().split(/\s+/u).filter(Boolean);
  return store.memories
    .map((memory) => ({
      memory,
      score: terms.filter((term) =>
        `${memory.title} ${memory.content} ${memory.category}`.toLocaleLowerCase().includes(term),
      ).length,
    }))
    .filter(({ score }) => terms.length === 0 || score > 0)
    .sort((a, b) => b.score - a.score || b.memory.importance - a.memory.importance)
    .map(({ memory }) => toContract(memory));
}

function validate(title: string, content: string): void {
  if (!title.trim()) throw new Error("Memory title cannot be empty.");
  if (!content.trim()) throw new Error("Memory content cannot be empty.");
  if (content.length > MAX_MEMORY_CONTENT_CHARS) {
    throw new Error(`Memory content is too long (maximum ${MAX_MEMORY_CONTENT_CHARS} characters).`);
  }
  if (SENSITIVE_VALUE.test(`${title}\n${content}`)) {
    throw new Error("Memory was not saved because it appears to contain a secret or credential.");
  }
}

function toContract(memory: StoredMemory): Memory {
  return {
    id: memory.id,
    scope: memory.scope,
    title: memory.title,
    content: memory.content,
    category: memory.category,
    importance: memory.importance,
    createdAt: memory.created_at,
    updatedAt: memory.updated_at,
  };
}

function memoryError(operation: string, cause: unknown): MemoryError {
  return new MemoryError({
    operation,
    message: cause instanceof Error ? cause.message : String(cause),
  });
}

function isNotFound(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT";
}
