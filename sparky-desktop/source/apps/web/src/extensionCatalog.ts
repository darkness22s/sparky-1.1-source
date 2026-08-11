export type PluginCategory =
  | "Featured"
  | "Productivity"
  | "Creativity"
  | "Developer Tools"
  | "Automation & Data";

export interface PluginCatalogEntry {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: PluginCategory;
  readonly logo: string;
  readonly accent: string;
  readonly featured?: boolean;
  readonly tags: ReadonlyArray<string>;
}

export interface ModCatalogEntry {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: Exclude<PluginCategory, "Creativity">;
  readonly skill: string;
  readonly mcpServer: string;
  readonly accent: string;
  readonly featured?: boolean;
  readonly tags: ReadonlyArray<string>;
}

export const PLUGIN_CATEGORIES: ReadonlyArray<PluginCategory> = [
  "Featured",
  "Productivity",
  "Creativity",
  "Developer Tools",
  "Automation & Data",
];

export const PLUGIN_CATALOG: ReadonlyArray<PluginCatalogEntry> = [
  {
    id: "github",
    name: "GitHub",
    description: "Review pull requests, inspect issues, and work with repositories.",
    category: "Developer Tools",
    logo: "github",
    accent: "#181717",
    featured: true,
    tags: ["code", "pull requests", "issues", "git"],
  },
  {
    id: "gmail",
    name: "Gmail",
    description: "Find important messages and draft thoughtful replies.",
    category: "Productivity",
    logo: "gmail",
    accent: "#ea4335",
    featured: true,
    tags: ["email", "inbox", "google"],
  },
  {
    id: "zapier",
    name: "Zapier",
    description: "Trigger workflows across the tools your team already uses.",
    category: "Automation & Data",
    logo: "zapier",
    accent: "#ff4f00",
    featured: true,
    tags: ["automation", "workflows", "actions"],
  },
  {
    id: "linear",
    name: "Linear",
    description: "Triage issues, shape projects, and keep cycles moving.",
    category: "Productivity",
    logo: "linear",
    accent: "#5e6ad2",
    featured: true,
    tags: ["issues", "projects", "planning"],
  },
  {
    id: "notion",
    name: "Notion",
    description: "Search team knowledge and turn conversations into documents.",
    category: "Productivity",
    logo: "notion",
    accent: "#111111",
    featured: true,
    tags: ["docs", "wiki", "knowledge"],
  },
  {
    id: "google-calendar",
    name: "Google Calendar",
    description: "Understand availability and prepare meetings with context.",
    category: "Productivity",
    logo: "googlecalendar",
    accent: "#4285f4",
    tags: ["calendar", "meetings", "schedule"],
  },
  {
    id: "asana",
    name: "Asana",
    description: "Create tasks, summarize projects, and surface blocked work.",
    category: "Productivity",
    logo: "asana",
    accent: "#f06a6a",
    tags: ["tasks", "projects", "teams"],
  },
  {
    id: "jira",
    name: "Jira",
    description: "Navigate backlogs, releases, and engineering work items.",
    category: "Productivity",
    logo: "jira",
    accent: "#0052cc",
    tags: ["issues", "backlog", "agile"],
  },
  {
    id: "trello",
    name: "Trello",
    description: "Turn plans into cards and keep boards organized.",
    category: "Productivity",
    logo: "trello",
    accent: "#0052cc",
    tags: ["boards", "cards", "tasks"],
  },
  {
    id: "dropbox",
    name: "Dropbox",
    description: "Find shared files and organize project handoffs.",
    category: "Productivity",
    logo: "dropbox",
    accent: "#0061ff",
    tags: ["files", "storage", "sharing"],
  },
  {
    id: "figma",
    name: "Figma",
    description: "Inspect design context and turn feedback into clear actions.",
    category: "Creativity",
    logo: "figma",
    accent: "#a259ff",
    featured: true,
    tags: ["design", "prototypes", "comments"],
  },
  {
    id: "miro",
    name: "Miro",
    description: "Summarize workshops and organize ideas from collaborative boards.",
    category: "Creativity",
    logo: "miro",
    accent: "#ffd02f",
    tags: ["whiteboard", "workshops", "ideas"],
  },
  {
    id: "airtable",
    name: "Airtable",
    description: "Query structured work and update the records that drive it.",
    category: "Automation & Data",
    logo: "airtable",
    accent: "#f82b60",
    tags: ["database", "records", "operations"],
  },
  {
    id: "hubspot",
    name: "HubSpot",
    description: "Research customer context and keep CRM records current.",
    category: "Automation & Data",
    logo: "hubspot",
    accent: "#ff7a59",
    tags: ["crm", "customers", "sales"],
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "Investigate payments and understand billing activity safely.",
    category: "Automation & Data",
    logo: "stripe",
    accent: "#635bff",
    tags: ["payments", "billing", "finance"],
  },
  {
    id: "shopify",
    name: "Shopify",
    description: "Work with products, orders, and storefront operations.",
    category: "Automation & Data",
    logo: "shopify",
    accent: "#7ab55c",
    tags: ["commerce", "orders", "products"],
  },
  {
    id: "discord",
    name: "Discord",
    description: "Summarize community conversations and coordinate follow-ups.",
    category: "Automation & Data",
    logo: "discord",
    accent: "#5865f2",
    tags: ["community", "messages", "teams"],
  },
  {
    id: "sentry",
    name: "Sentry",
    description: "Trace production errors from symptom to responsible code.",
    category: "Developer Tools",
    logo: "sentry",
    accent: "#362d59",
    tags: ["errors", "monitoring", "debugging"],
  },
  {
    id: "vercel",
    name: "Vercel",
    description: "Inspect deployments, logs, and preview environments.",
    category: "Developer Tools",
    logo: "vercel",
    accent: "#111111",
    tags: ["deployments", "hosting", "logs"],
  },
  {
    id: "supabase",
    name: "Supabase",
    description: "Explore database structure, logs, and project configuration.",
    category: "Developer Tools",
    logo: "supabase",
    accent: "#3ecf8e",
    tags: ["database", "backend", "postgres"],
  },
];

export const MOD_CATALOG: ReadonlyArray<ModCatalogEntry> = [
  {
    id: "release-pilot",
    name: "Release Pilot",
    description: "Prepare a release with checks, notes, and a clean handoff.",
    category: "Developer Tools",
    skill: "Guides a fail-closed release checklist and summarizes remaining risk.",
    mcpServer: "Repository and CI tools",
    accent: "#5b7cfa",
    featured: true,
    tags: ["release", "ci", "changelog"],
  },
  {
    id: "incident-room",
    name: "Incident Room",
    description: "Bring alerts, logs, and a response playbook into one thread.",
    category: "Developer Tools",
    skill: "Keeps investigation evidence-first and records a concise timeline.",
    mcpServer: "Observability tools",
    accent: "#f06a57",
    featured: true,
    tags: ["incident", "logs", "response"],
  },
  {
    id: "research-relay",
    name: "Research Relay",
    description: "Collect sources and shape them into a decision-ready brief.",
    category: "Featured",
    skill: "Separates evidence, uncertainty, and recommendation while citing sources.",
    mcpServer: "Browser and document search",
    accent: "#7c62d4",
    featured: true,
    tags: ["research", "sources", "brief"],
  },
  {
    id: "customer-pulse",
    name: "Customer Pulse",
    description: "Find themes across feedback without losing the original signal.",
    category: "Automation & Data",
    skill: "Clusters feedback, preserves representative quotes, and flags weak evidence.",
    mcpServer: "Support and CRM tools",
    accent: "#e78a36",
    tags: ["feedback", "crm", "themes"],
  },
  {
    id: "design-review",
    name: "Design Review",
    description: "Pair visual context with a focused, actionable interface critique.",
    category: "Featured",
    skill: "Reviews hierarchy, accessibility, responsive behavior, and finish quality.",
    mcpServer: "Preview and design tools",
    accent: "#d454a0",
    tags: ["design", "review", "accessibility"],
  },
  {
    id: "data-steward",
    name: "Data Steward",
    description: "Inspect operational data with a cautious read-before-write workflow.",
    category: "Automation & Data",
    skill: "Explains queries, scopes mutations, and asks before consequential writes.",
    mcpServer: "Database tools",
    accent: "#159b82",
    tags: ["data", "database", "safety"],
  },
];

export function searchCatalog<
  T extends { name: string; description: string; tags: ReadonlyArray<string> },
>(entries: ReadonlyArray<T>, query: string): ReadonlyArray<T> {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  if (normalizedQuery.length === 0) return entries;

  return entries.filter((entry) =>
    [entry.name, entry.description, ...entry.tags].some((value) =>
      value.toLocaleLowerCase().includes(normalizedQuery),
    ),
  );
}

export function buildExtensionReference(name: string, kind: "plugin" | "Mod"): string {
  return `Use ${name} ${kind}: `;
}

export const CREATE_PLUGIN_PROMPT = `Create a new Sparky plugin for [tool or service].

It should connect through an MCP server and expose only the permissions needed for: [describe the tasks].

Please scaffold a small demo I can review, including setup instructions, safe credential handling, and a verification flow.`;

export const CREATE_MOD_PROMPT = `Create a new Sparky Mod called [name].

Pack:
- MCP server: [what it connects to or does]
- Skill: [how Sparky should use it well]

Please scaffold a small demo I can review, document the permissions it needs, and include a verification flow.`;
