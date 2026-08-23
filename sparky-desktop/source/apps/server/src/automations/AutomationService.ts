import {
  Automation,
  AutomationCreateInput,
  AutomationId,
  AutomationSchedule,
  AutomationStatus,
  AutomationUpdateInput,
  CommandId,
  DEFAULT_MODEL,
  DEFAULT_PROVIDER_INTERACTION_MODE,
  DEFAULT_RUNTIME_MODE,
  ModelSelection,
  MessageId,
  OrchestrationCommand,
  ProviderInteractionMode,
  ProviderInstanceId,
  RuntimeMode,
  ThreadId,
  UNSCOPED_CHAT_PROJECT_ID,
} from "@sparky/contracts";
import * as Context from "effect/Context";
import * as Crypto from "effect/Crypto";
import * as Data from "effect/Data";
import * as DateTime from "effect/DateTime";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Option from "effect/Option";
import * as Schedule from "effect/Schedule";
import * as Schema from "effect/Schema";
import * as SqlClient from "effect/unstable/sql/SqlClient";
import type { SqlError } from "effect/unstable/sql/SqlError";

import { ServerEnvironment } from "../environment/ServerEnvironment.ts";
import { OrchestrationEngineService } from "../orchestration/Services/OrchestrationEngine.ts";
import { ProjectionSnapshotQuery } from "../orchestration/Services/ProjectionSnapshotQuery.ts";

export class AutomationServiceError extends Data.TaggedError("AutomationServiceError")<{
  readonly operation: string;
  readonly cause: unknown;
}> {}

type AutomationRow = {
  readonly id: string;
  readonly environmentId: string;
  readonly threadId: string;
  readonly providerInstanceId: string;
  readonly title: string;
  readonly prompt: string;
  readonly schedule: AutomationSchedule;
  readonly intervalHours: number;
  readonly runAt: string;
  readonly nextRunAt: string | null;
  readonly timezone: string;
  readonly enabled: number;
  readonly status: AutomationStatus;
  readonly executionMode: "chat" | "background";
  readonly notificationsEnabled: number;
  readonly modelSelectionJson: string | null;
  readonly runtimeMode: RuntimeMode;
  readonly interactionMode: ProviderInteractionMode;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly lastRunAt: string | null;
  readonly lastError: string | null;
};

const nowIso = () => DateTime.formatIso(DateTime.nowUnsafe());
const normalizeIntervalHours = (value: number | undefined) =>
  Math.max(1, Math.round(Number.isFinite(value) ? (value as number) : 1));

/** Calculates the next persisted occurrence without depending on the UI process. */
export function nextAutomationOccurrence(
  schedule: AutomationSchedule,
  from: string,
  intervalHours = 1,
): string | null {
  if (schedule === "once") return null;
  const current = DateTime.makeUnsafe(from);
  const next =
    schedule === "hourly"
      ? DateTime.add(current, { hours: normalizeIntervalHours(intervalHours) })
      : schedule === "daily"
        ? DateTime.add(current, { days: 1 })
        : DateTime.add(current, { days: 7 });
  return DateTime.formatIso(next);
}

function decodeModelSelection(value: string | null): ModelSelection | null {
  if (!value) return null;
  try {
    return Schema.decodeUnknownSync(Schema.fromJsonString(ModelSelection))(value);
  } catch {
    return null;
  }
}

function toAutomation(row: AutomationRow): Automation {
  return {
    id: row.id as AutomationId,
    environmentId: row.environmentId as Automation["environmentId"],
    threadId: row.threadId as ThreadId,
    providerInstanceId: row.providerInstanceId as Automation["providerInstanceId"],
    title: row.title,
    prompt: row.prompt,
    schedule: row.schedule,
    intervalHours: row.intervalHours,
    runAt: row.runAt,
    nextRunAt: row.nextRunAt,
    timezone: row.timezone,
    enabled: row.enabled === 1,
    status: row.status,
    executionMode: row.executionMode,
    notificationsEnabled: row.notificationsEnabled === 1,
    modelSelection: decodeModelSelection(row.modelSelectionJson),
    runtimeMode: row.runtimeMode,
    interactionMode: row.interactionMode,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    lastRunAt: row.lastRunAt,
    lastError: row.lastError,
  };
}

const AUTOMATION_COLUMNS = `
  id, environment_id AS "environmentId", thread_id AS "threadId",
  provider_instance_id AS "providerInstanceId", title, prompt, schedule,
  interval_hours AS "intervalHours", run_at AS "runAt", next_run_at AS "nextRunAt",
  timezone, enabled, status, execution_mode AS "executionMode",
  notifications_enabled AS "notificationsEnabled",
  model_selection_json AS "modelSelectionJson", runtime_mode AS "runtimeMode",
  interaction_mode AS "interactionMode", created_at AS "createdAt",
  updated_at AS "updatedAt", last_run_at AS "lastRunAt", last_error AS "lastError"
`;

export interface AutomationServiceShape {
  readonly list: () => Effect.Effect<ReadonlyArray<Automation>, AutomationServiceError>;
  readonly create: (
    input: AutomationCreateInput,
  ) => Effect.Effect<Automation, AutomationServiceError>;
  readonly update: (
    id: AutomationId,
    input: AutomationUpdateInput,
  ) => Effect.Effect<Automation, AutomationServiceError>;
  readonly toggle: (
    id: AutomationId,
    enabled: boolean,
  ) => Effect.Effect<Automation, AutomationServiceError>;
  readonly delete: (id: AutomationId) => Effect.Effect<boolean, AutomationServiceError>;
  readonly runNow: (id: AutomationId) => Effect.Effect<Automation, AutomationServiceError>;
}

export class AutomationService extends Context.Service<AutomationService, AutomationServiceShape>()(
  "t3/automations/AutomationService",
) {}

export const AutomationServiceLive = Layer.effect(
  AutomationService,
  Effect.gen(function* () {
    const sql = yield* SqlClient.SqlClient;
    const crypto = yield* Crypto.Crypto;
    const environment = yield* ServerEnvironment;
    const engine = yield* OrchestrationEngineService;
    const snapshots = yield* ProjectionSnapshotQuery;
    const environmentId = yield* environment.getEnvironmentId;

    const queryRows = (query: Effect.Effect<ReadonlyArray<AutomationRow>, SqlError>) =>
      query.pipe(
        Effect.mapError((cause) => new AutomationServiceError({ operation: "query", cause })),
      );

    const selectById = (id: AutomationId) =>
      queryRows(
        sql`SELECT ${sql.unsafe(AUTOMATION_COLUMNS)} FROM automations WHERE id = ${id} LIMIT 1`,
      ).pipe(
        Effect.map((rows) =>
          rows[0] ? Option.some(toAutomation(rows[0])) : Option.none<Automation>(),
        ),
      );

    const requireAutomation = (id: AutomationId) =>
      selectById(id).pipe(
        Effect.flatMap(
          Option.match({
            onNone: () =>
              Effect.fail(new AutomationServiceError({ operation: "not_found", cause: id })),
            onSome: Effect.succeed,
          }),
        ),
      );

    const list = () =>
      queryRows(
        sql`SELECT ${sql.unsafe(AUTOMATION_COLUMNS)} FROM automations ORDER BY next_run_at ASC, created_at ASC`,
      ).pipe(Effect.map((rows) => rows.map(toAutomation)));

    const create = (input: AutomationCreateInput) =>
      Effect.gen(function* () {
        const createdAt = nowIso();
        const title = input.title.trim();
        const id = (yield* crypto.randomUUIDv4.pipe(Effect.orDie)) as AutomationId;
        const templateThreadId = input.templateThreadId ?? input.threadId;
        const templateThread = templateThreadId
          ? Option.getOrUndefined(yield* snapshots.getThreadDetailById(templateThreadId))
          : undefined;
        const threadId = (yield* crypto.randomUUIDv4.pipe(Effect.orDie)) as ThreadId;
        const modelSelection = input.modelSelection ??
          templateThread?.modelSelection ?? {
            instanceId: input.providerInstanceId ?? ProviderInstanceId.make("codex"),
            model: DEFAULT_MODEL,
          };
        const runtimeMode =
          input.runtimeMode ?? templateThread?.runtimeMode ?? DEFAULT_RUNTIME_MODE;
        const interactionMode =
          input.interactionMode ??
          templateThread?.interactionMode ??
          DEFAULT_PROVIDER_INTERACTION_MODE;
        const command = {
          type: "thread.create" as const,
          commandId: (yield* crypto.randomUUIDv4.pipe(Effect.orDie)) as CommandId,
          threadId,
          projectId: UNSCOPED_CHAT_PROJECT_ID,
          title,
          modelSelection,
          runtimeMode,
          interactionMode,
          branch: null,
          worktreePath: null,
          createdAt,
        } as unknown as OrchestrationCommand;
        yield* engine
          .dispatch(command)
          .pipe(
            Effect.mapError(
              (cause) => new AutomationServiceError({ operation: "create_thread", cause }),
            ),
          );
        const modelSelectionJson = yield* Schema.encodeEffect(
          Schema.fromJsonString(ModelSelection),
        )(modelSelection);
        const intervalHours = normalizeIntervalHours(input.intervalHours);
        yield* sql`
          INSERT INTO automations (
            id, environment_id, thread_id, provider_instance_id, title, prompt,
            schedule, interval_hours, run_at, next_run_at, timezone, enabled, status,
            execution_mode, notifications_enabled, model_selection_json, runtime_mode,
            interaction_mode, created_at, updated_at
          ) VALUES (
            ${id}, ${environmentId}, ${threadId}, ${modelSelection.instanceId}, ${title}, ${input.prompt},
            ${input.schedule}, ${intervalHours}, ${input.runAt}, ${input.runAt}, ${input.timezone}, 1, 'active',
            ${input.executionMode ?? "chat"}, ${input.notificationsEnabled === false ? 0 : 1}, ${modelSelectionJson},
            ${runtimeMode}, ${interactionMode}, ${createdAt}, ${createdAt}
          )
        `;
        return yield* requireAutomation(id);
      }).pipe(
        Effect.mapError((cause) =>
          cause instanceof AutomationServiceError
            ? cause
            : new AutomationServiceError({ operation: "create", cause }),
        ),
      );

    const update = (id: AutomationId, input: AutomationUpdateInput) =>
      requireAutomation(id).pipe(
        Effect.flatMap((current) => {
          const intervalHours = normalizeIntervalHours(
            input.intervalHours ?? current.intervalHours,
          );
          const runAt = input.runAt ?? current.runAt;
          const nextRunAt = current.enabled ? runAt : null;
          const modelSelectionJson =
            input.modelSelection !== undefined
              ? input.modelSelection === null
                ? null
                : JSON.stringify(input.modelSelection)
              : undefined;
          return sql`
            UPDATE automations SET title = ${input.title ?? current.title},
              prompt = ${input.prompt ?? current.prompt}, schedule = ${input.schedule ?? current.schedule},
              interval_hours = ${intervalHours}, run_at = ${runAt}, next_run_at = ${nextRunAt},
              timezone = ${input.timezone ?? current.timezone},
              provider_instance_id = ${input.providerInstanceId ?? current.providerInstanceId},
              ${
                modelSelectionJson !== undefined
                  ? sql`model_selection_json = ${modelSelectionJson},`
                  : sql``
              }
              status = CASE WHEN ${current.enabled ? 1 : 0} = 1 THEN 'active' ELSE 'paused' END,
              updated_at = ${nowIso()}, last_error = NULL WHERE id = ${id}
          `.pipe(Effect.flatMap(() => requireAutomation(id)));
        }),
        Effect.mapError((cause) =>
          cause instanceof AutomationServiceError
            ? cause
            : new AutomationServiceError({ operation: "update", cause }),
        ),
      );

    const toggle = (id: AutomationId, enabled: boolean) =>
      requireAutomation(id).pipe(
        Effect.flatMap((current) =>
          sql`
          UPDATE automations SET enabled = ${enabled ? 1 : 0},
            status = ${enabled ? "active" : "paused"},
            next_run_at = ${enabled ? (current.nextRunAt ?? current.runAt) : null},
            updated_at = ${nowIso()} WHERE id = ${id}
        `.pipe(Effect.flatMap(() => requireAutomation(id))),
        ),
        Effect.mapError((cause) =>
          cause instanceof AutomationServiceError
            ? cause
            : new AutomationServiceError({ operation: "toggle", cause }),
        ),
      );

    const remove = (id: AutomationId) =>
      sql`DELETE FROM automations WHERE id = ${id}`.pipe(
        Effect.map(() => true),
        Effect.mapError((cause) => new AutomationServiceError({ operation: "delete", cause })),
      );

    const execute = (automation: Automation) =>
      snapshots.getThreadDetailById(automation.threadId).pipe(
        Effect.flatMap(
          Option.match({
            onNone: () =>
              Effect.fail(
                new AutomationServiceError({
                  operation: "thread_not_found",
                  cause: automation.threadId,
                }),
              ),
            onSome: (thread) =>
              Effect.gen(function* () {
                const commandId = (yield* crypto.randomUUIDv4.pipe(Effect.orDie)) as CommandId;
                const messageId = (yield* crypto.randomUUIDv4.pipe(Effect.orDie)) as MessageId;
                const command = {
                  type: "thread.turn.start" as const,
                  commandId,
                  threadId: automation.threadId,
                  message: {
                    messageId,
                    role: "user" as const,
                    text: automation.prompt,
                    attachments: [],
                  },
                  modelSelection: automation.modelSelection ?? thread.modelSelection,
                  titleSeed: automation.title,
                  runtimeMode: automation.runtimeMode,
                  interactionMode: automation.interactionMode,
                  createdAt: nowIso(),
                } as unknown as OrchestrationCommand;
                yield* engine
                  .dispatch(command)
                  .pipe(
                    Effect.mapError(
                      (cause) => new AutomationServiceError({ operation: "dispatch", cause }),
                    ),
                  );
              }),
          }),
        ),
      );

    const runNow = (id: AutomationId) =>
      requireAutomation(id).pipe(
        Effect.flatMap((automation) =>
          sql`UPDATE automations SET status = 'running', updated_at = ${nowIso()} WHERE id = ${id}`.pipe(
            Effect.flatMap(() => execute(automation)),
            Effect.as(automation),
          ),
        ),
        Effect.flatMap((automation) => {
          const runAt = nowIso();
          const nextRunAt = nextAutomationOccurrence(
            automation.schedule,
            runAt,
            automation.intervalHours,
          );
          return sql`
            UPDATE automations SET last_run_at = ${runAt}, next_run_at = ${nextRunAt},
              enabled = ${nextRunAt === null ? 0 : 1}, status = ${nextRunAt === null ? "completed" : "active"},
              updated_at = ${runAt}, last_error = NULL WHERE id = ${id}
          `.pipe(Effect.flatMap(() => requireAutomation(id)));
        }),
        Effect.mapError((cause) =>
          cause instanceof AutomationServiceError
            ? cause
            : new AutomationServiceError({ operation: "run_now", cause }),
        ),
      );

    const runDue = Effect.gen(function* () {
      const due = yield* sql<{ readonly id: string }>`
        SELECT id FROM automations
        WHERE enabled = 1 AND status = 'active' AND next_run_at IS NOT NULL AND next_run_at <= ${nowIso()}
        ORDER BY next_run_at ASC
      `;
      yield* Effect.forEach(due, ({ id }) =>
        runNow(id as AutomationId).pipe(
          Effect.catchTag("AutomationServiceError", (error) =>
            sql`UPDATE automations SET status = 'failed', last_error = ${String(error.cause)}, updated_at = ${nowIso()} WHERE id = ${id}`.pipe(
              Effect.asVoid,
            ),
          ),
        ),
      );
    });

    // The scheduler belongs to the server runtime, not the schedule page. A restart
    // therefore resumes persisted due work even when the UI has never been opened.
    yield* Effect.forkScoped(
      Effect.repeat(
        runDue.pipe(Effect.catch((error) => Effect.logWarning(error))),
        Schedule.spaced("1 second"),
      ),
    );

    return {
      list,
      create,
      update,
      toggle,
      delete: remove,
      runNow,
    } satisfies AutomationServiceShape;
  }),
);
