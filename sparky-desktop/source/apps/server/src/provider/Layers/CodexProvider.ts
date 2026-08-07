// @effect-diagnostics globalFetchInEffect:off
import * as DateTime from "effect/DateTime";
import * as Duration from "effect/Duration";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Option from "effect/Option";
import * as Result from "effect/Result";
import * as Schema from "effect/Schema";
import * as Scope from "effect/Scope";
import * as Types from "effect/Types";
import * as ChildProcess from "effect/unstable/process/ChildProcess";
import * as ChildProcessSpawner from "effect/unstable/process/ChildProcessSpawner";
import * as CodexClient from "effect-codex-app-server/client";
import * as CodexSchema from "effect-codex-app-server/schema";
import * as CodexErrors from "effect-codex-app-server/errors";

import type {
  CodexSettings,
  ServerProvider,
  ServerProviderState,
  ModelCapabilities,
  ProviderOptionDescriptor,
  ServerProviderModel,
  ServerProviderSkill,
  ServerProviderSlashCommand,
} from "@sparky/contracts";
import { PREFERRED_DEFAULT_CODEX_MODELS, ServerSettingsError } from "@sparky/contracts";

import { createModelCapabilities } from "@sparky/shared/model";
import { resolveSpawnCommand } from "@sparky/shared/shell";
import {
  codexAppServerArgs,
  resolveCodexLaunchArgs,
} from "./codexLaunchArgs.ts";
import {
  AUTH_PROBE_TIMEOUT_MS,
  buildServerProvider,
  type ServerProviderDraft,
} from "../providerSnapshot.ts";
import { expandHomePath } from "../../pathExpansion.ts";
import packageJson from "../../../package.json" with { type: "json" };
const isCodexAppServerSpawnError = Schema.is(CodexErrors.CodexAppServerSpawnError);

const CODEX_APP_SERVER_PROBE_FORCE_KILL_AFTER = "2 seconds" as const;
const CODEX_MODELS_DEV_TIMEOUT_MS = 2_000;

const CODEX_PRESENTATION = {
  displayName: "Codex",
  showInteractionModeToggle: true,
} as const;

const CODEX_SLASH_COMMANDS = [
  {
    name: "compact",
    description: "Compact the current Codex context",
  },
] satisfies ReadonlyArray<ServerProviderSlashCommand>;

export interface CodexAppServerProviderSnapshot {
  readonly account: CodexSchema.V2GetAccountResponse;
  readonly version: string | undefined;
  readonly models: ReadonlyArray<ServerProviderModel>;
  readonly skills: ReadonlyArray<ServerProviderSkill>;
}

const REASONING_EFFORT_LABELS: Readonly<Record<string, string>> = {
  none: "None",
  minimal: "Minimal",
  low: "Low",
  medium: "Medium",
  high: "High",
  xhigh: "Extra High",
  max: "Max",
  ultra: "Ultra",
};

function reasoningEffortLabel(reasoningEffort: string): string {
  return REASONING_EFFORT_LABELS[reasoningEffort] ?? reasoningEffort;
}

function positiveContextWindow(value: unknown): number | undefined {
  if (typeof value === "number") {
    return Number.isSafeInteger(value) && value > 0 ? value : undefined;
  }
  if (typeof value !== "string") return undefined;

  const normalized = value.trim().toLowerCase().replaceAll(",", "");
  const match = normalized.match(/^(\d+(?:\.\d+)?)(?:\s*(tokens?|k|m|b))?$/u);
  if (!match) return undefined;
  const amount = Number(match[1]);
  if (!Number.isFinite(amount) || amount <= 0) return undefined;
  const unit = match[2] ?? "";
  const multiplier = unit === "m" ? 1_000_000 : unit === "k" ? 1_000 : unit === "b" ? 1_000_000_000 : 1;
  const tokens = amount * multiplier;
  return Number.isSafeInteger(tokens) && tokens > 0 ? tokens : undefined;
}

function contextWindowFromRecord(value: unknown): number | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const record = value as Record<string, unknown>;
  for (const key of [
    "contextWindow",
    "context_window",
    "contextLength",
    "context_length",
    "contextLengthTokens",
    "context_length_tokens",
    "context",
    "context_tokens",
    "maxInputTokens",
    "max_input_tokens",
    "inputTokenLimit",
    "input_token_limit",
  ]) {
    const tokens = positiveContextWindow(record[key]);
    if (tokens !== undefined) return tokens;
  }
  for (const key of ["limit", "limits", "capabilities", "metadata"]) {
    const tokens = contextWindowFromRecord(record[key]);
    if (tokens !== undefined) return tokens;
  }
  return undefined;
}

function contextWindowDescriptor(tokens: number): ProviderOptionDescriptor {
  const id =
    tokens % 1_000_000 === 0
      ? `${tokens / 1_000_000}m`
      : tokens % 1_000 === 0
        ? `${tokens / 1_000}k`
        : String(tokens);
  const label = id.endsWith("m") ? id.replace(/m$/u, "M") : id;
  return {
    id: "contextWindow",
    label: "Context Window",
    type: "select",
    options: [{ id, label, isDefault: true }],
    currentValue: id,
  };
}

function contextWindowOption(
  model: CodexSchema.V2ModelListResponse__Model,
): ProviderOptionDescriptor | undefined {
  const raw = model as unknown as Record<string, unknown>;
  const candidates = [
    "contextWindow",
    "context_window",
    "modelContextWindow",
    "model_context_window",
    "contextLength",
    "context_length",
    "contextLengthTokens",
    "context_length_tokens",
    "maxInputTokens",
    "max_input_tokens",
    "inputTokenLimit",
    "input_token_limit",
  ];
  let tokens: number | undefined;
  for (const key of candidates) {
    tokens = positiveContextWindow(raw[key]);
    if (tokens !== undefined) break;
  }
  if (tokens === undefined) {
    for (const key of ["limit", "limits"]) {
      const limits = raw[key];
      if (limits && typeof limits === "object" && !Array.isArray(limits)) {
        tokens = positiveContextWindow((limits as Record<string, unknown>).context);
        if (tokens !== undefined) break;
      }
    }
  }
  if (tokens === undefined) return undefined;

  return contextWindowDescriptor(tokens);
}

function modelsDevContextWindow(
  catalog: Record<string, unknown> | undefined,
  modelId: string,
): number | undefined {
  if (!catalog) return undefined;
  for (const provider of ["openai-codex", "openai"]) {
    const providerRecord = catalog[provider];
    if (!providerRecord || typeof providerRecord !== "object" || Array.isArray(providerRecord)) {
      continue;
    }
    const models = (providerRecord as Record<string, unknown>).models;
    if (!models || typeof models !== "object" || Array.isArray(models)) continue;
    const metadata = (models as Record<string, unknown>)[modelId];
    const tokens = contextWindowFromRecord(metadata);
    if (tokens !== undefined) return tokens;
  }
  return undefined;
}

export function enrichCodexModelsWithModelsDev(
  models: ReadonlyArray<ServerProviderModel>,
  catalog: Record<string, unknown> | undefined,
): ReadonlyArray<ServerProviderModel> {
  return models.map((model) => {
    const hasContextWindow =
      model.capabilities?.optionDescriptors?.some((descriptor) => descriptor.id === "contextWindow") ===
      true;
    if (hasContextWindow) return model;
    const tokens = modelsDevContextWindow(catalog, model.slug);
    if (tokens === undefined) return model;
    return {
      ...model,
      contextWindowSource: "models.dev",
      capabilities: createModelCapabilities({
        optionDescriptors: [
          ...(model.capabilities?.optionDescriptors ?? []),
          contextWindowDescriptor(tokens),
        ],
      }),
    };
  });
}

function loadCodexModelsDevCatalog(): Effect.Effect<Record<string, unknown> | undefined> {
  return Effect.tryPromise({
    try: async () => {
      const response = (await globalThis.fetch("https://models.dev/api.json", {
        signal: AbortSignal.timeout(CODEX_MODELS_DEV_TIMEOUT_MS),
      })) as unknown as { readonly ok: boolean; readonly json: () => Promise<unknown> };
      if (!response.ok) return undefined;
      const payload = await response.json();
      return payload && typeof payload === "object" && !Array.isArray(payload)
        ? (payload as Record<string, unknown>)
        : undefined;
    },
    catch: () => undefined,
  }).pipe(
    Effect.timeoutOption(Duration.millis(CODEX_MODELS_DEV_TIMEOUT_MS)),
    Effect.map(Option.getOrUndefined),
    Effect.orElseSucceed(() => undefined),
  );
}

function codexAccountAuthLabel(account: CodexSchema.V2GetAccountResponse["account"]) {
  if (!account) return undefined;
  if (account.type === "apiKey") return "OpenAI API Key";
  if (account.type === "amazonBedrock") return "Amazon Bedrock";
  if (account.type !== "chatgpt") return undefined;

  switch (account.planType) {
    case "free":
      return "ChatGPT Free Subscription";
    case "go":
      return "ChatGPT Go Subscription";
    case "plus":
      return "ChatGPT Plus Subscription";
    case "pro":
      return "ChatGPT Pro 20x Subscription";
    case "prolite":
      return "ChatGPT Pro 5x Subscription";
    case "team":
      return "ChatGPT Team Subscription";
    case "self_serve_business_usage_based":
    case "business":
      return "ChatGPT Business Subscription";
    case "enterprise_cbp_usage_based":
    case "enterprise":
      return "ChatGPT Enterprise Subscription";
    case "edu":
      return "ChatGPT Edu Subscription";
    case "unknown":
      return "ChatGPT Subscription";
    default:
      account.planType satisfies never;
      return undefined;
  }
}

function codexAccountEmail(account: CodexSchema.V2GetAccountResponse["account"]) {
  if (!account || account.type !== "chatgpt") return undefined;
  return account.email;
}

export function mapCodexModelCapabilities(
  model: CodexSchema.V2ModelListResponse__Model,
): ModelCapabilities {
  const reasoningIds = new Set<string>();
  const reasoningOptions = model.supportedReasoningEfforts.flatMap(({ reasoningEffort }) => {
    if (!reasoningEffort || reasoningIds.has(reasoningEffort)) return [];
    reasoningIds.add(reasoningEffort);
    return [
      {
        id: reasoningEffort,
        label: reasoningEffortLabel(reasoningEffort),
        ...(reasoningEffort === model.defaultReasoningEffort ? { isDefault: true } : {}),
      },
    ];
  });
  const defaultReasoning = reasoningOptions.some(
    (option) => option.id === model.defaultReasoningEffort,
  )
    ? model.defaultReasoningEffort
    : undefined;
  const serviceTiers =
    model.serviceTiers && model.serviceTiers.length > 0
      ? model.serviceTiers
      : (model.additionalSpeedTiers ?? []).map((id) => ({
          id,
          name: id,
          description: "",
        }));
  const serviceTierIds = new Set<string>();
  const defaultServiceTier = model.defaultServiceTier ?? undefined;
  const serviceTierOptions = serviceTiers.flatMap((tier) => {
    if (!tier.id || serviceTierIds.has(tier.id)) return [];
    serviceTierIds.add(tier.id);
    return [
      {
        id: tier.id,
        label: tier.name,
        ...(tier.description ? { description: tier.description } : {}),
        ...(tier.id === defaultServiceTier ? { isDefault: true } : {}),
      },
    ];
  });
  const optionDescriptors: ProviderOptionDescriptor[] = [];

  if (reasoningOptions.length > 0) {
    optionDescriptors.push({
      id: "reasoningEffort",
      label: "Reasoning",
      type: "select",
      options: reasoningOptions,
      ...(defaultReasoning ? { currentValue: defaultReasoning } : {}),
    });
  }
  if (serviceTierOptions.length > 0) {
    optionDescriptors.push({
      id: "serviceTier",
      label: "Service Tier",
      type: "select",
      options: serviceTierOptions,
      ...(defaultServiceTier && serviceTierOptions.some((option) => option.id === defaultServiceTier)
        ? { currentValue: defaultServiceTier }
        : {}),
    });
  }
  const contextWindow = contextWindowOption(model);
  if (contextWindow) optionDescriptors.push(contextWindow);

  return createModelCapabilities({
    optionDescriptors,
  });
}

const toDisplayName = (model: CodexSchema.V2ModelListResponse__Model): string => {
  // Capitalize 'gpt' to 'GPT-' and capitalize any letter following a dash
  return model.displayName
    .replace(/^gpt/i, "GPT") // Handle start with 'gpt' or 'GPT'
    .replace(/-([a-z])/g, (_, c) => "-" + c.toUpperCase());
};

function parseCodexModelListResponse(
  response: CodexSchema.V2ModelListResponse,
): ReadonlyArray<ServerProviderModel> {
  return response.data.map((model) => {
    const capabilities = mapCodexModelCapabilities(model);
    const hasContextWindow =
      capabilities.optionDescriptors?.some((descriptor) => descriptor.id === "contextWindow") ===
      true;
    return {
      slug: model.model,
      name: toDisplayName(model),
      isCustom: false,
      ...(model.isDefault ? { isDefault: true } : {}),
      ...(hasContextWindow ? { contextWindowSource: "provider" as const } : {}),
      capabilities,
    };
  });
}

/**
 * Prefer our own default-model ranking when one of the preferred slugs is in
 * the live catalog; otherwise keep whatever Codex itself flagged as default.
 */
export function applyPreferredCodexDefaultModel(
  models: ReadonlyArray<ServerProviderModel>,
): ReadonlyArray<ServerProviderModel> {
  const preferredSlug = PREFERRED_DEFAULT_CODEX_MODELS.find((slug) =>
    models.some((model) => model.slug === slug && !model.isCustom),
  );
  if (!preferredSlug) {
    return models;
  }
  return models.map((model) => {
    if (model.slug === preferredSlug) {
      return model.isDefault ? model : { ...model, isDefault: true };
    }
    if (!model.isDefault) {
      return model;
    }
    const { isDefault: _isDefault, ...rest } = model;
    return rest;
  });
}

function appendCustomCodexModels(
  models: ReadonlyArray<ServerProviderModel>,
  customModels: ReadonlyArray<string>,
): ReadonlyArray<ServerProviderModel> {
  if (customModels.length === 0) {
    return models;
  }

  const seen = new Set(models.map((model) => model.slug));
  const customEntries: ServerProviderModel[] = [];
  for (const rawModel of customModels) {
    const slug = rawModel.trim();
    if (!slug || seen.has(slug)) {
      continue;
    }
    seen.add(slug);
    customEntries.push({
      slug,
      name: slug,
      isCustom: true,
      capabilities: null,
    });
  }
  return customEntries.length === 0 ? models : [...models, ...customEntries];
}

function parseCodexSkillsListResponse(
  response: CodexSchema.V2SkillsListResponse,
  cwd: string,
): ReadonlyArray<ServerProviderSkill> {
  const matchingEntry = response.data.find((entry) => entry.cwd === cwd);
  const skills = matchingEntry
    ? matchingEntry.skills
    : response.data.flatMap((entry) => entry.skills);

  return skills.map((skill) => {
    const shortDescription =
      skill.shortDescription ?? skill.interface?.shortDescription ?? undefined;

    const parsedSkill: Types.Mutable<ServerProviderSkill> = {
      name: skill.name,
      path: skill.path,
      enabled: skill.enabled,
    };

    if (skill.description) {
      parsedSkill.description = skill.description;
    }
    if (skill.scope) {
      parsedSkill.scope = skill.scope;
    }
    if (skill.interface?.displayName) {
      parsedSkill.displayName = skill.interface.displayName;
    }
    if (shortDescription) {
      parsedSkill.shortDescription = shortDescription;
    }

    return parsedSkill;
  });
}

const requestAllCodexModels = Effect.fn("requestAllCodexModels")(function* (
  client: CodexClient.CodexAppServerClient["Service"],
) {
  const models: ServerProviderModel[] = [];
  let cursor: string | null | undefined = undefined;

  do {
    const response: CodexSchema.V2ModelListResponse = yield* client.request(
      "model/list",
      cursor ? { cursor } : {},
    );
    models.push(...parseCodexModelListResponse(response));
    cursor = response.nextCursor;
  } while (cursor);

  return models;
});

export function buildCodexInitializeParams(): CodexSchema.V1InitializeParams {
  return {
    clientInfo: {
      name: "t3code_desktop",
      title: "Sparky Desktop",
      version: packageJson.version,
    },
    capabilities: {
      experimentalApi: true,
    },
  };
}

const probeCodexAppServerProvider = Effect.fn("probeCodexAppServerProvider")(function* (input: {
  readonly binaryPath: string;
  readonly homePath?: string;
  readonly launchArgs?: string;
  readonly cwd: string;
  readonly customModels?: ReadonlyArray<string>;
  readonly environment?: NodeJS.ProcessEnv;
}) {
  // `~` is not shell-expanded when env vars are set via `child_process.spawn`,
  // so `CODEX_HOME=~/.codex_work` would reach codex verbatim and trip
  // "CODEX_HOME points to '~/.codex_work', but that path does not exist".
  // Expand here for parity with `CodexTextGeneration`/`CodexSessionRuntime`.
  const resolvedHomePath = input.homePath ? expandHomePath(input.homePath) : undefined;
  const spawner = yield* ChildProcessSpawner.ChildProcessSpawner;
  const environment = {
    ...input.environment,
    ...(resolvedHomePath ? { CODEX_HOME: resolvedHomePath } : {}),
  };
  const spawnCommand = yield* resolveSpawnCommand(
    input.binaryPath,
    codexAppServerArgs(input.launchArgs),
    {
      env: environment,
      extendEnv: true,
    },
  );
  const child = yield* spawner
    .spawn(
      ChildProcess.make(spawnCommand.command, spawnCommand.args, {
        cwd: input.cwd,
        env: environment,
        extendEnv: true,
        forceKillAfter: CODEX_APP_SERVER_PROBE_FORCE_KILL_AFTER,
        shell: spawnCommand.shell,
      }),
    )
    .pipe(
      Effect.mapError(
        (cause) =>
          new CodexErrors.CodexAppServerSpawnError({
            command: `${input.binaryPath} app-server`,
            cause,
          }),
      ),
    );
  const clientContext = yield* Layer.build(CodexClient.layerChildProcess(child));
  const client = yield* Effect.service(CodexClient.CodexAppServerClient).pipe(
    Effect.provide(clientContext),
  );

  const initialize = yield* client.request("initialize", {
    clientInfo: {
      name: "t3code_desktop",
      title: "Sparky Desktop",
      version: "0.1.0",
    },
    capabilities: {
      experimentalApi: true,
    },
  });
  yield* client.notify("initialized", undefined);

  // Extract the version string after the first '/' in userAgent, up to the next space or the end
  const versionMatch = initialize.userAgent.match(/\/([^\s]+)/);
  const version = versionMatch ? versionMatch[1] : undefined;

  const accountResponse = yield* client.request("account/read", {});
  if (!accountResponse.account && accountResponse.requiresOpenaiAuth) {
    return {
      account: accountResponse,
      version,
      models: appendCustomCodexModels([], input.customModels ?? []),
      skills: [],
    } satisfies CodexAppServerProviderSnapshot;
  }

  const [skillsResponse, models] = yield* Effect.all(
    [
      client.request("skills/list", {
        cwds: [input.cwd],
      }),
      requestAllCodexModels(client),
    ],
    { concurrency: "unbounded" },
  );

  const modelsDevCatalog = models.some(
    (model) =>
      model.capabilities?.optionDescriptors?.some((descriptor) => descriptor.id === "contextWindow") !==
        true,
  )
    ? yield* loadCodexModelsDevCatalog()
    : undefined;

  return {
    account: accountResponse,
    version,
    models: applyPreferredCodexDefaultModel(
      appendCustomCodexModels(
        enrichCodexModelsWithModelsDev(models, modelsDevCatalog),
        input.customModels ?? [],
      ),
    ),
    skills: parseCodexSkillsListResponse(skillsResponse, input.cwd),
  } satisfies CodexAppServerProviderSnapshot;
});

const emptyCodexModelsFromSettings = (codexSettings: CodexSettings): ServerProvider["models"] => {
  const models = new Set<string>();
  for (const model of codexSettings.customModels) {
    const trimmed = model.trim();
    if (trimmed.length > 0) {
      models.add(trimmed);
    }
  }
  return Array.from(models, (model) => ({
    slug: model,
    name: model,
    isCustom: true,
    capabilities: null,
  }));
};

const makePendingCodexProvider = (
  codexSettings: CodexSettings,
): Effect.Effect<ServerProviderDraft> =>
  Effect.gen(function* () {
    const checkedAt = yield* Effect.map(DateTime.now, DateTime.formatIso);
    const models = emptyCodexModelsFromSettings(codexSettings);

    if (!codexSettings.enabled) {
      return buildServerProvider({
        presentation: CODEX_PRESENTATION,
        enabled: false,
        checkedAt,
        models,
        skills: [],
        probe: {
          installed: false,
          version: null,
          status: "warning",
          auth: { status: "unknown" },
          message: "Codex is disabled in Sparky settings.",
        },
      });
    }

    return buildServerProvider({
      presentation: CODEX_PRESENTATION,
      enabled: true,
      checkedAt,
      models,
      slashCommands: CODEX_SLASH_COMMANDS,
      skills: [],
      probe: {
        installed: false,
        version: null,
        status: "warning",
        auth: { status: "unknown" },
        message: "Codex provider status has not been checked in this session yet.",
      },
    });
  });

function accountProbeStatus(account: CodexAppServerProviderSnapshot["account"]): {
  readonly status: Exclude<ServerProviderState, "disabled">;
  readonly auth: ServerProvider["auth"];
  readonly message?: string;
} {
  const authLabel = codexAccountAuthLabel(account.account);
  const authEmail = codexAccountEmail(account.account);
  const auth = {
    status: account.account ? ("authenticated" as const) : ("unknown" as const),
    ...(account.account?.type ? { type: account.account?.type } : {}),
    ...(authLabel ? { label: authLabel } : {}),
    ...(authEmail ? { email: authEmail } : {}),
  } satisfies ServerProvider["auth"];

  if (account.account) {
    return { status: "ready", auth };
  }

  if (account.requiresOpenaiAuth) {
    return {
      status: "error",
      auth: { status: "unauthenticated" },
      message: "Codex CLI is not authenticated. Run `codex login` and try again.",
    };
  }

  return { status: "ready", auth };
}

export const checkCodexProviderStatus = Effect.fn("checkCodexProviderStatus")(function* (
  codexSettings: CodexSettings,
  probe: (input: {
    readonly binaryPath: string;
    readonly homePath?: string;
    readonly launchArgs?: string;
    readonly cwd: string;
    readonly customModels: ReadonlyArray<string>;
    readonly environment?: NodeJS.ProcessEnv;
  }) => Effect.Effect<
    CodexAppServerProviderSnapshot,
    CodexErrors.CodexAppServerError,
    ChildProcessSpawner.ChildProcessSpawner | Scope.Scope
  > = probeCodexAppServerProvider,
  environment?: NodeJS.ProcessEnv,
): Effect.fn.Return<
  ServerProviderDraft,
  ServerSettingsError,
  ChildProcessSpawner.ChildProcessSpawner
> {
  const resolvedEnvironment = environment ?? process.env;
  const checkedAt = DateTime.formatIso(yield* DateTime.now);
  const emptyModels = emptyCodexModelsFromSettings(codexSettings);

  if (!codexSettings.enabled) {
    return buildServerProvider({
      presentation: CODEX_PRESENTATION,
      enabled: false,
      checkedAt,
      models: emptyModels,
      skills: [],
      probe: {
        installed: false,
        version: null,
        status: "warning",
        auth: { status: "unknown" },
        message: "Codex is disabled in Sparky settings.",
      },
    });
  }

  const probeResult = yield* probe({
    binaryPath: codexSettings.binaryPath,
    homePath: codexSettings.homePath,
    launchArgs: resolveCodexLaunchArgs(codexSettings.launchArgs, resolvedEnvironment),
    cwd: process.cwd(),
    customModels: codexSettings.customModels,
    environment: resolvedEnvironment,
  }).pipe(
    Effect.scoped,
    Effect.timeoutOption(Duration.millis(AUTH_PROBE_TIMEOUT_MS)),
    Effect.result,
  );

  if (Result.isFailure(probeResult)) {
    const error = probeResult.failure;
    const installed = !isCodexAppServerSpawnError(error);
    return buildServerProvider({
      presentation: CODEX_PRESENTATION,
      enabled: codexSettings.enabled,
      checkedAt,
      models: emptyModels,
      skills: [],
      probe: {
        installed,
        version: null,
        status: "error",
        auth: { status: "unknown" },
        message: installed
          ? `Codex app-server provider probe failed: ${error.message}.`
          : "Codex CLI (`codex`) is not installed or not on PATH.",
      },
    });
  }

  if (Option.isNone(probeResult.success)) {
    return buildServerProvider({
      presentation: CODEX_PRESENTATION,
      enabled: codexSettings.enabled,
      checkedAt,
      models: emptyModels,
      skills: [],
      probe: {
        installed: true,
        version: null,
        status: "error",
        auth: { status: "unknown" },
        message: "Timed out while checking Codex app-server provider status.",
      },
    });
  }

  const snapshot = probeResult.success.value;
  const accountStatus = accountProbeStatus(snapshot.account);

  return buildServerProvider({
    presentation: CODEX_PRESENTATION,
    enabled: codexSettings.enabled,
    checkedAt,
    models: snapshot.models,
    slashCommands: CODEX_SLASH_COMMANDS,
    skills: snapshot.skills,
    probe: {
      installed: true,
      version: snapshot.version ?? null,
      status: accountStatus.status,
      auth: accountStatus.auth,
      ...(accountStatus.message ? { message: accountStatus.message } : {}),
    },
  });
});

// NOTE: the singleton `CodexProviderLive` Layer has been removed as part of
// the per-instance-driver refactor. `CodexDriver.create()` builds a managed
// snapshot per instance (each with its own `CodexSettings`) and hands the
// resulting `ServerProviderShape` back as `ProviderInstance.snapshot`.
//
// The `makePendingCodexProvider` and `checkCodexProviderStatus` helpers are
// re-exported for use by `CodexDriver`.
export { makePendingCodexProvider };
