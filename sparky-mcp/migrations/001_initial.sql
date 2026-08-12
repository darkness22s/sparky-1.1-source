CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS mcp_catalog (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  "logoUrl" TEXT NOT NULL,
  accent TEXT NOT NULL,
  "mcpServerUrl" TEXT NOT NULL,
  auth JSONB NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mcp_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userSubject" TEXT NOT NULL,
  "pluginSlug" TEXT NOT NULL REFERENCES mcp_catalog(slug) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('connected', 'revoked')),
  "encryptedAccessToken" TEXT NOT NULL,
  "encryptedRefreshToken" TEXT,
  "clientId" TEXT,
  "encryptedClientSecret" TEXT,
  "tokenType" TEXT NOT NULL DEFAULT 'Bearer',
  "expiresAt" TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE ("userSubject", "pluginSlug")
);

CREATE TABLE IF NOT EXISTS mcp_oauth_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state TEXT NOT NULL UNIQUE,
  "userSubject" TEXT NOT NULL,
  "pluginSlug" TEXT NOT NULL REFERENCES mcp_catalog(slug) ON DELETE CASCADE,
  "codeVerifier" TEXT NOT NULL,
  "clientId" TEXT,
  "encryptedClientSecret" TEXT,
  "expiresAt" TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS mcp_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tokenHash" TEXT NOT NULL UNIQUE,
  "userSubject" TEXT NOT NULL,
  "pluginSlug" TEXT NOT NULL REFERENCES mcp_catalog(slug) ON DELETE CASCADE,
  "mcpServerUrl" TEXT NOT NULL,
  "encryptedAccessToken" TEXT NOT NULL,
  "expiresAt" TIMESTAMPTZ NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS mcp_connections_user_idx ON mcp_connections ("userSubject");
CREATE INDEX IF NOT EXISTS mcp_sessions_expiry_idx ON mcp_sessions ("expiresAt");
