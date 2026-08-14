import {
  Automation,
  AutomationCreateInput,
  AutomationId,
  AutomationSchedule,
  AutomationStatus,
  AutomationUpdateInput,
  CommandId,
  ModelSelection,
  MessageId,
  OrchestrationCommand,
  RuntimeMode,
  ProviderInteractionMode,
  ThreadId,
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
import { ProjectionSnapshotQuery } from "../orchestration/Services/ProjectionSnapshotQuery.ts";
import { OrchestrationEngineService } from "../orchestration/Services/OrchestrationEngine.ts";

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
  readonly runAt: string;
  readonly nextRunAt: string | null;
  readonly timezone: string;
  readonly enabled: number;
  readonly status: AutomationStatus;
  readonly modelSelectionJson: string | null;
  readonly runtimeMode: RuntimeMode;
  readonly interactionMode: ProviderInteractionMode;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly lastRunAt: string | null;
  readonly lastError: string | null;
};

const nowIso = () => DateTime.formatIso(DateTime.nowUnsafe());

export function nextAutomationOccurrence(schedule: AutomationSchedule, from: string): string | null {
  if (schedule === "once") return null;
  const current = DateTime.makeUnsafe(from);
  if (schedule === "weekly") {
    return DateTime.formatIso(DateTime.add(current, { days: 7 }));
  }
  let next = DateTime.add(current, { days: 1 });
  while (schedule === "weekdays") {
    const weekday = DateTime.toPartsUtc(next).weekDay;
    if (weekday !== 0 && weekday !== 6) break;
    next = DateTime.add(next, { days: 1 });
  }
  return DateTime.formatIso(next);
}

function toAutomation(row: AutomationRow): Automation {
  let modelSelection: ModelSelection | null = null;
  if (row.modelSelectionJson) {
    try {
      modelSelection = Schema.decodeUnknownSync(Schema.fromJsonString(ModelSelection))(
        row.modelSelectionJson,
      );
    } catch {
      modelSelection = null;
    }
  }
  return {
    id: row.id as AutomationId,
    environmentId: row.environmentId as Automation["environmentId"],
    threadId: row.threadId as ThreadId,
    providerInstanceId: row.providerInstanceId as Automation["providerInstanceId"],
    title: row.title,
    prompt: row.prompt,
    schedule: row.schedule,
    runAt: row.runAt,
    nextRunAt: row.nextRunAt,
    timezone: row.timezone,
    enabled: row.enabled === 1,
    status: row.status,
    modelSelection,
    runtimeMode: row.runtimeMode,
    interactionMode: row.interactionMode,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    lastRunAt: row.lastRunAt,
    lastError: row.lastError,
  };
}

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

    const list = (): Effect.Effect<ReadonlyArray<Automation>, AutomationServiceError> =>
      queryRows(
        sql`
          SELECT id, environment_id AS "environmentId", thread_id AS "threadId",
            provider_instance_id AS "providerInstanceId", title, prompt, schedule,
            run_at AS "runAt", next_run_at AS "nextRunAt", timezone, enabled, status,
            model_selection_json AS "modelSelectionJson", runtime_mode AS "runtimeMode",
            interaction_mode AS "interactionMode", created_at AS "createdAt",
            updated_at AS "updatedAt", last_run_at AS "lastRunAt", last_error AS "lastError"
          FROM automations ORDER BY next_run_at ASC, created_at ASC
        `,
      ).pipe(Effect.map((rows) => rows.map(toAutomation)));

    const get = (id: AutomationId) =>
      queryRows(
        sql`
          SELECT id, environment_id AS "environmentId", thread_id AS "threadId",
            provider_instance_id AS "providerInstanceId", title, prompt, schedule,
            run_at AS "runAt", next_run_at AS "nextRunAt", timezone, enabled, status,
            model_selection_json AS "modelSelectionJson", runtime_mode AS "runtimeMode",
            interaction_mode AS "interactionMode", created_at AS "createdAt",
            updated_at AS "updatedAt", last_run_at AS "lastRunAt", last_error AS "lastError"
          FROM automations WHERE id = ${id} LIMIT 1
        `,
      ).pipe(
        Effect.map((rows) =>
          rows.length === 0 ? Option.none<Automation>() : Option.some(toAutomation(rows[0]!)),
        ),
      );

    const requireAutomation = (id: AutomationId) =>
      get(id).pipe(
        Effect.flatMap(
          Option.match({
            onNone: () =>
              Effect.fail(new AutomationServiceError({ operation: "not_found", cause: id })),
            onSome: Effect.succeed,
          }),
        ),
      );

    const create: AutomationServiceShape["create"] = (input) =>
      Effect.gen(function* () {
        const createdAt = nowIso();
        const id = (yield* crypto.randomUUIDv4.pipe(Effect.orDie)) as AutomationId;
        const modelSelectionJson =
          input.modelSelection === null
            ? null
            : yield* Schema.encodeEffect(Schema.fromJsonString(ModelSelection))(input.modelSelection);
        yield* sql`
          INSERT INTO automations (
            id, environment_id, thread_id, provider_instance_id, title, prompt,
            schedule, run_at, next_run_at, timezone, enabled, status,
            model_selection_json, runtime_mode, interaction_mode, created_at, updated_at
          ) VALUES (
            ${id}, ${environmentId}, ${input.threadId}, ${input.providerInstanceId}, ${input.title}, ${input.prompt},
            ${input.schedule}, ${input.runAt}, ${input.runAt}, ${input.timezone}, 1, 'active',
            ${modelSelectionJson},
            ${input.runtimeMode}, ${input.interactionMode}, ${createdAt}, ${createdAt}
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

    const update: AutomationServiceShape["update"] = (id, input) =>
      requireAutomation(id).pipe(
        Effect.flatMap((current) => {
          const schedule = input.schedule ?? current.schedule;
          const runAt = input.runAt ?? current.runAt;
          const nextRunAt = current.enabled ? runAt : null;
          return sql`
            UPDATE automations SET
              title = ${input.title ?? current.title},
              prompt = ${input.prompt ?? current.prompt},
              schedule = ${schedule}, run_at = ${runAt}, next_run_at = ${nextRunAt},
              timezone = ${input.timezone ?? current.timezone},
              status = CASE WHEN ${current.enabled ? 1 : 0} = 1 THEN 'active' ELSE 'paused' END,
              updated_at = ${nowIso()}, last_error = NULL
            WHERE id = ${id}
          `.pipe(Effect.flatMap(() => requireAutomation(id)));
        }),
        Effect.mapError((cause) =>
          cause instanceof AutomationServiceError
            ? cause
            : new AutomationServiceError({ operation: "update", cause }),
        ),
      );

    const toggle: AutomationServiceShape["toggle"] = (id, enabled) =>
      requireAutomation(id).pipe(
        Effect.flatMap((current) =>
          sql`
            UPDATE automations SET enabled = ${enabled ? 1 : 0},
              status = ${enabled ? "active" : "paused"},
              next_run_at = ${enabled ? (current.nextRunAt ?? current.runAt) : null},
              updated_at = ${nowIso()}
            WHERE id = ${id}
          `.pipe(Effect.flatMap(() => requireAutomation(id))),
        ),
        Effect.mapError((cause) =>
          cause instanceof AutomationServiceError
            ? cause
            : new AutomationServiceError({ operation: "toggle", cause }),
        ),
      );

    const remove: AutomationServiceShape["delete"] = (id) =>
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
                const commandId = (yield* crypto.randomUUIDv4.pipe(
                  Effect.orDie,
                )) as unknown as CommandId;
                const messageId = (yield* crypto.randomUUIDv4.pipe(
                  Effect.orDie,
                )) as unknown as MessageId;
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
        Effect.mapError((cause) =>
          cause instanceof AutomationServiceError
            ? cause
            : new AutomationServiceError({ operation: "execute", cause }),
        ),
      );

    const runNow: AutomationServiceShape["runNow"] = (id) =>
      requireAutomation(id).pipe(
        Effect.tap(execute),
        Effect.flatMap((automation) => {
          const runAt = nowIso();
          const nextRunAt = nextAutomationOccurrence(automation.schedule, runAt);
          const status = nextRunAt === null ? "completed" : "active";
          return sql`
            UPDATE automations SET last_run_at = ${runAt}, next_run_at = ${nextRunAt},
              enabled = ${nextRunAt === null ? 0 : 1}, status = ${status},
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
      const due = yield* queryRows(
        sql`
          SELECT id, environment_id AS "environmentId", thread_id AS "threadId",
            provider_instance_id AS "providerInstanceId", title, prompt, schedule,
            run_at AS "runAt", next_run_at AS "nextRunAt", timezone, enabled, status,
            model_selection_json AS "modelSelectionJson", runtime_mode AS "runtimeMode",
            interaction_mode AS "interactionMode", created_at AS "createdAt",
            updated_at AS "updatedAt", last_run_at AS "lastRunAt", last_error AS "lastError"
          FROM automations
          WHERE enabled = 1 AND status = 'active' AND next_run_at <= ${nowIso()}
        `,
      );
      yield* Effect.forEach(due, (row) =>
        runNow(row.id as AutomationId).pipe(
          Effect.catchTag("AutomationServiceError", (error) =>
            sql`UPDATE automations SET status = 'failed', last_error = ${String(error.cause)}, updated_at = ${nowIso()} WHERE id = ${row.id}`.pipe(
              Effect.asVoid,
            ),
          ),
        ),
      );
    });

    yield* Effect.forkScoped(
      Effect.repeat(
        runDue.pipe(Effect.catch((error) => Effect.logWarning(error))),
        Schedule.spaced("15 seconds"),
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
