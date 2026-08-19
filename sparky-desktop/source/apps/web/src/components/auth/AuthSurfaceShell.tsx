import type { ReactNode } from "react";

/**
 * Minimal frame for account surfaces. It intentionally uses the app's semantic
 * theme tokens so the page follows the operating system appearance setting.
 */
export function AuthSurfaceShell({ children }: { readonly children: ReactNode }) {
  return (
    <div className="h-dvh max-h-dvh overflow-y-auto bg-background px-5 text-foreground sm:px-8">
      <main className="mx-auto w-full max-w-[430px] py-10 sm:py-16">{children}</main>
    </div>
  );
}
