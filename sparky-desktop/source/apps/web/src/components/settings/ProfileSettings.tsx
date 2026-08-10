import { CameraIcon, CheckIcon, PencilIcon, UploadIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type ChangeEvent } from "react";
import type { EnvironmentThreadShell } from "@sparky/client-runtime/state/models";
import type { OrchestrationThread } from "@sparky/contracts";

import { useClientSettings, useUpdateClientSettings } from "../../hooks/useSettings";
import { useThreadShells, useThread } from "../../state/entities";
import { cn } from "../../lib/utils";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { SettingsPageContainer } from "./settingsLayout";
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

function profileHandle(name: string): string {
  const handle = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 24);
  return `@${handle || "sparky"}`;
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

function heatmapLevel(day: ProfileUsageDay, maxTokens: number): string {
  if (day.tokens <= 0) return "bg-muted/35";
  const ratio = day.tokens / maxTokens;
  if (ratio < 0.2) return "bg-sky-500/20";
  if (ratio < 0.45) return "bg-sky-500/35";
  if (ratio < 0.7) return "bg-sky-500/55";
  return "bg-sky-400/85";
}

function monthLabel(date: string): string {
  const [year = 1970, month = 1, day = 1] = date.split("-").map(Number);
  return new Intl.DateTimeFormat(undefined, { month: "short" }).format(
    new Date(year, month - 1, day),
  );
}

function UsageHeatmap({ usage }: { usage: ProfileUsageSummary }) {
  const defaultDay = usage.days.findLast(
    (day) => day.tokens > 0 || day.chats > 0 || day.messages > 0,
  );
  const [selectedDate, setSelectedDate] = useState(
    defaultDay?.date ?? usage.days.at(-1)?.date ?? "",
  );
  const [hasInteracted, setHasInteracted] = useState(false);
  const selectedDay = usage.days.find((day) => day.date === selectedDate) ?? usage.days.at(-1);
  const maxTokens = Math.max(1, ...usage.days.map((day) => day.tokens));
  const weeks = Array.from({ length: Math.ceil(usage.days.length / 7) }, (_, index) =>
    usage.days.slice(index * 7, index * 7 + 7),
  );

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
    <section className="mt-12" data-testid="profile-usage-chart">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-base font-semibold tracking-tight text-foreground">Token activity</h2>
          <div className="mt-1 flex min-h-5 flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground">
            {selectedDay ? (
              <>
                <span>{selectedDay.label}</span>
                <span aria-hidden="true">·</span>
                <span>{formatCount(selectedDay.tokens)} tokens</span>
                <span aria-hidden="true">·</span>
                <span>{formatCount(selectedDay.chats)} chats</span>
                <span aria-hidden="true">·</span>
                <span>{formatMinutes(selectedDay.activeMinutes)} active</span>
              </>
            ) : (
              <span>Last 12 months</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <button className="font-medium text-foreground" type="button">
            Daily
          </button>
          <span className="text-muted-foreground/65">Weekly</span>
          <span className="text-muted-foreground/65">Cumulative</span>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto pb-1">
        <div className="min-w-[760px]">
          <div
            className="grid gap-x-1.5"
            style={{ gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))` }}
          >
            {weeks.map((week, weekIndex) => {
              const previousWeek = weeks[weekIndex - 1];
              const showMonth =
                weekIndex === 0 ||
                week[0]?.date.slice(0, 7) !== previousWeek?.[0]?.date.slice(0, 7);
              return (
                <div className="flex min-w-0 flex-col gap-1" key={week[0]?.date ?? weekIndex}>
                  {Array.from({ length: 7 }, (_, dayIndex) => {
                    const day = week[dayIndex];
                    if (!day) {
                      return (
                        <span aria-hidden="true" className="aspect-square w-full" key={dayIndex} />
                      );
                    }
                    const isSelected = day.date === selectedDay?.date;
                    return (
                      <button
                        aria-label={`${day.label}: ${formatCount(day.tokens)} tokens, ${day.chats} chats, ${day.messages} messages`}
                        className={cn(
                          "aspect-square w-full rounded-[3px] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                          heatmapLevel(day, maxTokens),
                          isSelected && "ring-1 ring-sky-300/90",
                        )}
                        key={day.date}
                        onFocus={() => {
                          setHasInteracted(true);
                          setSelectedDate(day.date);
                        }}
                        onMouseEnter={() => {
                          setHasInteracted(true);
                          setSelectedDate(day.date);
                        }}
                        title={`${day.label}: ${formatCount(day.tokens)} tokens`}
                        type="button"
                      />
                    );
                  })}
                  <span className="mt-2 h-4 truncate text-[10px] text-muted-foreground/70">
                    {showMonth && week[0] ? monthLabel(week[0].date) : ""}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-end gap-1.5 text-[10px] text-muted-foreground/65">
        <span className="me-1">Less</span>
        <span className="size-3 rounded-[3px] bg-muted/35" />
        <span className="size-3 rounded-[3px] bg-sky-500/20" />
        <span className="size-3 rounded-[3px] bg-sky-500/35" />
        <span className="size-3 rounded-[3px] bg-sky-500/55" />
        <span className="size-3 rounded-[3px] bg-sky-400/85" />
        <span className="ms-1">More</span>
      </div>
    </section>
  );
}

function formatStreak(value: number): string {
  return `${value} ${value === 1 ? "day" : "days"}`;
}

function ProfileUsageStats({ usage }: { usage: ProfileUsageSummary }) {
  const stats = [
    ["Lifetime tokens", formatCount(usage.totalTokens)],
    ["Peak tokens", formatCount(usage.peakDayTokens)],
    ["Longest chat", formatMinutes(usage.longestChatMinutes)],
    ["Current streak", formatStreak(usage.currentStreak)],
    ["Longest streak", formatStreak(usage.longestStreak)],
  ] as const;

  return (
    <div
      className="mt-12 grid grid-cols-2 overflow-hidden rounded-2xl border border-border/70 sm:grid-cols-5"
      data-testid="profile-usage-stats"
    >
      {stats.map(([label, value], index) => (
        <div
          className={cn(
            "px-3 py-3.5 text-center",
            index > 0 && "sm:border-s sm:border-border/60",
            index >= 2 && "border-t border-border/60 sm:border-t-0",
            index % 2 === 1 && "border-s border-border/60",
          )}
          key={label}
        >
          <p className="text-[15px] font-medium tabular-nums text-foreground">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{label}</p>
        </div>
      ))}
    </div>
  );
}

function ProfileInsightRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border/45 py-2.5 last:border-b-0">
      <dt className="min-w-0 truncate text-sm text-muted-foreground">{label}</dt>
      <dd
        className="max-w-[60%] truncate text-right text-sm font-medium text-foreground"
        title={value}
      >
        {value}
      </dd>
    </div>
  );
}

function ProfileInsights({ usage }: { usage: ProfileUsageSummary }) {
  const highlights = [
    ["Most-used model", usage.mostUsedModel ?? "No model data yet"],
    ["Most-used skill", usage.mostUsedSkill ?? "No skill data yet"],
    ["Time in Sparky", formatMinutes(usage.activeMinutes)],
  ] as const;

  return (
    <div className="mt-14 grid gap-10 border-t border-border/60 pt-8 sm:grid-cols-2 sm:gap-16">
      <section>
        <h2 className="text-base font-semibold tracking-tight text-foreground">
          Activity insights
        </h2>
        <dl className="mt-3">
          <ProfileInsightRow label="Active days" value={formatCount(usage.activeDays)} />
          <ProfileInsightRow label="Total chats" value={formatCount(usage.totalChats)} />
          <ProfileInsightRow label="Messages" value={formatCount(usage.totalMessages)} />
          <ProfileInsightRow
            label="Tokens per active day"
            value={formatCount(usage.tokensPerDay)}
          />
        </dl>
      </section>
      <section>
        <h2 className="text-base font-semibold tracking-tight text-foreground">Most used</h2>
        <dl className="mt-3">
          {highlights.map(([label, value]) => (
            <ProfileInsightRow key={label} label={label} value={value} />
          ))}
        </dl>
      </section>
    </div>
  );
}

export function ProfileSettingsPanel() {
  const settings = useClientSettings();
  const updateSettings = useUpdateClientSettings();
  const threadShells = useThreadShells();
  const [profileName, setProfileName] = useState(settings.profileName);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [threadDetails, setThreadDetails] = useState<Map<string, OrchestrationThread>>(
    () => new Map(),
  );
  const [selectedChartDays] = useState(364);

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
  const displayName = profileName.trim() || "Your profile";

  const saveProfileName = useCallback(() => {
    const nextName = profileName.trim() || "Your profile";
    setProfileName(nextName);
    updateSettings({ profileName: nextName });
  }, [profileName, updateSettings]);

  const toggleEditingProfile = useCallback(() => {
    if (isEditingProfile && nameIsDirty) saveProfileName();
    setIsEditingProfile((current) => !current);
  }, [isEditingProfile, nameIsDirty, saveProfileName]);

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
      <SettingsPageContainer className="max-w-none gap-0">
        <div className="mx-auto w-full max-w-[960px] pb-10">
          <div className="flex justify-end pt-1">
            <Button
              className="text-muted-foreground"
              onClick={toggleEditingProfile}
              size="sm"
              variant="ghost"
            >
              <PencilIcon className="size-3.5" />
              {isEditingProfile ? "Done" : "Edit"}
            </Button>
          </div>

          <section className="pt-5 text-center sm:pt-8">
            <label
              className="group relative inline-flex cursor-pointer rounded-full focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background"
              htmlFor="profile-image-upload"
            >
              <ProfileAvatar
                alt={displayName}
                className="size-24 text-3xl"
                image={settings.profileImage}
                name={displayName}
                size="lg"
              />
              <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/45 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                {isUploadingImage ? (
                  <UploadIcon className="size-4 animate-pulse" />
                ) : (
                  <CameraIcon className="size-4" />
                )}
                <span className="sr-only">Change profile photo</span>
              </span>
            </label>
            <input
              accept="image/*"
              className="sr-only"
              id="profile-image-upload"
              onChange={handleImageChange}
              type="file"
            />
            <h1 className="mt-5 text-3xl font-medium tracking-tight text-foreground sm:text-[30px]">
              {displayName}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {profileHandle(displayName)} <span className="mx-1 text-muted-foreground/45">·</span>{" "}
              Local profile
            </p>

            {isEditingProfile ? (
              <div className="mx-auto mt-5 flex max-w-xl flex-wrap items-center justify-center gap-2 border-t border-border/50 pt-4">
                <Input
                  aria-label="Profile name"
                  className="h-8 max-w-64 bg-transparent text-center"
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
                  Save
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
                <p className="basis-full text-[11px] text-muted-foreground/70">
                  Click the avatar to upload a new photo.
                </p>
              </div>
            ) : null}
          </section>

          <ProfileUsageStats usage={usage} />
          <UsageHeatmap usage={usage} />
          {threadShells.length > 0 && loadedCount < threadShells.length ? (
            <p className="mt-2 text-right text-[11px] text-muted-foreground/65">Syncing chats…</p>
          ) : null}
          <ProfileInsights usage={usage} />
        </div>
      </SettingsPageContainer>
    </>
  );
}
