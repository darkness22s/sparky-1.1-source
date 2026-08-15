import { describe, expect, it } from "vite-plus/test";

import { queuedComposerMessagePreview, type QueuedComposerMessage } from "./steeringQueue";

const makeMessage = (overrides: Partial<QueuedComposerMessage> = {}): QueuedComposerMessage =>
  ({
    id: "queued-1",
    createdAt: "2026-01-01T00:00:00.000Z",
    prompt: "",
    images: [],
    terminalContexts: [],
    elementContexts: [],
    previewAnnotations: [],
    reviewComments: [],
    selectedPromptEffort: null,
    selectedModelOptionsForDispatch: null,
    selectedModelSelection: {} as QueuedComposerMessage["selectedModelSelection"],
    selectedProvider: "claude" as QueuedComposerMessage["selectedProvider"],
    selectedModel: "claude-sonnet",
    selectedProviderModels: [],
    runtimeMode: "local" as QueuedComposerMessage["runtimeMode"],
    interactionMode: "default",
    ...overrides,
  }) as QueuedComposerMessage;

describe("queuedComposerMessagePreview", () => {
  it("normalizes message text and hides inline context placeholders", () => {
    expect(queuedComposerMessagePreview(makeMessage({ prompt: "  Fix\n\uFFFC  the bug  " }))).toBe(
      "Fix the bug",
    );
  });

  it("describes attachment-only queued messages", () => {
    expect(
      queuedComposerMessagePreview(
        makeMessage({
          images: [
            {
              type: "image",
              id: "image-1",
              name: "screenshot.png",
              mimeType: "image/png",
              sizeBytes: 10,
              previewUrl: "blob:image-1",
              file: {} as File,
            },
          ],
        }),
      ),
    ).toBe("Image: screenshot.png");
  });

  it("falls back to a generic label for an empty message", () => {
    expect(queuedComposerMessagePreview(makeMessage())).toBe("Queued message");
  });
});
