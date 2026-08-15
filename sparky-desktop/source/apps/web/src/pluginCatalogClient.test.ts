import { describe, expect, it } from "vite-plus/test";

import { normalizeRemotePluginForTest } from "./pluginCatalogClient";

describe("remote plugin catalog", () => {
  it("normalizes Composio metadata into a categorized Sparky entry", () => {
    const plugin = normalizeRemotePluginForTest({
      slug: "example-app",
      name: "Example App",
      description: "Automate example work.",
      category: "Automation & Data",
      tags: ["automation", "example"],
      logoUrl: "https://cdn.example.test/example.svg",
      toolsCount: 12,
      sourceUpdatedAt: "2026-08-12T00:00:00Z",
    });

    expect(plugin).toMatchObject({
      id: "example-app",
      category: "Automation & Data",
      logoUrl: "https://cdn.example.test/example.svg",
      toolsCount: 12,
    });
  });

  it("does not accept non-HTTPS provider logos", () => {
    const plugin = normalizeRemotePluginForTest({
      slug: "unsafe-app",
      name: "Unsafe App",
      description: "Example.",
      category: "Productivity",
      tags: [],
      logoUrl: "javascript:alert(1)",
      toolsCount: 1,
      sourceUpdatedAt: null,
    });

    expect(plugin.logoUrl).toBeUndefined();
  });
});
