import { PreviewTabId } from "@sparky/contracts";
import * as Schema from "effect/Schema";
import { Tool, Toolkit } from "effect/unstable/ai";

import * as McpInvocationContext from "../../McpInvocationContext.ts";
import * as PreviewAutomationBroker from "../../PreviewAutomationBroker.ts";

const dependencies = [
  McpInvocationContext.McpInvocationContext,
  PreviewAutomationBroker.PreviewAutomationBroker,
];

export const ImageViewInput = Schema.Struct({
  path: Schema.optional(
    Schema.String.annotate({
      description: "Absolute path to a local image. Omit when inspecting the current browser tab.",
    }),
  ),
  tabId: Schema.optional(
    PreviewTabId.annotate({
      description: "Collaborative browser tab to inspect. Omit to use the current tab.",
    }),
  ),
  question: Schema.optional(
    Schema.String.annotate({
      description: "What must be verified or understood from the image.",
    }),
  ),
});

export const ImageViewTool = Tool.make("image_view", {
  description:
    "Inspect an image through a dedicated vision model while keeping the current model and task. Provide path for a local image, or omit path to inspect the current collaborative browser tab. Returns detailed OCR, layout, control positions, page state, and safe next-action guidance. Use it whenever you need visual evidence that you cannot directly inspect.",
  parameters: ImageViewInput,
  success: Schema.String,
  failure: Schema.String,
  dependencies,
})
  .annotate(Tool.Title, "ImageView")
  .annotate(Tool.Readonly, true)
  .annotate(Tool.Destructive, false)
  .annotate(Tool.Idempotent, true);

export const ImageViewToolkit = Toolkit.make(ImageViewTool);
