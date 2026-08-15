import {
  CopyIcon,
  KeyRoundIcon,
  MonitorIcon,
  NetworkIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { useState } from "react";
import { AuthStandardClientScopes } from "@sparky/contracts";
import {
  isAtomCommandInterrupted,
  squashAtomCommandFailure,
} from "@sparky/client-runtime/state/runtime";

import { environmentCatalog } from "../../connection/catalog";
import { readPrimaryCloudLinkTarget } from "../../cloud/linkEnvironment";
import { provisionPrimaryMachine } from "../../cloud/linkEnvironmentAtoms";
import { connectPairing } from "../../connection/onboarding";
import { createServerPairingCredential, revokeServerPairingLink } from "../../environments/primary";
import { useAtomCommand } from "../../state/use-atom-command";
import { useEnvironments, usePrimaryEnvironmentId } from "../../state/environments";
import { selectMachineEnvironments } from "../../machines";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
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
import { ConnectionStatusDot } from "../ConnectionStatusDot";
import { presentSavedCloudEnvironmentConnection } from "../cloud/cloudEnvironmentConnectionPresentation";
import { SettingsPageContainer, SettingsSection, SettingsRow } from "./settingsLayout";
import { makeSparkyPairingUrl } from "./machinesPairing";

function AddMachineDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [mode, setMode] = useState<"share" | "join">("share");
  const [host, setHost] = useState("");
  const [shareLabel, setShareLabel] = useState("");
  const [inviteId, setInviteId] = useState<string | null>(null);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [pairingUrl, setPairingUrl] = useState("");
  const [machineLabel, setMachineLabel] = useState("");
  const [busy, setBusy] = useState(false);
  const connectMachine = useAtomCommand(connectPairing, { reportFailure: false });
  const provisionMachine = useAtomCommand(provisionPrimaryMachine, { reportFailure: false });

  const createInvite = async () => {
    setBusy(true);
    try {
      const localTarget = readPrimaryCloudLinkTarget();
      let inviteHost = host.trim();
      if (!inviteHost && localTarget) {
        const result = await provisionMachine({
          target: localTarget,
        });
        if (result._tag !== "Success") {
          if (isAtomCommandInterrupted(result)) return;
          throw squashAtomCommandFailure(result);
        }
        inviteHost = result.value;
      }
      if (!inviteHost) {
        throw new Error("Enter an address that the other machine can reach.");
      }
      const credential = await createServerPairingCredential({
        ...(shareLabel.trim() ? { label: shareLabel.trim() } : {}),
        scopes: AuthStandardClientScopes,
      });
      setInviteId(credential.id);
      setInviteUrl(makeSparkyPairingUrl(inviteHost, credential.credential));
    } catch (error) {
      toastManager.add({
        type: "error",
        title: "Could not create machine invite",
        description: error instanceof Error ? error.message : "Try again from this machine.",
      });
    } finally {
      setBusy(false);
    }
  };

  const joinMachine = async () => {
    const trimmedUrl = pairingUrl.trim();
    if (!trimmedUrl) return;
    setBusy(true);
    const result = await connectMachine({
      pairingUrl: trimmedUrl,
      ...(machineLabel.trim() ? { label: machineLabel.trim() } : {}),
    });
    setBusy(false);
    if (result._tag === "Success") {
      toastManager.add({
        type: "success",
        title: "Machine paired",
        description: "The machine is now available in the Run on menu.",
      });
      onOpenChange(false);
      setPairingUrl("");
      setMachineLabel("");
      return;
    }
    if (isAtomCommandInterrupted(result)) return;
    const cause = squashAtomCommandFailure(result);
    toastManager.add({
      type: "error",
      title: "Could not pair machine",
      description: cause instanceof Error ? cause.message : "Check the invite and try again.",
    });
  };

  const copyInvite = async () => {
    if (!inviteUrl) return;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      toastManager.add({ type: "success", title: "Invite copied" });
    } catch {
      toastManager.add({
        type: "error",
        title: "Could not copy invite",
        description: "Select and copy the invite manually.",
      });
    }
  };

  const discardInvite = async () => {
    if (!inviteId) return;
    setBusy(true);
    try {
      await revokeServerPairingLink(inviteId);
      setInviteId(null);
      setInviteUrl(null);
      toastManager.add({ type: "success", title: "Invite revoked" });
    } catch (error) {
      toastManager.add({
        type: "error",
        title: "Could not revoke invite",
        description:
          error instanceof Error ? error.message : "The invite will expire automatically.",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup className="max-w-lg">
        <DialogHeader>
          <div className="flex size-9 items-center justify-center rounded-lg border border-border/70 bg-muted/60">
            <NetworkIcon className="size-4.5 text-muted-foreground" aria-hidden />
          </div>
          <DialogTitle>Pair a Sparky machine</DialogTitle>
          <DialogDescription>
            Pair with a one-time invite. No account is required.
          </DialogDescription>
        </DialogHeader>
        <DialogPanel className="space-y-5">
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted/45 p-1">
            <Button
              size="sm"
              variant={mode === "share" ? "default" : "ghost"}
              onClick={() => setMode("share")}
            >
              Share this machine
            </Button>
            <Button
              size="sm"
              variant={mode === "join" ? "default" : "ghost"}
              onClick={() => setMode("join")}
            >
              Join a machine
            </Button>
          </div>

          {mode === "share" ? (
            <div className="space-y-4">
              <label className="grid gap-2">
                <span className="text-xs font-medium">Reachable address (optional)</span>
                <Input
                  value={host}
                  onChange={(event) => setHost(event.target.value)}
                  placeholder="Leave blank for secure remote access"
                  autoFocus
                />
                <span className="text-[11px] leading-relaxed text-muted-foreground">
                  Leave blank to create a secure internet-reachable endpoint, or enter a LAN/VPN
                  address for direct pairing.
                </span>
              </label>
              <label className="grid gap-2">
                <span className="text-xs font-medium">Name for this machine (optional)</span>
                <Input
                  value={shareLabel}
                  onChange={(event) => setShareLabel(event.target.value)}
                  placeholder="e.g. Home desktop"
                />
              </label>
              <Button className="w-full" disabled={busy} onClick={() => void createInvite()}>
                <KeyRoundIcon className="size-3.5" />
                {busy ? "Creating invite…" : "Create one-time invite"}
              </Button>
              {inviteUrl ? (
                <div className="space-y-2 rounded-xl border border-primary/25 bg-primary/5 p-3">
                  <p className="text-xs font-medium">
                    Copy this invite into Sparky on the other machine
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap rounded-md bg-background/80 px-2 py-1.5 font-mono text-[11px]">
                      {inviteUrl}
                    </code>
                    <Button size="sm" variant="outline" onClick={() => void copyInvite()}>
                      <CopyIcon className="size-3.5" /> Copy
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={busy}
                      onClick={() => void discardInvite()}
                    >
                      Revoke
                    </Button>
                  </div>
                  <p className="text-[11px] leading-relaxed text-muted-foreground">
                    This invite is single-use and expires automatically. Keep it private.
                  </p>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="space-y-4">
              <label className="grid gap-2">
                <span className="text-xs font-medium">Machine invite</span>
                <Input
                  value={pairingUrl}
                  onChange={(event) => setPairingUrl(event.target.value)}
                  placeholder="Paste the Sparky invite here"
                  autoFocus
                />
              </label>
              <label className="grid gap-2">
                <span className="text-xs font-medium">Local machine name (optional)</span>
                <Input
                  value={machineLabel}
                  onChange={(event) => setMachineLabel(event.target.value)}
                  placeholder="e.g. Linux build box"
                />
              </label>
              <Button
                className="w-full"
                disabled={!pairingUrl.trim() || busy}
                onClick={() => void joinMachine()}
              >
                <NetworkIcon className="size-3.5" />
                {busy ? "Pairing…" : "Pair machine"}
              </Button>
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                The invite is exchanged directly with the other Sparky instance. Both machines must
                be able to reach the address in the invite.
              </p>
            </div>
          )}
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
        icon={<NetworkIcon className="size-3.5" />}
        headerAction={
          <Button size="xs" onClick={() => setAddDialogOpen(true)}>
            <PlusIcon className="size-3.5" /> Pair machine
          </Button>
        }
      >
        <div className="border-b border-border/60 px-5 py-4">
          <p className="max-w-2xl text-xs leading-relaxed text-muted-foreground/80">
            Pair Sparky instances directly and choose where each thread runs. Each machine keeps its
            own local identity and can use a different operating system and development setup.
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
                  <NetworkIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                  <span className="truncate">{machine.label}</span>
                </span>
              }
              description="Paired Sparky machine"
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
            No other machines are paired yet. Pair one to run work from this device elsewhere.
          </div>
        ) : null}
      </SettingsSection>

      <AddMachineDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />
    </SettingsPageContainer>
  );
}
