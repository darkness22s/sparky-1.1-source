import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import {
  ArrowUpRightIcon,
  CheckIcon,
  PlusIcon,
  SearchIcon,
  SlidersHorizontalIcon,
} from "lucide-react";
import { useCallback, useMemo, useState, type ReactNode } from "react";

import { ExtensionIcon } from "../components/extensions/ExtensionIcon";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { SidebarInset } from "../components/ui/sidebar";
import { Tooltip, TooltipPopup, TooltipTrigger } from "../components/ui/tooltip";
import { stackedThreadToast, toastManager } from "../components/ui/toast";
import {
  buildExtensionReference,
  CREATE_MOD_PROMPT,
  CREATE_PLUGIN_PROMPT,
  MOD_CATALOG,
  PLUGIN_CATALOG,
  PLUGIN_CATEGORIES,
  searchCatalog,
  type ModCatalogEntry,
  type PluginCatalogEntry,
  type PluginCategory,
} from "../extensionCatalog";
import { useExtensionInstallState } from "../extensionLibrary";
import { useHandleNewThread } from "../hooks/useHandleNewThread";
import { cn } from "../lib/utils";
import { isElectron } from "../env";
import { COLLAPSED_SIDEBAR_TITLEBAR_INSET_CLASS } from "../workspaceTitlebar";

type LibraryView = "plugins" | "mods";
type CatalogScope = "public" | "personal";

const CATEGORY_DESCRIPTIONS: Record<PluginCategory, string> = {
  Featured: "A sharp starting set for everyday work.",
  Productivity: "Keep projects, schedules, and team knowledge moving.",
  Creativity: "Bring design context and collaborative thinking into the thread.",
  "Developer Tools": "Move from code to production evidence without losing context.",
  "Automation & Data": "Connect operational systems and repeatable workflows.",
};

function PluginsRouteView() {
  const navigate = useNavigate();
  const { defaultProjectRef, handleNewThread } = useHandleNewThread();
  const [view, setView] = useState<LibraryView>("plugins");
  const [scope, setScope] = useState<CatalogScope>("public");
  const [query, setQuery] = useState("");
  const { pluginIds, modIds, setPluginInstalled, setModInstalled } = useExtensionInstallState();

  const installedPlugins = useMemo(
    () => PLUGIN_CATALOG.filter((entry) => pluginIds.includes(entry.id)),
    [pluginIds],
  );
  const installedMods = useMemo(
    () => MOD_CATALOG.filter((entry) => modIds.includes(entry.id)),
    [modIds],
  );

  const openEditableDraft = useCallback(
    async (prompt: string) => {
      if (!defaultProjectRef) {
        toastManager.add(
          stackedThreadToast({
            type: "info",
            title: "Add a project first",
            description: "Sparky creates extensions inside a project so you can review the files.",
          }),
        );
        await navigate({ to: "/" });
        return;
      }

      await handleNewThread(defaultProjectRef, {
        forceNew: true,
        initialPrompt: prompt,
      });
    },
    [defaultProjectRef, handleNewThread, navigate],
  );

  const handleCreate = useCallback(() => {
    void openEditableDraft(view === "plugins" ? CREATE_PLUGIN_PROMPT : CREATE_MOD_PROMPT);
  }, [openEditableDraft, view]);

  const handleUsePlugin = useCallback(
    (entry: PluginCatalogEntry) => {
      void openEditableDraft(
        `${buildExtensionReference(entry.name, "plugin")}[describe what you want Sparky to do].`,
      );
    },
    [openEditableDraft],
  );

  const handleUseMod = useCallback(
    (entry: ModCatalogEntry) => {
      void openEditableDraft(
        `${buildExtensionReference(entry.name, "Mod")}[describe the outcome you want from this Mod].`,
      );
    },
    [openEditableDraft],
  );

  const changeView = (nextView: LibraryView) => {
    setView(nextView);
    setQuery("");
  };

  return (
    <SidebarInset className="h-dvh min-h-0 overflow-hidden overscroll-y-none bg-background text-foreground">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-background">
        <LibraryHeader view={view} onChangeView={changeView} onCreate={handleCreate} />

        <main className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
          <div className="mx-auto w-full max-w-6xl px-4 pb-20 pt-9 sm:px-7 sm:pt-12 lg:px-10">
            <LibraryIntro view={view} query={query} onQueryChange={setQuery} />

            <InstalledShelf
              view={view}
              plugins={installedPlugins}
              mods={installedMods}
              onUsePlugin={handleUsePlugin}
              onUseMod={handleUseMod}
              onCreate={handleCreate}
            />

            <CatalogScopePicker scope={scope} onScopeChange={setScope} />

            {view === "plugins" ? (
              <PluginLibrary
                scope={scope}
                query={query}
                installedIds={pluginIds}
                onSetInstalled={setPluginInstalled}
                onUse={handleUsePlugin}
                onCreate={handleCreate}
              />
            ) : (
              <ModLibrary
                scope={scope}
                query={query}
                installedIds={modIds}
                onSetInstalled={setModInstalled}
                onUse={handleUseMod}
                onCreate={handleCreate}
              />
            )}
          </div>
        </main>
      </div>
    </SidebarInset>
  );
}

function LibraryHeader({
  view,
  onChangeView,
  onCreate,
}: {
  readonly view: LibraryView;
  readonly onChangeView: (view: LibraryView) => void;
  readonly onCreate: () => void;
}) {
  return (
    <header
      className={cn(
        "relative z-10 flex h-[var(--workspace-topbar-height)] shrink-0 items-center border-b border-border/70 bg-background/96 px-3 transition-[padding-left] duration-200 ease-linear motion-reduce:transition-none sm:px-5",
        COLLAPSED_SIDEBAR_TITLEBAR_INSET_CLASS,
        isElectron && "drag-region",
      )}
    >
      <div
        aria-label="Extension type"
        className="no-drag absolute left-1/2 flex -translate-x-1/2 items-center rounded-lg bg-muted/70 p-0.5 ring-1 ring-border/45"
        role="tablist"
      >
        {(["plugins", "mods"] as const).map((item) => (
          <button
            key={item}
            aria-selected={view === item}
            className={cn(
              "h-7 rounded-md px-3 text-xs font-medium outline-none transition-[background-color,color,box-shadow] focus-visible:ring-2 focus-visible:ring-ring",
              view === item
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
            role="tab"
            type="button"
            onClick={() => onChangeView(item)}
          >
            {item === "plugins" ? "Plugins" : "Mods"}
          </button>
        ))}
      </div>

      <Button className="no-drag ml-auto" size="sm" onClick={onCreate}>
        <PlusIcon />
        <span className="hidden sm:inline">Create {view === "plugins" ? "plugin" : "mod"}</span>
        <span className="sm:hidden">Create</span>
      </Button>
    </header>
  );
}

function LibraryIntro({
  view,
  query,
  onQueryChange,
}: {
  readonly view: LibraryView;
  readonly query: string;
  readonly onQueryChange: (query: string) => void;
}) {
  return (
    <section className="max-w-3xl">
      <h1 className="text-balance text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
        {view === "plugins"
          ? "Make Sparky fluent in your tools."
          : "Pack a capability. Teach it good judgment."}
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-[15px]">
        {view === "plugins"
          ? "Add curated integrations and MCP servers, then call them into any conversation when the work needs them."
          : "Mods pair an MCP server with a skill that explains how Sparky should use it—portable, focused, and easy to reference."}
      </p>

      <p className="mt-2 max-w-2xl text-xs leading-5 text-muted-foreground/80">
        {view === "plugins"
          ? "Adding a plugin makes it referenceable. Its MCP connection and credentials are configured when you use it."
          : "Adding a Mod makes its skill and MCP recipe referenceable; external credentials remain separate."}
      </p>

      <label className="relative mt-7 block max-w-2xl">
        <span className="sr-only">Search {view}</span>
        <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          nativeInput
          aria-label={`Search ${view}`}
          className="rounded-xl bg-muted/28 shadow-none has-focus-visible:bg-background [&_[data-slot=input]]:pl-10"
          inputMode="search"
          placeholder={`Search ${view}, tasks, or tools`}
          size="lg"
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.currentTarget.value)}
        />
      </label>
    </section>
  );
}

function InstalledShelf({
  view,
  plugins,
  mods,
  onUsePlugin,
  onUseMod,
  onCreate,
}: {
  readonly view: LibraryView;
  readonly plugins: ReadonlyArray<PluginCatalogEntry>;
  readonly mods: ReadonlyArray<ModCatalogEntry>;
  readonly onUsePlugin: (entry: PluginCatalogEntry) => void;
  readonly onUseMod: (entry: ModCatalogEntry) => void;
  readonly onCreate: () => void;
}) {
  const entries = view === "plugins" ? plugins : mods;

  return (
    <section className="mt-10 border-y border-border/70 py-5" aria-labelledby="installed-heading">
      <div className="flex items-center gap-3">
        <div>
          <h2 id="installed-heading" className="text-sm font-semibold">
            Your {view}
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {entries.length > 0
              ? "Select one to start a referenced chat."
              : `Nothing added yet. Your ${view} will stay within reach here.`}
          </p>
        </div>
        <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium tabular-nums text-muted-foreground">
          {entries.length}
        </span>
      </div>

      {entries.length > 0 ? (
        <div className="mt-4 flex gap-2.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {view === "plugins"
            ? plugins.map((entry) => (
                <Tooltip key={entry.id}>
                  <TooltipTrigger
                    render={
                      <button
                        aria-label={`Use ${entry.name} in chat`}
                        className="group rounded-xl outline-none ring-ring transition-transform hover:-translate-y-0.5 focus-visible:ring-2 motion-reduce:transition-none"
                        type="button"
                        onClick={() => onUsePlugin(entry)}
                      >
                        <ExtensionIcon
                          accent={entry.accent}
                          logo={entry.logo}
                          name={entry.name}
                          size="lg"
                          className="group-hover:shadow-[0_7px_18px_rgba(0,0,0,0.14)]"
                        />
                      </button>
                    }
                  />
                  <TooltipPopup side="bottom">Use {entry.name} in chat</TooltipPopup>
                </Tooltip>
              ))
            : mods.map((entry) => (
                <Tooltip key={entry.id}>
                  <TooltipTrigger
                    render={
                      <button
                        aria-label={`Use ${entry.name} in chat`}
                        className="group rounded-xl outline-none ring-ring transition-transform hover:-translate-y-0.5 focus-visible:ring-2 motion-reduce:transition-none"
                        type="button"
                        onClick={() => onUseMod(entry)}
                      >
                        <ExtensionIcon
                          accent={entry.accent}
                          name={entry.name}
                          size="lg"
                          className="group-hover:shadow-[0_7px_18px_rgba(0,0,0,0.14)]"
                        />
                      </button>
                    }
                  />
                  <TooltipPopup side="bottom">Use {entry.name} in chat</TooltipPopup>
                </Tooltip>
              ))}
        </div>
      ) : (
        <button
          className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg border border-dashed border-border px-3 text-xs font-medium text-muted-foreground outline-none transition-colors hover:border-foreground/25 hover:bg-muted/40 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          type="button"
          onClick={onCreate}
        >
          <PlusIcon className="size-3.5" />
          Create your first {view === "plugins" ? "plugin" : "Mod"}
        </button>
      )}
    </section>
  );
}

function CatalogScopePicker({
  scope,
  onScopeChange,
}: {
  readonly scope: CatalogScope;
  readonly onScopeChange: (scope: CatalogScope) => void;
}) {
  return (
    <div className="mt-9 flex items-center gap-1" role="tablist" aria-label="Catalog scope">
      {(["public", "personal"] as const).map((item) => (
        <button
          key={item}
          aria-selected={scope === item}
          className={cn(
            "rounded-lg px-3 py-1.5 text-xs font-medium capitalize outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
            scope === item
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
          )}
          role="tab"
          type="button"
          onClick={() => onScopeChange(item)}
        >
          {item}
        </button>
      ))}
      <SlidersHorizontalIcon className="ml-auto size-3.5 text-muted-foreground/65" />
    </div>
  );
}

function PluginLibrary({
  scope,
  query,
  installedIds,
  onSetInstalled,
  onUse,
  onCreate,
}: {
  readonly scope: CatalogScope;
  readonly query: string;
  readonly installedIds: ReadonlyArray<string>;
  readonly onSetInstalled: (id: string, installed: boolean) => void;
  readonly onUse: (entry: PluginCatalogEntry) => void;
  readonly onCreate: () => void;
}) {
  const scopedEntries =
    scope === "personal"
      ? PLUGIN_CATALOG.filter((entry) => installedIds.includes(entry.id))
      : PLUGIN_CATALOG;
  const results = searchCatalog(scopedEntries, query);

  if (results.length === 0) {
    return (
      <CatalogEmptyState
        title={
          scope === "personal" ? "Your plugin shelf is ready." : "No plugins match that search."
        }
        description={
          scope === "personal"
            ? "Add a public plugin or create one with Sparky."
            : "Try a tool name or the job you want it to do."
        }
        {...(scope === "personal" ? { actionLabel: "Create plugin", onAction: onCreate } : {})}
      />
    );
  }

  if (query.trim().length > 0 || scope === "personal") {
    return (
      <CatalogSection title={scope === "personal" ? "Added plugins" : "Search results"}>
        {results.map((entry) => (
          <PluginRow
            key={entry.id}
            entry={entry}
            installed={installedIds.includes(entry.id)}
            onSetInstalled={onSetInstalled}
            onUse={onUse}
          />
        ))}
      </CatalogSection>
    );
  }

  return (
    <div className="mt-3">
      {PLUGIN_CATEGORIES.map((category) => {
        const entries =
          category === "Featured"
            ? results.filter((entry) => entry.featured)
            : results.filter((entry) => entry.category === category);
        if (entries.length === 0) return null;
        return (
          <CatalogSection
            key={category}
            title={category}
            description={CATEGORY_DESCRIPTIONS[category]}
          >
            {entries.map((entry) => (
              <PluginRow
                key={entry.id}
                entry={entry}
                installed={installedIds.includes(entry.id)}
                onSetInstalled={onSetInstalled}
                onUse={onUse}
              />
            ))}
          </CatalogSection>
        );
      })}
    </div>
  );
}

function ModLibrary({
  scope,
  query,
  installedIds,
  onSetInstalled,
  onUse,
  onCreate,
}: {
  readonly scope: CatalogScope;
  readonly query: string;
  readonly installedIds: ReadonlyArray<string>;
  readonly onSetInstalled: (id: string, installed: boolean) => void;
  readonly onUse: (entry: ModCatalogEntry) => void;
  readonly onCreate: () => void;
}) {
  const scopedEntries =
    scope === "personal"
      ? MOD_CATALOG.filter((entry) => installedIds.includes(entry.id))
      : MOD_CATALOG;
  const results = searchCatalog(scopedEntries, query);

  if (results.length === 0) {
    return (
      <CatalogEmptyState
        title={scope === "personal" ? "No personal Mods yet." : "No Mods match that search."}
        description={
          scope === "personal"
            ? "Describe the MCP server and the skill that should guide it."
            : "Try searching for a workflow, system, or outcome."
        }
        {...(scope === "personal" ? { actionLabel: "Create Mod", onAction: onCreate } : {})}
      />
    );
  }

  return (
    <CatalogSection
      title={scope === "personal" ? "Your Mods" : query ? "Search results" : "Public Mods"}
    >
      {results.map((entry) => (
        <ModRow
          key={entry.id}
          entry={entry}
          installed={installedIds.includes(entry.id)}
          onSetInstalled={onSetInstalled}
          onUse={onUse}
        />
      ))}
    </CatalogSection>
  );
}

function CatalogSection({
  title,
  description,
  children,
}: {
  readonly title: string;
  readonly description?: string;
  readonly children: ReactNode;
}) {
  return (
    <section
      className="mt-11"
      aria-labelledby={`section-${title.replaceAll(" ", "-").toLowerCase()}`}
    >
      <div className="mb-3 flex items-end justify-between gap-5 border-b border-border/70 pb-3">
        <div>
          <h2
            id={`section-${title.replaceAll(" ", "-").toLowerCase()}`}
            className="text-base font-semibold tracking-[-0.015em]"
          >
            {title}
          </h2>
          {description ? <p className="mt-1 text-xs text-muted-foreground">{description}</p> : null}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-x-10 md:grid-cols-2">{children}</div>
    </section>
  );
}

function PluginRow({
  entry,
  installed,
  onSetInstalled,
  onUse,
}: {
  readonly entry: PluginCatalogEntry;
  readonly installed: boolean;
  readonly onSetInstalled: (id: string, installed: boolean) => void;
  readonly onUse: (entry: PluginCatalogEntry) => void;
}) {
  return (
    <article className="group flex min-h-24 items-center gap-3.5 border-b border-border/50 py-4">
      <ExtensionIcon accent={entry.accent} logo={entry.logo} name={entry.name} />
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-semibold text-foreground">{entry.name}</h3>
        <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
          {entry.description}
        </p>
      </div>
      <div className="ml-1 flex shrink-0 items-center gap-1.5">
        {installed ? (
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  aria-label={`Use ${entry.name} in chat`}
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => onUse(entry)}
                >
                  <ArrowUpRightIcon />
                </Button>
              }
            />
            <TooltipPopup side="top">Use in chat</TooltipPopup>
          </Tooltip>
        ) : null}
        <Button
          aria-label={installed ? `Remove ${entry.name}` : `Add ${entry.name}`}
          aria-pressed={installed}
          className={cn(installed && "text-muted-foreground")}
          size="xs"
          variant={installed ? "ghost" : "outline"}
          onClick={() => onSetInstalled(entry.id, !installed)}
        >
          {installed ? <CheckIcon /> : <PlusIcon />}
          {installed ? "Added" : "Add"}
        </Button>
      </div>
    </article>
  );
}

function ModRow({
  entry,
  installed,
  onSetInstalled,
  onUse,
}: {
  readonly entry: ModCatalogEntry;
  readonly installed: boolean;
  readonly onSetInstalled: (id: string, installed: boolean) => void;
  readonly onUse: (entry: ModCatalogEntry) => void;
}) {
  return (
    <article className="group flex min-h-36 gap-3.5 border-b border-border/50 py-5">
      <ExtensionIcon accent={entry.accent} name={entry.name} />
      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold">{entry.name}</h3>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">{entry.description}</p>
          </div>
          <Button
            aria-label={installed ? `Remove ${entry.name} Mod` : `Add ${entry.name} Mod`}
            aria-pressed={installed}
            className={cn(installed && "text-muted-foreground")}
            size="xs"
            variant={installed ? "ghost" : "outline"}
            onClick={() => onSetInstalled(entry.id, !installed)}
          >
            {installed ? <CheckIcon /> : <PlusIcon />}
            {installed ? "Added" : "Add"}
          </Button>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
          <span className="rounded-md bg-muted/70 px-2 py-1">Skill · {entry.skill}</span>
          <span className="rounded-md bg-muted/70 px-2 py-1">MCP · {entry.mcpServer}</span>
          {installed ? (
            <button
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 font-medium text-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
              type="button"
              onClick={() => onUse(entry)}
            >
              Use in chat <ArrowUpRightIcon className="size-3" />
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function CatalogEmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: {
  readonly title: string;
  readonly description: string;
  readonly actionLabel?: string;
  readonly onAction?: () => void;
}) {
  return (
    <section className="mt-12 flex min-h-48 flex-col items-center justify-center border-y border-dashed border-border py-10 text-center">
      <h2 className="text-sm font-semibold">{title}</h2>
      <p className="mt-1.5 max-w-sm text-xs leading-5 text-muted-foreground">{description}</p>
      {actionLabel && onAction ? (
        <Button className="mt-4" size="sm" variant="outline" onClick={onAction}>
          <PlusIcon />
          {actionLabel}
        </Button>
      ) : null}
    </section>
  );
}

export const Route = createFileRoute("/plugins")({
  beforeLoad: async ({ context }) => {
    if (
      context.authGateState.status !== "authenticated" &&
      context.authGateState.status !== "hosted-static"
    ) {
      throw redirect({ to: "/", replace: true });
    }
  },
  component: PluginsRouteView,
});
