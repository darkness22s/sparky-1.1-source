import {
  EventId,
  MessageId,
  type OrchestrationThread,
  type OrchestrationThreadShell,
} from "@sparky/contracts";
import { describe, expect, it } from "vite-plus/test";

import { buildProfileUsage, calculateUsageStreaks } from "./profileUsage";

const thread = (overrides: Partial<OrchestrationThread> = {}): OrchestrationThread =>
  ({
    id: "thread-1",
    projectId: "project-1",
    title: "Usage test",
    modelSelection: { instanceId: "codex", model: "gpt-5" },
    runtimeMode: "local",
    interactionMode: "default",
    branch: null,
    worktreePath: null,
    latestTurn: null,
    createdAt: "2025-01-01T12:00:00.000Z",
    updatedAt: "2025-01-02T12:00:00.000Z",
    archivedAt: null,
    deletedAt: null,
    messages: [],
    proposedPlans: [],
    activities: [],
    checkpoints: [],
    session: null,
    ...overrides,
  }) as unknown as OrchestrationThread;

const shell = (id: string): OrchestrationThreadShell =>
  ({
    id,
    projectId: "project-1",
    title: id,
    modelSelection: { instanceId: "codex", model: "gpt-5" },
    runtimeMode: "local",
    interactionMode: "default",
    branch: null,
    worktreePath: null,
    latestTurn: null,
    createdAt: "2025-01-01T12:00:00.000Z",
    updatedAt: "2025-01-02T12:00:00.000Z",
    archivedAt: null,
    session: null,
    latestUserMessageAt: "2025-01-02T12:00:00.000Z",
    hasPendingApprovals: false,
    hasPendingUserInput: false,
    hasActionableProposedPlan: false,
  }) as unknown as OrchestrationThreadShell;

describe("calculateUsageStreaks", () => {
  it("tracks the current run and the longest historical run", () => {
    expect(
      calculateUsageStreaks(
        ["2025-01-01", "2025-01-02", "2025-01-04"],
        new Date("2025-01-04T12:00:00.000Z"),
      ),
    ).toEqual({ current: 1, longest: 2 });
  });
});

describe("buildProfileUsage", () => {
  it("combines persisted usage increments with shell-only chats", () => {
    const usageThread = thread({
      messages: [
        {
          id: MessageId.make("message-1"),
          role: "user",
          text: "Hello",
          turnId: null,
          streaming: false,
          createdAt: "2025-01-01T12:00:00.000Z",
          updatedAt: "2025-01-01T12:00:00.000Z",
        },
        {
          id: MessageId.make("message-2"),
          role: "assistant",
          text: "Hi there",
          turnId: null,
          streaming: false,
          createdAt: "2025-01-02T12:00:00.000Z",
          updatedAt: "2025-01-02T12:00:00.000Z",
        },
      ],
      activities: [
        {
          id: EventId.make("event-1"),
          tone: "info",
          kind: "context-window.updated",
          summary: "Context window updated",
          payload: { usedTokens: 10, totalProcessedTokens: 10 },
          turnId: null,
          createdAt: "2025-01-01T12:00:00.000Z",
        },
        {
          id: EventId.make("event-2"),
          tone: "info",
          kind: "context-window.updated",
          summary: "Context window updated",
          payload: { usedTokens: 25, totalProcessedTokens: 25 },
          turnId: null,
          createdAt: "2025-01-02T12:00:00.000Z",
        },
      ],
    });

    const usage = buildProfileUsage([usageThread], {
      shells: [shell("thread-1"), shell("thread-2")],
      now: new Date("2025-01-02T12:00:00.000Z"),
      chartDays: 7,
    });

    expect(usage.totalChats).toBe(2);
    expect(usage.totalMessages).toBe(2);
    expect(usage.totalTokens).toBe(25);
    expect(usage.tokensPerDay).toBe(13);
    expect(usage.days.find((day) => day.date === "2025-01-01")).toMatchObject({
      tokens: 10,
      chats: 1,
      messages: 1,
    });
    expect(usage.days.find((day) => day.date === "2025-01-02")).toMatchObject({
      tokens: 15,
      chats: 2,
      messages: 1,
      mostUsedModel: "Gpt 5",
    });
  });
});
