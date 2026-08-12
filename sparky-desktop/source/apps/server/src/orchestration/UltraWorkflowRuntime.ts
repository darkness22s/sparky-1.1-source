// @effect-diagnostics globalDateInEffect:off globalRandom:off
import * as NodeCrypto from "node:crypto";
import * as DateTime from "effect/DateTime";
import * as vm from "node:vm";

export type UltraWorkflowStatus =
  | "Planning"
  | "Starting"
  | "Running"
  | "Waiting"
  | "Integrating"
  | "Verifying"
  | "Completed"
  | "Failed"
  | "Cancelled";

export type UltraAgentStatus =
  | "created"
  | "running"
  | "waiting"
  | "completed"
  | "failed"
  | "stopped";

export interface UltraAgentSnapshot {
  readonly id: string;
  readonly name: string;
  readonly task: string;
  readonly status: UltraAgentStatus;
  readonly activity: string;
  readonly recentMessages: readonly string[];
  readonly dependsOn: readonly string[];
}

export interface UltraMessage {
  readonly id: string;
  readonly from: string;
  readonly to: string | "broadcast";
  readonly text: string;
  readonly createdAt: string;
}

export interface UltraWorkflowSnapshot {
  readonly threadId: string;
  readonly workflowId: string;
  readonly status: UltraWorkflowStatus;
  readonly source: string;
  readonly agents: readonly UltraAgentSnapshot[];
  readonly messages: readonly UltraMessage[];
  readonly sharedState: Readonly<Record<string, unknown>>;
  readonly checkpoints: readonly string[];
  readonly summary: string;
}

export interface UltraWorkflowInput {
  readonly threadId: string;
  readonly prompt: string;
  readonly now?: () => string;
  readonly workflowId?: string;
}

interface AgentRecord extends UltraAgentSnapshot {
  readonly inbox: string[];
}

const MAX_SOURCE_CHARS = 24_000;
const MAX_AGENTS = 16;
const MAX_MESSAGES = 100;
const DANGEROUS_SOURCE =
  /\b(?:require|process|globalThis|import|export|child_process|fs|net|fetch|WebAssembly)\b|(?:\.constructor\s*\(|Function\s*\()/;

function defaultNow(): string {
  return DateTime.formatIso(DateTime.nowUnsafe());
}

function defaultWorkflowId(threadId: string): string {
  return `ultra:${idPart(threadId)}:${NodeCrypto.randomUUID()}`;
}

function idPart(value: string): string {
  return value.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 48) || "workflow";
}

function makeWorkflowSource(prompt: string): string {
  const task = JSON.stringify(prompt.slice(0, 8_000));
  return `(async () => {
    const analyst = await workflow.createAgent({ name: "Analyst", task: "Understand the request and identify risks." });
    const implementer = await workflow.createAgent({ name: "Implementer", task: "Propose the smallest implementation plan.", dependsOn: [analyst] });
    const verifier = await workflow.createAgent({ name: "Verifier", task: "Define focused verification for the requested change.", dependsOn: [implementer] });
    await workflow.parallel([analyst, implementer, verifier]);
    await workflow.send(analyst, "Main controller", "Analyze this task: " + ${task});
    await workflow.broadcast("Main controller", "Share concise findings before integration.");
    await workflow.wait([analyst, implementer, verifier]);
    await workflow.setState("task", ${task});
    await workflow.checkpoint("delegation-complete");
    await workflow.finish("Delegation complete; main controller should integrate and verify the findings.");
  })()`;
}

export function isUltraModelSelection(
  options: readonly { readonly id: string; readonly value: string | boolean }[] | undefined,
): boolean {
  return (
    options?.some(
      (option) =>
        (option.id === "effort" || option.id === "reasoningEffort") && option.value === "ultra",
    ) === true
  );
}

export async function runUltraWorkflow(input: UltraWorkflowInput): Promise<UltraWorkflowSnapshot> {
  const now = input.now ?? defaultNow;
  const workflowId = input.workflowId ?? defaultWorkflowId(input.threadId);
  const source = makeWorkflowSource(input.prompt);
  const agents = new Map<string, AgentRecord>();
  const messages: UltraMessage[] = [];
  const sharedState: Record<string, unknown> = Object.create(null);
  const checkpoints: string[] = [];
  let sequence = 0;
  let status: UltraWorkflowStatus = "Planning";
  let summary = "";
  let cancelled = false;

  const setStatus = (next: UltraWorkflowStatus) => {
    status = next;
  };
  const getAgent = (agentId: string): AgentRecord => {
    const agent = agents.get(agentId);
    if (!agent) throw new Error(`Unknown Ultra agent '${agentId}'.`);
    return agent;
  };
  const updateAgent = (agentId: string, patch: Partial<AgentRecord>) => {
    const current = getAgent(agentId);
    agents.set(agentId, { ...current, ...patch });
  };
  const createAgent = async (spec: {
    readonly name: string;
    readonly task: string;
    readonly dependsOn?: readonly string[];
  }) => {
    if (agents.size >= MAX_AGENTS) throw new Error("Ultra workflow agent limit reached.");
    const id = `agent-${++sequence}`;
    const dependsOn = [...(spec.dependsOn ?? [])];
    for (const dependency of dependsOn) getAgent(dependency);
    agents.set(id, {
      id,
      name: spec.name.slice(0, 120),
      task: spec.task.slice(0, 1_000),
      status: "created",
      activity: "Queued",
      recentMessages: [],
      dependsOn,
      inbox: [],
    });
    return id;
  };
  const runAgent = async (agentId: string) => {
    const agent = getAgent(agentId);
    if (cancelled) {
      updateAgent(agentId, { status: "stopped", activity: "Stopped by controller" });
      return;
    }
    for (const dependency of agent.dependsOn) {
      if (getAgent(dependency).status !== "completed") {
        updateAgent(agentId, { status: "waiting", activity: `Waiting for ${dependency}` });
        throw new Error(`Agent '${agentId}' dependency '${dependency}' has not completed.`);
      }
    }
    updateAgent(agentId, { status: "running", activity: "Working" });
    await Promise.resolve();
    const message = `Completed focused work: ${agent.task}`;
    updateAgent(agentId, {
      status: "completed",
      activity: "Completed",
      recentMessages: [message],
    });
    return message;
  };
  const send = async (from: string, to: string, text: string) => {
    const target = to === "Main controller" ? to : getAgent(to).id;
    const message: UltraMessage = {
      id: `message-${++sequence}`,
      from,
      to: target,
      text: text.slice(0, 4_000),
      createdAt: now(),
    };
    messages.push(message);
    if (messages.length > MAX_MESSAGES) messages.shift();
    if (target !== "Main controller") {
      const agent = getAgent(target);
      updateAgent(target, { recentMessages: [...agent.recentMessages, message.text].slice(-5) });
    }
  };
  const api = Object.freeze({
    createAgent,
    runAgent,
    parallel: async (ids: readonly string[]) => {
      setStatus("Running");
      const pending = new Set(ids);
      while (pending.size > 0) {
        const ready = [...pending].filter((id) =>
          getAgent(id).dependsOn.every((dependency) => getAgent(dependency).status === "completed"),
        );
        if (ready.length === 0) {
          throw new Error("Ultra workflow dependencies could not be resolved.");
        }
        await Promise.all(ready.map(runAgent));
        for (const id of ready) pending.delete(id);
      }
    },
    wait: async (ids: readonly string[]) => {
      setStatus("Waiting");
      for (const id of ids) if (getAgent(id).status !== "completed") await runAgent(id);
      setStatus("Running");
    },
    send,
    broadcast: async (from: string, text: string) => {
      for (const id of agents.keys()) await send(from, id, text);
    },
    listAgents: () => [...agents.values()].map(({ inbox: _inbox, ...agent }) => agent),
    getState: (key: string) => sharedState[key],
    setState: (key: string, value: unknown) => {
      sharedState[key] = value;
    },
    checkpoint: async (label: string) => {
      checkpoints.push(label.slice(0, 120));
    },
    stop: () => {
      cancelled = true;
      setStatus("Cancelled");
      for (const agent of agents.values()) {
        if (
          agent.status === "created" ||
          agent.status === "running" ||
          agent.status === "waiting"
        ) {
          updateAgent(agent.id, { status: "stopped", activity: "Stopped by controller" });
        }
      }
    },
    finish: async (value: string) => {
      summary = value.slice(0, 4_000);
      setStatus("Integrating");
      await Promise.resolve();
      setStatus("Verifying");
      await Promise.resolve();
      setStatus("Completed");
    },
  });

  setStatus("Starting");
  if (source.length > MAX_SOURCE_CHARS || DANGEROUS_SOURCE.test(source)) {
    setStatus("Failed");
    throw new Error("Ultra workflow source was rejected by the restricted runtime.");
  }
  const context = vm.createContext(Object.freeze({ workflow: api }));
  try {
    setStatus("Running");
    const script = new vm.Script(source, { filename: `ultra-${idPart(workflowId)}.mjs` });
    await script.runInContext(context, { timeout: 1_000 });
    const currentStatus = status as UltraWorkflowStatus;
    if (currentStatus !== "Completed" && currentStatus !== "Cancelled") {
      setStatus("Completed");
    }
  } catch (error) {
    setStatus(cancelled ? "Cancelled" : "Failed");
    summary = error instanceof Error ? error.message : "Ultra workflow failed.";
  }

  return {
    threadId: input.threadId,
    workflowId,
    status,
    source,
    agents: [...agents.values()].map(({ inbox: _inbox, ...agent }) => agent),
    messages,
    sharedState,
    checkpoints,
    summary,
  };
}
