import * as Effect from "effect/Effect";

import { managedRelaySessionAtom } from "@sparky/client-runtime/relay";

import { appAtomRegistry } from "./rpc/atomRegistry";

const defaultMcpServiceUrl = "https://sparky-mcp-service.vercel.app";

export interface McpConnection {
  readonly pluginSlug: string;
  readonly status: "connected" | "revoked";
  readonly expiresAt: string | null;
  readonly updatedAt: string;
}

function serviceUrl(): string {
  return (import.meta.env.VITE_MCP_SERVICE_URL?.trim() || defaultMcpServiceUrl).replace(/\/$/u, "");
}

async function readClerkToken(): Promise<string> {
  const session = appAtomRegistry.get(managedRelaySessionAtom);
  if (session === null) throw new Error("Sign in to Sparky Cloud before connecting a plugin.");
  const token = await Effect.runPromise(session.readClerkToken());
  if (!token) throw new Error("The Sparky Cloud session token is unavailable.");
  return token;
}

async function authenticatedRequest(path: string, init?: RequestInit): Promise<Response> {
  const token = await readClerkToken();
  const headers = new Headers(init?.headers);
  headers.set("Authorization", `Bearer ${token}`);
  if (init?.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  return fetch(`${serviceUrl()}${path}`, { ...init, headers });
}

async function readJson<T>(response: Response): Promise<T> {
  const body = (await response.json()) as { error?: string } & T;
  if (!response.ok) throw new Error(body.error || `MCP service request failed (${response.status}).`);
  return body as T;
}

export async function listMcpConnections(): Promise<ReadonlyArray<McpConnection>> {
  return readJson<ReadonlyArray<McpConnection>>(await authenticatedRequest("/mcp/connections"));
}

export async function startMcpOAuth(pluginSlug: string): Promise<string> {
  const response = await authenticatedRequest("/mcp/oauth/start", {
    method: "POST",
    body: JSON.stringify({ pluginSlug }),
  });
  const result = await readJson<{ authorizationUrl: string }>(response);
  return result.authorizationUrl;
}
