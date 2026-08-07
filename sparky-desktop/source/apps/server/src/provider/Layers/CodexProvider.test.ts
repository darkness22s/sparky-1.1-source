import { assert, it } from "@effect/vitest";

import {
  applyPreferredCodexDefaultModel,
  enrichCodexModelsWithModelsDev,
  mapCodexModelCapabilities,
} from "./CodexProvider.ts";

it("maps current Codex model capability fields", () => {
  const capabilities = mapCodexModelCapabilities({
    additionalSpeedTiers: [],
    defaultReasoningEffort: "super-high",
    description: "Test model",
    displayName: "GPT Test",
    hidden: false,
    id: "gpt-test",
    isDefault: true,
    model: "gpt-test",
    defaultServiceTier: "flex",
    serviceTiers: [
      {
        id: "priority",
        name: "Fast",
        description: "Lower latency responses.",
      },
      {
        id: "flex",
        name: "Flex",
        description: "Lower-cost asynchronous routing.",
      },
    ],
    supportedReasoningEfforts: [
      {
        description: "Maximum reasoning",
        reasoningEffort: "super-high",
      },
    ],
  });

  assert.deepStrictEqual(capabilities.optionDescriptors, [
    {
      id: "reasoningEffort",
      label: "Reasoning",
      type: "select",
      options: [{ id: "super-high", label: "super-high", isDefault: true }],
      currentValue: "super-high",
    },
    {
      id: "serviceTier",
      label: "Service Tier",
      type: "select",
      options: [
        {
          id: "priority",
          label: "Fast",
          description: "Lower latency responses.",
        },
        {
          id: "flex",
          label: "Flex",
          description: "Lower-cost asynchronous routing.",
          isDefault: true,
        },
      ],
      currentValue: "flex",
    },
  ]);
});

it("preserves the model-reported context window", () => {
  const capabilities = mapCodexModelCapabilities({
    additionalSpeedTiers: [],
    contextWindow: 1_000_000,
    defaultReasoningEffort: "medium",
    description: "Test model",
    displayName: "GPT Test",
    hidden: false,
    id: "gpt-test",
    isDefault: true,
    model: "gpt-test",
    serviceTiers: [],
    supportedReasoningEfforts: [],
  } as never);

  assert.deepStrictEqual(capabilities.optionDescriptors, [
    {
      id: "contextWindow",
      label: "Context Window",
      type: "select",
      options: [{ id: "1m", label: "1M", isDefault: true }],
      currentValue: "1m",
    },
  ]);
});

it("fills missing Codex context metadata from Models.dev without overwriting native metadata", () => {
  const native = {
    slug: "gpt-native-context",
    name: "Native context",
    isCustom: false,
    capabilities: mapCodexModelCapabilities({
      additionalSpeedTiers: [],
      contextWindow: 128_000,
      defaultReasoningEffort: "medium",
      description: "Test model",
      displayName: "GPT Native Context",
      hidden: false,
      id: "gpt-native-context",
      isDefault: false,
      model: "gpt-native-context",
      serviceTiers: [],
      supportedReasoningEfforts: [],
    } as never),
  };
  const [fallback, preserved] = enrichCodexModelsWithModelsDev(
    [
      { slug: "gpt-fallback-context", name: "Fallback context", isCustom: false, capabilities: null },
      native,
    ],
    {
      openai: {
        models: {
          "gpt-fallback-context": { limit: { context: "1m" } },
          "gpt-native-context": { context_length: "1m" },
        },
      },
    },
  );

  assert.deepStrictEqual(fallback?.capabilities?.optionDescriptors, [
    {
      id: "contextWindow",
      label: "Context Window",
      type: "select",
      options: [{ id: "1m", label: "1M", isDefault: true }],
      currentValue: "1m",
    },
  ]);
  assert.deepStrictEqual(
    preserved?.capabilities?.optionDescriptors?.find(
      (descriptor) => descriptor.id === "contextWindow",
    ),
    {
      id: "contextWindow",
      label: "Context Window",
      type: "select",
      options: [{ id: "128k", label: "128k", isDefault: true }],
      currentValue: "128k",
    },
  );
});

it("accepts billion-token context metadata from Models.dev", () => {
  const [model] = enrichCodexModelsWithModelsDev(
    [{ slug: "gpt-billion-context", name: "Billion context", isCustom: false, capabilities: null }],
    {
      openai: {
        models: {
          "gpt-billion-context": { context_length: "1b" },
        },
      },
    },
  );

  assert.deepStrictEqual(model?.capabilities?.optionDescriptors?.[0], {
    id: "contextWindow",
    label: "Context Window",
    type: "select",
    options: [{ id: "1000m", label: "1000M", isDefault: true }],
    currentValue: "1000m",
  });
});

it("does not invent a service tier when the catalog has no default", () => {
  const capabilities = mapCodexModelCapabilities({
    additionalSpeedTiers: ["fast"],
    defaultReasoningEffort: "medium",
    defaultServiceTier: null,
    description: "Test model",
    displayName: "GPT Test",
    hidden: false,
    id: "gpt-test",
    isDefault: true,
    model: "gpt-test",
    serviceTiers: [
      {
        id: "priority",
        name: "Fast",
        description: "1.5x speed, increased usage",
      },
    ],
    supportedReasoningEfforts: [],
  });

  assert.deepStrictEqual(capabilities.optionDescriptors, [
    {
      id: "serviceTier",
      label: "Service Tier",
      type: "select",
      options: [
        {
          id: "priority",
          label: "Fast",
          description: "1.5x speed, increased usage",
        },
      ],
    },
  ]);
});

it("marks the most preferred available model as default", () => {
  const models = applyPreferredCodexDefaultModel([
    { slug: "gpt-5.6-terra", name: "GPT-5.6-Terra", isCustom: false, capabilities: null },
    { slug: "gpt-5.4", name: "GPT-5.4", isCustom: false, isDefault: true, capabilities: null },
  ]);

  assert.deepStrictEqual(
    models.map((model) => ({ slug: model.slug, isDefault: model.isDefault })),
    [
      { slug: "gpt-5.6-terra", isDefault: true },
      { slug: "gpt-5.4", isDefault: undefined },
    ],
  );
});

it("prefers sol over terra when both are available", () => {
  const models = applyPreferredCodexDefaultModel([
    { slug: "gpt-5.6-terra", name: "GPT-5.6-Terra", isCustom: false, capabilities: null },
    { slug: "gpt-5.6-sol", name: "GPT-5.6-Sol", isCustom: false, capabilities: null },
  ]);

  assert.deepStrictEqual(models.find((model) => model.isDefault)?.slug, "gpt-5.6-sol");
});

it("keeps Codex's own default when no preferred model is available", () => {
  const models = applyPreferredCodexDefaultModel([
    { slug: "gpt-5.5", name: "GPT-5.5", isCustom: false, capabilities: null },
    { slug: "gpt-5.4", name: "GPT-5.4", isCustom: false, isDefault: true, capabilities: null },
  ]);

  assert.deepStrictEqual(models.find((model) => model.isDefault)?.slug, "gpt-5.4");
});

it("ignores custom models that shadow a preferred slug", () => {
  const models = applyPreferredCodexDefaultModel([
    { slug: "gpt-5.6-sol", name: "gpt-5.6-sol", isCustom: true, capabilities: null },
    { slug: "gpt-5.4", name: "GPT-5.4", isCustom: false, isDefault: true, capabilities: null },
  ]);

  assert.deepStrictEqual(models.find((model) => model.isDefault)?.slug, "gpt-5.4");
});
