import type { ProviderInstanceId, UnifiedSettings } from "@sparky/contracts";

import { getAppModelOptionsForInstance, type AppModelOption } from "./modelSelection";
import type { ProviderInstanceEntry } from "./providerInstances";

export interface AutomationProviderOption {
  readonly key: string;
  readonly instanceId: ProviderInstanceId;
  readonly displayName: string;
  readonly entry: ProviderInstanceEntry;
  readonly modelOptions: ReadonlyArray<AppModelOption>;
  readonly modelSlugs: ReadonlySet<string>;
}

/**
 * The runtime may expose several real provider catalogs through one aggregated
 * driver instance. Keep those catalogs selectable as separate providers in
 * automations while preserving the runtime instance id used for execution.
 */
export function deriveAutomationProviderOptions(
  entries: ReadonlyArray<ProviderInstanceEntry>,
  settings: UnifiedSettings,
): ReadonlyArray<AutomationProviderOption> {
  const result: AutomationProviderOption[] = [];

  for (const entry of entries) {
    if (!entry.enabled) continue;
    const modelOptions = getAppModelOptionsForInstance(settings, entry);
    const groups = new Map<string, { readonly displayName: string; readonly slugs: Set<string> }>();

    for (const model of entry.models) {
      const displayName = model.subProvider?.trim() || entry.displayName;
      const key = `${entry.instanceId}:${displayName}`;
      const group = groups.get(key);
      if (group) {
        group.slugs.add(model.slug);
      } else {
        groups.set(key, { displayName, slugs: new Set([model.slug]) });
      }
    }

    for (const model of modelOptions) {
      if ([...groups.values()].some((group) => group.slugs.has(model.slug))) continue;
      const displayName = entry.displayName;
      const key = `${entry.instanceId}:${displayName}`;
      const group = groups.get(key);
      if (group) {
        group.slugs.add(model.slug);
      } else {
        groups.set(key, { displayName, slugs: new Set([model.slug]) });
      }
    }

    for (const [key, group] of groups) {
      const options = modelOptions.filter((model) => group.slugs.has(model.slug));
      if (options.length === 0) continue;
      result.push({
        key,
        instanceId: entry.instanceId,
        displayName: group.displayName,
        entry,
        modelOptions: options,
        modelSlugs: group.slugs,
      });
    }
  }

  return result;
}

export function defaultAutomationModel(
  option: AutomationProviderOption,
): AppModelOption | undefined {
  return option.modelOptions.find((model) => model.isDefault) ?? option.modelOptions[0];
}
