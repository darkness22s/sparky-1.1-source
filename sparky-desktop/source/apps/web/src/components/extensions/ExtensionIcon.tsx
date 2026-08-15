import type { CSSProperties } from "react";

import { cn } from "~/lib/utils";

interface ExtensionIconProps {
  readonly name: string;
  readonly accent: string;
  readonly logo?: string | undefined;
  readonly logoUrl?: string | undefined;
  readonly size?: "sm" | "md" | "lg";
  readonly className?: string;
}

const SIZE_CLASS = {
  sm: "size-8 rounded-[10px]",
  md: "size-10 rounded-xl",
  lg: "size-12 rounded-[14px]",
} as const;

const IMAGE_SIZE_CLASS = {
  sm: "size-4.5",
  md: "size-5.5",
  lg: "size-6.5",
} as const;

export function ExtensionIcon({ name, accent, logo, logoUrl, size = "md", className }: ExtensionIconProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden border border-black/8 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.09)] dark:border-white/10",
        SIZE_CLASS[size],
        className,
      )}
      style={{ "--extension-accent": accent } as CSSProperties}
    >
      <span className="absolute inset-x-1.5 bottom-0 h-px bg-[var(--extension-accent)] opacity-70" />
      {logo || logoUrl ? (
        <img
          alt=""
          className={cn("relative object-contain", IMAGE_SIZE_CLASS[size])}
          src={logoUrl ?? `${import.meta.env.BASE_URL}plugin-logos/${logo}.svg`}
        />
      ) : (
        <svg className={cn("relative", IMAGE_SIZE_CLASS[size])} fill="none" viewBox="0 0 24 24">
          <path
            d="m12 3.25 7.25 4.1v9.3L12 20.75l-7.25-4.1v-9.3L12 3.25Z"
            fill="var(--extension-accent)"
            fillOpacity=".16"
            stroke="var(--extension-accent)"
            strokeWidth="1.5"
          />
          <path
            d="m5.15 7.55 6.85 4 6.85-4M12 11.55v8.4"
            stroke="var(--extension-accent)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
          <circle cx="12" cy="11.55" fill="var(--extension-accent)" r="1.35" />
        </svg>
      )}
      <span className="sr-only">{name}</span>
    </span>
  );
}

export function ExtensionsPageMark() {
  return (
    <span
      aria-hidden="true"
      className="relative inline-flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-[13px] bg-[#087fb8] shadow-[0_8px_24px_rgba(0,178,255,0.25)] ring-1 ring-white/20"
    >
      <svg className="size-6" fill="none" viewBox="0 0 24 24">
        <path
          d="M5.25 6.5A1.25 1.25 0 0 1 6.5 5.25h3.25v5.5H5.25V6.5Z"
          fill="white"
          fillOpacity=".95"
        />
        <path
          d="M14.25 5.25h3.25a1.25 1.25 0 0 1 1.25 1.25v3.25h-5.5v-3.5a1 1 0 0 1 1-1Z"
          fill="#a6e7ff"
        />
        <path
          d="M5.25 14.25a1 1 0 0 1 1-1h3.5v5.5H6.5a1.25 1.25 0 0 1-1.25-1.25v-3.25Z"
          fill="#72d5ff"
        />
        <path
          d="M13.25 13.25h5.5v4.25a1.25 1.25 0 0 1-1.25 1.25h-3.25a1 1 0 0 1-1-1v-4.5Z"
          fill="white"
          fillOpacity=".82"
        />
        <path d="M9.75 8h3.5M8 10.75v2.5M16 9.75v3.5M10.75 16h2.5" stroke="#087fb8" />
      </svg>
    </span>
  );
}
