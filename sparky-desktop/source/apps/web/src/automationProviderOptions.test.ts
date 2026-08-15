import {
  DEFAULT_UNIFIED_SETTINGS,
  ProviderDriverKind,
  ProviderInstanceId,
  type ServerProvider,
} from "@sparky/contracts";
import { describe, expect, it } from "vite-plus/test";

import { deriveAutomationProviderOptions } from "./automationProviderOptions";
import { deriveProviderInstanceEntries } from "./providerInstances";

const provider = {
  instanceId: ProviderInstanceId.make("sparky"),
  driver: ProviderDriverKind.make("sparky"),
  displayName: "Sparky",
  enabled: true,
  installed: true,
  version: null,
  status: "ready",
  auth: { status: "authenticated" },
  checkedAt: "2026-01-01T00:00:00.000Z",
  models: [
    {
      slug: "openai-codex/gpt-5.5",
      name: "gpt-5.5",
      subProvider: "OpenAI Codex",
      isCustom: false,
      isDefault: true,
      capabilities: null,
    },
    {
      slug: "anthropic/claude-sonnet",
      name: "Claude Sonnet",
      subProvider: "Claude",
      isCustom: false,
      capabilities: null,
    },
  ],
  slashCommands: [],
  skills: [],
} satisfies ServerProvider;

describe("deriveAutomationProviderOptions", () => {
  it("exposes aggregated provider catalogs instead of the Sparky runtime label", () => {
    const entry = deriveProviderInstanceEntries([provider])[0];
    if (!entry) throw new Error("expected a provider entry");
    const options = deriveAutomationProviderOptions([entry], DEFAULT_UNIFIED_SETTINGS);

    expect(options.map((option) => option.displayName)).toEqual(["OpenAI Codex", "Claude"]);
    expect(options.map((option) => option.modelOptions[0]?.slug)).toEqual([
      "openai-codex/gpt-5.5",
      "anthropic/claude-sonnet",
    ]);
    expect(options.every((option) => option.instanceId === ProviderInstanceId.make("sparky"))).toBe(
      true,
    );
  });
});
