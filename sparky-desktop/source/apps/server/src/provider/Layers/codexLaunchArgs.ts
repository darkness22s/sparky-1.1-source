import { tokenizeCliArgs } from "@sparky/shared/cliArgs";

export const T3CODE_CODEX_LAUNCH_ARGS_ENV = "T3CODE_CODEX_LAUNCH_ARGS";

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

export function parseCodexContextWindowTokens(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const normalized = value.trim().toLowerCase().replaceAll(",", "");
  const match = normalized.match(/^(\d+(?:\.\d+)?)(?:\s*(tokens?|k|m|b))?$/u);
  if (!match) return undefined;
  const amount = Number(match[1]);
  if (!Number.isFinite(amount) || amount <= 0) return undefined;
  const unit = match[2] ?? "";
  const multiplier = unit.startsWith("b")
    ? 1_000_000_000
    : unit === "m"
      ? 1_000_000
      : unit === "k"
        ? 1_000
        : 1;
  const tokens = amount * multiplier;
  return Number.isSafeInteger(tokens) && tokens > 0 ? tokens : undefined;
}

function appendCodexContextSelection(
  args: ReadonlyArray<string>,
  contextWindowTokens: number | undefined,
): Array<string> {
  const next = [...args];
  if (contextWindowTokens !== undefined && !hasConfigKey(next, "model_context_window")) {
    next.push("-c", `model_context_window=${contextWindowTokens}`);
  }
  return next;
}

export const codexAppServerArgs = (launchArgs?: string, contextWindowTokens?: number) => [
  "app-server",
  ...appendCodexContextSelection(codexLaunchArgv(launchArgs), contextWindowTokens),
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
  contextWindowTokens?: number,
) => {
  const launchAppServerArgs = codexAppServerArgs(launchArgs);
  const combined = appServerArgs
    ? [...launchAppServerArgs, ...appServerArgs]
    : launchAppServerArgs;
  return appendCodexContextSelection(combined, contextWindowTokens);
};
