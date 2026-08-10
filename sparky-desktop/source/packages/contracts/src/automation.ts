import * as Schema from "effect/Schema";

import { EnvironmentId, IsoDateTime, ThreadId, TrimmedNonEmptyString } from "./baseSchemas.ts";
import { ModelSelection, ProviderInteractionMode, RuntimeMode } from "./orchestration.ts";
import { ProviderInstanceId } from "./providerInstance.ts";

export const AutomationId = TrimmedNonEmptyString.pipe(Schema.brand("AutomationId"));
export type AutomationId = typeof AutomationId.Type;

export const AutomationSchedule = Schema.Literals(["once", "daily", "weekdays", "weekly"]);
export type AutomationSchedule = typeof AutomationSchedule.Type;

export const AutomationStatus = Schema.Literals(["active", "paused", "completed", "failed"]);
export type AutomationStatus = typeof AutomationStatus.Type;

export const Automation = Schema.Struct({
  id: AutomationId,
  environmentId: EnvironmentId,
  threadId: ThreadId,
  providerInstanceId: ProviderInstanceId,
  title: TrimmedNonEmptyString,
  prompt: TrimmedNonEmptyString,
  schedule: AutomationSchedule,
  runAt: IsoDateTime,
  nextRunAt: Schema.NullOr(IsoDateTime),
  timezone: TrimmedNonEmptyString,
  enabled: Schema.Boolean,
  status: AutomationStatus,
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
  threadId: ThreadId,
  providerInstanceId: ProviderInstanceId,
  title: TrimmedNonEmptyString,
  prompt: TrimmedNonEmptyString,
  schedule: AutomationSchedule,
  runAt: IsoDateTime,
  timezone: TrimmedNonEmptyString,
  modelSelection: Schema.NullOr(ModelSelection),
  runtimeMode: RuntimeMode,
  interactionMode: ProviderInteractionMode,
});
export type AutomationCreateInput = typeof AutomationCreateInput.Type;

export const AutomationUpdateInput = Schema.Struct({
  title: Schema.optional(TrimmedNonEmptyString),
  prompt: Schema.optional(TrimmedNonEmptyString),
  schedule: Schema.optional(AutomationSchedule),
  runAt: Schema.optional(IsoDateTime),
  timezone: Schema.optional(TrimmedNonEmptyString),
});
export type AutomationUpdateInput = typeof AutomationUpdateInput.Type;

export const AutomationToggleInput = Schema.Struct({
  enabled: Schema.Boolean,
});
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
