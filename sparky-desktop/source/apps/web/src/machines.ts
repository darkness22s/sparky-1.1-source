import type { EnvironmentId } from "@sparky/contracts";

export interface MachineEnvironment {
  readonly environmentId: EnvironmentId;
  readonly relayManaged: boolean;
}

/** Return linked Sparky environments, excluding the device running the UI. */
export function selectMachineEnvironments<T extends MachineEnvironment>(
  environments: readonly T[],
  primaryEnvironmentId: EnvironmentId | null,
): T[] {
  return environments.filter(
    (environment) => environment.relayManaged && environment.environmentId !== primaryEnvironmentId,
  );
}
