import type { EnvironmentId } from "@sparky/contracts";
import type { ConnectionTarget } from "@sparky/client-runtime/connection";

export interface MachineEnvironment {
  readonly environmentId: EnvironmentId;
  readonly relayManaged: boolean;
  readonly connectionKind?: ConnectionTarget["_tag"];
}

/** Return linked remote environments, excluding the device running the UI. */
export function selectMachineEnvironments<T extends MachineEnvironment>(
  environments: readonly T[],
  primaryEnvironmentId: EnvironmentId | null,
): T[] {
  return environments.filter(
    (environment) =>
      environment.environmentId !== primaryEnvironmentId &&
      (environment.relayManaged || environment.connectionKind === "BearerConnectionTarget"),
  );
}
