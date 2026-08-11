import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const authConfig = v.object({
  authorizationEndpoint: v.string(),
  tokenEndpoint: v.string(),
  clientIdEnv: v.string(),
  clientSecretEnv: v.string(),
  scopes: v.array(v.string()),
});

export default defineSchema({
  mcpCatalog: defineTable({
    slug: v.string(),
    name: v.string(),
    description: v.string(),
    category: v.string(),
    tags: v.array(v.string()),
    logoUrl: v.string(),
    accent: v.string(),
    mcpServerUrl: v.string(),
    auth: authConfig,
    enabled: v.boolean(),
    updatedAt: v.number(),
  }).index("by_slug", ["slug"]),

  mcpConnections: defineTable({
    userSubject: v.string(),
    pluginSlug: v.string(),
    status: v.union(v.literal("connected"), v.literal("revoked")),
    encryptedAccessToken: v.string(),
    encryptedRefreshToken: v.optional(v.string()),
    tokenType: v.string(),
    expiresAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user_and_plugin", ["userSubject", "pluginSlug"]),

  mcpOauthStates: defineTable({
    state: v.string(),
    userSubject: v.string(),
    pluginSlug: v.string(),
    codeVerifier: v.string(),
    expiresAt: v.number(),
  }).index("by_state", ["state"]),

  mcpSessions: defineTable({
    tokenHash: v.string(),
    userSubject: v.string(),
    pluginSlug: v.string(),
    mcpServerUrl: v.string(),
    encryptedAccessToken: v.string(),
    expiresAt: v.number(),
    createdAt: v.number(),
  })
    .index("by_token_hash", ["tokenHash"])
    .index("by_expiry", ["expiresAt"]),
});
