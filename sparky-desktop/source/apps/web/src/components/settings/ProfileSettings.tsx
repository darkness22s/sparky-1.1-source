import {
  ActivityIcon,
  CameraIcon,
  CheckIcon,
  Clock3Icon,
  FlameIcon,
  ImagePlusIcon,
  MessageSquareIcon,
  PencilIcon,
  SparklesIcon,
  UploadIcon,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type ChangeEvent, type ReactNode } from "react";
import type { EnvironmentThreadShell } from "@sparky/client-runtime/state/models";
import type { OrchestrationThread } from "@sparky/contracts";

import { useClientSettings, useUpdateClientSettings } from "../../hooks/useSettings";
import { useThreadShells, useThread } from "../../state/entities";
import { cn } from "../../lib/utils";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { SettingsPageContainer, SettingsSection } from "./settingsLayout";
import { ProfileAvatar } from "../profile/ProfileAvatar";
import { buildProfileUsage, type ProfileUsageDay, type ProfileUsageSummary } from "./profileUsage";

function formatCount(value: number): string {
  return new Intl.NumberFormat(undefined, {
    notation: value >= 1_000 ? "compact" : "standard",
    maximumFractionDigits: value >= 1_000 ? 1 : 0,
  }).format(Math.max(0, Math.round(value)));
}

function formatMinutes(value: number): string {
  if (value < 60) return `${Math.round(value)}m`;
  const hours = Math.floor(value / 60);
  const minutes = Math.round(value % 60);
  return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}m`;
}

function readImageAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      try {
        const maxSize = 512;
        const scale = Math.min(1, maxSize / Math.max(image.naturalWidth, image.naturalHeight));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
        const context = canvas.getContext("2d");
        if (!context) {
          reject(new Error("Could not prepare the profile image."));
          return;
        }
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.86));
      } catch (error) {
        reject(error);
      } finally {
        URL.revokeObjectURL(objectUrl);
      }
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Could not read the profile image."));
    };
    image.src = objectUrl;
  });
}

function UsageThreadObserver({
  shell,
  onThread,
}: {
  shell: EnvironmentThreadShell;
  onThread: (thread: OrchestrationThread) => void;
}) {
  const thread = useThread({ environmentId: shell.environmentId, threadId: shell.id });
  useEffect(() => {
    if (thread) onThread(thread);
  }, [onThread, thread]);
  return null;
}

function UsageDetails({ day }: { day: ProfileUsageDay }) {
  return (
    <div className="flex min-h-[208px] flex-col rounded-2xl border border-border/70 bg-muted/25 p-4">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/70">
            Selected day
          </p>
          <h3 className="mt-1 text-sm font-semibold text-foreground">{day.label}</h3>
        </div>
        <ActivityIcon className="size-4 text-primary" />
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
        <UsageDetail label="Tokens" value={formatCount(day.tokens)} />
        <UsageDetail label="Chats" value={formatCount(day.chats)} />
        <UsageDetail label="Messages" value={formatCount(day.messages)} />
        <UsageDetail label="Active time" value={formatMinutes(day.activeMinutes)} />
      </div>
      <div className="mt-auto space-y-2 border-t border-border/60 pt-3 text-xs">
        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground">Most-used model</span>
          <span className="max-w-[9rem] truncate text-right font-medium text-foreground">
            {day.mostUsedModel ?? "No model activity"}
          </span>
        </div>
        <div className="flex items-start justify-between gap-3">
          <span className="text-muted-foreground">Skills</span>
          <span className="max-w-[9rem] text-right font-medium text-foreground">
            {day.mostUsedSkills.length > 0 ? day.mostUsedSkills.join(", ") : "No skills recorded"}
          </span>
        </div>
      </div>
    </div>
  );
}

function UsageDetail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-semibold tabular-nums text-foreground">{value}</p>
    </div>
  );
}

function UsageChart({ usage }: { usage: ProfileUsageSummary }) {
  const defaultDay = usage.days.findLast(
    (day) => day.tokens > 0 || day.chats > 0 || day.messages > 0,
  );
  const [selectedDate, setSelectedDate] = useState(
    defaultDay?.date ?? usage.days.at(-1)?.date ?? "",
  );
  const [hasInteracted, setHasInteracted] = useState(false);
  const selectedDay = usage.days.find((day) => day.date === selectedDate) ?? usage.days.at(-1);
  const maxTokens = Math.max(1, ...usage.days.map((day) => day.tokens));

  useEffect(() => {
    if (!hasInteracted && defaultDay && defaultDay.date !== selectedDate) {
      setSelectedDate(defaultDay.date);
      return;
    }
    if (!usage.days.some((day) => day.date === selectedDate)) {
      setSelectedDate(defaultDay?.date ?? usage.days.at(-1)?.date ?? "");
    }
  }, [defaultDay?.date, hasInteracted, selectedDate, usage.days]);

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
      <div
        className="rounded-2xl border border-border/70 bg-muted/15 p-4"
        data-testid="profile-usage-chart"
      >
        <div className="flex h-48 items-end gap-1.5 sm:gap-2">
          {usage.days.map((day, index) => {
            const height = day.tokens > 0 ? Math.max(8, (day.tokens / maxTokens) * 100) : 3;
            const isSelected = day.date === selectedDay?.date;
            const showLabel = index % 5 === 0 || index === usage.days.length - 1;
            return (
              <button
                aria-label={`${day.label}: ${formatCount(day.tokens)} tokens, ${day.chats} chats, ${day.messages} messages`}
                className="group flex h-full min-w-0 flex-1 flex-col justify-end gap-2 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
                key={day.date}
                onFocus={() => {
                  setHasInteracted(true);
                  setSelectedDate(day.date);
                }}
                onMouseEnter={() => {
                  setHasInteracted(true);
                  setSelectedDate(day.date);
                }}
                type="button"
              >
                <span
                  className={cn(
                    "mx-auto block w-full min-w-1 rounded-t-md bg-primary/45 transition-[height,background-color,opacity] group-hover:bg-primary group-focus-visible:bg-primary",
                    isSelected && "bg-primary",
                  )}
                  style={{ height: `${height}%` }}
                />
                <span className="h-3 w-full truncate text-[9px] text-muted-foreground/70">
                  {showLabel ? day.label.split(" ")[0] : ""}
                </span>
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground/70">
          <span>Last {usage.days.length} days</span>
          <span>Tokens used</span>
        </div>
      </div>
      {selectedDay ? <UsageDetails day={selectedDay} /> : null}
    </div>
  );
}

function ProfileUsageStats({ usage }: { usage: ProfileUsageSummary }) {
  const cards = [
    {
      label: "Total chats",
      value: formatCount(usage.totalChats),
      detail: "Conversations in this workspace",
      icon: MessageSquareIcon,
    },
    {
      label: "Messages",
      value: formatCount(usage.totalMessages),
      detail: "User and assistant messages",
      icon: PencilIcon,
    },
    {
      label: "Total tokens",
      value: formatCount(usage.totalTokens),
      detail: "Observed or estimated usage",
      icon: SparklesIcon,
    },
    {
      label: "Tokens / day",
      value: formatCount(usage.tokensPerDay),
      detail: usage.activeDays > 0 ? `${usage.activeDays} active days` : "No active days yet",
      icon: ActivityIcon,
    },
  ] as const;

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ detail, icon: Icon, label, value }) => (
        <div className="rounded-2xl border border-border/70 bg-card p-4" key={label}>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground">{label}</span>
            <Icon className="size-4 text-muted-foreground/65" />
          </div>
          <p className="mt-3 text-2xl font-semibold tracking-tight tabular-nums text-foreground">
            {value}
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground/75">{detail}</p>
        </div>
      ))}
      <div className="rounded-2xl border border-border/70 bg-card p-4 sm:col-span-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground">Daily-use streaks</span>
          <FlameIcon className="size-4 text-orange-500" />
        </div>
        <div className="mt-3 flex items-end gap-8">
          <div>
            <p className="text-2xl font-semibold tracking-tight tabular-nums text-foreground">
              {usage.currentStreak}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground/75">Current streak</p>
          </div>
          <div>
            <p className="text-2xl font-semibold tracking-tight tabular-nums text-foreground">
              {usage.longestStreak}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground/75">Longest streak</p>
          </div>
          <div className="ms-auto hidden text-right text-[11px] text-muted-foreground/75 sm:block">
            Keep chatting
            <br />
            to build your streak
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProfileSettingsPanel() {
  const settings = useClientSettings();
  const updateSettings = useUpdateClientSettings();
  const threadShells = useThreadShells();
  const [profileName, setProfileName] = useState(settings.profileName);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [threadDetails, setThreadDetails] = useState<Map<string, OrchestrationThread>>(
    () => new Map(),
  );
  const [selectedChartDays] = useState(30);

  useEffect(() => {
    setProfileName(settings.profileName);
  }, [settings.profileName]);

  const handleThread = useCallback((thread: OrchestrationThread) => {
    setThreadDetails((current) => {
      const key = String(thread.id);
      if (current.get(key) === thread) return current;
      const next = new Map(current);
      next.set(key, thread);
      return next;
    });
  }, []);

  const loadedThreads = useMemo(() => [...threadDetails.values()], [threadDetails]);
  const usage = useMemo(
    () => buildProfileUsage(loadedThreads, { shells: threadShells, chartDays: selectedChartDays }),
    [loadedThreads, selectedChartDays, threadShells],
  );
  const nameIsDirty = profileName.trim() !== settings.profileName;
  const loadedCount = loadedThreads.length;

  const saveProfileName = useCallback(() => {
    const nextName = profileName.trim() || "Your profile";
    setProfileName(nextName);
    updateSettings({ profileName: nextName });
  }, [profileName, updateSettings]);

  const handleImageChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.currentTarget.files?.[0];
      event.currentTarget.value = "";
      if (!file || !file.type.startsWith("image/")) return;
      setIsUploadingImage(true);
      try {
        const image = await readImageAsDataUrl(file);
        updateSettings({ profileImage: image });
      } catch (error) {
        console.error("Could not update profile image.", error);
      } finally {
        setIsUploadingImage(false);
      }
    },
    [updateSettings],
  );

  return (
    <>
      {threadShells.map((shell) => (
        <UsageThreadObserver
          key={`${shell.environmentId}:${shell.id}`}
          onThread={handleThread}
          shell={shell}
        />
      ))}
      <SettingsPageContainer className="max-w-5xl gap-7">
        <section className="overflow-hidden rounded-3xl border border-border/70 bg-card shadow-sm/5">
          <div className="h-24 bg-gradient-to-r from-indigo-500/20 via-violet-500/15 to-cyan-400/20" />
          <div className="-mt-10 flex flex-col gap-5 px-5 pb-5 sm:flex-row sm:items-end sm:px-7">
            <div className="relative shrink-0">
              <label
                className="group relative block cursor-pointer rounded-full focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background"
                htmlFor="profile-image-upload"
              >
                <ProfileAvatar
                  alt={settings.profileName}
                  className="size-20 text-2xl ring-4 ring-card"
                  image={settings.profileImage}
                  name={settings.profileName}
                  size="lg"
                />
                <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/45 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                  {isUploadingImage ? (
                    <UploadIcon className="size-5 animate-pulse" />
                  ) : (
                    <CameraIcon className="size-5" />
                  )}
                </span>
              </label>
              <input
                accept="image/*"
                className="sr-only"
                id="profile-image-upload"
                onChange={handleImageChange}
                type="file"
              />
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground/70">
                  Profile
                </p>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
                  Make Sparky yours
                </h1>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Input
                  aria-label="Profile name"
                  className="h-9 max-w-sm bg-background/70"
                  maxLength={80}
                  onChange={(event) => setProfileName(event.currentTarget.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") saveProfileName();
                  }}
                  placeholder="Your profile"
                  value={profileName}
                />
                <Button disabled={!nameIsDirty} onClick={saveProfileName} size="sm">
                  <CheckIcon className="size-3.5" />
                  Save name
                </Button>
                {settings.profileImage ? (
                  <Button
                    onClick={() => updateSettings({ profileImage: "" })}
                    size="sm"
                    variant="ghost"
                  >
                    Remove photo
                  </Button>
                ) : null}
              </div>
              <p className="text-xs text-muted-foreground/75">
                Upload a photo or choose a name for the profile shown in your sidebar.
              </p>
            </div>
          </div>
        </section>

        <SettingsSection
          title="Usage overview"
          icon={<ActivityIcon className="size-3.5 text-primary/75" />}
          headerAction={
            <span className="text-[11px] text-muted-foreground/70">
              {threadShells.length > 0 && loadedCount < threadShells.length
                ? "Syncing chats…"
                : "All time"}
            </span>
          }
        >
          <div className="space-y-4 p-4 sm:p-5">
            <ProfileUsageStats usage={usage} />
            <div className="border-t border-border/60 pt-4">
              <UsageChart usage={usage} />
            </div>
          </div>
        </SettingsSection>

        <SettingsSection
          title="Highlights"
          icon={<SparklesIcon className="size-3.5 text-primary/75" />}
        >
          <div className="grid gap-3 p-4 sm:grid-cols-3 sm:p-5">
            <HighlightCard
              icon={<SparklesIcon className="size-4" />}
              label="Most-used model"
              value={usage.mostUsedModel ?? "No model data yet"}
            />
            <HighlightCard
              icon={<ImagePlusIcon className="size-4" />}
              label="Most-used skill"
              value={usage.mostUsedSkill ?? "No skill data yet"}
            />
            <HighlightCard
              icon={<Clock3Icon className="size-4" />}
              label="Time in Sparky"
              value={formatMinutes(usage.activeMinutes)}
            />
          </div>
        </SettingsSection>
      </SettingsPageContainer>
    </>
  );
}

function HighlightCard({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-muted/15 p-4">
      <div className="flex items-center gap-2 text-primary">
        {icon}
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className="mt-3 truncate text-sm font-semibold text-foreground" title={value}>
        {value}
      </p>
    </div>
  );
}
