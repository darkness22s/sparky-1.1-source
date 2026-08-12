import { describe, expect, it } from "vite-plus/test";

import {
  composioAuthorizationHeader,
  composioHeaders,
  readComposioMcpConfig,
} from "./ComposioMcp.js";

describe("Composio MCP configuration", () => {
  it("requires both the endpoint and runtime key", () => {
    expect(readComposioMcpConfig({ COMPOSIO_MCP_URL: "https://example.test/mcp" })).toBeUndefined();
    expect(readComposioMcpConfig({ COMPOSIO_MCP_API_KEY: "ak_test" })).toBeUndefined();
  });

  it("adds the stable Composio user id to the server endpoint", () => {
    const config = readComposioMcpConfig({
      COMPOSIO_MCP_URL: "https://example.test/mcp",
      COMPOSIO_MCP_API_KEY: "ak_test",
      COMPOSIO_MCP_USER_ID: "sparky-test",
    });

    expect(config?.endpoint).toBe("https://example.test/mcp?user_id=sparky-test");
    expect(composioAuthorizationHeader(config!)).toBe("Bearer ak_test");
    expect(composioHeaders(config!)).toEqual({ "x-api-key": "ak_test" });
  });
});
