import {
  AuthOrchestrationOperateScope,
  AuthOrchestrationReadScope,
  AutomationId,
  EnvironmentHttpApi,
} from "@sparky/contracts";
import * as Effect from "effect/Effect";
import * as Option from "effect/Option";
import * as HttpApiBuilder from "effect/unstable/httpapi/HttpApiBuilder";

import * as AutomationService from "./AutomationService.ts";
import {
  annotateEnvironmentRequest,
  failEnvironmentInternal,
  requireEnvironmentScope,
} from "../auth/http.ts";

export const automationHttpApiLayer = HttpApiBuilder.group(
  EnvironmentHttpApi,
  "automations",
  Effect.fnUntraced(function* (handlers) {
    const serviceOrDie = Effect.map(
      Effect.serviceOption(AutomationService.AutomationService),
      Option.getOrThrow,
    );

    const internal = (cause: unknown) =>
      failEnvironmentInternal("orchestration_snapshot_failed", cause);

    return handlers
      .handle(
        "list",
        Effect.fn("environment.automations.list")(function* (args) {
          const service = yield* serviceOrDie;
          yield* annotateEnvironmentRequest(args.endpoint.name);
          yield* requireEnvironmentScope(AuthOrchestrationReadScope);
          return yield* service.list().pipe(Effect.catch(internal));
        }),
      )
      .handle(
        "create",
        Effect.fn("environment.automations.create")(function* (args) {
          const service = yield* serviceOrDie;
          yield* annotateEnvironmentRequest(args.endpoint.name);
          yield* requireEnvironmentScope(AuthOrchestrationOperateScope);
          return yield* service.create(args.payload).pipe(Effect.catch(internal));
        }),
      )
      .handle(
        "update",
        Effect.fn("environment.automations.update")(function* (args) {
          const service = yield* serviceOrDie;
          yield* annotateEnvironmentRequest(args.endpoint.name);
          yield* requireEnvironmentScope(AuthOrchestrationOperateScope);
          return yield* service
            .update(args.params.automationId as AutomationId, args.payload)
            .pipe(Effect.catch(internal));
        }),
      )
      .handle(
        "toggle",
        Effect.fn("environment.automations.toggle")(function* (args) {
          const service = yield* serviceOrDie;
          yield* annotateEnvironmentRequest(args.endpoint.name);
          yield* requireEnvironmentScope(AuthOrchestrationOperateScope);
          return yield* service
            .toggle(args.params.automationId as AutomationId, args.payload.enabled)
            .pipe(Effect.catch(internal));
        }),
      )
      .handle(
        "run",
        Effect.fn("environment.automations.run")(function* (args) {
          const service = yield* serviceOrDie;
          yield* annotateEnvironmentRequest(args.endpoint.name);
          yield* requireEnvironmentScope(AuthOrchestrationOperateScope);
          return yield* service
            .runNow(args.params.automationId as AutomationId)
            .pipe(Effect.catch(internal));
        }),
      )
      .handle(
        "delete",
        Effect.fn("environment.automations.delete")(function* (args) {
          const service = yield* serviceOrDie;
          yield* annotateEnvironmentRequest(args.endpoint.name);
          yield* requireEnvironmentScope(AuthOrchestrationOperateScope);
          return yield* service.delete(args.params.automationId as AutomationId).pipe(
            Effect.map((deleted) => ({ deleted })),
            Effect.catch(internal),
          );
        }),
      );
  }),
);
