import type {
  OrchestrationThread,
  OrchestrationThreadActivity,
  OrchestrationThreadShell,
} from "@sparky/contracts";

export interface ProfileUsageDay {
  readonly date: string;
  readonly label: string;
  readonly shortLabel: string;
  readonly tokens: number;
  readonly chats: number;
  readonly messages: number;
  readonly activeMinutes: number;
  readonly mostUsedModel: string | null;
  readonly mostUsedModels: ReadonlyArray<string>;
  readonly mostUsedSkills: ReadonlyArray<string>;
}

export interface ProfileUsageSummary {
  readonly totalChats: number;
  readonly totalMessages: number;
  readonly totalTokens: number;
  readonly tokensPerDay: number;
  readonly activeDays: number;
  readonly currentStreak: number;
  readonly longestStreak: number;
  readonly activeMinutes: number;
  readonly mostUsedModel: string | null;
  readonly mostUsedSkill: string | null;
  readonly days: ReadonlyArray<ProfileUsageDay>;
}

type UsageAccumulator = {
  tokens: number;
  chats: Set<string>;
  messages: number;
  activeMinutes: number;
  models: Map<string, number>;
  skills: Map<string, number>;
};

type UsagePoint = {
  date: string;
  cumulativeTokens: number | null;
  directTokens: number;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function asFiniteNonNegativeNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : null;
}

function dateKey(value: string | Date): string | null {
  const date = value instanceof Date ? value : new Date(value);
  if (!Number.isFinite(date.getTime())) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dateFromKey(value: string): Date {
  const [year = 1970, month = 1, day = 1] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function addDays(value: Date, amount: number): Date {
  const date = new Date(value);
  date.setDate(date.getDate() + amount);
  return date;
}

function modelLabel(model: string): string {
  const normalized = model.trim();
  if (!normalized) return "Unknown model";
  const withoutProvider = normalized.includes("/")
    ? normalized.slice(normalized.lastIndexOf("/") + 1)
    : normalized;
  return withoutProvider.replace(/[-_]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function skillLabel(value: unknown): string | null {
  if (typeof value !== "string" || value.trim().length === 0) return null;
  return value
    .trim()
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function usagePointFromActivity(activity: OrchestrationThreadActivity): UsagePoint | null {
  const payload = asRecord(activity.payload);
  if (!payload) return null;
  const usage = activity.kind === "context-window.updated" ? payload : asRecord(payload.usage);
  if (!usage) return null;

  const totalProcessedTokens = asFiniteNonNegativeNumber(usage.totalProcessedTokens);
  const inputTokens = asFiniteNonNegativeNumber(usage.inputTokens);
  const outputTokens = asFiniteNonNegativeNumber(usage.outputTokens);
  const lastInputTokens = asFiniteNonNegativeNumber(usage.lastInputTokens);
  const lastOutputTokens = asFiniteNonNegativeNumber(usage.lastOutputTokens);
  const usedTokens =
    asFiniteNonNegativeNumber(usage.lastUsedTokens) ?? asFiniteNonNegativeNumber(usage.usedTokens);
  const directTokens =
    (lastInputTokens ?? inputTokens ?? 0) + (lastOutputTokens ?? outputTokens ?? 0) ||
    usedTokens ||
    0;

  if (totalProcessedTokens === null && directTokens <= 0) return null;
  const pointDate = dateKey(activity.createdAt);
  if (!pointDate) return null;
  return {
    date: pointDate,
    cumulativeTokens: totalProcessedTokens,
    directTokens,
  };
}

function addToCounter(counter: Map<string, number>, value: string | null, amount = 1): void {
  if (!value) return;
  counter.set(value, (counter.get(value) ?? 0) + amount);
}

function accumulatorFor(map: Map<string, UsageAccumulator>, key: string): UsageAccumulator {
  const current = map.get(key);
  if (current) return current;
  const next: UsageAccumulator = {
    tokens: 0,
    chats: new Set<string>(),
    messages: 0,
    activeMinutes: 0,
    models: new Map<string, number>(),
    skills: new Map<string, number>(),
  };
  map.set(key, next);
  return next;
}

function addChat(accumulator: UsageAccumulator, threadId: string): void {
  accumulator.chats.add(threadId);
}

function addModel(accumulator: UsageAccumulator, model: string | null, amount = 1): void {
  addToCounter(accumulator.models, model, amount);
}

function addSkill(accumulator: UsageAccumulator, skill: string | null, amount = 1): void {
  addToCounter(accumulator.skills, skill, amount);
}

function sortedCounterValues(counter: Map<string, number>): ReadonlyArray<string> {
  return [...counter.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .map(([value]) => value);
}

function formatDay(value: string, options: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat(undefined, options).format(dateFromKey(value));
}

function emptyAccumulator(): UsageAccumulator {
  return {
    tokens: 0,
    chats: new Set<string>(),
    messages: 0,
    activeMinutes: 0,
    models: new Map<string, number>(),
    skills: new Map<string, number>(),
  };
}

export function calculateUsageStreaks(
  activeDates: ReadonlyArray<string>,
  today = new Date(),
): {
  current: number;
  longest: number;
} {
  const dates = [...new Set(activeDates)].sort();
  if (dates.length === 0) return { current: 0, longest: 0 };

  let longest = 1;
  let run = 1;
  for (let index = 1; index < dates.length; index += 1) {
    const previousKey = dates[index - 1];
    const currentKey = dates[index];
    if (!previousKey || !currentKey) continue;
    const previous = dateFromKey(previousKey);
    const current = dateFromKey(currentKey);
    const difference = Math.round((current.getTime() - previous.getTime()) / 86_400_000);
    run = difference === 1 ? run + 1 : 1;
    longest = Math.max(longest, run);
  }

  const todayKey = dateKey(today);
  if (!todayKey || !dates.includes(todayKey)) return { current: 0, longest };
  let current = 1;
  let cursor = dateFromKey(todayKey);
  const active = new Set(dates);
  while (active.has(dateKey(addDays(cursor, -1)) ?? "")) {
    current += 1;
    cursor = addDays(cursor, -1);
  }
  return { current, longest };
}

export function buildProfileUsage(
  threads: ReadonlyArray<OrchestrationThread>,
  options: {
    readonly shells?: ReadonlyArray<OrchestrationThreadShell>;
    readonly now?: Date;
    readonly chartDays?: number;
  } = {},
): ProfileUsageSummary {
  const now = options.now ?? new Date();
  const chartDays = Math.max(7, options.chartDays ?? 30);
  const byDate = new Map<string, UsageAccumulator>();
  const knownThreadIds = new Set(threads.map((thread) => String(thread.id)));
  const allThreadIds = new Set(knownThreadIds);
  let totalMessages = 0;
  let totalTokens = 0;
  let activeMinutes = 0;
  const overallModels = new Map<string, number>();
  const overallSkills = new Map<string, number>();

  for (const thread of threads) {
    const threadId = String(thread.id);
    const model = modelLabel(thread.modelSelection.model);
    const messageDates = new Set<string>();
    for (const message of thread.messages) {
      const messageDate = dateKey(message.createdAt);
      if (!messageDate) continue;
      const accumulator = accumulatorFor(byDate, messageDate);
      addChat(accumulator, threadId);
      accumulator.messages += 1;
      addModel(accumulator, model);
      messageDates.add(messageDate);
      totalMessages += 1;
    }

    const usagePoints = thread.activities
      .map(usagePointFromActivity)
      .filter((point): point is UsagePoint => point !== null)
      .sort((left, right) => left.date.localeCompare(right.date));
    let previousCumulative = 0;
    let hasObservedUsage = false;
    for (const point of usagePoints) {
      let increment = point.directTokens;
      if (point.cumulativeTokens !== null) {
        increment =
          point.cumulativeTokens >= previousCumulative
            ? point.cumulativeTokens - previousCumulative
            : point.cumulativeTokens;
        previousCumulative = point.cumulativeTokens;
      }
      if (increment <= 0) continue;
      hasObservedUsage = true;
      const accumulator = accumulatorFor(byDate, point.date);
      addChat(accumulator, threadId);
      addModel(accumulator, model);
      accumulator.tokens += increment;
      totalTokens += increment;
      messageDates.add(point.date);
    }

    // Older threads may not have persisted provider usage activities. Keep the
    // dashboard useful by deriving a conservative text-token estimate instead
    // of presenting a misleading empty chart.
    if (!hasObservedUsage) {
      for (const message of thread.messages) {
        const messageDate = dateKey(message.createdAt);
        if (!messageDate) continue;
        const estimatedTokens = Math.max(1, Math.ceil(message.text.length / 4));
        const accumulator = accumulatorFor(byDate, messageDate);
        accumulator.tokens += estimatedTokens;
        totalTokens += estimatedTokens;
      }
    }

    for (const activity of thread.activities) {
      const activityDate = dateKey(activity.createdAt);
      if (!activityDate) continue;
      const accumulator = accumulatorFor(byDate, activityDate);
      addChat(accumulator, threadId);
      addModel(accumulator, model);
      const payload = asRecord(activity.payload);
      const skill =
        skillLabel(payload?.lastToolName) ??
        skillLabel(payload?.toolName) ??
        skillLabel(payload?.itemType) ??
        (activity.kind.startsWith("tool.") ? "Tool use" : null);
      addSkill(accumulator, skill);
      const durationMs = asFiniteNonNegativeNumber(payload?.durationMs);
      if (durationMs !== null) accumulator.activeMinutes += durationMs / 60_000;
    }

    if (thread.latestTurn?.startedAt && thread.latestTurn.completedAt) {
      const completedDate = dateKey(thread.latestTurn.completedAt);
      const startedAt = new Date(thread.latestTurn.startedAt).getTime();
      const completedAt = new Date(thread.latestTurn.completedAt).getTime();
      if (completedDate && completedAt >= startedAt) {
        const minutes = (completedAt - startedAt) / 60_000;
        accumulatorFor(byDate, completedDate).activeMinutes += minutes;
      }
    }

    for (const date of messageDates) {
      const accumulator = accumulatorFor(byDate, date);
      addChat(accumulator, threadId);
    }
  }

  for (const shell of options.shells ?? []) {
    const threadId = String(shell.id);
    allThreadIds.add(threadId);
    if (knownThreadIds.has(threadId)) continue;
    const shellDate = dateKey(shell.latestUserMessageAt ?? shell.updatedAt ?? shell.createdAt);
    if (!shellDate) continue;
    const accumulator = accumulatorFor(byDate, shellDate);
    addChat(accumulator, threadId);
    addModel(accumulator, modelLabel(shell.modelSelection.model));
  }

  for (const accumulator of byDate.values()) {
    for (const [model, count] of accumulator.models) addToCounter(overallModels, model, count);
    for (const [skill, count] of accumulator.skills) addToCounter(overallSkills, skill, count);
    activeMinutes += accumulator.activeMinutes;
  }

  const activeDates = [...byDate.entries()]
    .filter(
      ([, accumulator]) =>
        accumulator.chats.size > 0 || accumulator.messages > 0 || accumulator.tokens > 0,
    )
    .map(([date]) => date)
    .sort();
  const streaks = calculateUsageStreaks(activeDates, now);
  const totalChats = allThreadIds.size;
  const activeDays = activeDates.length;
  const chartEnd = dateKey(now) ?? dateKey(new Date()) ?? "1970-01-01";
  const chartStart = dateKey(addDays(dateFromKey(chartEnd), -(chartDays - 1))) ?? chartEnd;
  const days: ProfileUsageDay[] = [];

  for (let index = 0; index < chartDays; index += 1) {
    const key = dateKey(addDays(dateFromKey(chartStart), index)) ?? chartStart;
    const accumulator = byDate.get(key) ?? emptyAccumulator();
    const models = sortedCounterValues(accumulator.models);
    const skills = sortedCounterValues(accumulator.skills);
    days.push({
      date: key,
      label: formatDay(key, { month: "long", day: "numeric", year: "numeric" }),
      shortLabel: formatDay(key, { weekday: "short" }),
      tokens: Math.round(accumulator.tokens),
      chats: accumulator.chats.size,
      messages: accumulator.messages,
      activeMinutes: Math.round(accumulator.activeMinutes),
      mostUsedModel: models[0] ?? null,
      mostUsedModels: models.slice(0, 3),
      mostUsedSkills: skills.slice(0, 3),
    });
  }

  const modelList = sortedCounterValues(overallModels);
  const skillList = sortedCounterValues(overallSkills);
  return {
    totalChats,
    totalMessages,
    totalTokens: Math.round(totalTokens),
    tokensPerDay: activeDays > 0 ? Math.round(totalTokens / activeDays) : 0,
    activeDays,
    currentStreak: streaks.current,
    longestStreak: streaks.longest,
    activeMinutes: Math.round(activeMinutes),
    mostUsedModel: modelList[0] ?? null,
    mostUsedSkill: skillList[0] ?? null,
    days,
  };
}
