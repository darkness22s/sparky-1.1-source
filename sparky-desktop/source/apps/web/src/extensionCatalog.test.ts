import { describe, expect, it } from "vite-plus/test";

import {
  buildExtensionReference,
  MOD_CATALOG,
  PLUGIN_CATALOG,
  searchCatalog,
} from "./extensionCatalog";
import { updateInstalledIds } from "./extensionLibrary";

describe("extension catalog", () => {
  it("ships a curated 20-plugin catalog with unique identifiers", () => {
    expect(PLUGIN_CATALOG).toHaveLength(20);
    expect(new Set(PLUGIN_CATALOG.map((plugin) => plugin.id)).size).toBe(20);
  });

  it("models every Mod as an MCP server plus a guiding skill", () => {
    expect(MOD_CATALOG.length).toBeGreaterThan(0);
    for (const mod of MOD_CATALOG) {
      expect(mod.mcpServer.length).toBeGreaterThan(0);
      expect(mod.skill.length).toBeGreaterThan(0);
    }
  });

  it("searches names, descriptions, and task tags case-insensitively", () => {
    expect(searchCatalog(PLUGIN_CATALOG, "PULL REQUESTS").map((plugin) => plugin.id)).toContain(
      "github",
    );
    expect(searchCatalog(PLUGIN_CATALOG, "billing").map((plugin) => plugin.id)).toContain("stripe");
  });

  it("builds a stable chat reference token", () => {
    expect(buildExtensionReference("Release Pilot", "Mod")).toBe("Use Release Pilot Mod: ");
  });
});

describe("extension install state", () => {
  it("adds ids once and removes them without disturbing the rest", () => {
    expect(updateInstalledIds(["github"], "github", true)).toEqual(["github"]);
    expect(updateInstalledIds(["github"], "linear", true)).toEqual(["github", "linear"]);
    expect(updateInstalledIds(["github", "linear"], "github", false)).toEqual(["linear"]);
  });
});
