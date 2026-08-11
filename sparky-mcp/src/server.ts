import { createHash } from "node:crypto";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { Readable } from "node:stream";

import { authenticateBearer, HttpAuthError, subjectFromClaims } from "./auth.js";
import {
  deleteOAuthState,
  getConnection,
  getOAuthState,
  getPlugin,
  getSession,
  listConnections,
  listPlugins,
  revokeConnection,
  saveConnection,
  saveOAuthState,
  saveSession,
  sql,
  upsertPlugin,
  type PluginAuthConfig,
  type PluginRecord,
} from "./db.js";
import { decryptSecret, encryptSecret, hashToken, randomToken } from "./crypto.js";

const oauthStateLifetimeMs = 10 * 60 * 1000;
const mcpSessionLifetimeMs = 15 * 60 * 1000;
const maxBodyBytes = 2 * 1024 * 1024;
const port = Number(process.env.PORT ?? 8787);

function siteUrl(): string {
  const value = process.env.MCP_SITE_URL?.replace(/\/$/u, "");
  if (!value) throw new Error("MCP_SITE_URL is not configured.");
  return value;
}

function json(res: ServerResponse, status: number, body: unknown, headers: Record<string, string> = {}) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    ...corsHeaders(headers["Access-Control-Allow-Origin"]),
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(payload),
    ...headers,
  });
  res.end(payload);
}

function corsHeaders(origin: string | undefined): Record<string, string> {
  const allowed = (process.env.MCP_ALLOWED_ORIGINS ?? "*")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const requested = origin && allowed.includes(origin) ? origin : allowed.includes("*") ? "*" : "";
  return {
    ...(requested ? { "Access-Control-Allow-Origin": requested } : {}),
    "Access-Control-Allow-Headers": "Authorization, Content-Type, Mcp-Session-Id, Mcp-Protocol-Version",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Cache-Control": "no-store",
  };
}

function bearerToken(request: IncomingMessage): string | null {
  const value = request.headers.authorization;
  return value?.startsWith("Bearer ") ? value.slice("Bearer ".length).trim() || null : null;
}

async function readBody(request: IncomingMessage): Promise<Buffer> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;
    if (size > maxBodyBytes) throw new HttpError(413, "Request body is too large.");
    chunks.push(buffer);
  }
  return Buffer.concat(chunks);
}

async function readJson(request: IncomingMessage): Promise<Record<string, unknown>> {
  const body = await readBody(request);
  if (body.length === 0) return {};
  const parsed: unknown = JSON.parse(body.toString("utf8"));
  if (!isRecord(parsed)) throw new HttpError(400, "Expected a JSON object.");
  return parsed;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringField(body: Record<string, unknown>, name: string): string {
  const value = body[name];
  if (typeof value !== "string" || value.trim().length === 0) throw new HttpError(400, `${name} is required.`);
  return value.trim();
}

async function requireUser(request: IncomingMessage): Promise<string> {
  const claims = await authenticateBearer(request.headers.authorization);
  return subjectFromClaims(claims);
}

function requireAdmin(userSubject: string) {
  const adminSubject = process.env.MCP_ADMIN_SUBJECT;
  if (!adminSubject || userSubject !== adminSubject) throw new HttpError(403, "MCP catalog administration is required.");
}

function oauthClient(plugin: PluginRecord) {
  const clientId = process.env[plugin.auth.clientIdEnv];
  const clientSecret = process.env[plugin.auth.clientSecretEnv];
  if (!clientId || !clientSecret) throw new Error(`OAuth credentials are not configured for ${plugin.slug}.`);
  return { clientId, clientSecret };
}

function pkceChallenge(verifier: string): string {
  return createHash("sha256").update(verifier).digest("base64url");
}

async function startOAuth(request: IncomingMessage) {
  const userSubject = await requireUser(request);
  const body = await readJson(request);
  const plugin = await getPlugin(stringField(body, "pluginSlug"));
  if (!plugin?.enabled) throw new HttpError(404, "MCP plugin is unavailable.");
  const { clientId } = oauthClient(plugin);
  const verifier = randomToken();
  const state = randomToken();
  await saveOAuthState({
    state,
    userSubject,
    pluginSlug: plugin.slug,
    codeVerifier: verifier,
    expiresAt: new Date(Date.now() + oauthStateLifetimeMs),
  });
  const authorizationUrl = new URL(plugin.auth.authorizationEndpoint);
  authorizationUrl.searchParams.set("client_id", clientId);
  authorizationUrl.searchParams.set("redirect_uri", `${siteUrl()}/mcp/oauth/callback`);
  authorizationUrl.searchParams.set("response_type", "code");
  authorizationUrl.searchParams.set("state", state);
  authorizationUrl.searchParams.set("code_challenge", pkceChallenge(verifier));
  authorizationUrl.searchParams.set("code_challenge_method", "S256");
  if (plugin.auth.scopes.length > 0) authorizationUrl.searchParams.set("scope", plugin.auth.scopes.join(" "));
  return { authorizationUrl: authorizationUrl.toString() };
}

async function completeOAuth(url: URL) {
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const oauthError = url.searchParams.get("error");
  if (oauthError || !code || !state) throw new HttpError(400, oauthError ?? "Missing OAuth response.");
  const oauthState = await getOAuthState(state);
  if (!oauthState || oauthState.expiresAt.getTime() < Date.now()) throw new HttpError(400, "OAuth state is invalid or expired.");
  const plugin = await getPlugin(oauthState.pluginSlug);
  if (!plugin) throw new HttpError(404, "MCP plugin is unavailable.");
  const { clientId, clientSecret } = oauthClient(plugin);
  const response = await fetch(plugin.auth.tokenEndpoint, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: `${siteUrl()}/mcp/oauth/callback`,
      code_verifier: oauthState.codeVerifier,
    }),
  });
  if (!response.ok) throw new HttpError(502, `OAuth token exchange failed (${response.status}).`);
  const token = (await response.json()) as Record<string, unknown>;
  if (typeof token.access_token !== "string") throw new HttpError(502, "OAuth response did not contain an access token.");
  await saveConnection({
    userSubject: oauthState.userSubject,
    pluginSlug: oauthState.pluginSlug,
    encryptedAccessToken: encryptSecret(token.access_token),
    ...(typeof token.refresh_token === "string" ? { encryptedRefreshToken: encryptSecret(token.refresh_token) } : {}),
    tokenType: typeof token.token_type === "string" ? token.token_type : "Bearer",
    ...(typeof token.expires_in === "number" ? { expiresAt: new Date(Date.now() + token.expires_in * 1000) } : {}),
  });
  await deleteOAuthState(oauthState.id);
  return plugin.slug;
}

async function refreshConnection(userSubject: string, plugin: PluginRecord, connection: NonNullable<Awaited<ReturnType<typeof getConnection>>>) {
  if (!connection.encryptedRefreshToken) throw new HttpError(409, "Reconnect this MCP plugin.");
  const { clientId, clientSecret } = oauthClient(plugin);
  const refreshToken = decryptSecret(connection.encryptedRefreshToken);
  const response = await fetch(plugin.auth.tokenEndpoint, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });
  if (!response.ok) throw new HttpError(409, "Reconnect this MCP plugin.");
  const token = (await response.json()) as Record<string, unknown>;
  if (typeof token.access_token !== "string") throw new HttpError(409, "Reconnect this MCP plugin.");
  const refreshed = {
    ...connection,
    encryptedAccessToken: encryptSecret(token.access_token),
    encryptedRefreshToken: typeof token.refresh_token === "string" ? encryptSecret(token.refresh_token) : connection.encryptedRefreshToken,
    tokenType: typeof token.token_type === "string" ? token.token_type : connection.tokenType,
    expiresAt: typeof token.expires_in === "number" ? new Date(Date.now() + token.expires_in * 1000) : null,
  };
  await saveConnection({
    userSubject,
    pluginSlug: plugin.slug,
    encryptedAccessToken: refreshed.encryptedAccessToken,
    encryptedRefreshToken: refreshed.encryptedRefreshToken ?? undefined,
    tokenType: refreshed.tokenType,
    expiresAt: refreshed.expiresAt ?? undefined,
  });
  return refreshed;
}

async function createMcpSession(request: IncomingMessage) {
  const userSubject = await requireUser(request);
  const body = await readJson(request);
  const pluginSlug = stringField(body, "pluginSlug");
  const plugin = await getPlugin(pluginSlug);
  let connection = await getConnection(userSubject, pluginSlug);
  if (!plugin?.enabled || !connection || connection.status !== "connected") {
    throw new HttpError(409, "Connect this MCP plugin before using it.");
  }
  if (connection.expiresAt && connection.expiresAt.getTime() <= Date.now() + 60_000) {
    connection = await refreshConnection(userSubject, plugin, connection);
  }
  const token = randomToken();
  const expiresAt = new Date(Date.now() + mcpSessionLifetimeMs);
  await saveSession({
    tokenHash: hashToken(token),
    userSubject,
    pluginSlug,
    mcpServerUrl: plugin.mcpServerUrl,
    encryptedAccessToken: connection.encryptedAccessToken,
    expiresAt,
  });
  return { token, endpointPath: `/mcp/${encodeURIComponent(pluginSlug)}`, expiresAt: expiresAt.toISOString() };
}

async function proxyMcp(request: IncomingMessage, response: ServerResponse, pluginSlug: string) {
  const sessionToken = bearerToken(request);
  if (!sessionToken) throw new HttpAuthError("MCP session authorization is required.");
  const session = await getSession(hashToken(sessionToken));
  if (!session || session.pluginSlug !== pluginSlug || session.expiresAt.getTime() < Date.now()) {
    throw new HttpAuthError("MCP session is invalid or expired.");
  }
  const body = request.method === "GET" || request.method === "DELETE" ? undefined : await readBody(request);
  const headers = new Headers();
  for (const name of ["accept", "content-type", "mcp-session-id", "mcp-protocol-version"]) {
    const value = request.headers[name];
    if (typeof value === "string") headers.set(name, value);
  }
  headers.set("authorization", `${"Bearer"} ${decryptSecret(session.encryptedAccessToken)}`);
  const upstream = await fetch(session.mcpServerUrl, {
    method: request.method ?? "GET",
    headers,
    ...(body ? { body: body.toString("utf8") } : {}),
  });
  const responseHeaders = corsHeaders(request.headers.origin);
  for (const name of ["content-type", "cache-control", "mcp-session-id"]) {
    const value = upstream.headers.get(name);
    if (value) responseHeaders[name] = value;
  }
  response.writeHead(upstream.status, responseHeaders);
  if (upstream.body) Readable.fromWeb(upstream.body as never).pipe(response);
  else response.end();
}

function parsePluginInput(body: Record<string, unknown>): Omit<PluginRecord, "updatedAt"> {
  const authValue = body.auth;
  if (!isRecord(authValue)) throw new HttpError(400, "auth is required.");
  const scopes = authValue.scopes;
  if (!Array.isArray(scopes) || scopes.some((value) => typeof value !== "string")) throw new HttpError(400, "auth.scopes is invalid.");
  return {
    slug: stringField(body, "slug"),
    name: stringField(body, "name"),
    description: stringField(body, "description"),
    category: stringField(body, "category"),
    tags: Array.isArray(body.tags) && body.tags.every((value) => typeof value === "string") ? body.tags : [],
    logoUrl: stringField(body, "logoUrl"),
    accent: stringField(body, "accent"),
    mcpServerUrl: stringField(body, "mcpServerUrl"),
    auth: {
      authorizationEndpoint: stringField(authValue, "authorizationEndpoint"),
      tokenEndpoint: stringField(authValue, "tokenEndpoint"),
      clientIdEnv: stringField(authValue, "clientIdEnv"),
      clientSecretEnv: stringField(authValue, "clientSecretEnv"),
      scopes,
    } satisfies PluginAuthConfig,
    enabled: body.enabled !== false,
  };
}

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function html(response: ServerResponse, status: number, title: string, message: string, origin?: string) {
  const payload = `<h1>${escapeHtml(title)}</h1><p>${escapeHtml(message)}</p>`;
  response.writeHead(status, { ...corsHeaders(origin), "Content-Type": "text/html; charset=utf-8" });
  response.end(payload);
}

async function route(request: IncomingMessage, response: ServerResponse) {
  const url = new URL(request.url ?? "/", `http://${request.headers.host ?? "localhost"}`);
  if (request.method === "OPTIONS") {
    response.writeHead(204, corsHeaders(request.headers.origin));
    response.end();
    return;
  }
  if (request.method === "GET" && url.pathname === "/health") {
    json(response, 200, { ok: true }, corsHeaders(request.headers.origin));
    return;
  }
  if (request.method === "GET" && url.pathname === "/mcp/catalog") {
    json(response, 200, await listPlugins(), corsHeaders(request.headers.origin));
    return;
  }
  if (request.method === "GET" && url.pathname === "/mcp/connections") {
    json(response, 200, await listConnections(await requireUser(request)), corsHeaders(request.headers.origin));
    return;
  }
  if (request.method === "POST" && url.pathname === "/mcp/catalog") {
    const userSubject = await requireUser(request);
    requireAdmin(userSubject);
    await upsertPlugin(parsePluginInput(await readJson(request)));
    json(response, 204, null, corsHeaders(request.headers.origin));
    return;
  }
  if (request.method === "POST" && url.pathname === "/mcp/oauth/start") {
    json(response, 200, await startOAuth(request), corsHeaders(request.headers.origin));
    return;
  }
  if (request.method === "GET" && url.pathname === "/mcp/oauth/callback") {
    try {
      const pluginSlug = await completeOAuth(url);
      html(response, 200, "Connected", `${pluginSlug} is now connected to Sparky. You can close this window.`, request.headers.origin);
    } catch (error) {
      html(response, error instanceof HttpError ? error.statusCode : 400, "MCP connection failed", error instanceof Error ? error.message : "OAuth failed.", request.headers.origin);
    }
    return;
  }
  if (request.method === "POST" && url.pathname === "/mcp/session") {
    json(response, 200, await createMcpSession(request), corsHeaders(request.headers.origin));
    return;
  }
  if (request.method === "POST" && url.pathname === "/mcp/connections/revoke") {
    const userSubject = await requireUser(request);
    await revokeConnection(userSubject, stringField(await readJson(request), "pluginSlug"));
    json(response, 204, null, corsHeaders(request.headers.origin));
    return;
  }
  const match = url.pathname.match(/^\/mcp\/([^/]+)$/u);
  if (match && request.method && ["GET", "POST", "DELETE"].includes(request.method)) {
    await proxyMcp(request, response, decodeURIComponent(match[1]!));
    return;
  }
  json(response, 404, { error: "Not found." }, corsHeaders(request.headers.origin));
}

class HttpError extends Error {
  constructor(readonly statusCode: number, message: string) {
    super(message);
  }
}

const server = createServer((request, response) => {
  void route(request, response).catch((error: unknown) => {
    const status = error instanceof HttpAuthError || error instanceof HttpError ? error.statusCode : 500;
    const message = status >= 500 ? "Internal MCP backend error." : error instanceof Error ? error.message : "Request failed.";
    if (!response.headersSent) json(response, status, { error: message }, corsHeaders(request.headers.origin));
    else response.end();
  });
});

server.listen(port, () => {
  console.log(`Sparky MCP backend listening on port ${port}`);
});

async function shutdown() {
  await sql.end({ timeout: 5 });
  server.close();
}

process.once("SIGINT", () => void shutdown());
process.once("SIGTERM", () => void shutdown());
