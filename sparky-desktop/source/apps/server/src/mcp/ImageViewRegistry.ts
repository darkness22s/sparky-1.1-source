import type { ProviderInstanceId, ThreadId } from "@sparky/contracts";

export interface ImageViewRequest {
  readonly image:
    | { readonly type: "path"; readonly path: string }
    | { readonly type: "data"; readonly mimeType: string; readonly data: string };
  readonly question?: string | undefined;
}

export type ImageViewAnalyzer = (request: ImageViewRequest) => Promise<string>;

const analyzers = new Map<string, ImageViewAnalyzer>();
const keyOf = (threadId: ThreadId, providerInstanceId: ProviderInstanceId) =>
  `${threadId}\u0000${providerInstanceId}`;

export function registerImageViewAnalyzer(
  threadId: ThreadId,
  providerInstanceId: ProviderInstanceId,
  analyzer: ImageViewAnalyzer,
): void {
  analyzers.set(keyOf(threadId, providerInstanceId), analyzer);
}

export function unregisterImageViewAnalyzer(
  threadId: ThreadId,
  providerInstanceId: ProviderInstanceId,
): void {
  analyzers.delete(keyOf(threadId, providerInstanceId));
}

export function readImageViewAnalyzer(
  threadId: ThreadId,
  providerInstanceId: ProviderInstanceId,
): ImageViewAnalyzer | undefined {
  return analyzers.get(keyOf(threadId, providerInstanceId));
}
