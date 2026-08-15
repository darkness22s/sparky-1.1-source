import { EnvironmentId } from "@sparky/contracts";
import { describe, expect, it } from "vite-plus/test";

import { selectMachineEnvironments } from "./machines";

const primary = EnvironmentId.make("environment-primary");
const remote = EnvironmentId.make("environment-remote");
const ssh = EnvironmentId.make("environment-ssh");

describe("selectMachineEnvironments", () => {
  it("keeps linked remote environments and excludes the primary device", () => {
    const result = selectMachineEnvironments(
      [
        { environmentId: primary, relayManaged: false, label: "This device" },
        { environmentId: remote, relayManaged: true, label: "Laptop" },
        {
          environmentId: EnvironmentId.make("environment-paired-direct"),
          relayManaged: false,
          connectionKind: "BearerConnectionTarget",
          label: "Direct pair",
        },
        { environmentId: ssh, relayManaged: false, label: "SSH server" },
      ],
      primary,
    );

    expect(result.map(({ environmentId }) => environmentId)).toEqual([
      remote,
      EnvironmentId.make("environment-paired-direct"),
    ]);
  });

  it("supports a missing primary environment while the catalog is booting", () => {
    const result = selectMachineEnvironments(
      [{ environmentId: remote, relayManaged: true, label: "Laptop" }],
      null,
    );

    expect(result).toHaveLength(1);
  });
});
