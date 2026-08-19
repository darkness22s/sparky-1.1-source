import { AuthView } from "@neondatabase/auth-ui";
import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { APP_BASE_NAME } from "../branding";
import { hasNeonAuthConfig } from "../account/neonAuth";
import { AuthSurfaceShell } from "../components/auth/AuthSurfaceShell";

type AuthMode = "sign-in" | "sign-up";

const authFormClassNames = {
  base: "space-y-6",
  input:
    "h-12 rounded-md border-input bg-muted px-4 text-base text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20",
  label: "text-sm font-medium text-foreground",
  primaryButton:
    "h-12 rounded-md bg-foreground text-base font-semibold text-background hover:opacity-90",
  outlineButton:
    "h-12 rounded-md border-border bg-background text-base font-semibold text-foreground hover:bg-muted",
  providerButton:
    "h-12 rounded-md border-border bg-background text-base font-semibold text-foreground hover:bg-muted",
  forgotPasswordLink:
    "text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground",
} as const;

function OnboardingRouteView() {
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const isSignUp = mode === "sign-up";
  const authRedirectURL = typeof window === "undefined" ? "/" : window.location.origin;

  return (
    <AuthSurfaceShell>
      <div className="mx-auto w-full">
        <div className="flex justify-center">
          <img
            alt={`${APP_BASE_NAME} logo`}
            className="size-14 object-contain"
            src={`${import.meta.env.BASE_URL}sparky-logo-small.svg`}
          />
        </div>

        <header className="flex flex-col text-center" style={{ gap: 20, marginTop: 48 }}>
          <h1 className="text-3xl font-semibold tracking-[-0.035em] text-foreground sm:text-4xl">
            {isSignUp ? `Sign up for ${APP_BASE_NAME}` : "Log in or sign up"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isSignUp ? "Create your workspace with one email." : "Use your email to continue."}
          </p>
        </header>

        {!hasNeonAuthConfig ? (
          <p className="text-center text-sm text-muted-foreground" style={{ marginTop: 56 }}>
            Neon Auth is not configured for this build yet.
          </p>
        ) : (
          <div style={{ marginTop: 56 }}>
            <AuthView
              callbackURL={authRedirectURL}
              className="[&_[data-slot=card]]:border-0 [&_[data-slot=card]]:bg-transparent [&_[data-slot=card]]:p-0 [&_[data-slot=card]]:shadow-none"
              classNames={{
                footer: "hidden",
                form: authFormClassNames,
                header: "hidden",
              }}
              path={isSignUp ? "sign-up" : "sign-in"}
              redirectTo={authRedirectURL}
              socialLayout="vertical"
            />
          </div>
        )}

        <p className="text-center text-sm text-muted-foreground" style={{ marginTop: 56 }}>
          {isSignUp ? "Already have an account?" : "New to Sparky?"}{" "}
          <button
            className="font-semibold text-foreground underline decoration-primary decoration-2 underline-offset-4 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => setMode(isSignUp ? "sign-in" : "sign-up")}
            type="button"
          >
            {isSignUp ? "Log in" : "Sign up"}
          </button>
        </p>

        <p
          className="text-center text-xs leading-5 text-muted-foreground"
          style={{ marginTop: 56 }}
        >
          By continuing, you agree to Sparky’s Terms and Privacy Policy.
        </p>
      </div>
    </AuthSurfaceShell>
  );
}

export const Route = createFileRoute("/onboarding")({
  component: OnboardingRouteView,
});
