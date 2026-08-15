import { createFileRoute } from "@tanstack/react-router";

import { MachinesSettingsPanel } from "../components/settings/MachinesSettingsPanel";

export const Route = createFileRoute("/settings/machines")({
  component: MachinesSettingsPanel,
});
