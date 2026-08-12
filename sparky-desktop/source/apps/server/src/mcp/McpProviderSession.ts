import type { EnvironmentId, ProviderInstanceId, ThreadId } from "@sparky/contracts";

export interface McpProviderSessionConfig {
  readonly environmentId: EnvironmentId;
  readonly threadId: ThreadId;
  readonly providerSessionId: string;
  readonly providerInstanceId: ProviderInstanceId;
  readonly endpoint: string;
  readonly authorizationHeader: string;
}

export interface ExternalMcpProviderSessionConfig {
  readonly pluginSlug: string;
  readonly endpoint: string;
  readonly authorizationHeader: string;
  readonly expiresAt: number;
}

const sessionsByThread = new Map<ThreadId, McpProviderSessionConfig>();
const externalSessionsByThread = new Map<ThreadId, ReadonlyArray<ExternalMcpProviderSessionConfig>>();

export function setMcpProviderSession(config: McpProviderSessionConfig): void {
  sessionsByThread.set(config.threadId, config);
}

export function readMcpProviderSession(
  threadId: ThreadId,
  providerInstanceId: ProviderInstanceId,
): McpProviderSessionConfig | undefined {
  const config = sessionsByThread.get(threadId);
  return config?.providerInstanceId === providerInstanceId ? config : undefined;
}

export function clearMcpProviderSession(threadId: ThreadId): void {
  sessionsByThread.delete(threadId);
}

export function setExternalMcpProviderSessions(
  threadId: ThreadId,
  sessions: ReadonlyArray<ExternalMcpProviderSessionConfig>,
): void {
  externalSessionsByThread.set(threadId, sessions);
}

export function readExternalMcpProviderSessions(
  threadId: ThreadId,
): ReadonlyArray<ExternalMcpProviderSessionConfig> {
  return externalSessionsByThread.get(threadId) ?? [];
}

export function clearExternalMcpProviderSessions(threadId: ThreadId): void {
  externalSessionsByThread.delete(threadId);
}

export function externalMcpServerName(pluginSlug: string, index: number): string {
  const safeSlug = pluginSlug.replace(/[^a-zA-Z0-9_]/gu, "_");
  return `sparky_${safeSlug || "plugin"}_${index}`;
}

export function clearAllMcpProviderSessions(): void {
  sessionsByThread.clear();
}
