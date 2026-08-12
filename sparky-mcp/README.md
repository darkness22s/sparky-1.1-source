# Sparky MCP backend

Standalone Node service for Sparky's generic MCP integrations. Neon Postgres stores
catalog metadata, OAuth state, encrypted per-user credentials, and short-lived MCP
sessions. The desktop client never receives provider client secrets or long-lived
provider tokens.

## Environment

Set these in the backend host's secret manager, never in Sparky Desktop:

- `DATABASE_URL`: Neon Postgres connection string. Keep it out of source control.
- `MCP_SITE_URL`: public base URL for this service; OAuth callbacks use
  `${MCP_SITE_URL}/mcp/oauth/callback`.
- `MCP_TOKEN_ENCRYPTION_KEY`: 32 random bytes encoded as base64url.
- `MCP_ADMIN_SUBJECT`: Clerk `sub` claim allowed to manage the catalog.
- `CLERK_ISSUER`: Clerk issuer URL used to validate desktop bearer tokens.
- `CLERK_AUDIENCE`: optional Clerk JWT audience.
- Provider-specific OAuth client IDs and secrets named by each catalog entry's
  `clientIdEnv` and `clientSecretEnv` values.

Set `MCP_ALLOWED_ORIGINS` to the exact Sparky web/desktop origins in production.
The default `*` is intended only for controlled development.

## Database setup

Run `migrations/001_initial.sql` and then `migrations/002_oauth_client_state.sql`
against the Neon database once. The migrations create catalog, connection, OAuth
state, and session tables. Do not commit a real `.env.local` or connection string.

Seed the supported remote MCP catalog after the migrations:

```sh
pnpm run seed:catalog
```

Providers that publish OAuth metadata are registered through dynamic client
registration when the provider allows it. Providers that require a pre-registered
OAuth application read their client ID and secret from the provider-specific
environment variables in `.env.example`.

## Commands

```sh
pnpm install
pnpm run check
pnpm run build
pnpm start
```

Deploy the resulting Node service to the backend host of your choice. Configure the
same environment variables and run the SQL migration before accepting user OAuth
connections. The `/mcp/catalog` `POST` endpoint is restricted to
`MCP_ADMIN_SUBJECT`; users access `GET /mcp/catalog`, OAuth, connections, sessions,
and the short-lived `/mcp/:pluginSlug` proxy with Clerk bearer tokens.
