const COMPOSIO_MCP_URL_ENV = "COMPOSIO_MCP_URL";
const COMPOSIO_MCP_API_KEY_ENV = "COMPOSIO_MCP_API_KEY";
const COMPOSIO_MCP_USER_ID_ENV = "COMPOSIO_MCP_USER_ID";

export interface ComposioMcpConfig {
  readonly endpoint: string;
  readonly apiKey: string;
}

/**
 * Resolve the configured Composio MCP server without persisting credentials.
 * The API key is intentionally kept out of URLs and returned only for the
 * provider launch path that must attach it to the MCP request.
 */
export function readComposioMcpConfig(
  environment: NodeJS.ProcessEnv = process.env,
): ComposioMcpConfig | undefined {
  const apiKey = environment[COMPOSIO_MCP_API_KEY_ENV]?.trim();
  const configuredUrl = environment[COMPOSIO_MCP_URL_ENV]?.trim();
  if (!apiKey || !configuredUrl) return undefined;

  const endpoint = new URL(configuredUrl);
  if (!endpoint.searchParams.has("user_id")) {
    endpoint.searchParams.set(
      "user_id",
      environment[COMPOSIO_MCP_USER_ID_ENV]?.trim() || "sparky",
    );
  }

  return { endpoint: endpoint.toString(), apiKey };
}

export function composioAuthorizationHeader(config: ComposioMcpConfig): string {
  return `Bearer ${config.apiKey}`;
}

export function composioHeaders(config: ComposioMcpConfig): Record<string, string> {
  return { "x-api-key": config.apiKey };
}
