import {
  scopedProjectKey,
  scopeProjectRef,
  scopeThreadRef,
} from "@sparky/client-runtime/environment";
import type { EnvironmentThreadShell } from "@sparky/client-runtime/state/shell";
import {
  ArrowLeftIcon,
  ArrowUpIcon,
  CircleAlertIcon,
  CircleCheckIcon,
  CircleDashedIcon,
  Clock3Icon,
  EyeIcon,
  FolderPlusIcon,
  ListFilterIcon,
  MessageSquarePlusIcon,
  PauseIcon,
  PlusIcon,
  SettingsIcon,
} from "lucide-react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, type FormEvent } from "react";

import { useOpenAddProjectCommandPalette } from "../commandPaletteContext";
import { Button } from "../components/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "../components/ui/empty";
import { Input } from "../components/ui/input";
import { SidebarInset } from "../components/ui/sidebar";
import { cn } from "../lib/utils";
import {
  useAllEnvironmentShellsBootstrapped,
  useProjects,
  useThreadShells,
} from "../state/entities";
import { buildThreadRouteParams } from "../threadRoutes";
import { formatRelativeTimeLabel } from "../timestampFormat";

type ActivityState = "approval" | "attention" | "running" | "paused" | "ready";
type ActivityFilter = "all" | "attention" | "working" | "ready";
type QuickActionId = ActivityFilter | "new-thread" | "add-project" | "settings";

type ActivityItem = {
  thread: EnvironmentThreadShell;
  project: string;
  state: ActivityState;
  stateLabel: string;
  summary: string;
};

const quickActions: ReadonlyArray<{
  id: QuickActionId;
  label: string;
  description: string;
  icon: typeof CircleAlertIcon;
}> = [
  {
    id: "all",
    label: "All activity",
    description: "Show every recent thread",
    icon: ListFilterIcon,
  },
  {
    id: "attention",
    label: "Needs attention",
    description: "Approvals and questions",
    icon: CircleAlertIcon,
  },
  {
    id: "working",
    label: "Working now",
    description: "Running threads",
    icon: CircleDashedIcon,
  },
  {
    id: "ready",
    label: "Ready to review",
    description: "Completed work and plans",
    icon: CircleCheckIcon,
  },
  {
    id: "new-thread",
    label: "New thread",
    description: "Start another task",
    icon: MessageSquarePlusIcon,
  },
  {
    id: "add-project",
    label: "Add project",
    description: "Open a local workspace",
    icon: FolderPlusIcon,
  },
  {
    id: "settings",
    label: "Settings",
    description: "Configure Sparky",
    icon: SettingsIcon,
  },
];

function resolveActivityItem(thread: EnvironmentThreadShell, project: string): ActivityItem {
  if (thread.hasPendingApprovals) {
    return {
      thread,
      project,
      state: "approval",
      stateLabel: "Approval needed",
      summary: "Sparky is waiting for you to review an approval request.",
    };
  }
  if (thread.hasPendingUserInput) {
    return {
      thread,
      project,
      state: "attention",
      stateLabel: "Needs input",
      summary: "Sparky needs an answer before this thread can continue.",
    };
  }
  if (thread.session?.status === "running" || thread.session?.status === "starting") {
    return {
      thread,
      project,
      state: "running",
      stateLabel: thread.session.status === "starting" ? "Connecting" : "Working",
      summary:
        thread.session.status === "starting"
          ? "Sparky is connecting to the provider and preparing this thread."
          : "Sparky is actively working on this thread.",
    };
  }
  if (thread.hasActionableProposedPlan) {
    return {
      thread,
      project,
      state: "ready",
      stateLabel: "Plan ready",
      summary: "A proposed plan is ready for you to review.",
    };
  }
  if (thread.latestTurn?.completedAt) {
    return {
      thread,
      project,
      state: "ready",
      stateLabel: "Completed",
      summary: "Sparky finished the latest turn and the result is ready to review.",
    };
  }
  return {
    thread,
    project,
    state: "paused",
    stateLabel: "Idle",
    summary: "This thread is ready whenever you want to continue.",
  };
}

const activityPriority: Record<ActivityState, number> = {
  approval: 5,
  attention: 4,
  running: 3,
  ready: 2,
  paused: 1,
};

function matchesFilter(item: ActivityItem, filter: ActivityFilter): boolean {
  if (filter === "all") return true;
  if (filter === "attention") return item.state === "approval" || item.state === "attention";
  if (filter === "working") return item.state === "running";
  return item.state === "ready";
}

const statePresentation: Record<
  ActivityState,
  { icon: typeof CircleAlertIcon; badge: string; dot: string }
> = {
  approval: {
    icon: CircleAlertIcon,
    badge: "bg-primary/10 text-primary",
    dot: "bg-primary",
  },
  attention: {
    icon: Clock3Icon,
    badge: "bg-muted text-foreground",
    dot: "bg-muted-foreground",
  },
  running: {
    icon: CircleDashedIcon,
    badge: "bg-primary/10 text-primary",
    dot: "bg-primary",
  },
  paused: {
    icon: PauseIcon,
    badge: "bg-muted text-muted-foreground",
    dot: "bg-muted-foreground",
  },
  ready: {
    icon: CircleCheckIcon,
    badge: "bg-muted text-foreground",
    dot: "bg-muted-foreground",
  },
};

function ActivityCard({ item, onOpen }: { item: ActivityItem; onOpen: () => void }) {
  const presentation = statePresentation[item.state];
  const StatusIcon = presentation.icon;
  const updatedLabel = formatRelativeTimeLabel(item.thread.updatedAt);

  return (
    <article
      className={cn(
        "group relative flex min-h-36 flex-col overflow-hidden rounded-xl border bg-card p-4 shadow-xs transition-[border-color,box-shadow] duration-200 motion-reduce:transition-none sm:p-5",
        item.state === "approval"
          ? "border-primary/30 hover:border-primary/50 hover:shadow-md"
          : "border-border/80 hover:border-primary/25 hover:shadow-md",
      )}
    >
      <div className="flex min-w-0 items-start gap-3">
        <span
          className={cn("mt-1 size-2 shrink-0 rounded-full", presentation.dot)}
          aria-hidden="true"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="truncate text-sm font-semibold tracking-tight text-foreground">
                {item.thread.title}
              </h2>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">{item.project}</p>
            </div>
            <span
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium",
                presentation.badge,
              )}
            >
              <StatusIcon className="size-3" aria-hidden="true" />
              {item.stateLabel}
            </span>
          </div>
          <p className="mt-3 line-clamp-2 text-sm leading-5 text-muted-foreground">
            {item.summary}
          </p>
        </div>
      </div>

      <div className="mt-auto flex items-end justify-between gap-3 pt-4">
        <span className="text-[11px] text-muted-foreground/75">
          Updated {updatedLabel || "recently"}
        </span>
        <Button
          size="xs"
          variant={item.state === "approval" ? "default" : "ghost"}
          onClick={onOpen}
        >
          <EyeIcon />
          {item.state === "approval" ? "Review approval" : "Open thread"}
        </Button>
      </div>
    </article>
  );
}

function ActivityMonitor() {
  const navigate = useNavigate();
  const openAddProject = useOpenAddProjectCommandPalette();
  const projects = useProjects();
  const threads = useThreadShells();
  const bootstrapped = useAllEnvironmentShellsBootstrapped();
  const [question, setQuestion] = useState("");
  const [filter, setFilter] = useState<ActivityFilter>("all");
  const [suggestion, setSuggestion] = useState<{
    message: string;
    item: ActivityItem | null;
  } | null>(null);
  const [toolsOpen, setToolsOpen] = useState(false);

  const activityItems = useMemo(() => {
    const projectTitleByKey = new Map(
      projects.map((project) => [
        scopedProjectKey(scopeProjectRef(project.environmentId, project.id)),
        project.title,
      ]),
    );
    return threads
      .filter((thread) => thread.archivedAt === null)
      .map((thread) =>
        resolveActivityItem(
          thread,
          projectTitleByKey.get(
            scopedProjectKey(scopeProjectRef(thread.environmentId, thread.projectId)),
          ) ?? "Unknown project",
        ),
      )
      .sort(
        (left, right) =>
          activityPriority[right.state] - activityPriority[left.state] ||
          Date.parse(right.thread.updatedAt) - Date.parse(left.thread.updatedAt),
      );
  }, [projects, threads]);
  const visibleItems = activityItems.filter((item) => matchesFilter(item, filter));
  const approvalCount = activityItems.filter((item) => item.state === "approval").length;
  const runningCount = activityItems.filter((item) => item.state === "running").length;
  const readyCount = activityItems.filter((item) => item.state === "ready").length;
  const mostRecentThread = useMemo(
    () =>
      threads
        .filter((thread) => thread.archivedAt === null)
        .toSorted((left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt))[0] ??
      null,
    [threads],
  );

  const navigateToThread = (thread: EnvironmentThreadShell) =>
    navigate({
      to: "/$environmentId/$threadId",
      params: buildThreadRouteParams(scopeThreadRef(thread.environmentId, thread.id)),
    });

  const handleQuestion = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!question.trim()) return;
    const nextItem = activityItems[0] ?? null;
    setSuggestion(
      nextItem
        ? {
            message: `Start with “${nextItem.thread.title}” — ${nextItem.summary.toLowerCase()}`,
            item: nextItem,
          }
        : { message: "There are no active threads to review yet.", item: null },
    );
    setQuestion("");
  };

  const handleQuickAction = (actionId: QuickActionId) => {
    setToolsOpen(false);
    if (actionId === "new-thread") {
      void navigate({ to: "/" });
      return;
    }
    if (actionId === "add-project") {
      openAddProject();
      return;
    }
    if (actionId === "settings") {
      void navigate({ to: "/settings" });
      return;
    }
    setFilter(actionId);
  };

  return (
    <SidebarInset className="h-dvh min-h-0 overflow-hidden bg-background text-foreground">
      <div className="flex min-h-0 flex-1 flex-col">
        <header className="flex h-[52px] shrink-0 items-center border-b border-border/70 px-3 sm:px-5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (mostRecentThread) {
                void navigateToThread(mostRecentThread);
              } else {
                void navigate({ to: "/" });
              }
            }}
          >
            <ArrowLeftIcon />
            Back to threads
          </Button>
          <span className="mx-3 h-4 w-px bg-border" aria-hidden="true" />
          <span className="text-sm font-medium">Activity monitor</span>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <main className="mx-auto flex w-full max-w-6xl flex-col px-4 pb-28 pt-7 sm:px-7 lg:px-10">
            <div className="flex flex-col gap-5 border-b border-border/70 pb-6 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-[-0.025em] sm:text-3xl">
                  Keep every thread moving.
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                  See what Sparky is doing, respond where you are needed, and jump back into any
                  active thread.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2" aria-label="Activity summary">
                <span className="rounded-md bg-primary/10 px-2.5 py-1.5 text-xs font-medium text-primary">
                  {approvalCount} {approvalCount === 1 ? "approval" : "approvals"}
                </span>
                <span className="rounded-md bg-muted px-2.5 py-1.5 text-xs font-medium text-muted-foreground">
                  {runningCount} working
                </span>
                <span className="rounded-md bg-muted px-2.5 py-1.5 text-xs font-medium text-muted-foreground">
                  {readyCount} ready
                </span>
              </div>
            </div>

            {bootstrapped && visibleItems.length > 0 ? (
              <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
                {visibleItems.map((item) => (
                  <ActivityCard
                    key={`${item.thread.environmentId}:${item.thread.id}`}
                    item={item}
                    onOpen={() => void navigateToThread(item.thread)}
                  />
                ))}
              </div>
            ) : bootstrapped ? (
              <Empty className="min-h-72">
                <EmptyHeader>
                  <EmptyTitle>
                    {activityItems.length === 0 ? "No thread activity yet" : "Nothing in this view"}
                  </EmptyTitle>
                  <EmptyDescription>
                    {activityItems.length === 0
                      ? "Start a thread and its live status will appear here."
                      : "Choose All activity from the plus menu to see every thread."}
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : null}
          </main>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-background via-background/96 to-transparent px-4 pb-5 pt-10 sm:px-7">
          <div className="pointer-events-auto mx-auto max-w-2xl">
            {toolsOpen ? (
              <div
                className="mb-2 max-h-[min(24rem,55vh)] overflow-y-auto rounded-2xl border border-border bg-popover p-2 shadow-2xl"
                role="menu"
                aria-label="Activity quick actions"
              >
                {quickActions.map((action) => {
                  const ActionIcon = action.icon;
                  const selected = action.id === filter;
                  return (
                    <button
                      key={action.id}
                      type="button"
                      role="menuitem"
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left hover:bg-muted focus-visible:bg-muted focus-visible:outline-none",
                        selected && "bg-muted",
                      )}
                      onClick={() => handleQuickAction(action.id)}
                    >
                      <ActionIcon
                        className="size-4 shrink-0 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <span className="min-w-0 text-sm font-medium text-foreground">
                        {action.label}
                      </span>
                      <span className="ms-auto truncate text-xs text-muted-foreground">
                        {action.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : null}
            {suggestion ? (
              <div
                className="mb-2 flex items-center gap-2 rounded-lg border border-primary/20 bg-background px-3 py-2 text-xs text-muted-foreground shadow-sm"
                aria-live="polite"
              >
                <p className="min-w-0 flex-1">
                  <span className="font-medium text-foreground">Sparky suggests: </span>
                  {suggestion.message}
                </p>
                {suggestion.item ? (
                  <Button
                    type="button"
                    size="xs"
                    variant="ghost"
                    onClick={() => void navigateToThread(suggestion.item!.thread)}
                  >
                    Open
                  </Button>
                ) : null}
              </div>
            ) : null}
            <form
              className="flex items-center gap-2 rounded-xl border border-input bg-card p-1.5 shadow-[0_12px_36px_-16px_rgb(0_0_0/0.32)]"
              onSubmit={handleQuestion}
            >
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                className={cn("shrink-0", toolsOpen && "bg-muted")}
                aria-label="Open activity quick actions"
                aria-expanded={toolsOpen}
                onClick={() => setToolsOpen((open) => !open)}
              >
                <PlusIcon />
              </Button>
              <Input
                className="flex-1"
                unstyled
                nativeInput
                aria-label="Ask Sparky what to do next"
                placeholder="Ask Sparky what to do next"
                value={question}
                onChange={(event) => setQuestion(event.currentTarget.value)}
              />
              <Button
                type="submit"
                size="icon-sm"
                aria-label="Ask Sparky"
                disabled={!question.trim()}
              >
                <ArrowUpIcon />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </SidebarInset>
  );
}

export const Route = createFileRoute("/activity")({
  component: ActivityMonitor,
});
