import { Automation, AutomationCreateInput } from "@sparky/contracts";
import {
  Clock3Icon,
  PauseIcon,
  PlayIcon,
  PlusIcon,
  RefreshCwIcon,
  SparklesIcon,
  Trash2Icon,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useThreadShells } from "../state/entities";
import { fetchPrimaryEnvironment } from "../environments/primary/httpLayer";
import { resolvePrimaryEnvironmentHttpUrl } from "../environments/primary/target";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { SidebarInset } from "./ui/sidebar";
import { Textarea } from "./ui/textarea";
import { cn } from "~/lib/utils";
import { COLLAPSED_SIDEBAR_TITLEBAR_INSET_CLASS } from "~/workspaceTitlebar";

const automationUrl = (path = "/api/automations") => resolvePrimaryEnvironmentHttpUrl(path);
const localDateTime = (date: Date) => {
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};
const formatDate = (value: string | null) =>
  value === null
    ? "Not scheduled"
    : new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(
        new Date(value),
      );
const scheduleLabel = (value: Automation["schedule"]) =>
  ({ once: "Once", daily: "Every day", weekdays: "Weekdays", weekly: "Every week" })[value];

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
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState(threads[0]?.id ?? "");
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [runAt, setRunAt] = useState(() => localDateTime(new Date(Date.now() + 60 * 60_000)));
  const [schedule, setSchedule] = useState<Automation["schedule"]>("once");
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
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not update automation.");
    }
  };

  return (
    <SidebarInset className="h-dvh min-h-0 overflow-hidden bg-background text-foreground isolate">
      <div className="flex min-h-0 flex-1 flex-col">
        <header
          className={cn("border-b border-border px-5 py-3", COLLAPSED_SIDEBAR_TITLEBAR_INSET_CLASS)}
        >
          <div className="flex items-center gap-2">
            <SparklesIcon className="size-4 text-primary" />
            <div>
              <h1 className="text-sm font-semibold">Scheduled tasks</h1>
              <p className="text-xs text-muted-foreground">
                Let Sparky take care of routine work on your schedule.
              </p>
            </div>
            <Button
              className="ms-auto"
              size="sm"
              variant="ghost"
              onClick={() => void load()}
              disabled={loading}
              aria-label="Refresh scheduled tasks"
            >
              <RefreshCwIcon className={cn("size-4", loading && "animate-spin")} />
              Refresh
            </Button>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto p-5 md:p-8">
          <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold">Your automations</h2>
                  <p className="text-xs text-muted-foreground">
                    Runs in the selected thread with its current model and permissions.
                  </p>
                </div>
                <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                  {automations.length} {automations.length === 1 ? "task" : "tasks"}
                </span>
              </div>
              {error ? (
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                  {error}
                </div>
              ) : null}
              {loading ? (
                <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                  Loading scheduled tasks…
                </div>
              ) : null}
              {!loading && automations.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center gap-2 py-14 text-center">
                    <Clock3Icon className="size-8 text-muted-foreground/50" />
                    <p className="font-medium">No scheduled tasks yet</p>
                    <p className="max-w-sm text-sm text-muted-foreground">
                      Create your first automation and Sparky will start it at the time you choose.
                    </p>
                  </CardContent>
                </Card>
              ) : null}
              {automations.map((automation) => (
                <Card
                  key={automation.id}
                  className={cn("transition-colors", !automation.enabled && "opacity-70")}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-lg bg-primary/10 p-2 text-primary">
                        <Clock3Icon className="size-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <CardTitle className="truncate text-sm">{automation.title}</CardTitle>
                        <CardDescription className="mt-1 line-clamp-2">
                          {automation.prompt}
                        </CardDescription>
                      </div>
                      <span
                        className={cn(
                          "rounded-full px-2 py-1 text-[11px] font-medium",
                          automation.enabled
                            ? "bg-emerald-500/10 text-emerald-600"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        {automation.enabled
                          ? "Active"
                          : automation.status === "completed"
                            ? "Completed"
                            : "Paused"}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                      <span>{scheduleLabel(automation.schedule)}</span>
                      <span>Next: {formatDate(automation.nextRunAt)}</span>
                      <span className="truncate">Thread: {automation.threadId}</span>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => void mutate(automation, "toggle")}
                      >
                        <>
                          {automation.enabled ? (
                            <PauseIcon className="size-3.5" />
                          ) : (
                            <PlayIcon className="size-3.5" />
                          )}
                        </>
                        {automation.enabled ? "Pause" : "Resume"}
                      </Button>
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={() => void mutate(automation, "run")}
                      >
                        <PlayIcon className="size-3.5" />
                        Run now
                      </Button>
                      <Button
                        size="xs"
                        variant="ghost"
                        className="ms-auto text-destructive hover:text-destructive"
                        onClick={() => void mutate(automation, "delete")}
                      >
                        <Trash2Icon className="size-3.5" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </section>

            <Card className="h-fit lg:sticky lg:top-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <PlusIcon className="size-4 text-primary" />
                  Create a scheduled task
                </CardTitle>
                <CardDescription>
                  Describe the work once. Sparky will send it to the selected conversation.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="automation-title">Name</Label>
                  <Input
                    id="automation-title"
                    placeholder="Morning status check"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="automation-prompt">Prompt</Label>
                  <Textarea
                    id="automation-prompt"
                    className="min-h-24 resize-y"
                    placeholder="Review the latest changes and summarize anything I should know."
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="automation-thread">Conversation</Label>
                  <select
                    id="automation-thread"
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                    value={selectedThreadId}
                    onChange={(event) => setSelectedThreadId(event.target.value)}
                  >
                    <option value="">Select a conversation</option>
                    {threads.map((thread) => (
                      <option key={thread.id} value={thread.id}>
                        {thread.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="automation-time">Start at</Label>
                    <Input
                      id="automation-time"
                      type="datetime-local"
                      value={runAt}
                      onChange={(event) => setRunAt(event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="automation-schedule">Repeat</Label>
                    <select
                      id="automation-schedule"
                      className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                      value={schedule}
                      onChange={(event) =>
                        setSchedule(event.target.value as Automation["schedule"])
                      }
                    >
                      <option value="once">Once</option>
                      <option value="daily">Every day</option>
                      <option value="weekdays">Weekdays</option>
                      <option value="weekly">Every week</option>
                    </select>
                  </div>
                </div>
                <Button
                  className="w-full"
                  onClick={() => void create()}
                  disabled={saving || !selectedThread || !title.trim() || !prompt.trim()}
                >
                  <PlusIcon className="size-4" />
                  {saving ? "Scheduling…" : "Schedule task"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarInset>
  );
}
