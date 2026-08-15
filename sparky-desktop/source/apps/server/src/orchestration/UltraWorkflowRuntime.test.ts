import { describe, expect, it } from "vite-plus/test";

import { isUltraModelSelection, runUltraWorkflow } from "./UltraWorkflowRuntime.ts";

describe("UltraWorkflowRuntime", () => {
  it("recognizes the Ultra option", () => {
    expect(isUltraModelSelection([{ id: "effort", value: "ultra" }])).toBe(true);
    expect(isUltraModelSelection([{ id: "reasoningEffort", value: "ultra" }])).toBe(true);
    expect(isUltraModelSelection([{ id: "effort", value: "high" }])).toBe(false);
  });

  it("runs dependent agents, records messages, state, and checkpoints", async () => {
    const snapshot = await runUltraWorkflow({
      threadId: "thread-1",
      prompt: "Ship the smallest safe change.",
      workflowId: "ultra:test",
      now: () => "2026-01-01T00:00:00.000Z",
    });

    expect(snapshot).toMatchObject({
      threadId: "thread-1",
      workflowId: "ultra:test",
      status: "Completed",
      sharedState: { task: "Ship the smallest safe change." },
      checkpoints: ["delegation-complete"],
    });
    expect(snapshot.agents).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "Analyst", status: "completed" }),
        expect.objectContaining({ name: "Implementer", status: "completed" }),
        expect.objectContaining({ name: "Verifier", status: "completed" }),
      ]),
    );
    expect(snapshot.messages).toHaveLength(4);
    expect(snapshot.messages.at(-1)).toMatchObject({
      from: "Main controller",
      to: "agent-3",
      createdAt: "2026-01-01T00:00:00.000Z",
    });
  });
});
