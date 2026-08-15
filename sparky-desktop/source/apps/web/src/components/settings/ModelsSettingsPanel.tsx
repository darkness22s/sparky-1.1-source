import { useEffect, useMemo, useState, type ComponentType, type SVGProps } from "react";
import {
  CheckCircle2Icon,
  KeyRoundIcon,
  LoaderCircleIcon,
  SaveIcon,
  Trash2Icon,
} from "lucide-react";
import {
  ProviderDriverKind,
  ProviderInstanceId,
  type ProviderInstanceConfig,
} from "@sparky/contracts";
import {
  isAtomCommandInterrupted,
  squashAtomCommandFailure,
} from "@sparky/client-runtime/state/runtime";

import { usePrimarySettings, useUpdatePrimarySettings } from "../../hooks/useSettings";
import { fetchPrimaryEnvironment } from "../../environments/primary/httpLayer";
import { resolvePrimaryEnvironmentHttpUrl } from "../../environments/primary/target";
import { usePrimaryEnvironment } from "../../state/environments";
import { serverEnvironment } from "../../state/server";
import { useAtomCommand } from "../../state/use-atom-command";
import { ClaudeAI, Gemini, OpenAI, OpenCodeIcon } from "../Icons";
import { Button } from "../ui/button";
import { SettingsPageContainer, SettingsSection } from "./settingsLayout";

type Logo = ComponentType<SVGProps<SVGSVGElement>>;

const SPARKY_INSTANCE_ID = ProviderInstanceId.make("sparky");
const SPARKY_DRIVER = ProviderDriverKind.make("sparky");
const CODEX_AUTH_PATH = "/api/sparky/codex-auth";

type CodexAuthStatus = {
  readonly authenticated: boolean;
  readonly accountId?: string | null;
  readonly expires?: number | null;
};

async function codexAuthRequest(path = "", method = "GET"): Promise<CodexAuthStatus> {
  const requestUrl = resolvePrimaryEnvironmentHttpUrl(`${CODEX_AUTH_PATH}${path}`);
  let response: Response;
  try {
    response = await fetchPrimaryEnvironment(requestUrl, {
      method,
      signal: AbortSignal.timeout(path === "/login" ? 15 * 60_000 : 20_000),
    });
  } catch (cause) {
    const detail = cause instanceof Error ? cause.message : String(cause);
    throw new Error(
      `Could not reach Sparky's local authentication service (${detail}). Restart Sparky and try again.`,
      { cause },
    );
  }
  const responseText = await response.text();
  let payload: CodexAuthStatus & { readonly error?: string };
  try {
    payload = responseText
      ? (JSON.parse(responseText) as CodexAuthStatus & { readonly error?: string })
      : { authenticated: false };
  } catch (cause) {
    throw new Error(
      `Sparky's authentication service returned an invalid response (HTTP ${response.status}).`,
      { cause },
    );
  }
  if (!response.ok) {
    throw new Error(payload.error || `ChatGPT authentication failed (HTTP ${response.status}).`);
  }
  return payload;
}

const MODEL_APIS: ReadonlyArray<{
  readonly id: string;
  readonly name: string;
  readonly envName: string;
  readonly placeholder: string;
  readonly description: string;
  readonly Logo: Logo;
}> = [
  {
    id: "openai",
    name: "OpenAI",
    envName: "OPENAI_API_KEY",
    placeholder: "sk-...",
    description: "GPT models through the OpenAI API.",
    Logo: OpenAI,
  },
  {
    id: "anthropic",
    name: "Anthropic",
    envName: "ANTHROPIC_API_KEY",
    placeholder: "sk-ant-...",
    description: "Claude models through the Anthropic API.",
    Logo: ClaudeAI,
  },
  {
    id: "google",
    name: "Google",
    envName: "GEMINI_API_KEY",
    placeholder: "AIza...",
    description: "Gemini models through Google AI Studio.",
    Logo: Gemini,
  },
  {
    id: "opencode",
    name: "OpenCode Zen",
    envName: "OPENCODE_API_KEY",
    placeholder: "OpenCode Zen API key",
    description: "OpenCode Zen gateway models through Sparky.",
    Logo: OpenCodeIcon,
  },
];

export function ModelsSettingsPanel() {
  const settings = usePrimarySettings();
  const updateSettings = useUpdatePrimarySettings();
  const primaryEnvironment = usePrimaryEnvironment();
  const refreshServerProviders = useAtomCommand(serverEnvironment.refreshProviders, {
    reportFailure: false,
  });
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [codexAuth, setCodexAuth] = useState<CodexAuthStatus | null>(null);
  const [codexAuthBusy, setCodexAuthBusy] = useState(false);
  const [codexAuthError, setCodexAuthError] = useState<string | null>(null);

  const instance = settings.providerInstances[SPARKY_INSTANCE_ID];
  const variables = useMemo(
    () => new Map((instance?.environment ?? []).map((variable) => [variable.name, variable])),
    [instance?.environment],
  );

  useEffect(() => {
    let active = true;
    void codexAuthRequest()
      .then((status) => {
        if (active) setCodexAuth(status);
      })
      .catch((error: unknown) => {
        if (active) setCodexAuthError(error instanceof Error ? error.message : String(error));
      });
    return () => {
      active = false;
    };
  }, []);

  const refreshSparkyProvider = async () => {
    if (!primaryEnvironment) {
      throw new Error(
        "Sparky's local provider is not connected yet. Restart Sparky and try again.",
      );
    }

    const result = await refreshServerProviders({
      environmentId: primaryEnvironment.environmentId,
      input: { instanceId: SPARKY_INSTANCE_ID },
    });
    if (result._tag === "Failure" && !isAtomCommandInterrupted(result)) {
      const error = squashAtomCommandFailure(result);
      throw error instanceof Error ? error : new Error(String(error));
    }
  };

  const updateCodexAuthentication = async (operation: "login" | "logout") => {
    setCodexAuthBusy(true);
    setCodexAuthError(null);
    try {
      const status = await codexAuthRequest(`/${operation}`, "POST");
      setCodexAuth(status);
      await refreshSparkyProvider();
    } catch (error) {
      setCodexAuthError(error instanceof Error ? error.message : String(error));
    } finally {
      setCodexAuthBusy(false);
    }
  };

  const commitKey = (envName: string, value: string) => {
    const knownNames = new Set(MODEL_APIS.map((api) => api.envName));
    const existingVariables = (instance?.environment ?? []).filter(
      (variable) => !knownNames.has(variable.name) || variable.name !== envName,
    );
    const environment = [
      ...existingVariables,
      {
        name: envName,
        value,
        sensitive: true,
        ...(value.length === 0 ? {} : { valueRedacted: false }),
      },
    ];
    const nextInstance: ProviderInstanceConfig = {
      driver: SPARKY_DRIVER,
      displayName: "Sparky",
      enabled: true,
      environment,
      config: instance?.config ?? { binaryPath: "" },
    };
    updateSettings({
      providerInstances: {
        [SPARKY_INSTANCE_ID]: nextInstance,
      },
    });
    setDrafts((current) => ({ ...current, [envName]: "" }));
  };

  return (
    <SettingsPageContainer>
      <SettingsSection title="Models" icon={<KeyRoundIcon className="size-3.5" />}>
        <div className="border-b border-border/60 px-5 py-4">
          <h3 className="text-[13px] font-semibold text-foreground">Sparky model APIs</h3>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground/80">
            Sparky is the only coding runtime. Add provider-specific API keys here to make those
            models available in the existing model picker. A ChatGPT subscription is separate from
            the OpenAI API and does not authenticate Claude, Gemini, or OpenCode. Keys are encrypted
            by the local desktop backend and never returned to this page.
          </p>
        </div>

        {MODEL_APIS.map(({ id, name, envName, placeholder, description, Logo }) => {
          const stored = variables.get(envName);
          const configured = stored?.valueRedacted === true || Boolean(stored?.value);
          const draft = drafts[envName] ?? "";
          return (
            <div key={id} className="border-t border-border/60 px-4 py-4 first:border-t-0 sm:px-5">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl border border-border/70 bg-background/70">
                  <Logo className="size-5" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-[13px] font-semibold text-foreground">{name}</h3>
                    {configured ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2Icon className="size-3" /> Configured
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground/80">{description}</p>
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                    <input
                      type="password"
                      value={draft}
                      autoComplete="off"
                      spellCheck={false}
                      placeholder={configured ? "Enter a replacement key" : placeholder}
                      aria-label={`${name} API key`}
                      onChange={(event) =>
                        setDrafts((current) => ({
                          ...current,
                          [envName]: event.target.value,
                        }))
                      }
                      className="h-9 min-w-0 flex-1 rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-ring focus:ring-2 focus:ring-ring/20"
                    />
                    <Button
                      type="button"
                      size="sm"
                      className="h-9 gap-1.5"
                      disabled={draft.trim().length === 0}
                      onClick={() => commitKey(envName, draft.trim())}
                    >
                      <SaveIcon className="size-3.5" /> Save key
                    </Button>
                    {configured ? (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-9 gap-1.5 text-destructive hover:text-destructive"
                        onClick={() => commitKey(envName, "")}
                      >
                        <Trash2Icon className="size-3.5" /> Remove
                      </Button>
                    ) : null}
                  </div>
                  {id === "openai" ? (
                    <div className="mt-2">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/60 transition-colors hover:text-muted-foreground disabled:opacity-50"
                        disabled={codexAuthBusy}
                        onClick={() =>
                          void updateCodexAuthentication(
                            codexAuth?.authenticated ? "logout" : "login",
                          )
                        }
                      >
                        {codexAuthBusy ? (
                          <LoaderCircleIcon className="size-3 animate-spin" />
                        ) : codexAuth?.authenticated ? (
                          <CheckCircle2Icon className="size-3 text-emerald-500" />
                        ) : null}
                        {codexAuth?.authenticated
                          ? "Signed in with ChatGPT subscription"
                          : codexAuthBusy
                            ? "Signing in to ChatGPT…"
                            : "Already have a subscription? Sign in with ChatGPT"}
                      </button>
                      {codexAuthError ? (
                        <p role="alert" className="mt-1 text-xs text-destructive">
                          {codexAuthError}
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </SettingsSection>
    </SettingsPageContainer>
  );
}
