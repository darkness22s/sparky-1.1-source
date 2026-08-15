import { useEffect, useState } from "react";

import {
  PLUGIN_CATALOG,
  type PluginCatalogEntry,
  type PluginCategory,
} from "./extensionCatalog";

interface RemotePlugin {
  readonly slug: string;
  readonly name: string;
  readonly description: string;
  readonly category: PluginCategory;
  readonly tags: ReadonlyArray<string>;
  readonly logoUrl: string | null;
  readonly toolsCount: number;
  readonly sourceUpdatedAt: string | null;
}

interface RemoteCatalogResponse {
  readonly version: number;
  readonly plugins: ReadonlyArray<RemotePlugin>;
}

export interface PluginCatalogState {
  readonly catalog: ReadonlyArray<PluginCatalogEntry>;
  readonly isLoading: boolean;
  readonly lastSyncedAt: number | null;
  readonly error: string | null;
}

const REFRESH_INTERVAL_MS = 10_000;
const CATEGORY_ACCENTS: Record<PluginCategory, string> = {
  Featured: "#087fb8",
  Productivity: "#5e6ad2",
  Creativity: "#a259ff",
  "Developer Tools": "#2f80ed",
  "Automation & Data": "#159b82",
};

function catalogUrl(): string {
  return import.meta.env.VITE_SPARKY_PLUGIN_CATALOG_URL?.trim() ?? "";
}

function isSafeLogoUrl(value: string | null): value is string {
  return typeof value === "string" && value.startsWith("https://");
}

function normalizePlugin(plugin: RemotePlugin): PluginCatalogEntry {
  return {
    id: plugin.slug,
    name: plugin.name,
    description: plugin.description,
    category: plugin.category,
    ...(isSafeLogoUrl(plugin.logoUrl) ? { logoUrl: plugin.logoUrl } : {}),
    accent: CATEGORY_ACCENTS[plugin.category] ?? CATEGORY_ACCENTS.Featured,
    tags: plugin.tags,
    toolsCount: plugin.toolsCount,
    ...(plugin.sourceUpdatedAt ? { sourceUpdatedAt: plugin.sourceUpdatedAt } : {}),
  };
}

async function fetchRemoteCatalog(signal: AbortSignal): Promise<RemoteCatalogResponse> {
  const response = await fetch(catalogUrl(), {
    headers: { Accept: "application/json" },
    signal,
  });
  if (!response.ok) throw new Error(`Catalog request failed (${response.status})`);
  return (await response.json()) as RemoteCatalogResponse;
}

export function usePluginCatalog(): PluginCatalogState {
  const [state, setState] = useState<PluginCatalogState>({
    catalog: PLUGIN_CATALOG,
    isLoading: true,
    lastSyncedAt: null,
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();
    let disposed = false;

    const refresh = async () => {
      try {
        const payload = await fetchRemoteCatalog(controller.signal);
        if (disposed) return;
        setState({
          // Keep the bundled catalog until the first successful admin sync has
          // produced a non-zero source version. A deliberate empty catalog
          // after that point remains empty and is respected by the client.
          catalog: payload.version > 0 ? payload.plugins.map(normalizePlugin) : PLUGIN_CATALOG,
          isLoading: false,
          lastSyncedAt: Date.now(),
          error: null,
        });
      } catch (error) {
        if (disposed || (error instanceof DOMException && error.name === "AbortError")) return;
        setState((current) => ({
          ...current,
          isLoading: false,
          error: error instanceof Error ? error.message : "Catalog refresh failed",
        }));
      }
    };

    void refresh();
    const interval = window.setInterval(() => void refresh(), REFRESH_INTERVAL_MS);
    return () => {
      disposed = true;
      controller.abort();
      window.clearInterval(interval);
    };
  }, []);

  return state;
}

export function normalizeRemotePluginForTest(plugin: RemotePlugin): PluginCatalogEntry {
  return normalizePlugin(plugin);
}
