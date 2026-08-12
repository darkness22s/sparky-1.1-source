import { v } from "convex/values";
import {
  action,
  internalMutation,
  internalQuery,
  mutation,
  query,
  type MutationCtx,
  type QueryCtx,
} from "./_generated/server";
import { internal } from "./_generated/api";

const ADMIN_EMAIL = "soliamanmagbari@gmail.com";
const categoryValidator = v.union(
  v.literal("Featured"),
  v.literal("Productivity"),
  v.literal("Creativity"),
  v.literal("Developer Tools"),
  v.literal("Automation & Data"),
);
const pluginValidator = v.object({
  slug: v.string(),
  name: v.string(),
  description: v.string(),
  category: categoryValidator,
  tags: v.array(v.string()),
  logoUrl: v.union(v.string(), v.null()),
  appUrl: v.union(v.string(), v.null()),
  authSchemes: v.array(v.string()),
  managedAuthSchemes: v.array(v.string()),
  toolsCount: v.number(),
  sourceCreatedAt: v.union(v.string(), v.null()),
  sourceUpdatedAt: v.union(v.string(), v.null()),
});

const INITIAL_ENABLED_SLUGS = new Set([
  "github",
  "gmail",
  "slack",
  "linear",
  "notion",
  "googlecalendar",
  "asana",
  "jira",
  "trello",
  "dropbox",
  "figma",
  "miro",
  "airtable",
  "hubspot",
  "stripe",
  "googledrive",
  "discord",
  "sentry",
  "outlook",
  "supabase",
]);

type CatalogCategory =
  | "Featured"
  | "Productivity"
  | "Creativity"
  | "Developer Tools"
  | "Automation & Data";

function categoryFor(categories: ReadonlyArray<string>): CatalogCategory {
  const normalized = categories.map((category) => category.toLowerCase());
  if (normalized.some((category) => category.includes("developer") || category.includes("engineering"))) {
    return "Developer Tools";
  }
  if (normalized.some((category) => category.includes("creative") || category.includes("design"))) {
    return "Creativity";
  }
  if (
    normalized.some((category) =>
      ["automation", "data", "business", "finance", "marketing", "sales", "communication"].some(
        (token) => category.includes(token),
      ),
    )
  ) {
    return "Automation & Data";
  }
  return "Productivity";
}

function tagsFor(toolkit: {
  name: string;
  meta?: { categories?: Array<{ name?: string }>; description?: string };
}) {
  return [
    toolkit.name,
    ...(toolkit.meta?.categories?.map((category) => category.name ?? "") ?? []),
  ]
    .map((tag) => tag.trim().toLowerCase())
    .filter((tag, index, tags) => tag.length > 0 && tags.indexOf(tag) === index)
    .slice(0, 8);
}

async function requireAdmin(ctx: Pick<QueryCtx, "auth"> | Pick<MutationCtx, "auth">) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity || identity.email?.toLowerCase() !== ADMIN_EMAIL) {
    throw new Error("Administrator access is required.");
  }
}

export const publicCatalog = internalQuery({
  args: {},
  returns: v.object({ version: v.number(), plugins: v.array(pluginValidator) }),
  handler: async (ctx) => {
    const plugins = await ctx.db
      .query("pluginCatalog")
      .withIndex("by_enabled", (q) => q.eq("enabled", true))
      .order("desc")
      .take(2000);
    const version = plugins.reduce((latest, plugin) => Math.max(latest, plugin.syncedAt), 0);
    const project = ({
      _id: _id,
      _creationTime: _creationTime,
      syncedAt: _syncedAt,
      enabled: _enabled,
      ...plugin
    }: (typeof plugins)[number]) => plugin;
    return {
      version,
      plugins: plugins.map(project),
    };
  },
});

export const listAdmin = query({
  args: {},
  returns: v.object({
    syncedAt: v.union(v.number(), v.null()),
    enabled: v.array(pluginValidator),
    available: v.array(pluginValidator),
  }),
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const enabled = await ctx.db
      .query("pluginCatalog")
      .withIndex("by_enabled", (q) => q.eq("enabled", true))
      .order("desc")
      .take(2000);
    const available = await ctx.db
      .query("pluginCatalog")
      .withIndex("by_enabled", (q) => q.eq("enabled", false))
      .order("desc")
      .take(2000);
    const rows = [...enabled, ...available];
    const syncedAt = rows.length > 0 ? Math.max(...rows.map((row) => row.syncedAt)) : null;
    const project = ({
      _id: _id,
      _creationTime: _creationTime,
      syncedAt: _syncedAt,
      enabled: _enabled,
      ...plugin
    }: (typeof rows)[number]) => plugin;
    return { syncedAt, enabled: enabled.map(project), available: available.map(project) };
  },
});

export const upsertSnapshot = internalMutation({
  args: { plugins: v.array(pluginValidator), syncedAt: v.number() },
  returns: v.object({ count: v.number(), enabledCount: v.number() }),
  handler: async (ctx, args) => {
    let enabledCount = 0;
    const seenSlugs = new Set(args.plugins.map((plugin) => plugin.slug));
    for (const plugin of args.plugins) {
      const existing = await ctx.db
        .query("pluginCatalog")
        .withIndex("by_slug", (q) => q.eq("slug", plugin.slug))
        .unique();
      const enabled = existing?.enabled ?? INITIAL_ENABLED_SLUGS.has(plugin.slug);
      if (enabled) enabledCount += 1;
      const row = { ...plugin, enabled, syncedAt: args.syncedAt };
      if (existing) await ctx.db.replace(existing._id, row);
      else await ctx.db.insert("pluginCatalog", row);
    }
    const existingRows = await ctx.db.query("pluginCatalog").take(2000);
    for (const row of existingRows) {
      if (!seenSlugs.has(row.slug)) {
        // The table is a Composio snapshot, so a toolkit removed upstream
        // should disappear from both the admin queue and the public feed.
        await ctx.db.delete(row._id);
      }
    }
    return { count: args.plugins.length, enabledCount };
  },
});

export const syncComposioToolkits = action({
  args: {},
  returns: v.object({ count: v.number(), enabledCount: v.number(), syncedAt: v.number() }),
  handler: async (ctx): Promise<{ count: number; enabledCount: number; syncedAt: number }> => {
    await requireAdmin(ctx);
    const apiKey = process.env.COMPOSIO_API_KEY?.trim();
    if (!apiKey) throw new Error("COMPOSIO_API_KEY is not configured on the Convex deployment.");

    const toolkits: Array<Record<string, unknown>> = [];
    let cursor: string | undefined;
    for (let page = 0; page < 30; page += 1) {
      const url = new URL("https://backend.composio.dev/api/v3/toolkits");
      url.searchParams.set("limit", "100");
      url.searchParams.set("sort_by", "alphabetically");
      if (cursor) url.searchParams.set("cursor", cursor);
      const response = await fetch(url, { headers: { "x-api-key": apiKey } });
      if (!response.ok) throw new Error(`Composio toolkit sync failed (HTTP ${response.status}).`);
      const body = (await response.json()) as { items?: Array<Record<string, unknown>>; next_cursor?: string };
      toolkits.push(...(body.items ?? []));
      if (!body.next_cursor || (body.items?.length ?? 0) === 0) break;
      cursor = body.next_cursor;
    }
    if (toolkits.length === 0) throw new Error("Composio returned no toolkits.");

    const plugins = toolkits
      .map((toolkit) => {
        const meta = (toolkit.meta ?? {}) as {
          description?: string;
          logo?: string;
          app_url?: string;
          categories?: Array<{ name?: string }>;
          created_at?: string;
          updated_at?: string;
          tools_count?: number;
        };
        const name = typeof toolkit.name === "string" ? toolkit.name.trim() : "";
        const slug = typeof toolkit.slug === "string" ? toolkit.slug.trim() : "";
        if (!name || !slug) return null;
        const categories = meta.categories?.map((category) => category.name ?? "") ?? [];
        return {
          slug,
          name,
          description: meta.description?.trim() || `${name} tools through Composio.`,
          category: categoryFor(categories),
          tags: tagsFor({ name, meta }),
          logoUrl: meta.logo?.trim() || null,
          appUrl: meta.app_url?.trim() || null,
          authSchemes: Array.isArray(toolkit.auth_schemes) ? toolkit.auth_schemes.filter((value): value is string => typeof value === "string") : [],
          managedAuthSchemes: Array.isArray(toolkit.composio_managed_auth_schemes) ? toolkit.composio_managed_auth_schemes.filter((value): value is string => typeof value === "string") : [],
          toolsCount: typeof meta.tools_count === "number" ? meta.tools_count : 0,
          sourceCreatedAt: meta.created_at ?? null,
          sourceUpdatedAt: meta.updated_at ?? null,
        };
      })
      .filter((plugin): plugin is NonNullable<typeof plugin> => plugin !== null);
    const syncedAt = Date.now();
    return await ctx.runMutation(internal.pluginCatalog.upsertSnapshot, { plugins, syncedAt }).then((result) => ({ ...result, syncedAt }));
  },
});

export const add = mutation({
  args: { slug: v.string() },
  returns: v.object({ slug: v.string(), enabled: v.boolean() }),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const plugin = await ctx.db
      .query("pluginCatalog")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!plugin) throw new Error("Sync Composio before adding a plugin.");
    await ctx.db.patch(plugin._id, { enabled: true });
    return { slug: plugin.slug, enabled: true };
  },
});

export const remove = mutation({
  args: { slug: v.string() },
  returns: v.object({ slug: v.string(), enabled: v.boolean() }),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const plugin = await ctx.db
      .query("pluginCatalog")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!plugin) throw new Error("Plugin not found.");
    await ctx.db.patch(plugin._id, { enabled: false });
    return { slug: plugin.slug, enabled: false };
  },
});
