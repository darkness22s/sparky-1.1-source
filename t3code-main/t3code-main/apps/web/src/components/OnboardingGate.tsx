import { useEffect, useState } from "react";
import { CheckIcon, Code2Icon } from "lucide-react";

import {
  useClientSettings,
  useClientSettingsHydrated,
  useUpdateClientSettings,
} from "../hooks/useSettings";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";

const USE_CASES = [
  "Build new products",
  "Improve an existing codebase",
  "Learn and explore code",
  "Automate engineering work",
] as const;

export function OnboardingGate() {
  const hydrated = useClientSettingsHydrated();
  const settings = useClientSettings();
  const updateSettings = useUpdateClientSettings();
  const [useCase, setUseCase] = useState(settings.onboardingUseCase);

  useEffect(() => {
    if (!hydrated) return;
    setUseCase(settings.onboardingUseCase);
  }, [hydrated, settings.onboardingUseCase]);

  if (!hydrated || settings.onboardingCompleted) return null;

  return (
    <div className="fixed inset-0 z-[200] grid place-items-center overflow-y-auto bg-background/96 p-4 text-foreground backdrop-blur-xl sm:p-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50rem_28rem_at_50%_-8rem,color-mix(in_srgb,#00B2FF_18%,transparent),transparent)]" />
      <main className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-border bg-card shadow-2xl shadow-black/15">
        <header className="border-b border-border/70 px-6 py-6 sm:px-8">
          <div className="flex items-center gap-3">
            <img
              alt=""
              className="size-11 object-contain"
              src={`${import.meta.env.BASE_URL}sparky-logo-small.svg`}
            />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                Welcome to Sparky
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight">Make Sparky yours</h1>
            </div>
          </div>
          <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
            Two quick choices help tailor your local coding workspace. You can change either one
            later in Settings.
          </p>
        </header>

        <div className="space-y-7 px-6 py-6 sm:px-8 sm:py-7">
          <section>
            <div className="mb-3 flex items-center gap-2">
              <Code2Icon className="size-4 text-primary" />
              <h2 className="text-sm font-semibold">What do you want to use Sparky for?</h2>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {USE_CASES.map((option) => {
                const selected = useCase === option;
                return (
                  <button
                    key={option}
                    type="button"
                    className={cn(
                      "flex min-h-12 items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors",
                      selected
                        ? "border-primary bg-primary/8 text-foreground ring-1 ring-primary/20"
                        : "border-border bg-background/55 text-muted-foreground hover:border-primary/45 hover:text-foreground",
                    )}
                    onClick={() => setUseCase(option)}
                  >
                    <span>{option}</span>
                    {selected ? <CheckIcon className="size-4 shrink-0 text-primary" /> : null}
                  </button>
                );
              })}
            </div>
          </section>

        </div>

        <footer className="flex items-center justify-between gap-4 border-t border-border/70 bg-muted/20 px-6 py-4 sm:px-8">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            Preferences are saved locally in your Sparky config.
          </span>
          <Button
            disabled={!useCase}
            onClick={() =>
              updateSettings({
                onboardingCompleted: true,
                onboardingUseCase: useCase,
              })
            }
          >
            Start using Sparky
          </Button>
        </footer>
      </main>
    </div>
  );
}
