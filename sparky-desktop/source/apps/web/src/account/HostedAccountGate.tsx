import { AuthSurfaceShell } from "../components/auth/AuthSurfaceShell";
import { Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

import { neonAuth } from "./neonAuth";

type HostedAccountSessionState = {
  readonly status: "pending" | "ready";
  readonly data: unknown;
};

export function HostedAccountGate({ appShell }: { readonly appShell: ReactNode }) {
  if (neonAuth === null) {
    return appShell;
  }

  return <ConfiguredHostedAccountGate appShell={appShell} />;
}

function ConfiguredHostedAccountGate({ appShell }: { readonly appShell: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [session, setSession] = useState<HostedAccountSessionState>({
    status: "pending",
    data: null,
  });
  const onOnboardingRoute = location.pathname === "/onboarding";

  useEffect(() => {
    let active = true;
    setSession({ status: "pending", data: null });
    void neonAuth!.adapter
      .getSession()
      .then((result) => {
        if (active) {
          setSession({ status: "ready", data: result.data ?? null });
        }
      })
      .catch(() => {
        if (active) {
          setSession({ status: "ready", data: null });
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (session.status === "pending" || session.data || onOnboardingRoute) {
      return;
    }
    void navigate({ to: "/onboarding", replace: true });
  }, [navigate, onOnboardingRoute, session.data, session.status]);

  if (session.status === "pending") {
    return (
      <AuthSurfaceShell>
        <div className="flex min-h-32 items-center justify-center text-sm text-muted-foreground">
          Checking your account…
        </div>
      </AuthSurfaceShell>
    );
  }

  if (!session.data) {
    return onOnboardingRoute ? <Outlet /> : null;
  }

  return appShell;
}
