import { readFile } from "node:fs/promises";
import postgres from "postgres";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is not configured.");

const catalog = JSON.parse(
  await readFile(new URL("../catalog.json", import.meta.url), "utf8"),
);
const sql = postgres(databaseUrl, { ssl: "require", connect_timeout: 10 });

try {
  for (const plugin of catalog) {
    await sql`
      INSERT INTO mcp_catalog
        (slug, name, description, category, tags, "logoUrl", accent, "mcpServerUrl", auth, enabled, "updatedAt")
      VALUES
        (${plugin.slug}, ${plugin.name}, ${plugin.description}, ${plugin.category}, ${sql.array(plugin.tags)},
         ${plugin.logoUrl}, ${plugin.accent}, ${plugin.mcpServerUrl}, ${JSON.stringify(plugin.auth)}::jsonb,
         ${plugin.enabled}, NOW())
      ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        category = EXCLUDED.category,
        tags = EXCLUDED.tags,
        "logoUrl" = EXCLUDED."logoUrl",
        accent = EXCLUDED.accent,
        "mcpServerUrl" = EXCLUDED."mcpServerUrl",
        auth = EXCLUDED.auth,
        enabled = EXCLUDED.enabled,
        "updatedAt" = NOW()
    `;
  }
  console.log(`Seeded ${catalog.length} MCP catalog entries.`);
} finally {
  await sql.end({ timeout: 5 });
}
