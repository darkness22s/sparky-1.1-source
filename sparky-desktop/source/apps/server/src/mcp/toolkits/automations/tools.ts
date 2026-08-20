import {
  AutomationCreateInput,
  AutomationDeleteResult,
  AutomationId,
  AutomationListResponse,
  AutomationSchedule,
  AutomationToolResult,
  TrimmedNonEmptyString,
} from "@sparky/contracts";
import * as Effect from "effect/Effect";
import * as Option from "effect/Option";
import * as Schema from "effect/Schema";
import { Tool, Toolkit } from "effect/unstable/ai";

import * as McpInvocationContext from "../../McpInvocationContext.ts";
import { AutomationService } from "../../../automations/AutomationService.ts";

const dependencies = [McpInvocationContext.McpInvocationContext];
const AutomationIdInput = Schema.Struct({ id: AutomationId });
const serviceOrDie = Effect.map(Effect.serviceOption(AutomationService), Option.getOrThrow);

export const AutomationListTool = Tool.make("automation_list", {
  description: "List scheduled tasks for this environment.",
  parameters: Tool.EmptyParams,
  success: AutomationListResponse,
  failure: Schema.Unknown,
  dependencies,
})
  .annotate(Tool.Title, "List scheduled tasks")
  .annotate(Tool.Readonly, true);

export const AutomationCreateTool = Tool.make("automation_create", {
  description: "Create a scheduled task. It gets its own reusable chat in All Projects.",
  parameters: Schema.Struct({
    title: TrimmedNonEmptyString,
    prompt: TrimmedNonEmptyString,
    schedule: AutomationSchedule,
    intervalHours: Schema.optional(Schema.Number),
    runAt: TrimmedNonEmptyString,
    timezone: TrimmedNonEmptyString,
  }),
  success: AutomationToolResult,
  failure: Schema.Unknown,
  dependencies,
}).annotate(Tool.Title, "Create scheduled task");

export const AutomationRunTool = Tool.make("automation_run_now", {
  description: "Run an existing scheduled task immediately.",
  parameters: AutomationIdInput,
  success: AutomationToolResult,
  failure: Schema.Unknown,
  dependencies,
}).annotate(Tool.Title, "Run scheduled task");

export const AutomationToggleTool = Tool.make("automation_toggle", {
  description: "Pause or resume a scheduled task.",
  parameters: Schema.Struct({ id: AutomationId, enabled: Schema.Boolean }),
  success: AutomationToolResult,
  failure: Schema.Unknown,
  dependencies,
}).annotate(Tool.Title, "Pause or resume scheduled task");

export const AutomationDeleteTool = Tool.make("automation_delete", {
  description: "Delete a scheduled task.",
  parameters: AutomationIdInput,
  success: AutomationDeleteResult,
  failure: Schema.Unknown,
  dependencies,
}).annotate(Tool.Title, "Delete scheduled task");

export const AutomationToolkit = Toolkit.make(
  AutomationListTool,
  AutomationCreateTool,
  AutomationRunTool,
  AutomationToggleTool,
  AutomationDeleteTool,
);

export const AutomationToolkitHandlersLive = AutomationToolkit.toLayer({
  automation_list: () =>
    McpInvocationContext.requireMcpCapability("preview").pipe(
      Effect.flatMap(() => serviceOrDie),
      Effect.flatMap((service) => service.list()),
    ),
  automation_create: (input) =>
    Effect.gen(function* () {
      const invocation = yield* McpInvocationContext.requireMcpCapability("preview");
      const service = yield* serviceOrDie;
      const automation = yield* service.create({
        templateThreadId: invocation.threadId,
        providerInstanceId: invocation.providerInstanceId,
        title: input.title,
        prompt: input.prompt,
        schedule: input.schedule,
        intervalHours: input.intervalHours,
        runAt: input.runAt,
        timezone: input.timezone,
        modelSelection: null,
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
