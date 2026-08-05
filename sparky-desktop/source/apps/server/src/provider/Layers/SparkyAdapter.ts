// @effect-diagnostics nodeBuiltinImport:off globalDate:off globalDateInEffect:off globalTimers:off
import * as NodeChildProcess from "node:child_process";
import * as NodeCrypto from "node:crypto";
import * as NodeFS from "node:fs";
import * as NodePath from "node:path";

import {
  EventId,
  ProviderDriverKind,
  ProviderInstanceId,
  RuntimeItemId,
  ThreadId,
  type ChatAttachment,
  type ToolLifecycleItemType,
  TurnId,
  type ProviderInteractionMode,
  type ProviderRuntimeEvent,
  type ProviderSession,
} from "@sparky/contracts";
import * as Duration from "effect/Duration";
import * as Effect from "effect/Effect";
import * as Fiber from "effect/Fiber";
import * as PubSub from "effect/PubSub";
import * as Scope from "effect/Scope";
import * as Stream from "effect/Stream";
import { getModelSelectionStringOptionValue } from "@sparky/shared/model";

import { resolveAttachmentPath } from "../../attachmentStore.ts";
import {
  ProviderAdapterProcessError,
  ProviderAdapterRequestError,
  ProviderAdapterSessionNotFoundError,
  ProviderAdapterValidationError,
  type ProviderAdapterError,
} from "../Errors.ts";
import * as McpProviderSession from "../../mcp/McpProviderSession.ts";
import type { ProviderAdapterShape, ProviderThreadSnapshot } from "../Services/ProviderAdapter.ts";

const PROVIDER = ProviderDriverKind.make("sparky");
const T3_MCP_BEARER_TOKEN_ENV_VAR = "T3_MCP_BEARER_TOKEN";
const CODEX_OAUTH_CONTEXT_WINDOW_TOKENS = 320_000;
const HIDDEN_SPARKY_CONTROL_TOOLS = new Set(["end_task"]);
const SPARKY_BROWSER_INSTRUCTIONS = `You are running inside Sparky Desktop. The t3-code MCP tools named preview_* control the collaborative browser shared with the user.
For browser work, first call preview_status. If no automation-capable preview is attached, call preview_open. Then use preview_navigate, preview_snapshot, and the focused interaction tools. Prefer snapshot-provided locators over coordinates.
Do not open the user's external browser or start a replacement browser automation stack when the preview_* tools are available.`;

export interface SparkyAdapterOptions {
  readonly instanceId: ProviderInstanceId;
  readonly binaryPath: string;
  readonly attachmentsDir: string;
  readonly environment: NodeJS.ProcessEnv;
  readonly getCustomInstructions?: (() => Effect.Effect<string>) | undefined;
}

export interface SparkyProcessResult {
  readonly response: string;
  readonly sessionId?: string | undefined;
}

export interface SparkyToolStartedEvent {
  readonly toolCallId: string;
  readonly toolName: string;
  readonly arguments: unknown;
}

export interface SparkyToolCompletedEvent {
  readonly toolCallId: string;
  readonly toolName: string;
  readonly output: string;
  readonly isError: boolean;
}

export interface SparkyUsageEvent {
  readonly promptTokens: number;
  readonly completionTokens: number;
  readonly totalTokens: number;
  readonly cumulativeTotalTokens: number;
}

export interface SparkyStreamCallbacks {
  readonly onDelta?: ((delta: string) => void) | undefined;
  readonly onToolStarted?: ((event: SparkyToolStartedEvent) => void) | undefined;
  readonly onToolCompleted?: ((event: SparkyToolCompletedEvent) => void) | undefined;
  readonly onUsage?: ((event: SparkyUsageEvent) => void) | undefined;
  /** Fired as soon as the terminal JSON result frame is received. */
  readonly onResult?: ((result: SparkyProcessResult) => void) | undefined;
}

export interface SparkyAssistantSegmentCallbacks {
  readonly onStarted: (segmentId: string) => void;
  readonly onDelta: (segmentId: string, delta: string) => void;
  readonly onCompleted: (segmentId: string, text: string) => void;
}

// Maximum time a single Sparky turn is allowed to run before we kill it.
const TURN_TIMEOUT_DURATION = Duration.minutes(10);

export function isHiddenSparkyControlTool(toolName: string): boolean {
  return HIDDEN_SPARKY_CONTROL_TOOLS.has(toolName);
}

interface SessionState {
  session: ProviderSession;
  snapshot: ProviderThreadSnapshot;
  nextTurn: number;
}

type SparkyChildProcess = ReturnType<typeof NodeChildProcess.spawn>;

export function makeSparkyStreamDecoder(callbacks: SparkyStreamCallbacks = {}) {
  let stdoutBuffer = "";
  let result: SparkyProcessResult | undefined;
  let protocolError: Error | undefined;
  const activeTools = new Map<string, { readonly toolName: string }>();

  const failOpenTools = (reason: string) => {
    for (const [toolCallId, tool] of activeTools) {
      callbacks.onToolCompleted?.({
        toolCallId,
        toolName: tool.toolName,
        output: reason,
        isError: true,
      });
    }
    activeTools.clear();
  };

  const processLine = (line: string) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    try {
      const event = JSON.parse(trimmed) as {
        type?: unknown;
        delta?: unknown;
        response?: unknown;
        sessionId?: unknown;
        toolCallId?: unknown;
        toolName?: unknown;
        arguments?: unknown;
        output?: unknown;
        isError?: unknown;
        promptTokens?: unknown;
        completionTokens?: unknown;
        totalTokens?: unknown;
        cumulativeTotalTokens?: unknown;
      };
      if (event.type === "delta" && typeof event.delta === "string") {
        callbacks.onDelta?.(event.delta);
        return;
      }
      if (
        event.type === "tool.started" &&
        typeof event.toolCallId === "string" &&
        typeof event.toolName === "string"
      ) {
        activeTools.set(event.toolCallId, { toolName: event.toolName });
        callbacks.onToolStarted?.({
          toolCallId: event.toolCallId,
          toolName: event.toolName,
          arguments: event.arguments,
        });
        return;
      }
      if (
        event.type === "usage" &&
        typeof event.promptTokens === "number" &&
        typeof event.completionTokens === "number" &&
        typeof event.totalTokens === "number" &&
        typeof event.cumulativeTotalTokens === "number"
      ) {
        callbacks.onUsage?.({
          promptTokens: event.promptTokens,
          completionTokens: event.completionTokens,
          totalTokens: event.totalTokens,
          cumulativeTotalTokens: event.cumulativeTotalTokens,
        });
        return;
      }
      if (
        event.type === "tool.completed" &&
        typeof event.toolCallId === "string" &&
        typeof event.toolName === "string" &&
        typeof event.output === "string" &&
        typeof event.isError === "boolean"
      ) {
        activeTools.delete(event.toolCallId);
        callbacks.onToolCompleted?.({
          toolCallId: event.toolCallId,
          toolName: event.toolName,
          output: event.output,
          isError: event.isError,
        });
        return;
      }
      if (event.type === "result" && typeof event.response === "string") {
        result = {
          response: event.response,
          ...(typeof event.sessionId === "string" ? { sessionId: event.sessionId } : {}),
        };
        callbacks.onResult?.(result);
      }
    } catch (cause) {
      protocolError = new Error("Sparky returned an invalid streaming event.", { cause });
    }
  };

  return {
    push(chunk: string): void {
      stdoutBuffer += chunk;
      let lineEnd = stdoutBuffer.indexOf("\n");
      while (lineEnd >= 0) {
        const line = stdoutBuffer.slice(0, lineEnd);
        stdoutBuffer = stdoutBuffer.slice(lineEnd + 1);
        processLine(line);
        // A result frame is terminal. Do not let data after it be interpreted
        // as another part of the completed turn while the child is shutting
        // down.
        if (result) {
          stdoutBuffer = "";
          break;
        }
        lineEnd = stdoutBuffer.indexOf("\n");
      }
    },
    failOpenTools,
    finish(): SparkyProcessResult {
      // Clear the pending buffer before parsing it. `onResult` is allowed to
      // call finish synchronously, so leaving the same line in the buffer
      // would parse the terminal result recursively.
      if (!result && stdoutBuffer.trim().length > 0) {
        const pending = stdoutBuffer;
        stdoutBuffer = "";
        processLine(pending);
      }
      if (protocolError) {
        failOpenTools(protocolError.message);
        throw protocolError;
      }
      if (!result || result.response.trim().length === 0) {
        failOpenTools("Sparky ended before this tool returned a result.");
        throw new Error("Sparky returned an empty streaming result.");
      }
      if (activeTools.size > 0) {
        failOpenTools("Sparky ended before this tool returned a result.");
      }
      return result;
    },
  };
}

export function makeSparkyAssistantSegmenter(
  callbacks: SparkyAssistantSegmentCallbacks,
  makeSegmentId: () => string = NodeCrypto.randomUUID,
) {
  let activeSegment: { readonly id: string; text: string } | undefined;
  let sawText = false;

  const closeActiveSegment = () => {
    if (!activeSegment) return;
    callbacks.onCompleted(activeSegment.id, activeSegment.text);
    activeSegment = undefined;
  };

  const pushDelta = (delta: string) => {
    if (delta.length === 0) return;
    if (!activeSegment) {
      activeSegment = { id: makeSegmentId(), text: "" };
      callbacks.onStarted(activeSegment.id);
    }
    activeSegment.text += delta;
    sawText = true;
    callbacks.onDelta(activeSegment.id, delta);
  };

  return {
    pushDelta,
    closeBeforeTool: closeActiveSegment,
    finish(fallbackText: string): void {
      if (activeSegment) {
        closeActiveSegment();
        return;
      }
      if (!sawText && fallbackText.length > 0) {
        pushDelta(fallbackText);
        closeActiveSegment();
      }
    },
  };
}

function humanizeSparkyToolName(toolName: string): string {
  const words = toolName
    .trim()
    .replace(/([a-z0-9])([A-Z])/gu, "$1 $2")
    .split(/[._:-]+/u)
    .map((word) => word.trim())
    .filter(Boolean);
  return words.length > 0
    ? words.map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`).join(" ")
    : "Tool";
}

export function sparkyToolPresentation(
  toolName: string,
  argumentsValue: unknown,
): {
  readonly itemType: ToolLifecycleItemType;
  readonly title: string;
  readonly data: Record<string, unknown>;
} {
  const normalizedName = toolName.trim().toLowerCase();
  const rawInput =
    argumentsValue !== null && typeof argumentsValue === "object" && !Array.isArray(argumentsValue)
      ? (argumentsValue as Record<string, unknown>)
      : {};
  const isBrowserTool = normalizedName.startsWith("preview_");
  const itemType: ToolLifecycleItemType =
    normalizedName === "bash"
      ? "command_execution"
      : normalizedName === "write" || normalizedName === "edit"
        ? "file_change"
        : isBrowserTool
          ? "mcp_tool_call"
        : "dynamic_tool_call";
  const kind =
    normalizedName === "bash"
      ? "execute"
      : normalizedName === "grep" || normalizedName === "find"
        ? "search"
        : normalizedName;
  const titleByName: Record<string, string> = {
    ask_user: "Ask user",
    bash: "Terminal",
    edit: "Edit file",
    find: "Find",
    grep: "Grep",
    ls: "List files",
    memory_add: "Save memory",
    memory_delete: "Forget memory",
    memory_search: "Search memory",
    memory_update: "Update memory",
    read: "Read file",
    update_plan: "Update plan",
    write: "Write file",
    preview_status: "Get browser status",
    preview_open: "Open browser",
    preview_navigate: "Navigate browser",
    preview_resize: "Resize browser",
    preview_snapshot: "Inspect browser page",
    preview_click: "Click browser",
    preview_type: "Type in browser",
    preview_press: "Press key in browser",
    preview_scroll: "Scroll browser",
    preview_evaluate: "Evaluate browser JavaScript",
    preview_wait_for: "Wait for browser",
    preview_recording_start: "Start browser recording",
    preview_recording_stop: "Stop browser recording",
  };
  return {
    itemType,
    title: titleByName[normalizedName] ?? humanizeSparkyToolName(toolName),
    data: {
      kind,
      toolName,
      rawInput,
      ...(typeof rawInput.command === "string" ? { command: rawInput.command } : {}),
    },
  };
}

function parseModelSelection(model: string | undefined): {
  readonly provider: string;
  readonly model: string;
  readonly baseUrl?: string | undefined;
} {
  const selected = model?.trim() || "GPT-5.6 Sol";
  const slash = selected.indexOf("/");
  if (slash <= 0 || slash === selected.length - 1) {
    return { provider: "openai", model: selected };
  }
  const provider = selected.slice(0, slash);
  const modelId = selected.slice(slash + 1);
  if (provider === "google") {
    return { provider: "gemini", model: modelId };
  }
  if (provider === "opencode") {
    return {
      provider: "opencode",
      model: modelId,
      baseUrl: "https://opencode.ai/zen/v1",
    };
  }
  return { provider, model: modelId };
}

export function parseSparkyContextWindowTokens(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const normalized = value.trim().toLowerCase().replaceAll(",", "");
  const match = normalized.match(/^(\d+(?:\.\d+)?)(?:\s*(tokens?|k|m|b))?$/u);
  if (!match) return undefined;
  const amount = Number(match[1]);
  if (!Number.isFinite(amount) || amount <= 0) return undefined;
  const unit = match[2] ?? "";
  const multiplier = unit.startsWith("b")
    ? 1_000_000_000
    : unit === "m"
      ? 1_000_000
      : unit === "k"
        ? 1_000
        : 1;
  const tokens = amount * multiplier;
  return Number.isSafeInteger(tokens) && tokens > 0 ? tokens : undefined;
}

export function normalizeSparkyContextWindow(
  model: string,
  value: string | undefined,
): string | undefined {
  const tokens = parseSparkyContextWindowTokens(value);
  if (
    tokens !== undefined &&
    model.trim().toLowerCase().startsWith("openai-codex/") &&
    tokens > CODEX_OAUTH_CONTEXT_WINDOW_TOKENS
  ) {
    return "320k";
  }
  return value;
}

const SPARKY_SESSION_ID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function sparkySessionFile(cwd: string, sessionId: string): string {
  return NodePath.join(cwd, ".sparky", "sessions", `${sessionId}.jsonl`);
}

function usableSparkySessionId(cwd: string, value: unknown): string | undefined {
  if (typeof value !== "string" || !SPARKY_SESSION_ID_PATTERN.test(value)) return undefined;
  return NodeFS.existsSync(sparkySessionFile(cwd, value)) ? value : undefined;
}

function sessionBindingFile(cwd: string, threadId: string): string {
  const bindingId = NodeCrypto.createHash("sha256").update(threadId).digest("hex");
  return NodePath.join(cwd, ".sparky", "t3-sessions", `${bindingId}.json`);
}

export function readSparkySessionBinding(cwd: string, threadId: string): string | undefined {
  try {
    const parsed = JSON.parse(NodeFS.readFileSync(sessionBindingFile(cwd, threadId), "utf8")) as {
      version?: unknown;
      threadId?: unknown;
      sparkySessionId?: unknown;
    };
    if (parsed.version !== 1 || parsed.threadId !== threadId) return undefined;
    return usableSparkySessionId(cwd, parsed.sparkySessionId);
  } catch {
    return undefined;
  }
}

/** Ensure .sparky/ is gitignored and remove from git index if already tracked. */
function ensureGitignoreAndUntrack(cwd: string): void {
  const gitignorePath = NodePath.join(cwd, ".gitignore");
  const sparkyEntry = "/.sparky/";

  let content: string;
  try {
    content = NodeFS.readFileSync(gitignorePath, "utf8");
  } catch {
    // No .gitignore yet — create one.
    NodeFS.writeFileSync(gitignorePath, `${sparkyEntry}\n`, "utf8");
    return;
  }

  const hasEntry = content.split("\n").some((line) => {
    const trimmed = line.trim();
    return (
      trimmed === sparkyEntry ||
      trimmed === "/.sparky" ||
      trimmed === ".sparky/" ||
      trimmed === ".sparky"
    );
  });

  if (!hasEntry) {
    NodeFS.writeFileSync(gitignorePath, `${content.trimEnd()}\n${sparkyEntry}\n`, "utf8");
  }

  // If .sparky/ was already tracked, remove it from the git index so the
  // gitignore entry takes effect and session files stop polluting diffs.
  try {
    NodeChildProcess.execSync("git rm --cached -r --quiet .sparky/", {
      cwd,
      stdio: "ignore",
    });
  } catch {
    // Either not a git repo, or .sparky/ wasn't tracked — both fine.
  }
}

export function writeSparkySessionBinding(cwd: string, threadId: string, sessionId: string): void {
  if (!usableSparkySessionId(cwd, sessionId)) {
    throw new Error(`Cannot bind missing Sparky session '${sessionId}'.`);
  }
  const bindingDirectory = NodePath.join(cwd, ".sparky", "t3-sessions");
  const bindingFile = sessionBindingFile(cwd, threadId);
  NodeFS.mkdirSync(bindingDirectory, { recursive: true });
  ensureGitignoreAndUntrack(cwd);
  const temporaryFile = `${bindingFile}.${process.pid}.${NodeCrypto.randomUUID()}.tmp`;
  NodeFS.writeFileSync(
    temporaryFile,
    `${JSON.stringify({ version: 1, threadId, sparkySessionId: sessionId })}\n`,
    "utf8",
  );
  NodeFS.renameSync(temporaryFile, bindingFile);
}

function sparkySessionIdFromResumeCursor(value: unknown, threadId: string): string | undefined {
  if (!value || typeof value !== "object") return undefined;
  const cursor = value as { threadId?: unknown; sparkySessionId?: unknown };
  if (cursor.threadId !== threadId) return undefined;
  return typeof cursor.sparkySessionId === "string" ? cursor.sparkySessionId : undefined;
}

function cwdFromResumeCursor(value: unknown, threadId: string): string | undefined {
  if (!value || typeof value !== "object") return undefined;
  const cursor = value as { threadId?: unknown; cwd?: unknown };
  if (cursor.threadId !== threadId || typeof cursor.cwd !== "string") return undefined;
  const cwd = cursor.cwd.trim();
  return cwd.length > 0 ? cwd : undefined;
}

function sessionIdFromResumeCursor(
  cwd: string,
  threadId: string,
  resumeCursor: unknown,
): string | undefined {
  const sessionId = sparkySessionIdFromResumeCursor(resumeCursor, threadId);
  return sessionId ? usableSparkySessionId(cwd, sessionId) : undefined;
}

/** Resolve the conversation identity for every follow-up turn. */
export function resolveSparkySessionId(
  cwd: string,
  threadId: string,
  resumeCursor: unknown,
): string | undefined {
  const requestedSessionId = sparkySessionIdFromResumeCursor(resumeCursor, threadId);
  if (requestedSessionId && !usableSparkySessionId(cwd, requestedSessionId)) {
    throw new Error(
      `Cannot continue Sparky conversation '${threadId}': persisted session '${requestedSessionId}' is missing from '${cwd}'. Refusing to start a new conversation.`,
    );
  }
  return (
    requestedSessionId ??
    readSparkySessionBinding(cwd, threadId)
  );
}

export function makeSparkyProcessArgs(input: {
  readonly cwd: string;
  readonly prompt: string;
  readonly model: string;
  readonly images?: ReadonlyArray<{ readonly path: string; readonly mimeType: string }>;
  readonly reasoningEffort?: string | undefined;
  readonly contextWindow?: string | undefined;
  readonly interactionMode?: ProviderInteractionMode | undefined;
  readonly sessionId?: string | undefined;
  readonly customInstructions?: string | undefined;
  readonly mcpUrl?: string | undefined;
  readonly mcpBearerTokenEnvVar?: string | undefined;
}): string[] {
  const selection = parseModelSelection(input.model);
  const args = [
    "--json-stream",
    "--provider",
    selection.provider,
    "--model",
    selection.model,
    "--cwd",
    input.cwd,
    "--prompt-stdin",
  ];
  if (selection.baseUrl) {
    args.push("--base-url", selection.baseUrl);
  }
  if (input.sessionId) {
    args.push("--session", input.sessionId);
  }
  if (input.reasoningEffort?.trim()) {
    args.push("--effort", input.reasoningEffort.trim());
  }
  if (input.contextWindow?.trim()) {
    args.push("--context-window", input.contextWindow.trim());
  }
  if (input.interactionMode) {
    // The provider contract calls the normal coding mode "default", while
    // Sparky's CLI names that same mode "build".
    args.push(
      "--interaction-mode",
      input.interactionMode === "plan" ? "plan" : "build",
    );
  }
  for (const image of input.images ?? []) {
    args.push("--image-path", image.path, "--image-mime-type", image.mimeType);
  }
  if (input.customInstructions?.trim()) {
    args.push("--append-system-prompt", input.customInstructions.trim());
  }
  if (input.mcpUrl?.trim() && input.mcpBearerTokenEnvVar?.trim()) {
    args.push("--mcp-url", input.mcpUrl.trim());
    args.push("--mcp-bearer-token-env-var", input.mcpBearerTokenEnvVar.trim());
  }
  return args;
}

function runSparky(input: {
  readonly binaryPath: string;
  readonly cwd: string;
  readonly prompt: string;
  readonly model: string;
  readonly images?: ReadonlyArray<{ readonly path: string; readonly mimeType: string }>;
  readonly reasoningEffort?: string | undefined;
  readonly contextWindow?: string | undefined;
  readonly interactionMode?: ProviderInteractionMode | undefined;
  readonly environment: NodeJS.ProcessEnv;
  readonly activeChildren?: Map<string, SparkyChildProcess> | undefined;
  readonly childKey?: string | undefined;
  readonly callbacks?: SparkyStreamCallbacks | undefined;
  readonly sessionId?: string | undefined;
  readonly customInstructions?: string | undefined;
  readonly mcpUrl?: string | undefined;
  readonly mcpBearerTokenEnvVar?: string | undefined;
}) {
  return Effect.tryPromise({
    try: () =>
      new Promise<SparkyProcessResult>((resolve, reject) => {
        const args = makeSparkyProcessArgs(input);

        let settled = false;
        let timeout: ReturnType<typeof setTimeout> | undefined;

        const child = NodeChildProcess.spawn(input.binaryPath, args, {
          cwd: input.cwd,
          env: input.environment,
          windowsHide: true,
          shell: false,
          stdio: ["pipe", "pipe", "pipe"],
        });
        if (input.childKey) input.activeChildren?.set(input.childKey, child);

        let stderr = "";
        const appendStderr = (chunk: string) => {
          const next = stderr + chunk;
          stderr = next.length > 65_536 ? next.slice(-65_536) : next;
        };
        const removeActiveChild = () => {
          if (input.childKey && input.activeChildren?.get(input.childKey) === child) {
            input.activeChildren.delete(input.childKey);
          }
        };
        const cleanup = () => {
          if (timeout !== undefined) {
            clearTimeout(timeout);
            timeout = undefined;
          }
          removeActiveChild();
        };
        const resolveOnce = (value: SparkyProcessResult) => {
          if (settled) return;
          settled = true;
          cleanup();
          // The JSON result is the protocol-level end of a one-shot turn. Do
          // not wait for a provider/MCP child to close its inherited event
          // loop before settling the desktop turn state.
          child.kill();
          resolve(value);
        };
        const rejectOnce = (cause: unknown) => {
          if (settled) return;
          settled = true;
          cleanup();
          reject(cause);
        };
        const decoder = makeSparkyStreamDecoder({
          ...input.callbacks,
          onResult: (result) => {
            try {
              resolveOnce(decoder.finish());
            } catch (cause) {
              rejectOnce(cause);
            }
          },
        });
        child.stdout.setEncoding("utf8");
        child.stderr.setEncoding("utf8");
        child.stdout.on("data", (chunk: string) => {
          decoder.push(chunk);
        });
        child.stderr.on("data", (chunk: string) => {
          appendStderr(chunk);
        });
        child.stdin.on("error", (error) => {
          appendStderr(`\nUnable to send the prompt to Sparky: ${error.message}`);
        });
        child.stdin.end(input.prompt, "utf8");
        timeout = setTimeout(() => {
          child.kill("SIGKILL");
          appendStderr(
            `\nSparky turn timed out after ${TURN_TIMEOUT_DURATION}.`,
          );
        }, Duration.toMillis(TURN_TIMEOUT_DURATION));
        child.once("error", (err) => {
          if (settled) return;
          decoder.failOpenTools(`Sparky process error: ${err.message}`);
          rejectOnce(err);
        });
        child.once("close", (code) => {
          if (settled) return;
          cleanup();
          if (code !== 0) {
            decoder.failOpenTools(
              stderr.trim() ||
                `Sparky exited before returning a result (exit code ${code ?? "unknown"}).`,
            );
            rejectOnce(
              new Error(
                stderr.trim() ||
                  `Sparky exited before returning a result (exit code ${code ?? "unknown"}).`,
              ),
            );
            return;
          }
          try {
            resolveOnce(decoder.finish());
          } catch (cause) {
            rejectOnce(cause);
          }
        });
      }),
    catch: (cause) =>
      new ProviderAdapterProcessError({
        provider: PROVIDER,
        threadId: "standalone",
        detail: cause instanceof Error ? cause.message : String(cause),
        cause,
      }),
  });
}

export const makeSparkyAdapter = (options: SparkyAdapterOptions) =>
      Effect.gen(function* () {
    const adapterScope = yield* Scope.Scope;
    const runtimeEvents = yield* PubSub.unbounded<ProviderRuntimeEvent>();
    const sessions = new Map<ThreadId, SessionState>();
    const activeChildren = new Map<string, SparkyChildProcess>();
    const activeFibers = new Map<string, Fiber.Fiber<void>>();

    const stamp = (threadId: ThreadId, turnId?: TurnId) => ({
      eventId: EventId.make(NodeCrypto.randomUUID()),
      provider: PROVIDER,
      providerInstanceId: options.instanceId,
      threadId,
      createdAt: new Date().toISOString(),
      ...(turnId ? { turnId } : {}),
    });
    const publish = (event: ProviderRuntimeEvent) =>
      PubSub.publish(runtimeEvents, event).pipe(Effect.asVoid);
    const missingSession = (threadId: ThreadId) =>
      Effect.fail(
        new ProviderAdapterSessionNotFoundError({
          provider: PROVIDER,
          threadId: String(threadId),
        }),
      );

  const executeTurn = (
      state: SessionState,
      turnId: TurnId,
      prompt: string,
      model: string,
      images: ReadonlyArray<{ readonly path: string; readonly mimeType: string }>,
      reasoningEffort: string | undefined,
      contextWindow: string | undefined,
      contextWindowTokens: number | undefined,
      interactionMode: ProviderInteractionMode,
    ) => {
      const threadId = state.session.threadId;
      const childKey = `${threadId}:${turnId}`;
      const cwd = state.session.cwd ?? process.cwd();
      const toolPresentations = new Map<string, ReturnType<typeof sparkyToolPresentation>>();
      return Effect.gen(function* () {
        yield* publish({
          type: "turn.started",
          ...stamp(threadId, turnId),
          payload: { model },
        });
        const assistantSegments = makeSparkyAssistantSegmenter({
          onStarted: (segmentId) => {
            Effect.runSync(
              publish({
                type: "item.started",
                ...stamp(threadId, turnId),
                itemId: RuntimeItemId.make(segmentId),
                payload: { itemType: "assistant_message", status: "inProgress" },
              }),
            );
          },
          onDelta: (segmentId, delta) => {
            Effect.runSync(
              publish({
                type: "content.delta",
                ...stamp(threadId, turnId),
                itemId: RuntimeItemId.make(segmentId),
                payload: { streamKind: "assistant_text", delta },
              }),
            );
          },
          onCompleted: (segmentId, text) => {
            Effect.runSync(
              publish({
                type: "item.completed",
                ...stamp(threadId, turnId),
                itemId: RuntimeItemId.make(segmentId),
                payload: {
                  itemType: "assistant_message",
                  status: "completed",
                  detail: text,
                },
              }),
            );
          },
        });

        const customInstructions = options.getCustomInstructions
          ? yield* options.getCustomInstructions()
          : "";
        const mcpSession = McpProviderSession.readMcpProviderSession(threadId);
        const effectiveInstructions = [
          customInstructions.trim(),
          ...(mcpSession ? [SPARKY_BROWSER_INSTRUCTIONS] : []),
        ]
          .filter((instructions) => instructions.length > 0)
          .join("\n\n");
        const result = yield* runSparky({
          binaryPath: options.binaryPath,
          cwd,
          prompt,
          model,
          images,
          reasoningEffort,
          contextWindow,
          interactionMode,
          environment: mcpSession
            ? {
                ...options.environment,
                [T3_MCP_BEARER_TOKEN_ENV_VAR]: mcpSession.authorizationHeader.replace(
                  /^Bearer\s+/u,
                  "",
                ),
              }
            : options.environment,
          activeChildren,
          childKey,
          sessionId: resolveSparkySessionId(cwd, String(threadId), state.session.resumeCursor),
          customInstructions: effectiveInstructions,
          ...(mcpSession
            ? {
                mcpUrl: mcpSession.endpoint,
                mcpBearerTokenEnvVar: T3_MCP_BEARER_TOKEN_ENV_VAR,
              }
            : {}),
          callbacks: {
            onDelta: assistantSegments.pushDelta,
            onUsage: (usage) => {
              Effect.runSync(
                publish({
                  type: "thread.token-usage.updated",
                  ...stamp(threadId, turnId),
                  payload: {
                    usage: {
                      usedTokens: Math.max(0, Math.round(usage.totalTokens)),
                      totalProcessedTokens: Math.max(
                        0,
                        Math.round(usage.cumulativeTotalTokens),
                      ),
                      ...(contextWindowTokens !== undefined
                        ? { maxTokens: contextWindowTokens }
                        : {}),
                      inputTokens: Math.max(0, Math.round(usage.promptTokens)),
                      outputTokens: Math.max(0, Math.round(usage.completionTokens)),
                      lastUsedTokens: Math.max(0, Math.round(usage.totalTokens)),
                      lastInputTokens: Math.max(0, Math.round(usage.promptTokens)),
                      lastOutputTokens: Math.max(0, Math.round(usage.completionTokens)),
                      compactsAutomatically: true,
                    },
                  },
                }),
              );
            },
            onToolStarted: (event) => {
              if (isHiddenSparkyControlTool(event.toolName)) return;
              assistantSegments.closeBeforeTool();
              const toolItemId = RuntimeItemId.make(event.toolCallId);
              const presentation = sparkyToolPresentation(event.toolName, event.arguments);
              toolPresentations.set(event.toolCallId, presentation);
              const data = { ...presentation.data, toolCallId: event.toolCallId };
              Effect.runSync(
                Effect.all(
                  [
                    publish({
                      type: "item.started",
                      ...stamp(threadId, turnId),
                      itemId: toolItemId,
                      payload: {
                        itemType: presentation.itemType,
                        status: "inProgress",
                        title: presentation.title,
                        data,
                      },
                    }),
                    publish({
                      type: "item.updated",
                      ...stamp(threadId, turnId),
                      itemId: toolItemId,
                      payload: {
                        itemType: presentation.itemType,
                        status: "inProgress",
                        title: presentation.title,
                        data,
                      },
                    }),
                  ],
                  { concurrency: 1, discard: true },
                ),
              );
            },
            onToolCompleted: (event) => {
              if (isHiddenSparkyControlTool(event.toolName)) return;
              const toolItemId = RuntimeItemId.make(event.toolCallId);
              const presentation =
                toolPresentations.get(event.toolCallId) ??
                sparkyToolPresentation(event.toolName, {});
              toolPresentations.delete(event.toolCallId);
              Effect.runSync(
                publish({
                  type: "item.completed",
                  ...stamp(threadId, turnId),
                  itemId: toolItemId,
                  payload: {
                    itemType: presentation.itemType,
                    status: event.isError ? "failed" : "completed",
                    title: presentation.title,
                    // Keep the full output in the structured result only. The
                    // previous event duplicated large tool payloads in both
                    // detail and data, increasing ingestion and UI costs.
                    data: {
                      ...presentation.data,
                      toolCallId: event.toolCallId,
                      result: { output: event.output, isError: event.isError },
                    },
                  },
                }),
              );
            },
          },
        });
        assistantSegments.finish(result.response);
        if (result.sessionId) {
          try {
            writeSparkySessionBinding(cwd, String(threadId), result.sessionId);
          } catch (cause) {
            yield* Effect.logWarning("failed to persist Sparky thread session binding", {
              threadId,
              sessionId: result.sessionId,
              cause,
            });
          }
        }

        state.snapshot = {
          threadId,
          turns: [
            ...state.snapshot.turns,
            {
              id: turnId,
              items: [
                { type: "userMessage", content: [{ type: "text", text: prompt }] },
                { type: "agentMessage", text: result.response },
              ],
            },
          ],
        };
        state.session = {
          ...state.session,
          status: "ready",
          activeTurnId: undefined,
          lastError: undefined,
          updatedAt: new Date().toISOString(),
          resumeCursor: result.sessionId
            ? { threadId: String(threadId), sparkySessionId: result.sessionId, cwd }
            : state.session.resumeCursor,
        };

        yield* publish({
          type: "turn.completed",
          ...stamp(threadId, turnId),
          payload: {
            state: "completed",
            ...(result.sessionId
              ? {
                  resumeCursor: {
                    threadId: String(threadId),
                    sparkySessionId: result.sessionId,
                    cwd,
                  },
                }
              : {}),
          },
        });
      }).pipe(
        Effect.catch((error) =>
          Effect.gen(function* () {
            const errorMessage = error?.message ?? "";
            const isContextLengthError =
              errorMessage.includes("context_length_exceeded") ||
              errorMessage.includes("context length") ||
              errorMessage.includes("Context window") ||
              errorMessage.includes("context window");

            // When the model's context window is exceeded, reset the session
            // cursor so the next turn starts fresh instead of retrying with
            // the same bloated conversation history.
            if (isContextLengthError) {
              yield* Effect.logWarning("context window exceeded - resetting session cursor", {
                threadId,
                turnId,
              });
              // Clear the resume cursor so the next sendTurn starts a new session
              state.session = {
                ...state.session,
                resumeCursor: undefined,
              };
              // Reset the snapshot turns to prevent replays
              state.snapshot = {
                threadId,
                turns: state.snapshot.turns.slice(-2), // keep only the last 2 turns
              };
            }

            state.session = {
              ...state.session,
              status: "error",
              activeTurnId: undefined,
              lastError: errorMessage || "Sparky turn failed.",
              updatedAt: new Date().toISOString(),
            };

            yield* publish({
              type: "runtime.error",
              ...stamp(threadId, turnId),
              payload: { message: errorMessage, class: "provider_error" },
            });
            yield* publish({
              type: "turn.completed",
              ...stamp(threadId, turnId),
              payload: {
                state: "failed",
                errorMessage: isContextLengthError
                  ? "Conversation too long - the model's context window was exceeded. Starting a fresh session for the next message."
                  : errorMessage,
                ...(isContextLengthError ? { resumeCursor: null } : {}),
              },
            });
          }),
        ),
        Effect.ensuring(
          Effect.sync(() => {
            activeChildren.delete(childKey);
            activeFibers.delete(childKey);
          }),
        ),
      );
    };

    const adapter: ProviderAdapterShape<ProviderAdapterError> = {
      provider: PROVIDER,
      capabilities: { sessionModelSwitch: "in-session" },
      startSession: (input) =>
        Effect.sync(() => {
          const now = new Date().toISOString();
          const threadId = String(input.threadId);
          const requestedSessionId = sparkySessionIdFromResumeCursor(input.resumeCursor, threadId);
          const cwd = input.cwd ?? cwdFromResumeCursor(input.resumeCursor, threadId) ?? process.cwd();
          const sparkySessionId =
            sessionIdFromResumeCursor(cwd, threadId, input.resumeCursor) ??
            readSparkySessionBinding(cwd, threadId);
          if (requestedSessionId && !sparkySessionId) {
            throw new Error(
              `Cannot resume Sparky conversation '${threadId}': session '${requestedSessionId}' is not available in '${cwd}'. Refusing to start a new conversation.`,
            );
          }
          const session: ProviderSession = {
            provider: PROVIDER,
            providerInstanceId: options.instanceId,
            status: "ready",
            runtimeMode: input.runtimeMode,
            threadId: input.threadId,
            cwd,
            ...(input.modelSelection?.model ? { model: input.modelSelection.model } : {}),
            ...(sparkySessionId
              ? { resumeCursor: { threadId, sparkySessionId, cwd } }
              : input.resumeCursor !== undefined
                ? { resumeCursor: input.resumeCursor }
                : {}),
            createdAt: now,
            updatedAt: now,
          };
          sessions.set(input.threadId, {
            session,
            snapshot: { threadId: input.threadId, turns: [] },
            nextTurn: 0,
          });
          return session;
        }),
      sendTurn: (input) =>
        Effect.gen(function* () {
          const state = sessions.get(input.threadId);
          if (!state) return yield* missingSession(input.threadId);
          const prompt = input.input?.trim();
          if (!prompt) {
            return yield* new ProviderAdapterValidationError({
              provider: PROVIDER,
              operation: "sendTurn",
              issue: "Sparky requires a text prompt.",
            });
          }
          const images = yield* Effect.forEach(input.attachments ?? [], (attachment: ChatAttachment) =>
            Effect.gen(function* () {
              const path = resolveAttachmentPath({
                attachmentsDir: options.attachmentsDir,
                attachment,
              });
              if (!path || !NodeFS.existsSync(path)) {
                return yield* new ProviderAdapterRequestError({
                  provider: PROVIDER,
                  method: "thread.turn.start",
                  detail: `Attachment '${attachment.name}' could not be loaded by Sparky.`,
                });
              }
              return { path, mimeType: attachment.mimeType };
            }),
          );
          const model = input.modelSelection?.model ?? state.session.model ?? "GPT-5.6 Sol";
          const reasoningEffort = input.modelSelection
            ? getModelSelectionStringOptionValue(input.modelSelection, "reasoningEffort")
            : undefined;
          const contextWindow = normalizeSparkyContextWindow(
            model,
            input.modelSelection
              ? getModelSelectionStringOptionValue(input.modelSelection, "contextWindow")
              : undefined,
          );
          const contextWindowTokens = parseSparkyContextWindowTokens(contextWindow);
          const interactionMode = input.interactionMode ?? "default";
          state.nextTurn += 1;
          const turnId = TurnId.make(`sparky-${state.nextTurn}-${NodeCrypto.randomUUID()}`);
          state.session = {
            ...state.session,
            status: "running",
            activeTurnId: turnId,
            model,
            updatedAt: new Date().toISOString(),
          };
          const fiber = yield* executeTurn(
            state,
            turnId,
            prompt,
            model,
            images,
            reasoningEffort,
            contextWindow,
            contextWindowTokens,
            interactionMode,
          ).pipe(Effect.forkIn(adapterScope));
          activeFibers.set(`${input.threadId}:${turnId}`, fiber);
          return { threadId: input.threadId, turnId };
        }),
      interruptTurn: (threadId, turnId) => {
        const state = sessions.get(threadId);
        if (!state) return missingSession(threadId);
        const targetTurnId = turnId ?? state.session.activeTurnId;
        if (!targetTurnId) return Effect.void;
        const key = `${threadId}:${targetTurnId}`;
        return Effect.gen(function* () {
          activeChildren.get(key)?.kill();
          const fiber = activeFibers.get(key);
          if (fiber) yield* Fiber.interrupt(fiber);
          yield* publish({
            type: "turn.completed",
            ...stamp(threadId, targetTurnId),
            payload: { state: "interrupted" },
          });
        });
      },
      respondToRequest: (threadId) =>
        sessions.has(threadId)
          ? Effect.fail(
              new ProviderAdapterValidationError({
                provider: PROVIDER,
                operation: "respondToRequest",
                issue: "Sparky handles tool execution inside its own runtime.",
              }),
            )
          : missingSession(threadId),
      respondToUserInput: (threadId) =>
        sessions.has(threadId)
          ? Effect.fail(
              new ProviderAdapterValidationError({
                provider: PROVIDER,
                operation: "respondToUserInput",
                issue: "Sparky does not expose structured follow-up requests.",
              }),
            )
          : missingSession(threadId),
      stopSession: (threadId) =>
        Effect.sync(() => {
          for (const [key, child] of activeChildren) {
            if (key.startsWith(`${threadId}:`)) child.kill();
          }
          sessions.delete(threadId);
        }),
      listSessions: () => Effect.sync(() => [...sessions.values()].map((state) => state.session)),
      hasSession: (threadId) => Effect.succeed(sessions.has(threadId)),
      readThread: (threadId) => {
        const state = sessions.get(threadId);
        return state ? Effect.succeed(state.snapshot) : missingSession(threadId);
      },
      rollbackThread: (threadId, numTurns) => {
        const state = sessions.get(threadId);
        if (!state) return missingSession(threadId);
        if (!Number.isInteger(numTurns) || numTurns < 0 || numTurns > state.snapshot.turns.length) {
          return Effect.fail(
            new ProviderAdapterValidationError({
              provider: PROVIDER,
              operation: "rollbackThread",
              issue: "numTurns must be within the current Sparky transcript.",
            }),
          );
        }
        return Effect.sync(() => {
          state.snapshot = {
            threadId,
            turns: state.snapshot.turns.slice(0, state.snapshot.turns.length - numTurns),
          };
          state.nextTurn = state.snapshot.turns.length;
          return state.snapshot;
        });
      },
      stopAll: () =>
        Effect.sync(() => {
          for (const child of activeChildren.values()) child.kill();
          activeChildren.clear();
          sessions.clear();
        }),
      streamEvents: Stream.fromPubSub(runtimeEvents),
    };

    return adapter;
  });

export const runSparkyTextGeneration = runSparky;
