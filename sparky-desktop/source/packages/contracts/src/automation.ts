import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";

import { EnvironmentId, IsoDateTime, ThreadId, TrimmedNonEmptyString } from "./baseSchemas.ts";
import {
  DEFAULT_PROVIDER_INTERACTION_MODE,
  DEFAULT_RUNTIME_MODE,
  ModelSelection,
  ProviderInteractionMode,
  RuntimeMode,
} from "./orchestration.ts";
import { ProviderInstanceId } from "./providerInstance.ts";

export const AutomationId = TrimmedNonEmptyString.pipe(Schema.brand("AutomationId"));
export type AutomationId = typeof AutomationId.Type;

export const AutomationSchedule = Schema.Literals(["once", "hourly", "daily", "weekly"]);
export type AutomationSchedule = typeof AutomationSchedule.Type;

export const AutomationExecutionMode = Schema.Literals(["chat", "background"]);
export type AutomationExecutionMode = typeof AutomationExecutionMode.Type;

export const AutomationStatus = Schema.Literals([
  "active",
  "running",
  "paused",
  "completed",
  "failed",
]);
export type AutomationStatus = typeof AutomationStatus.Type;

export const Automation = Schema.Struct({
  id: AutomationId,
  environmentId: EnvironmentId,
  threadId: ThreadId,
  providerInstanceId: ProviderInstanceId,
  title: TrimmedNonEmptyString,
  prompt: TrimmedNonEmptyString,
  schedule: AutomationSchedule,
  intervalHours: Schema.Number,
  runAt: IsoDateTime,
  nextRunAt: Schema.NullOr(IsoDateTime),
  timezone: TrimmedNonEmptyString,
  enabled: Schema.Boolean,
  status: AutomationStatus,
  executionMode: AutomationExecutionMode,
  notificationsEnabled: Schema.Boolean,
  modelSelection: Schema.NullOr(ModelSelection),
  runtimeMode: RuntimeMode,
  interactionMode: ProviderInteractionMode,
  createdAt: IsoDateTime,
  updatedAt: IsoDateTime,
  lastRunAt: Schema.NullOr(IsoDateTime),
  lastError: Schema.NullOr(Schema.String),
});
export type Automation = typeof Automation.Type;

export const AutomationCreateInput = Schema.Struct({
  templateThreadId: Schema.optional(ThreadId),
  threadId: Schema.optional(ThreadId),
  providerInstanceId: Schema.optional(ProviderInstanceId),
  title: TrimmedNonEmptyString,
  prompt: TrimmedNonEmptyString,
  schedule: AutomationSchedule,
  intervalHours: Schema.optional(Schema.Number),
  runAt: IsoDateTime,
  timezone: TrimmedNonEmptyString,
  modelSelection: Schema.optional(Schema.NullOr(ModelSelection)),
  executionMode: Schema.optional(
    AutomationExecutionMode.pipe(Schema.withDecodingDefault(Effect.succeed("chat" as const))),
  ),
  notificationsEnabled: Schema.optional(Schema.Boolean),
  runtimeMode: Schema.optional(
    RuntimeMode.pipe(Schema.withDecodingDefault(Effect.succeed(DEFAULT_RUNTIME_MODE))),
  ),
  interactionMode: Schema.optional(
    ProviderInteractionMode.pipe(
      Schema.withDecodingDefault(Effect.succeed(DEFAULT_PROVIDER_INTERACTION_MODE)),
    ),
  ),
});
export type AutomationCreateInput = typeof AutomationCreateInput.Type;

export const AutomationUpdateInput = Schema.Struct({
  title: Schema.optional(TrimmedNonEmptyString),
  prompt: Schema.optional(TrimmedNonEmptyString),
  schedule: Schema.optional(AutomationSchedule),
  intervalHours: Schema.optional(Schema.Number),
  runAt: Schema.optional(IsoDateTime),
  timezone: Schema.optional(TrimmedNonEmptyString),
});
export type AutomationUpdateInput = typeof AutomationUpdateInput.Type;

export const AutomationToggleInput = Schema.Struct({ enabled: Schema.Boolean });
export type AutomationToggleInput = typeof AutomationToggleInput.Type;

export const AutomationListResponse = Schema.Array(Automation);
export type AutomationListResponse = typeof AutomationListResponse.Type;

export const AutomationToolResult = Schema.Struct({
  automation: Automation,
  message: TrimmedNonEmptyString,
});
export type AutomationToolResult = typeof AutomationToolResult.Type;

export const AutomationDeleteResult = Schema.Struct({ deleted: Schema.Boolean });
export type AutomationDeleteResult = typeof AutomationDeleteResult.Type;
