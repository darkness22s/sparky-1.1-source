import { v } from "convex/values";
import {
  action,
  internalMutation,
  internalQuery,
  mutation,
  query,
  type ActionCtx,
  type MutationCtx,
  type QueryCtx,
} from "./_generated/server";
import { internal } from "./_generated/api";

const oauthStateLifetimeMs = 10 * 60 * 1000;
const mcpSessionLifetimeMs = 15 * 60 * 1000;

const pluginArgs = {
  slug: v.string(),
  name: v.string(),
  description: v.string(),
  category: v.string(),
  tags: v.array(v.string()),
  logoUrl: v.string(),
  accent: v.string(),
  mcpServerUrl: v.string(),
  auth: v.object({
    authorizationEndpoint: v.string(),
    tokenEndpoint: v.string(),
    clientIdEnv: v.string(),
    clientSecretEnv: v.string(),
    scopes: v.array(v.string()),
  }),
  enabled: v.boolean(),
};

function base64UrlEncode(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function base64UrlDecode(value: string): Uint8Array {
  const padded = value.replaceAll("-", "+").replaceAll("_", "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  return Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
}

function randomToken(): string {
  return base64UrlEncode(crypto.getRandomValues(new Uint8Array(32)));
}

async function sha256(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return base64UrlEncode(new Uint8Array(digest));
}

async function encryptionKey(): Promise<CryptoKey> {
  const encoded = process.env.MCP_TOKEN_ENCRYPTION_KEY;
  if (!encoded) throw new Error("MCP_TOKEN_ENCRYPTION_KEY is not configured.");
  const bytes = base64UrlDecode(encoded);
  if (bytes.byteLength !== 32) throw new Error("MCP_TOKEN_ENCRYPTION_KEY must decode to 32 bytes.");
  const raw = new Uint8Array(bytes.byteLength);
  raw.set(bytes);
  return crypto.subtle.importKey("raw", raw.buffer, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
}

async function encryptSecret(value: string): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv.buffer as ArrayBuffer },
    await encryptionKey(),
    new TextEncoder().encode(value),
  );
  return `${base64UrlEncode(iv)}.${base64UrlEncode(new Uint8Array(encrypted))}`;
}

async function decryptSecret(value: string): Promise<string> {
  const [encodedIv, encodedCiphertext] = value.split(".");
  if (!encodedIv || !encodedCiphertext) throw new Error("Invalid encrypted MCP credential.");
  const iv = base64UrlDecode(encodedIv);
  const ciphertext = base64UrlDecode(encodedCiphertext);
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv.buffer as ArrayBuffer },
    await encryptionKey(),
    ciphertext.buffer as ArrayBuffer,
  );
  return new TextDecoder().decode(decrypted);
}

async function subject(ctx: Pick<QueryCtx, "auth"> | Pick<MutationCtx, "auth"> | Pick<ActionCtx, "auth">) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity?.subject) throw new Error("Authentication is required.");
  return identity.subject;
}

export const list = query({
  args: {},
  handler: async (ctx) =>
    (await ctx.db.query("mcpCatalog").collect())
      .filter((plugin) => plugin.enabled)
      .map(({ auth: _auth, ...plugin }) => plugin),
});

export const listConnections = query({
  args: {},
  handler: async (ctx) => {
    const userSubject = await subject(ctx);
    return ctx.db
      .query("mcpConnections")
      .withIndex("by_user_and_plugin", (query) => query.eq("userSubject", userSubject))
      .collect()
      .then((connections) =>
        connections.map((connection) => ({
          pluginSlug: connection.pluginSlug,
          status: connection.status,
          expiresAt: connection.expiresAt ?? null,
          updatedAt: connection.updatedAt,
        })),
      );
  },
});

export const upsertCatalogEntry = mutation({
  args: pluginArgs,
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity?.subject || identity.subject !== process.env.MCP_ADMIN_SUBJECT) {
      throw new Error("MCP catalog administration is required.");
    }
    const existing = await ctx.db
      .query("mcpCatalog")
      .withIndex("by_slug", (query) => query.eq("slug", args.slug))
      .unique();
    const data = { ...args, updatedAt: Date.now() };
    if (existing) {
      await ctx.db.patch(existing._id, data);
      return existing._id;
    }
    return ctx.db.insert("mcpCatalog", data);
  },
});

export const revoke = mutation({
  args: { pluginSlug: v.string() },
  handler: async (ctx, args) => {
    const userSubject = await subject(ctx);
    const connection = await ctx.db
      .query("mcpConnections")
      .withIndex("by_user_and_plugin", (query) =>
        query.eq("userSubject", userSubject).eq("pluginSlug", args.pluginSlug),
      )
      .unique();
    if (!connection) return;
    await ctx.db.patch(connection._id, { status: "revoked", updatedAt: Date.now() });
  },
});

export const getPlugin = internalQuery({
  args: { slug: v.string() },
  handler: (ctx, args) =>
    ctx.db
      .query("mcpCatalog")
      .withIndex("by_slug", (query) => query.eq("slug", args.slug))
      .unique(),
});

export const getConnection = internalQuery({
  args: { userSubject: v.string(), pluginSlug: v.string() },
  handler: (ctx, args) =>
    ctx.db
      .query("mcpConnections")
      .withIndex("by_user_and_plugin", (query) =>
        query.eq("userSubject", args.userSubject).eq("pluginSlug", args.pluginSlug),
      )
      .unique(),
});

export const getOauthState = internalQuery({
  args: { state: v.string() },
  handler: (ctx, args) =>
    ctx.db
      .query("mcpOauthStates")
      .withIndex("by_state", (query) => query.eq("state", args.state))
      .unique(),
});

export const createOauthState = internalMutation({
  args: {
    state: v.string(),
    userSubject: v.string(),
    pluginSlug: v.string(),
    codeVerifier: v.string(),
    expiresAt: v.number(),
  },
  handler: (ctx, args) => ctx.db.insert("mcpOauthStates", args),
});

export const saveConnection = internalMutation({
  args: {
    userSubject: v.string(),
    pluginSlug: v.string(),
    encryptedAccessToken: v.string(),
    encryptedRefreshToken: v.optional(v.string()),
    tokenType: v.string(),
    expiresAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("mcpConnections")
      .withIndex("by_user_and_plugin", (query) =>
        query.eq("userSubject", args.userSubject).eq("pluginSlug", args.pluginSlug),
      )
      .unique();
    const now = Date.now();
    const data = { ...args, status: "connected" as const, updatedAt: now };
    if (existing) {
      await ctx.db.patch(existing._id, data);
      return;
    }
    await ctx.db.insert("mcpConnections", { ...data, createdAt: now });
  },
});

export const deleteOauthState = internalMutation({
  args: { id: v.id("mcpOauthStates") },
  handler: (ctx, args) => ctx.db.delete(args.id),
});

export const saveSession = internalMutation({
  args: {
    tokenHash: v.string(),
    userSubject: v.string(),
    pluginSlug: v.string(),
    mcpServerUrl: v.string(),
    encryptedAccessToken: v.string(),
    expiresAt: v.number(),
  },
  handler: (ctx, args) => ctx.db.insert("mcpSessions", { ...args, createdAt: Date.now() }),
});

export const getSession = internalQuery({
  args: { tokenHash: v.string() },
  handler: (ctx, args) =>
    ctx.db
      .query("mcpSessions")
      .withIndex("by_token_hash", (query) => query.eq("tokenHash", args.tokenHash))
      .unique(),
});

type OAuthStartResult = { readonly authorizationUrl: string };
type OAuthCompleteResult = { readonly pluginSlug: string };

const startOAuthHandler = async (
  ctx: ActionCtx,
  args: { readonly pluginSlug: string },
): Promise<OAuthStartResult> => {
  const userSubject = await subject(ctx);
  const plugin = await ctx.runQuery(internal.mcp.getPlugin, { slug: args.pluginSlug });
  if (!plugin?.enabled) throw new Error("MCP plugin is unavailable.");
  const siteUrl = process.env.MCP_SITE_URL;
  const clientId = process.env[plugin.auth.clientIdEnv];
  if (!siteUrl || !clientId) throw new Error("MCP OAuth is not configured for this plugin.");

  const codeVerifier = randomToken();
  const codeChallenge = await sha256(codeVerifier);
  const state = randomToken();
  await ctx.runMutation(internal.mcp.createOauthState, {
    state,
    userSubject,
    pluginSlug: args.pluginSlug,
    codeVerifier,
    expiresAt: Date.now() + oauthStateLifetimeMs,
  });

  const callback = `${siteUrl.replace(/\/$/u, "")}/mcp/oauth/callback`;
  const authorizationUrl = new URL(plugin.auth.authorizationEndpoint);
  authorizationUrl.searchParams.set("client_id", clientId);
  authorizationUrl.searchParams.set("redirect_uri", callback);
  authorizationUrl.searchParams.set("response_type", "code");
  authorizationUrl.searchParams.set("state", state);
  authorizationUrl.searchParams.set("code_challenge", codeChallenge);
  authorizationUrl.searchParams.set("code_challenge_method", "S256");
  if (plugin.auth.scopes.length > 0) authorizationUrl.searchParams.set("scope", plugin.auth.scopes.join(" "));
  return { authorizationUrl: authorizationUrl.toString() };
};

export const startOAuth = action({
  args: { pluginSlug: v.string() },
  handler: startOAuthHandler,
});

const completeOAuthHandler = async (
  ctx: ActionCtx,
  args: { readonly code: string; readonly state: string },
): Promise<OAuthCompleteResult> => {
  const oauthState = await ctx.runQuery(internal.mcp.getOauthState, { state: args.state });
  if (!oauthState || oauthState.expiresAt < Date.now()) throw new Error("OAuth state is invalid or expired.");
  const plugin = await ctx.runQuery(internal.mcp.getPlugin, { slug: oauthState.pluginSlug });
  if (!plugin) throw new Error("MCP plugin is unavailable.");
  const clientId = process.env[plugin.auth.clientIdEnv];
  const clientSecret = process.env[plugin.auth.clientSecretEnv];
  const siteUrl = process.env.MCP_SITE_URL;
  if (!clientId || !clientSecret || !siteUrl) throw new Error("MCP OAuth is not configured for this plugin.");

  const response = await fetch(plugin.auth.tokenEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: args.code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: `${siteUrl.replace(/\/$/u, "")}/mcp/oauth/callback`,
      code_verifier: oauthState.codeVerifier,
    }),
  });
  if (!response.ok) throw new Error(`MCP OAuth token exchange failed (${response.status}).`);
  const token = (await response.json()) as Record<string, unknown>;
  if (typeof token.access_token !== "string") throw new Error("MCP OAuth response did not contain an access token.");
  await ctx.runMutation(internal.mcp.saveConnection, {
    userSubject: oauthState.userSubject,
    pluginSlug: oauthState.pluginSlug,
    encryptedAccessToken: await encryptSecret(token.access_token),
    ...(typeof token.refresh_token === "string"
      ? { encryptedRefreshToken: await encryptSecret(token.refresh_token) }
      : {}),
    tokenType: typeof token.token_type === "string" ? token.token_type : "Bearer",
    ...(typeof token.expires_in === "number" ? { expiresAt: Date.now() + token.expires_in * 1000 } : {}),
  });
  await ctx.runMutation(internal.mcp.deleteOauthState, { id: oauthState._id });
  return { pluginSlug: oauthState.pluginSlug };
};

export const completeOAuth = action({
  args: { code: v.string(), state: v.string() },
  handler: completeOAuthHandler,
});

export const createSession = action({
  args: { pluginSlug: v.string() },
  handler: async (ctx, args) => {
    const userSubject = await subject(ctx);
    const [plugin, connection] = await Promise.all([
      ctx.runQuery(internal.mcp.getPlugin, { slug: args.pluginSlug }),
      ctx.runQuery(internal.mcp.getConnection, { userSubject, pluginSlug: args.pluginSlug }),
    ]);
    if (!plugin?.enabled || !connection || connection.status !== "connected") {
      throw new Error("Connect this MCP plugin before using it.");
    }
    const token = randomToken();
    await ctx.runMutation(internal.mcp.saveSession, {
      tokenHash: await sha256(token),
      userSubject,
      pluginSlug: args.pluginSlug,
      mcpServerUrl: plugin.mcpServerUrl,
      encryptedAccessToken: connection.encryptedAccessToken,
      expiresAt: Date.now() + mcpSessionLifetimeMs,
    });
    return {
      token,
      endpointPath: `/mcp/${encodeURIComponent(args.pluginSlug)}`,
      expiresAt: Date.now() + mcpSessionLifetimeMs,
    };
  },
});

export { decryptSecret };
