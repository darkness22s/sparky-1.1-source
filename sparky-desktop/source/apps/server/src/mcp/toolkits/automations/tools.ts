import {
  AutomationCreateInput,
  AutomationDeleteResult,
  AutomationId,
  AutomationListResponse,
  AutomationSchedule,
  AutomationToolResult,
} from "@sparky/contracts";
import * as Effect from "effect/Effect";
import * as Option from "effect/Option";
import * as Schema from "effect/Schema";
import { Tool, Toolkit } from "effect/unstable/ai";

import * as McpInvocationContext from "../../McpInvocationContext.ts";
import { AutomationService } from "../../../automations/AutomationService.ts";

const dependencies = [McpInvocationContext.McpInvocationContext];

const AutomationCreateToolInput = Schema.Struct({
  title: Schema.String,
  prompt: Schema.String,
  schedule: AutomationSchedule,
  runAt: Schema.String,
  timezone: Schema.String,
});

const AutomationIdInput = Schema.Struct({ id: AutomationId });

export const AutomationListTool = Tool.make("automation_list", {
  description: "List scheduled automations for this Sparky environment.",
  parameters: Schema.Struct({}),
  success: AutomationListResponse,
  failure: Schema.Unknown,
  dependencies,
})
  .annotate(Tool.Title, "List scheduled automations")
  .annotate(Tool.Readonly, true)
  .annotate(Tool.Idempotent, true)
  .annotate(Tool.Destructive, false);

export const AutomationCreateTool = Tool.make("automation_create", {
  description:
    "Schedule a prompt to run in the current chat thread at a specific ISO time. Use schedule once, daily, weekdays, or weekly.",
  parameters: AutomationCreateToolInput,
  success: AutomationToolResult,
  failure: Schema.Unknown,
  dependencies,
})
  .annotate(Tool.Title, "Create scheduled automation")
  .annotate(Tool.Destructive, false);

export const AutomationRunTool = Tool.make("automation_run_now", {
  description: "Run an existing scheduled automation immediately.",
  parameters: AutomationIdInput,
  success: AutomationToolResult,
  failure: Schema.Unknown,
  dependencies,
})
  .annotate(Tool.Title, "Run scheduled automation")
  .annotate(Tool.Destructive, false);

export const AutomationToggleTool = Tool.make("automation_toggle", {
  description: "Pause or resume an existing scheduled automation.",
  parameters: Schema.Struct({ id: AutomationId, enabled: Schema.Boolean }),
  success: AutomationToolResult,
  failure: Schema.Unknown,
  dependencies,
})
  .annotate(Tool.Title, "Pause or resume automation")
  .annotate(Tool.Destructive, false);

export const AutomationDeleteTool = Tool.make("automation_delete", {
  description: "Delete an existing scheduled automation.",
  parameters: AutomationIdInput,
  success: AutomationDeleteResult,
  failure: Schema.Unknown,
  dependencies,
})
  .annotate(Tool.Title, "Delete scheduled automation")
  .annotate(Tool.Destructive, true);

export const AutomationToolkit = Toolkit.make(
  AutomationListTool,
  AutomationCreateTool,
  AutomationRunTool,
  AutomationToggleTool,
  AutomationDeleteTool,
);

const serviceOrDie = Effect.map(Effect.serviceOption(AutomationService), Option.getOrThrow);

export const AutomationToolkitHandlersLive = AutomationToolkit.toLayer({
  automation_list: (input) =>
    McpInvocationContext.requireMcpCapability("preview").pipe(
      Effect.flatMap(() => serviceOrDie),
      Effect.flatMap((service) => service.list()),
    ),
  automation_create: (input) =>
    Effect.gen(function* () {
      const invocation = yield* McpInvocationContext.requireMcpCapability("preview");
      const service = yield* serviceOrDie;
      const automation = yield* service.create({
        threadId: invocation.threadId,
        providerInstanceId: invocation.providerInstanceId,
        title: input.title,
        prompt: input.prompt,
        schedule: input.schedule,
        runAt: input.runAt,
        timezone: input.timezone,
        modelSelection: null,
        executionMode: "chat",
        notificationsEnabled: true,
        runtimeMode: "full-access",
        interactionMode: "default",
      } satisfies AutomationCreateInput);
      return { automation, message: `Scheduled ${automation.title}.` };
    }),
  automation_run_now: (input) =>
    McpInvocationContext.requireMcpCapability("preview").pipe(
      Effect.flatMap(() => serviceOrDie),
      Effect.flatMap((service) => service.runNow(input.id)),
      Effect.map((automation) => ({ automation, message: `Started ${automation.title}.` })),
    ),
  automation_toggle: (input) =>
    McpInvocationContext.requireMcpCapability("preview").pipe(
      Effect.flatMap(() => serviceOrDie),
      Effect.flatMap((service) => service.toggle(input.id, input.enabled)),
      Effect.map((automation) => ({
        automation,
        message: `${automation.title} is ${automation.enabled ? "active" : "paused"}.`,
      })),
    ),
  automation_delete: (input) =>
    McpInvocationContext.requireMcpCapability("preview").pipe(
      Effect.flatMap(() => serviceOrDie),
      Effect.flatMap((service) => service.delete(input.id)),
      Effect.map((deleted) => ({ deleted })),
    ),
});
