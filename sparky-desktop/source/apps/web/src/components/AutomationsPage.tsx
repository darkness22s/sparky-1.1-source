import { Automation, AutomationCreateInput } from "@sparky/contracts";
import { scopeProjectRef } from "@sparky/client-runtime/environment";
import {
  ActivityIcon,
  BellIcon,
  CalendarClockIcon,
  CalendarDaysIcon,
  ChevronDownIcon,
  Clock3Icon,
  EllipsisIcon,
  MessageCircleIcon,
  PauseIcon,
  PencilLineIcon,
  PlayIcon,
  PlusIcon,
  RefreshCwIcon,
  SearchIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useThreadShells, useProjects } from "../state/entities";
import { fetchPrimaryEnvironment } from "../environments/primary/httpLayer";
import { resolvePrimaryEnvironmentHttpUrl } from "../environments/primary/target";
import { useNewThreadHandler } from "../hooks/useHandleNewThread";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectItem, SelectPopup, SelectTrigger, SelectValue } from "./ui/select";
import { SidebarInset } from "./ui/sidebar";
import { Textarea } from "./ui/textarea";
import { cn } from "~/lib/utils";

const automationUrl = (path = "/api/automations") => resolvePrimaryEnvironmentHttpUrl(path);
const localDateTime = (date: Date) => {
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};
const scheduleLabel = (value: Automation["schedule"]) =>
  ({ once: "Once", daily: "Every day", weekdays: "Weekdays", weekly: "Every week" })[value];
const formatNextRun = (value: string | null) => {
  if (value === null) return "No upcoming run";
  const diff = new Date(value).getTime() - Date.now();
  if (diff <= 0) return "Due now";
  const units = [
    ["day", 86_400_000],
    ["hour", 3_600_000],
    ["minute", 60_000],
  ] as const;
  const [unit, milliseconds] = units.find(([, amount]) => diff >= amount) ?? units[2];
  const count = Math.max(1, Math.round(diff / milliseconds));
  return `Next run in ${count} ${unit}${count === 1 ? "" : "s"}`;
};

const AUTOMATION_CHAT_STARTER_PROMPT = "Create an automation that ";
const iconToneClasses = {
  sky: "text-sky-600 dark:text-sky-300",
  violet: "text-violet-600 dark:text-violet-300",
  emerald: "text-emerald-600 dark:text-emerald-300",
  amber: "text-amber-600 dark:text-amber-300",
} as const;
const scheduleVisuals = {
  once: { icon: CalendarClockIcon, tone: "violet" },
  daily: { icon: ActivityIcon, tone: "sky" },
  weekdays: { icon: CalendarDaysIcon, tone: "emerald" },
  weekly: { icon: Clock3Icon, tone: "amber" },
} as const;

const taskSuggestions = [
  {
    icon: BellIcon,
    tone: "sky",
    title: "Daily brief",
    timing: "Weekdays at 8:00 AM",
    prompt: "Summarize my recent work, open changes, and anything that needs my attention.",
  },
  {
    icon: CalendarClockIcon,
    tone: "violet",
    title: "Weekly review",
    timing: "Fridays at 4:00 PM",
    prompt: "Review this week's work and turn it into a concise status update.",
  },
  {
    icon: Clock3Icon,
    tone: "emerald",
    title: "Follow-up monitor",
    timing: "Weekdays at 9:00 AM",
    prompt: "Review recent activity and flag anything that needs a follow-up.",
  },
] as const;

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetchPrimaryEnvironment(automationUrl(path), {
    ...init,
    headers: { "content-type": "application/json", ...(init?.headers ?? {}) },
  });
  if (!response.ok)
    throw new Error((await response.text()) || `Request failed (${response.status})`);
  return (await response.json()) as T;
}

export function AutomationsPage() {
  const threads = useThreadShells();
  const projects = useProjects();
  const handleNewThread = useNewThreadHandler();
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState(threads[0]?.id ?? "");
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [runAt, setRunAt] = useState(() => localDateTime(new Date(Date.now() + 60 * 60_000)));
  const [schedule, setSchedule] = useState<Automation["schedule"]>("once");
  const [filter, setFilter] = useState<"all" | "active" | "paused">("all");
  const [query, setQuery] = useState("");
  const [createMenuOpen, setCreateMenuOpen] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const [startingChat, setStartingChat] = useState(false);
  const [openActionId, setOpenActionId] = useState<Automation["id"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedThreadId && threads[0]) setSelectedThreadId(threads[0].id);
  }, [selectedThreadId, threads]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setAutomations(await request<Automation[]>("/api/automations"));
      setError(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load automations.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => void load(), [load]);

  const filteredAutomations = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return automations.filter((automation) => {
      const matchesFilter =
        filter === "all" || (filter === "active" ? automation.enabled : !automation.enabled);
      const matchesQuery =
        !normalizedQuery ||
        automation.title.toLowerCase().includes(normalizedQuery) ||
        automation.prompt.toLowerCase().includes(normalizedQuery);
      return matchesFilter && matchesQuery;
    });
  }, [automations, filter, query]);

  const useSuggestion = (suggestion: (typeof taskSuggestions)[number]) => {
    setTitle(suggestion.title);
    setPrompt(suggestion.prompt);
    setSchedule(suggestion.title === "Daily brief" ? "weekdays" : "weekly");
    setManualOpen(true);
  };

  const openChatCreation = async () => {
    const project = projects[0];
    if (!project) {
      setError("Add a project before starting a chat automation.");
      setCreateMenuOpen(false);
      return;
    }
    setCreateMenuOpen(false);
    setStartingChat(true);
    try {
      await handleNewThread(scopeProjectRef(project.environmentId, project.id), {
        initialPrompt: AUTOMATION_CHAT_STARTER_PROMPT,
      });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not open a new chat.");
    } finally {
      setStartingChat(false);
    }
  };

  const selectedThread = useMemo(
    () => threads.find((thread) => thread.id === selectedThreadId) ?? null,
    [selectedThreadId, threads],
  );

  const create = async () => {
    if (!selectedThread || !title.trim() || !prompt.trim()) return;
    setSaving(true);
    try {
      const payload: AutomationCreateInput = {
        threadId: selectedThread.id,
        providerInstanceId: selectedThread.modelSelection.instanceId,
        title: title.trim(),
        prompt: prompt.trim(),
        schedule,
        runAt: new Date(runAt).toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        modelSelection: selectedThread.modelSelection,
        runtimeMode: selectedThread.runtimeMode,
        interactionMode: selectedThread.interactionMode,
      };
      await request<Automation>("/api/automations", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setTitle("");
      setPrompt("");
      await load();
      setManualOpen(false);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not create automation.");
    } finally {
      setSaving(false);
    }
  };

  const mutate = async (automation: Automation, action: "toggle" | "run" | "delete") => {
    try {
      if (action === "delete") {
        await request(`/api/automations/${automation.id}/delete`, { method: "POST" });
      } else if (action === "run") {
        await request(`/api/automations/${automation.id}/run`, { method: "POST" });
      } else {
        await request(`/api/automations/${automation.id}/toggle`, {
          method: "POST",
          body: JSON.stringify({ enabled: !automation.enabled }),
        });
      }
      await load();
      setOpenActionId(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not update automation.");
    }
  };

  return (
    <SidebarInset className="h-dvh min-h-0 overflow-hidden bg-background text-foreground isolate">
      <main className="min-h-0 flex-1 overflow-y-auto px-5 py-8 md:px-10 md:py-12">
        <div className={cn("mx-auto space-y-8", manualOpen ? "max-w-none" : "max-w-4xl")}>
          <header className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-medium tracking-tight md:text-3xl">Scheduled tasks</h1>
              <p className="mt-2 text-sm text-muted-foreground md:text-base">
                Ask Sparky to schedule tasks, reminders, or monitor for updates.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={() => void load()}
                disabled={loading}
                aria-label="Refresh scheduled tasks"
              >
                <RefreshCwIcon className={cn("size-4", loading && "animate-spin")} />
              </Button>
              <div className="relative">
                <Button
                  size="sm"
                  onClick={() => setCreateMenuOpen((open) => !open)}
                  aria-expanded={createMenuOpen}
                  aria-haspopup="menu"
                  disabled={startingChat}
                >
                  {startingChat ? "Opening…" : "Create"}
                  <ChevronDownIcon className="size-4" />
                </Button>
                {createMenuOpen ? (
                  <div
                    className="absolute end-0 top-full z-20 mt-2 w-56 rounded-xl border border-border bg-popover p-1.5 text-popover-foreground shadow-lg"
                    role="menu"
                  >
                    <button
                      type="button"
                      role="menuitem"
                      className="flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-start transition-colors hover:bg-muted"
                      onClick={() => void openChatCreation()}
                    >
                      <MessageCircleIcon className={cn("mt-0.5 size-4", iconToneClasses.sky)} />
                      <span>
                        <span className="block text-sm font-medium">Create in chat</span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          Start a new chat with a ready-to-edit prompt.
                        </span>
                      </span>
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      className="flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-start transition-colors hover:bg-muted"
                      onClick={() => {
                        setCreateMenuOpen(false);
                        setManualOpen(true);
                      }}
                    >
                      <PencilLineIcon className={cn("mt-0.5 size-4", iconToneClasses.amber)} />
                      <span>
                        <span className="block text-sm font-medium">Create manually</span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          Configure the schedule and chat here.
                        </span>
                      </span>
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </header>

          <div
            className={cn(
              manualOpen &&
                "grid min-h-[calc(100dvh-13rem)] overflow-hidden rounded-2xl border border-border/70 md:grid-cols-[minmax(0,1fr)_minmax(280px,0.78fr)] md:divide-x",
            )}
          >
            <div className={cn("min-w-0 space-y-8", manualOpen && "p-5 md:p-6")}>
              <section className="space-y-5">
                <div className="relative">
                  <SearchIcon className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search scheduled tasks"
                    aria-label="Search scheduled tasks"
                    className="h-10 w-full rounded-full border border-input bg-background ps-10 pe-4 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
                  />
                </div>
                <div
                  className="flex items-center gap-1"
                  role="tablist"
                  aria-label="Scheduled task filters"
                >
                  {(["all", "active", "paused"] as const).map((value) => (
                    <button
                      key={value}
                      type="button"
                      role="tab"
                      aria-selected={filter === value}
                      onClick={() => setFilter(value)}
                      className={cn(
                        "rounded-lg px-3 py-1.5 text-sm transition-colors",
                        filter === value
                          ? "bg-muted text-foreground"
                          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                      )}
                    >
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </button>
                  ))}
                </div>

                {error ? (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                    {error}
                  </div>
                ) : null}
                {loading ? (
                  <div className="py-8 text-center text-sm text-muted-foreground">
                    Loading scheduled tasks…
                  </div>
                ) : null}
                {!loading && filteredAutomations.length > 0 ? (
                  <div className="divide-y divide-border/70 border-y border-border/70">
                    {filteredAutomations.map((automation) => {
                      const scheduleVisual = scheduleVisuals[automation.schedule];
                      const ScheduleIcon = scheduleVisual.icon;
                      return (
                        <article
                          key={automation.id}
                          className="group flex items-start gap-3 px-2 py-5 transition-colors hover:bg-muted/35"
                        >
                          <ScheduleIcon
                            className={cn(
                              "mt-0.5 size-4 shrink-0",
                              iconToneClasses[scheduleVisual.tone],
                            )}
                          />
                          <button
                            type="button"
                            className={cn(
                              "mt-0.5 size-4 shrink-0 rounded-full border-2 transition-colors",
                              automation.enabled
                                ? "border-primary hover:bg-primary/15"
                                : "border-muted-foreground/60 hover:border-foreground",
                            )}
                            onClick={() => void mutate(automation, "toggle")}
                            aria-label={
                              automation.enabled
                                ? `Pause ${automation.title}`
                                : `Resume ${automation.title}`
                            }
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                              <h2 className="truncate text-sm font-medium md:text-base">
                                {automation.title}
                              </h2>
                              {automation.status === "failed" ? (
                                <span className="text-xs text-destructive">Failed</span>
                              ) : automation.status === "completed" ? (
                                <span className="text-xs text-muted-foreground">Completed</span>
                              ) : null}
                            </div>
                            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground md:text-sm">
                              <span>{scheduleLabel(automation.schedule)}</span>
                              <span aria-hidden="true">·</span>
                              <span>{formatNextRun(automation.nextRunAt)}</span>
                              <span aria-hidden="true">·</span>
                              <span>Local scheduled task</span>
                            </div>
                            <p className="mt-2 line-clamp-1 text-xs text-muted-foreground/80">
                              {automation.prompt}
                            </p>
                          </div>
                          <div className="relative shrink-0">
                            <Button
                              size="icon-xs"
                              variant="ghost"
                              className="opacity-70 group-hover:opacity-100"
                              onClick={() =>
                                setOpenActionId((openId) =>
                                  openId === automation.id ? null : automation.id,
                                )
                              }
                              aria-label={`Actions for ${automation.title}`}
                              aria-expanded={openActionId === automation.id}
                            >
                              <EllipsisIcon className="size-4" />
                            </Button>
                            {openActionId === automation.id ? (
                              <div className="absolute end-0 top-full z-10 mt-1 min-w-32 rounded-lg border border-border bg-popover p-1 text-sm shadow-lg">
                                <button
                                  type="button"
                                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-start hover:bg-muted"
                                  onClick={() => void mutate(automation, "run")}
                                >
                                  <PlayIcon className={cn("size-3.5", iconToneClasses.sky)} /> Run
                                  now
                                </button>
                                <button
                                  type="button"
                                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-start hover:bg-muted"
                                  onClick={() => void mutate(automation, "toggle")}
                                >
                                  {automation.enabled ? (
                                    <PauseIcon className={cn("size-3.5", iconToneClasses.amber)} />
                                  ) : (
                                    <PlayIcon className={cn("size-3.5", iconToneClasses.emerald)} />
                                  )}
                                  {automation.enabled ? "Pause" : "Resume"}
                                </button>
                                <button
                                  type="button"
                                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-start text-destructive hover:bg-destructive/10"
                                  onClick={() => void mutate(automation, "delete")}
                                >
                                  <Trash2Icon className="size-3.5" /> Delete
                                </button>
                              </div>
                            ) : null}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                ) : null}
                {!loading && filteredAutomations.length === 0 ? (
                  <div className="py-8 text-center text-sm text-muted-foreground">
                    {automations.length === 0
                      ? "No scheduled tasks yet. Create one to get started."
                      : "No tasks match this search or filter."}
                  </div>
                ) : null}
              </section>

              <section className="border-t border-border/70 pt-5">
                <h2 className="text-base font-medium">Suggestions</h2>
                <div className="mt-3 divide-y divide-border/60">
                  {taskSuggestions.map((suggestion) => {
                    const Icon = suggestion.icon;
                    return (
                      <button
                        key={suggestion.title}
                        type="button"
                        className="flex w-full items-start gap-3 py-4 text-start transition-colors hover:bg-muted/35"
                        onClick={() => useSuggestion(suggestion)}
                      >
                        <Icon className={cn("mt-0.5 size-4", iconToneClasses[suggestion.tone])} />
                        <span className="min-w-0">
                          <span className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm">
                            <span className="font-medium">{suggestion.title}</span>
                            <span className="text-muted-foreground">{suggestion.timing}</span>
                          </span>
                          <span className="mt-1 block text-xs text-muted-foreground md:text-sm">
                            {suggestion.prompt}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>
            </div>

            {manualOpen ? (
              <aside
                className="min-w-0 border-t border-border/70 bg-card/20 md:border-t-0"
                aria-label="Create automation manually"
              >
                <div className="space-y-6 p-5 md:p-6 md:sticky md:top-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        New
                      </p>
                      <h2 className="mt-1 text-lg font-medium">Create manually</h2>
                    </div>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => setManualOpen(false)}
                      aria-label="Close manual creation"
                    >
                      <XIcon className="size-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="automation-title">Scheduled task title</Label>
                    <Input
                      id="automation-title"
                      className="h-10 text-base"
                      placeholder="Morning status check"
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="automation-prompt">What should Sparky do?</Label>
                    <Textarea
                      id="automation-prompt"
                      className="min-h-24 resize-y"
                      placeholder="Describe what Sparky should do"
                      value={prompt}
                      onChange={(event) => setPrompt(event.target.value)}
                    />
                  </div>

                  <div className="space-y-5">
                    <p className="text-sm font-medium text-muted-foreground">Details</p>
                    <div className="divide-y divide-border/70 rounded-xl border border-border/70 bg-background/45">
                      <div className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                        <span>Runs on</span>
                        <span className="text-muted-foreground">This device</span>
                      </div>
                      <div className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                        <span>Runs in</span>
                        <span className="text-muted-foreground">Existing chat</span>
                      </div>
                      <label className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                        <span>Conversation</span>
                        <Select
                          value={selectedThreadId}
                          onValueChange={(value) => {
                            if (value) setSelectedThreadId(value);
                          }}
                        >
                          <SelectTrigger
                            id="automation-thread"
                            size="sm"
                            className="w-auto min-w-0 max-w-[60%] px-2"
                            aria-label="Conversation"
                          >
                            <SelectValue>{selectedThread?.title ?? "Choose a chat"}</SelectValue>
                          </SelectTrigger>
                          <SelectPopup
                            align="end"
                            alignItemWithTrigger={false}
                            popupClassName="min-w-56"
                          >
                            {threads.map((thread) => (
                              <SelectItem key={thread.id} value={thread.id}>
                                {thread.title}
                              </SelectItem>
                            ))}
                          </SelectPopup>
                        </Select>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <p className="text-sm font-medium text-muted-foreground">Frequency</p>
                    <div className="divide-y divide-border/70 rounded-xl border border-border/70 bg-background/45">
                      <label className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                        <span>Repeat</span>
                        <Select
                          value={schedule}
                          onValueChange={(value) => {
                            if (value) setSchedule(value as Automation["schedule"]);
                          }}
                        >
                          <SelectTrigger
                            id="automation-schedule"
                            size="sm"
                            className="w-auto min-w-0 px-2"
                            aria-label="Repeat"
                          >
                            <SelectValue>{scheduleLabel(schedule)}</SelectValue>
                          </SelectTrigger>
                          <SelectPopup
                            align="end"
                            alignItemWithTrigger={false}
                            popupClassName="min-w-40"
                          >
                            <SelectItem value="once">Once</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekdays">Weekdays</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                          </SelectPopup>
                        </Select>
                      </label>
                      <label className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                        <span>At</span>
                        <Input
                          id="automation-time"
                          className="h-7 w-auto border-0 bg-transparent p-0 text-end shadow-none"
                          type="datetime-local"
                          value={runAt}
                          onChange={(event) => setRunAt(event.target.value)}
                        />
                      </label>
                      <div className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                        <span>Notifications</span>
                        <span className="text-muted-foreground">Important updates</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => void create()}
                    disabled={saving || !selectedThread || !title.trim() || !prompt.trim()}
                  >
                    <PlusIcon className={cn("size-4", iconToneClasses.sky)} />
                    {saving ? "Scheduling…" : "Create automation"}
                  </Button>
                </div>
              </aside>
            ) : null}
          </div>
        </div>
      </main>
    </SidebarInset>
  );
}
