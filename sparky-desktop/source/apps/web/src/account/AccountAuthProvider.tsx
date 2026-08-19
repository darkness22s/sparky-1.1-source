import { NeonAuthUIProvider } from "@neondatabase/auth-ui";
import { setManagedRelaySession } from "@sparky/client-runtime/relay";
import type { ReactNode } from "react";
import { useEffect } from "react";

import { appAtomRegistry } from "../rpc/atomRegistry";
import { fetchAccountSnapshot } from "./accountApi";
import { neonAuth } from "./neonAuth";

function AccountRelaySessionBridge() {
  const session = neonAuth!.adapter.useSession();
  const accountId = session.data?.user.id ?? null;

  useEffect(() => {
    if (session.isPending || accountId === null) {
      setManagedRelaySession(appAtomRegistry, null);
      return;
    }

    setManagedRelaySession(appAtomRegistry, {
      accountId,
      readAccountToken: async () => (await neonAuth!.getJWTToken?.()) ?? null,
    });
  }, [accountId, session.isPending]);

  useEffect(() => {
    if (session.isPending || accountId === null) return;
    void fetchAccountSnapshot().catch((error: unknown) => {
      console.warn(
        "Sparky account API is unavailable",
        error instanceof Error ? error.message : "request failed",
      );
    });
  }, [accountId, session.isPending]);

  return null;
}

export function AccountAuthProvider({ children }: { readonly children: ReactNode }) {
  if (neonAuth === null) {
    return children;
  }

  return (
    <NeonAuthUIProvider
      authClient={neonAuth.adapter}
      defaultTheme="system"
      emailOTP={false}
      passkey={false}
      social={{ providers: ["google", "apple"] }}
    >
      <AccountRelaySessionBridge />
      {children}
    </NeonAuthUIProvider>
  );
}
