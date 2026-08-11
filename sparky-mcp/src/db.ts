import postgres from "postgres";

export interface PluginAuthConfig {
  authorizationEndpoint: string;
  tokenEndpoint: string;
  clientIdEnv: string;
  clientSecretEnv: string;
  scopes: string[];
}

export interface PluginRecord {
  slug: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  logoUrl: string;
  accent: string;
  mcpServerUrl: string;
  auth: PluginAuthConfig;
  enabled: boolean;
  updatedAt: string;
}

export interface ConnectionRecord {
  pluginSlug: string;
  status: "connected" | "revoked";
  encryptedAccessToken: string;
  encryptedRefreshToken: string | null;
  tokenType: string;
  expiresAt: Date | null;
}

export interface SessionRecord {
  tokenHash: string;
  pluginSlug: string;
  mcpServerUrl: string;
  encryptedAccessToken: string;
  expiresAt: Date;
}

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is not configured.");

export const sql = postgres(databaseUrl, {
  ssl: "require",
  max: Number(process.env.DATABASE_POOL_MAX ?? 10),
  idle_timeout: 20,
  connect_timeout: 10,
});

export async function listPlugins(): Promise<ReadonlyArray<Omit<PluginRecord, "auth">>> {
  return sql<Omit<PluginRecord, "auth">[]>`
    SELECT slug, name, description, category, tags, "logoUrl", accent, "mcpServerUrl", enabled, "updatedAt"
    FROM mcp_catalog
    WHERE enabled = true
    ORDER BY category, name
  `;
}

export async function getPlugin(slug: string): Promise<PluginRecord | null> {
  const rows = await sql<PluginRecord[]>`
    SELECT slug, name, description, category, tags, "logoUrl", accent, "mcpServerUrl", auth, enabled, "updatedAt"
    FROM mcp_catalog
    WHERE slug = ${slug}
    LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function listConnections(userSubject: string) {
  return sql<Array<{
    pluginSlug: string;
    status: "connected" | "revoked";
    expiresAt: Date | null;
    updatedAt: string;
  }>>`
    SELECT "pluginSlug", status, "expiresAt", "updatedAt"
    FROM mcp_connections
    WHERE "userSubject" = ${userSubject}
    ORDER BY "updatedAt" DESC
  `;
}

export async function upsertPlugin(input: Omit<PluginRecord, "updatedAt">) {
  await sql`
    INSERT INTO mcp_catalog
      (slug, name, description, category, tags, "logoUrl", accent, "mcpServerUrl", auth, enabled, "updatedAt")
    VALUES
      (${input.slug}, ${input.name}, ${input.description}, ${input.category}, ${sql.array(input.tags)},
       ${input.logoUrl}, ${input.accent}, ${input.mcpServerUrl}, ${JSON.stringify(input.auth)}::jsonb,
       ${input.enabled}, NOW())
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

export async function revokeConnection(userSubject: string, pluginSlug: string) {
  await sql`
    UPDATE mcp_connections
    SET status = 'revoked', "updatedAt" = NOW()
    WHERE "userSubject" = ${userSubject} AND "pluginSlug" = ${pluginSlug}
  `;
}

export async function getConnection(userSubject: string, pluginSlug: string): Promise<ConnectionRecord | null> {
  const rows = await sql<ConnectionRecord[]>`
    SELECT "pluginSlug", status, "encryptedAccessToken", "encryptedRefreshToken", "tokenType", "expiresAt"
    FROM mcp_connections
    WHERE "userSubject" = ${userSubject} AND "pluginSlug" = ${pluginSlug}
    LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function saveOAuthState(input: {
  state: string;
  userSubject: string;
  pluginSlug: string;
  codeVerifier: string;
  expiresAt: Date;
}) {
  await sql`
    INSERT INTO mcp_oauth_states (state, "userSubject", "pluginSlug", "codeVerifier", "expiresAt")
    VALUES (${input.state}, ${input.userSubject}, ${input.pluginSlug}, ${input.codeVerifier}, ${input.expiresAt})
  `;
}

export async function getOAuthState(state: string) {
  const rows = await sql<Array<{
    id: string;
    state: string;
    userSubject: string;
    pluginSlug: string;
    codeVerifier: string;
    expiresAt: Date;
  }>>`
    SELECT id, state, "userSubject", "pluginSlug", "codeVerifier", "expiresAt"
    FROM mcp_oauth_states
    WHERE state = ${state}
    LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function deleteOAuthState(id: string) {
  await sql`DELETE FROM mcp_oauth_states WHERE id = ${id}`;
}

export async function saveConnection(input: {
  userSubject: string;
  pluginSlug: string;
  encryptedAccessToken: string;
  encryptedRefreshToken?: string;
  tokenType: string;
  expiresAt?: Date;
}) {
  await sql`
    INSERT INTO mcp_connections
      ("userSubject", "pluginSlug", status, "encryptedAccessToken", "encryptedRefreshToken", "tokenType", "expiresAt", "createdAt", "updatedAt")
    VALUES
      (${input.userSubject}, ${input.pluginSlug}, 'connected', ${input.encryptedAccessToken},
       ${input.encryptedRefreshToken ?? null}, ${input.tokenType}, ${input.expiresAt ?? null}, NOW(), NOW())
    ON CONFLICT ("userSubject", "pluginSlug") DO UPDATE SET
      status = 'connected',
      "encryptedAccessToken" = EXCLUDED."encryptedAccessToken",
      "encryptedRefreshToken" = EXCLUDED."encryptedRefreshToken",
      "tokenType" = EXCLUDED."tokenType",
      "expiresAt" = EXCLUDED."expiresAt",
      "updatedAt" = NOW()
  `;
}

export async function saveSession(input: {
  tokenHash: string;
  userSubject: string;
  pluginSlug: string;
  mcpServerUrl: string;
  encryptedAccessToken: string;
  expiresAt: Date;
}) {
  await sql`
    INSERT INTO mcp_sessions
      ("tokenHash", "userSubject", "pluginSlug", "mcpServerUrl", "encryptedAccessToken", "expiresAt", "createdAt")
    VALUES
      (${input.tokenHash}, ${input.userSubject}, ${input.pluginSlug}, ${input.mcpServerUrl},
       ${input.encryptedAccessToken}, ${input.expiresAt}, NOW())
  `;
}

export async function getSession(tokenHash: string): Promise<SessionRecord | null> {
  const rows = await sql<SessionRecord[]>`
    SELECT "tokenHash", "pluginSlug", "mcpServerUrl", "encryptedAccessToken", "expiresAt"
    FROM mcp_sessions
    WHERE "tokenHash" = ${tokenHash}
    LIMIT 1
  `;
  return rows[0] ?? null;
}
