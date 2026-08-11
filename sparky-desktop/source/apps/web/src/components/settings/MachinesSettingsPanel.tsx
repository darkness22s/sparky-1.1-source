import {
  CheckIcon,
  CloudIcon,
  CopyIcon,
  ExternalLinkIcon,
  MonitorIcon,
  PlusIcon,
  RefreshCwIcon,
  Trash2Icon,
} from "lucide-react";
import { useState } from "react";

import { environmentCatalog } from "../../connection/catalog";
import { CloudEnvironmentConnectRows } from "../cloud/CloudEnvironmentConnectList";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
} from "../ui/dialog";
import { toastManager } from "../ui/toast";
import { useAtomCommand } from "../../state/use-atom-command";
import { useEnvironments, usePrimaryEnvironmentId } from "../../state/environments";
import { selectMachineEnvironments } from "../../machines";
import { SettingsPageContainer, SettingsSection, SettingsRow } from "./settingsLayout";
import { ConnectionStatusDot } from "../ConnectionStatusDot";
import { presentSavedCloudEnvironmentConnection } from "../cloud/cloudEnvironmentConnectionPresentation";
import {
  isAtomCommandInterrupted,
  squashAtomCommandFailure,
} from "@sparky/client-runtime/state/runtime";

const CONNECT_COMMAND = "t3 connect link";

function AddMachineDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [copied, setCopied] = useState(false);

  const copyCommand = async () => {
    try {
      await navigator.clipboard.writeText(CONNECT_COMMAND);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      toastManager.add({
        type: "error",
        title: "Could not copy command",
        description: "Copy the command manually from the dialog.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup className="max-w-lg">
        <DialogHeader>
          <div className="flex size-9 items-center justify-center rounded-lg border border-border/70 bg-muted/60">
            <CloudIcon className="size-4.5 text-muted-foreground" aria-hidden />
          </div>
          <DialogTitle>Add a machine</DialogTitle>
          <DialogDescription>
            Connect any machine that runs Sparky. The operating system and local development tools
            can be different; only the Sparky app and the same account are required.
          </DialogDescription>
        </DialogHeader>
        <DialogPanel>
          <ol className="space-y-4 text-sm">
            <li className="flex gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                1
              </span>
              <span className="pt-0.5">
                Install and open Sparky on the machine you want to add.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                2
              </span>
              <span className="pt-0.5">Sign in with this same Sparky account, then run:</span>
            </li>
          </ol>
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-border/70 bg-muted/35 p-3">
            <code className="min-w-0 flex-1 overflow-x-auto font-mono text-xs text-foreground">
              {CONNECT_COMMAND}
            </code>
            <Button size="sm" variant="outline" onClick={() => void copyCommand()}>
              {copied ? <CheckIcon className="size-3.5" /> : <CopyIcon className="size-3.5" />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
          <p className="mt-4 flex gap-2 text-xs leading-relaxed text-muted-foreground">
            <ExternalLinkIcon className="mt-0.5 size-3.5 shrink-0" aria-hidden />
            After the link is approved, refresh this page. The machine will be available in the
            composer&apos;s <span className="font-medium text-foreground">Run on</span> menu.
          </p>
        </DialogPanel>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  );
}

export function MachinesSettingsPanel() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const primaryEnvironmentId = usePrimaryEnvironmentId();
  const { environments, isReady } = useEnvironments();
  const removeEnvironment = useAtomCommand(environmentCatalog.remove, { reportFailure: false });
  const savedMachines = selectMachineEnvironments(environments, primaryEnvironmentId);

  const handleRemove = async (
    environmentId: (typeof savedMachines)[number]["environmentId"],
    label: string,
  ) => {
    const result = await removeEnvironment(environmentId);
    if (result._tag === "Success") {
      toastManager.add({
        type: "success",
        title: "Machine removed",
        description: `${label} is no longer available in this Sparky workspace.`,
      });
      return;
    }
    if (isAtomCommandInterrupted(result)) return;
    const cause = squashAtomCommandFailure(result);
    toastManager.add({
      type: "error",
      title: "Could not remove machine",
      description: cause instanceof Error ? cause.message : "The machine could not be removed.",
    });
  };

  const primary = environments.find(
    (environment) => environment.environmentId === primaryEnvironmentId,
  );

  return (
    <SettingsPageContainer>
      <SettingsSection
        title="Machines"
        icon={<CloudIcon className="size-3.5" />}
        headerAction={
          <Button size="xs" onClick={() => setAddDialogOpen(true)}>
            <PlusIcon className="size-3.5" /> Add machine
          </Button>
        }
      >
        <div className="border-b border-border/60 px-5 py-4">
          <p className="max-w-2xl text-xs leading-relaxed text-muted-foreground/80">
            Connect multiple Sparky apps and choose where each thread runs. Machines can use
            different operating systems and software; Sparky Cloud handles the secure connection.
          </p>
        </div>

        {primary ? (
          <SettingsRow
            title={
              <span className="flex items-center gap-2">
                <MonitorIcon className="size-4 text-muted-foreground" aria-hidden />
                {primary.label}
              </span>
            }
            description="This device"
            status={
              <span className="inline-flex items-center gap-1.5 text-success">
                <ConnectionStatusDot dotClassName="bg-success" /> Connected
              </span>
            }
          />
        ) : null}

        {savedMachines.map((machine) => {
          const connection = presentSavedCloudEnvironmentConnection(machine.connection);
          const dotClassName =
            connection.tone === "connected"
              ? "bg-success"
              : connection.tone === "connecting"
                ? "bg-warning"
                : connection.tone === "error"
                  ? "bg-destructive"
                  : "bg-muted-foreground/35";
          return (
            <SettingsRow
              key={machine.environmentId}
              title={
                <span className="flex min-w-0 items-center gap-2">
                  <CloudIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                  <span className="truncate">{machine.label}</span>
                </span>
              }
              description="Sparky Cloud machine"
              status={
                <span className="inline-flex items-center gap-1.5">
                  <ConnectionStatusDot dotClassName={dotClassName} /> {connection.statusText}
                </span>
              }
              control={
                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive hover:text-destructive"
                  onClick={() => void handleRemove(machine.environmentId, machine.label)}
                >
                  <Trash2Icon className="size-3.5" /> Remove
                </Button>
              }
            />
          );
        })}

        {isReady && savedMachines.length === 0 ? (
          <div className="border-t border-border/60 px-5 py-5 text-sm text-muted-foreground">
            No other machines are connected yet. Add one to run work from this device elsewhere.
          </div>
        ) : null}
      </SettingsSection>

      <SettingsSection title="Available machines" icon={<RefreshCwIcon className="size-3.5" />}>
        <CloudEnvironmentConnectRows
          primaryEnvironmentId={primaryEnvironmentId}
          savedEnvironments={savedMachines.map(({ environmentId, connection }) => ({
            environmentId,
            connection,
          }))}
          empty={
            <div className="border-t border-border/60 px-5 py-5 text-sm text-muted-foreground">
              No new linked machines found. Add Sparky on another machine, sign in, and run the link
              command.
            </div>
          }
        />
      </SettingsSection>

      <AddMachineDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />
    </SettingsPageContainer>
  );
}
