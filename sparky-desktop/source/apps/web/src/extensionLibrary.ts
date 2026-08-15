import * as Schema from "effect/Schema";
import { useCallback } from "react";

import { useLocalStorage } from "./hooks/useLocalStorage";

export interface ExtensionInstallState {
  readonly pluginIds: ReadonlyArray<string>;
  readonly modIds: ReadonlyArray<string>;
}

const ExtensionInstallStateSchema = Schema.Struct({
  pluginIds: Schema.Array(Schema.String),
  modIds: Schema.Array(Schema.String),
});

const EMPTY_EXTENSION_INSTALL_STATE: ExtensionInstallState = {
  pluginIds: [],
  modIds: [],
};

export const EXTENSION_LIBRARY_STORAGE_KEY = "sparky:extension-library:v1";

export function updateInstalledIds(
  ids: ReadonlyArray<string>,
  id: string,
  installed: boolean,
): ReadonlyArray<string> {
  if (installed) {
    return ids.includes(id) ? ids : [...ids, id];
  }
  return ids.filter((candidate) => candidate !== id);
}

export function useExtensionInstallState() {
  const [state, setState] = useLocalStorage(
    EXTENSION_LIBRARY_STORAGE_KEY,
    EMPTY_EXTENSION_INSTALL_STATE,
    ExtensionInstallStateSchema,
  );

  const setPluginInstalled = useCallback(
    (id: string, installed: boolean) => {
      setState((current) => ({
        ...current,
        pluginIds: updateInstalledIds(current.pluginIds, id, installed),
      }));
    },
    [setState],
  );

  const setModInstalled = useCallback(
    (id: string, installed: boolean) => {
      setState((current) => ({
        ...current,
        modIds: updateInstalledIds(current.modIds, id, installed),
      }));
    },
    [setState],
  );

  return {
    pluginIds: state.pluginIds,
    modIds: state.modIds,
    setPluginInstalled,
    setModInstalled,
  };
}
