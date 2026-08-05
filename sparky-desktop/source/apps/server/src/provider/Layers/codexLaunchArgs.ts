import { tokenizeCliArgs } from "@sparky/shared/cliArgs";

export const T3CODE_CODEX_LAUNCH_ARGS_ENV = "T3CODE_CODEX_LAUNCH_ARGS";

// ChatGPT OAuth-backed Codex sessions currently have a materially smaller
// usable context than some model catalog entries report. Keep the app-server
// below that hard boundary and compact before it is reached.
export const CODEX_OAUTH_CONTEXT_WINDOW_TOKENS = 320_000;
export const CODEX_OAUTH_AUTO_COMPACT_TOKEN_LIMIT = 280_000;

export const resolveCodexLaunchArgs = (
  launchArgs?: string,
  environment: NodeJS.ProcessEnv = process.env,
) => environment[T3CODE_CODEX_LAUNCH_ARGS_ENV]?.trim() || launchArgs?.trim() || "";

export const codexLaunchArgv = (launchArgs?: string): ReadonlyArray<string> =>
  tokenizeCliArgs(launchArgs);

function hasConfigKey(args: ReadonlyArray<string>, key: string): boolean {
  for (let index = 0; index < args.length; index++) {
    const argument = args[index];
    if (argument === undefined) continue;

    let value: string | undefined;
    if (argument === "--config" || argument === "-c") {
      value = args[index + 1];
      index++;
    } else if (argument.startsWith("--config=") || argument.startsWith("-c=")) {
      value = argument.slice(argument.indexOf("=") + 1);
    }

    if (value?.trim().split("=", 1)[0] === key) {
      return true;
    }
  }
  return false;
}

function appendCodexContextDefaults(args: ReadonlyArray<string>): Array<string> {
  const next = [...args];
  const defaults = [
    ["model_context_window", String(CODEX_OAUTH_CONTEXT_WINDOW_TOKENS)],
    ["model_auto_compact_token_limit", String(CODEX_OAUTH_AUTO_COMPACT_TOKEN_LIMIT)],
  ] as const;

  for (const [key, value] of defaults) {
    if (!hasConfigKey(next, key)) {
      next.push("-c", `${key}=${value}`);
    }
  }
  return next;
}

export const codexAppServerArgs = (launchArgs?: string) => [
  "app-server",
  ...appendCodexContextDefaults(codexLaunchArgv(launchArgs)),
];

export const codexExecLaunchArgs = (launchArgs?: string) => {
  const args = codexLaunchArgv(launchArgs);
  const execArgs: Array<string> = [];

  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    if (arg === undefined) continue;

    if (arg === "--strict-config" || arg.startsWith("--config=") || arg.startsWith("-c=")) {
      execArgs.push(arg);
    } else if (arg === "--config" || arg === "-c" || arg === "--enable" || arg === "--disable") {
      const value = args[index + 1];
      if (value !== undefined && !value.startsWith("-")) {
        execArgs.push(arg, value);
        index++;
      }
    } else if (arg.startsWith("--enable=") || arg.startsWith("--disable=")) {
      execArgs.push(arg);
    }
  }

  return execArgs;
};

export const codexSessionAppServerArgs = (
  appServerArgs: ReadonlyArray<string> | undefined,
  launchArgs: string | undefined,
) => {
  const launchAppServerArgs = codexAppServerArgs(launchArgs);
  return appServerArgs ? [...launchAppServerArgs, ...appServerArgs] : launchAppServerArgs;
};
