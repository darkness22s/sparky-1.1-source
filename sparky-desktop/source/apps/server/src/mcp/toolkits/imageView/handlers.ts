import * as Effect from "effect/Effect";

import * as McpInvocationContext from "../../McpInvocationContext.ts";
import * as PreviewAutomationBroker from "../../PreviewAutomationBroker.ts";
import * as ImageViewRegistry from "../../ImageViewRegistry.ts";
import { ImageViewToolkit } from "./tools.ts";

const handlers = {
  image_view: (input) =>
    Effect.gen(function* () {
      const invocation = yield* McpInvocationContext.requireMcpCapability("image_view").pipe(
        Effect.mapError((cause) => cause.message),
      );
      const analyzer = ImageViewRegistry.readImageViewAnalyzer(
        invocation.threadId,
        invocation.providerInstanceId,
      );
      if (!analyzer) {
        return yield* Effect.fail(
          "ImageView is disabled or unavailable for this provider session. Enable it in General settings and start a new turn.",
        );
      }

      if (input.path?.trim()) {
        return yield* analyzer({
          image: { type: "path", path: input.path.trim() },
          question: input.question,
        }).pipe(Effect.mapError((cause) => cause.message));
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
          ...(input.tabId ? { tabId: input.tabId } : {}),
        })
        .pipe(Effect.mapError((cause) => cause.message));
      return yield* analyzer({
        image: {
          type: "data",
          mimeType: snapshot.screenshot.mimeType,
          data: snapshot.screenshot.data,
        },
        question: input.question,
      }).pipe(Effect.mapError((cause) => cause.message));
    }),
} satisfies Parameters<typeof ImageViewToolkit.toLayer>[0];

export const ImageViewToolkitHandlersLive = ImageViewToolkit.toLayer(handlers);
