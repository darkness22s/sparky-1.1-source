import type {
  ModelSelection,
  PreviewAnnotationPayload,
  ProviderDriverKind,
  ProviderInteractionMode,
  RuntimeMode,
  ServerProvider,
} from "@sparky/contracts";
import type { ComposerImageAttachment } from "../../composerDraftStore";
import type { ElementContextDraft } from "../../lib/elementContext";
import type { ReviewCommentContext } from "../../reviewCommentContext";
import {
  formatTerminalContextLabel,
  stripInlineTerminalContextPlaceholders,
  type TerminalContextDraft,
} from "../../lib/terminalContext";

export interface QueuedComposerMessage {
  readonly id: string;
  readonly createdAt: string;
  readonly prompt: string;
  readonly images: ReadonlyArray<ComposerImageAttachment>;
  readonly terminalContexts: ReadonlyArray<TerminalContextDraft>;
  readonly elementContexts: ReadonlyArray<ElementContextDraft>;
  readonly previewAnnotations: ReadonlyArray<PreviewAnnotationPayload>;
  readonly reviewComments: ReadonlyArray<ReviewCommentContext>;
  readonly selectedPromptEffort: string | null;
  readonly selectedModelOptionsForDispatch: unknown;
  readonly selectedModelSelection: ModelSelection;
  readonly selectedProvider: ProviderDriverKind;
  readonly selectedModel: string;
  readonly selectedProviderModels: ReadonlyArray<ServerProvider["models"][number]>;
  readonly runtimeMode: RuntimeMode;
  readonly interactionMode: ProviderInteractionMode;
}

export type QueuedMessageSendMode = "auto" | "steer";

export interface QueuedMessageSendRequest {
  readonly queuedMessage: QueuedComposerMessage;
  readonly mode: QueuedMessageSendMode;
}

/**
 * Keep the queue row useful even when the message only contains attachments or
 * terminal context chips. Inline placeholders are implementation details and
 * should not be exposed as the queue preview.
 */
export function queuedComposerMessagePreview(message: QueuedComposerMessage): string {
  const prompt = stripInlineTerminalContextPlaceholders(message.prompt).replace(/\s+/g, " ").trim();
  if (prompt.length > 0) {
    return prompt;
  }

  if (message.images.length === 1) {
    return `Image: ${message.images[0]?.name ?? "attachment"}`;
  }
  if (message.images.length > 1) {
    return `${message.images.length} image attachments`;
  }
  if (message.terminalContexts.length === 1) {
    return `Terminal: ${formatTerminalContextLabel(message.terminalContexts[0]!)}`;
  }
  if (message.terminalContexts.length > 1) {
    return `${message.terminalContexts.length} terminal selections`;
  }
  if (message.elementContexts.length > 0) {
    return `${message.elementContexts.length} picked element${
      message.elementContexts.length === 1 ? "" : "s"
    }`;
  }
  if (message.previewAnnotations.length > 0) {
    return `${message.previewAnnotations.length} preview annotation${
      message.previewAnnotations.length === 1 ? "" : "s"
    }`;
  }
  if (message.reviewComments.length > 0) {
    return `${message.reviewComments.length} review comment${
      message.reviewComments.length === 1 ? "" : "s"
    }`;
  }
  return "Queued message";
}
