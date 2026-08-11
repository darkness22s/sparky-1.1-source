import * as Effect from "effect/Effect";

import * as McpInvocationContext from "../../McpInvocationContext.ts";
import * as PreviewAutomationBroker from "../../PreviewAutomationBroker.ts";
import * as ImageViewRegistry from "../../ImageViewRegistry.ts";
import { ImageViewToolkit } from "./tools.ts";

const handlers = {
  image_view: (input) =>
    Effect.gen(function* () {
      const invocation = yield* McpInvocationContext.requireMcpCapability("preview").pipe(
        Effect.mapError((cause) => cause.message),
      );
      const analyzer = ImageViewRegistry.readImageViewAnalyzer(
        invocation.threadId,
        invocation.providerInstanceId,
      );
      if (!analyzer) {
        return yield* Effect.fail(
          "ImageView is disabled or unavailable for this provider session. Enable it in Models settings and start a new turn.",
        );
      }

      if (input.path?.trim()) {
        return yield* Effect.tryPromise({
          try: () =>
            analyzer({
              image: { type: "path", path: input.path!.trim() },
              question: input.question,
            }),
          catch: (cause) => (cause instanceof Error ? cause.message : String(cause)),
        });
      }

      const broker = yield* PreviewAutomationBroker.PreviewAutomationBroker;
      const snapshot = yield* broker
        .invoke<{
          readonly screenshot: {
            readonly mimeType: string;
            readonly data: string;
            readonly width: number;
            readonly height: number;
          };
        }>({
          scope: invocation,
          operation: "snapshot",
          input: {},
          ...(input.tabId ? { tabId: input.tabId as never } : {}),
        })
        .pipe(Effect.mapError((cause) => cause.message));
      return yield* Effect.tryPromise({
        try: () =>
          analyzer({
            image: {
              type: "data",
              mimeType: snapshot.screenshot.mimeType,
              data: snapshot.screenshot.data,
            },
            question: input.question,
          }),
        catch: (cause) => (cause instanceof Error ? cause.message : String(cause)),
      });
    }),
} satisfies Parameters<typeof ImageViewToolkit.toLayer>[0];

export const ImageViewToolkitHandlersLive = ImageViewToolkit.toLayer(handlers);
