import { useMemo } from "react";

import { buildExtensionReference, buildPluginReference, MOD_CATALOG } from "../../extensionCatalog";
import { useExtensionInstallState } from "../../extensionLibrary";
import { usePluginCatalog } from "../../pluginCatalogClient";
import { ExtensionIcon } from "../extensions/ExtensionIcon";
import { Tooltip, TooltipPopup, TooltipTrigger } from "../ui/tooltip";

export function ComposerExtensionReferences({
  onReference,
}: {
  readonly onReference: (reference: string) => void;
}) {
  const { pluginIds, modIds } = useExtensionInstallState();
  const { catalog: pluginCatalog } = usePluginCatalog();
  const installedPlugins = useMemo(
    () => pluginCatalog.filter((entry) => pluginIds.includes(entry.id)),
    [pluginCatalog, pluginIds],
  );
  const installedMods = useMemo(
    () => MOD_CATALOG.filter((entry) => modIds.includes(entry.id)),
    [modIds],
  );

  if (installedPlugins.length + installedMods.length === 0) return null;

  return (
    <div
      aria-label="Available Plugin and Mod references"
      className="flex items-center gap-2 overflow-x-auto border-b border-border/55 px-3 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <span className="mr-0.5 shrink-0 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/75">
        Tools
      </span>
      {installedPlugins.map((entry) => (
        <Tooltip key={entry.id}>
          <TooltipTrigger
            render={
              <button
                aria-label={`Reference ${entry.name}`}
                className="shrink-0 rounded-[10px] outline-none ring-ring transition-transform hover:-translate-y-0.5 focus-visible:ring-2 motion-reduce:transition-none"
                type="button"
                onClick={() => onReference(buildPluginReference(entry))}
              >
                <ExtensionIcon
                  accent={entry.accent}
                  className="shadow-none"
                  logo={entry.logo}
                  logoUrl={entry.logoUrl}
                  name={entry.name}
                  size="sm"
                />
              </button>
            }
          />
          <TooltipPopup side="top">Reference {entry.name}</TooltipPopup>
        </Tooltip>
      ))}
      {installedMods.map((entry) => (
        <Tooltip key={entry.id}>
          <TooltipTrigger
            render={
              <button
                aria-label={`Reference ${entry.name}`}
                className="shrink-0 rounded-[10px] outline-none ring-ring transition-transform hover:-translate-y-0.5 focus-visible:ring-2 motion-reduce:transition-none"
                type="button"
                onClick={() => onReference(buildExtensionReference(entry.name, "Mod"))}
              >
                <ExtensionIcon
                  accent={entry.accent}
                  className="shadow-none"
                  name={entry.name}
                  size="sm"
                />
              </button>
            }
          />
          <TooltipPopup side="top">Reference {entry.name} Mod</TooltipPopup>
        </Tooltip>
      ))}
    </div>
  );
}
