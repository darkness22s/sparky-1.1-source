# Sparky MCP backend

This is a separate Convex project for Sparky's generic MCP integrations. It keeps
MCP OAuth configuration and encrypted per-user credentials out of the desktop
client. The client receives only a short-lived MCP gateway session.

## Required Convex environment variables

Set these in the deployment, never in the desktop app:

- `MCP_SITE_URL`: the Convex HTTP actions base URL.
- `MCP_TOKEN_ENCRYPTION_KEY`: 32 random bytes encoded as base64url.
- `MCP_ADMIN_SUBJECT`: the Clerk subject allowed to manage the catalog.
- Provider-specific OAuth client IDs and secrets named by each catalog entry's
  `clientIdEnv` and `clientSecretEnv` values.

The catalog stores public metadata and remote logo URLs. OAuth client secrets and
user access/refresh tokens are never returned by catalog or connection APIs.

## Commands

```sh
pnpm install
pnpm run check
pnpm run deploy
```

`convex deployment select` and `convex deploy` update the selected deployment;
this project does not start a development server.
