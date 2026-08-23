import { ProviderDriverKind } from "@sparky/contracts";
import { Icon, SparkyIcon } from "../Icons";
import {
  PROVIDER_BRAND_ICON_BY_DRIVER,
  PROVIDER_BRAND_ICON_BY_SUBPROVIDER,
} from "./providerBrandIcons";
import { PROVIDER_OPTIONS } from "../../session-logic";

export const PROVIDER_ICON_BY_PROVIDER: Partial<Record<ProviderDriverKind, Icon>> = {
  [ProviderDriverKind.make("sparky")]: SparkyIcon,
  ...PROVIDER_BRAND_ICON_BY_DRIVER,
};

/**
 * Resolve the most specific brand icon for a model entry. Sparky-driver
 * models proxy upstream vendors (OpenCode Zen, OpenAI, Claude, Google...),
 * so prefer the model's subProvider label before falling back to the
 * driver-level icon (the Sparky app icon).
 */
export function resolveProviderIconForModel(
  driverKind: ProviderDriverKind,
  model?: ModelEsque | null,
): Icon | null {
  if (driverKind === "sparky" && model?.subProvider) {
    const brand =
      PROVIDER_BRAND_ICON_BY_SUBPROVIDER[model.subProvider.trim().toLowerCase()];
    if (brand) return brand;
    // Fall back to the slug prefix for slugs like "openai/gpt-5".
    const slashIndex = model.slug.indexOf("/");
    if (slashIndex > 0) {
      const prefix = model.slug.slice(0, slashIndex).trim().toLowerCase();
      if (prefix !== "sparky") {
        const byPrefix = PROVIDER_BRAND_ICON_BY_SUBPROVIDER[prefix];
        if (byPrefix) return byPrefix;
      }
    }
  }
  return PROVIDER_ICON_BY_PROVIDER[driverKind] ?? null;
}

function isAvailableProviderOption(option: (typeof PROVIDER_OPTIONS)[number]): option is {
  value: ProviderDriverKind;
  label: string;
  available: true;
  pickerSidebarBadge?: "new" | "soon";
} {
  return option.available;
}

export const AVAILABLE_PROVIDER_OPTIONS = PROVIDER_OPTIONS.filter(isAvailableProviderOption);

export type ModelEsque = {
  slug: string;
  name: string;
  shortName?: string | undefined;
  subProvider?: string | undefined;
};

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function stripLeadingQualifier(value: string, qualifier: string | null | undefined): string {
  const trimmedQualifier = qualifier?.trim();
  if (!trimmedQualifier) {
    return value;
  }

  const pattern = new RegExp(`^${escapeRegExp(trimmedQualifier)}(?:\\s*[.:/-]\\s*|\\s+)`, "iu");
  return value.replace(pattern, "").trim() || value;
}

export function getDisplayModelName(
  model: ModelEsque,
  options?: { preferShortName?: boolean },
): string {
  const name = options?.preferShortName && model.shortName ? model.shortName : model.name;
  return stripLeadingQualifier(name, model.subProvider);
}

export function getTriggerDisplayModelName(model: ModelEsque): string {
  return getDisplayModelName(model, { preferShortName: true });
}

export function getTriggerDisplayModelLabel(model: ModelEsque): string {
  return getTriggerDisplayModelName(model);
}
