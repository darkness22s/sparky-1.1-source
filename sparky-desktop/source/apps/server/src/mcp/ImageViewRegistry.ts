import type { ProviderInstanceId, ThreadId } from "@sparky/contracts";
import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";

export class ImageViewError extends Schema.TaggedErrorClass<ImageViewError>()(
  "ImageViewError",
  {
    issue: Schema.String,
    cause: Schema.optional(Schema.Defect()),
  },
) {
  override get message(): string {
    return `ImageView analysis failed: ${this.issue}`;
  }
}

export interface ImageViewRequest {
  readonly image:
    | { readonly type: "path"; readonly path: string }
    | { readonly type: "data"; readonly mimeType: string; readonly data: string };
  readonly question?: string | undefined;
}

export type ImageViewAnalyzer = (
  request: ImageViewRequest,
) => Effect.Effect<string, ImageViewError>;

export interface ImageViewRegistry {
  readonly register: (
    threadId: ThreadId,
    providerInstanceId: ProviderInstanceId,
    analyzer: ImageViewAnalyzer,
  ) => void;
  readonly unregister: (threadId: ThreadId, providerInstanceId: ProviderInstanceId) => void;
  readonly read: (
    threadId: ThreadId,
    providerInstanceId: ProviderInstanceId,
  ) => ImageViewAnalyzer | undefined;
}

const keyOf = (threadId: ThreadId, providerInstanceId: ProviderInstanceId) =>
  `${threadId}\u0000${providerInstanceId}`;

const analyzers = new Map<string, ImageViewAnalyzer>();

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

export function clearImageViewAnalyzers(): void {
  analyzers.clear();
}
