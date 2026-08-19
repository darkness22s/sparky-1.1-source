import type { OrchestrationThread } from "@sparky/contracts";

import { recordAccountUsageEvent } from "./accountApi";
import { recordModelAnalyticsEvent } from "./modelAnalytics";

type NumericUsage = {
  readonly lastInputTokens?: unknown;
  readonly lastCachedInputTokens?: unknown;
  readonly lastOutputTokens?: unknown;
  readonly lastReasoningOutputTokens?: unknown;
  readonly lastUsedTokens?: unknown;
  readonly toolUses?: unknown;
};

function numeric(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : undefined;
}

function usageForTurn(thread: OrchestrationThread, turnId: string): NumericUsage {
  const activity = [...thread.activities]
    .reverse()
    .find(
      (candidate) => candidate.turnId === turnId && candidate.kind === "context-window.updated",
    );
  if (!activity || typeof activity.payload !== "object" || activity.payload === null) return {};
  return activity.payload as NumericUsage;
}

/**
 * Records one idempotent usage row after a provider turn settles. Prompts,
 * responses, and tool payloads are deliberately excluded; only operational
 * usage metadata is sent to the authenticated account analytics endpoint.
 */
export async function recordCompletedTurnUsage(input: {
  readonly environmentId: string;
  readonly thread: OrchestrationThread;
}): Promise<boolean> {
  const turn = input.thread.latestTurn;
  if (turn === null || turn.state === "running") return false;

  const usage = usageForTurn(input.thread, String(turn.turnId));
  const totalTokens =
    numeric(usage.lastUsedTokens) ??
    (numeric(usage.lastInputTokens) ?? 0) +
      (numeric(usage.lastCachedInputTokens) ?? 0) +
      (numeric(usage.lastOutputTokens) ?? 0) +
      (numeric(usage.lastReasoningOutputTokens) ?? 0);
  const providerInstanceId = String(input.thread.modelSelection.instanceId);

  const event = {
    eventId: `turn:${String(input.thread.id)}:${String(turn.turnId)}`,
    environmentId: input.environmentId,
    threadId: String(input.thread.id),
    turnId: String(turn.turnId),
    provider: providerInstanceId,
    providerInstanceId,
    model: input.thread.modelSelection.model,
    inputTokens: numeric(usage.lastInputTokens),
    cachedInputTokens: numeric(usage.lastCachedInputTokens),
    outputTokens: numeric(usage.lastOutputTokens),
    reasoningOutputTokens: numeric(usage.lastReasoningOutputTokens),
    totalTokens,
    toolUses: numeric(usage.toolUses),
    occurredAt: turn.completedAt ?? input.thread.updatedAt,
  };
  recordModelAnalyticsEvent(event);
  return recordAccountUsageEvent(event);
}
