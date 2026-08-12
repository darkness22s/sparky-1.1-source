ALTER TABLE mcp_oauth_states
  ADD COLUMN IF NOT EXISTS "clientId" TEXT,
  ADD COLUMN IF NOT EXISTS "encryptedClientSecret" TEXT;

ALTER TABLE mcp_connections
  ADD COLUMN IF NOT EXISTS "clientId" TEXT,
  ADD COLUMN IF NOT EXISTS "encryptedClientSecret" TEXT;
