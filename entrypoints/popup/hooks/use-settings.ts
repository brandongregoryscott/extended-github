import type { Settings } from "@/utilities/settings";
import {
  DEFAULT_SETTINGS,
  getSettings,
  updateSettings,
} from "@/utilities/settings";
import { useEffect, useState } from "react";

const useSettings = () => {
  const [settings, _setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  useEffect(() => {
    getSettings().then(_setSettings);
  }, []);

  const setSettings = async (
    updatedSettings: ((settings: Settings) => Settings) | Partial<Settings>
  ) => {
    const mergedSettings: Settings = {
      ...settings,
      ...(typeof updatedSettings === "function"
        ? updatedSettings(settings)
        : updatedSettings),
    };
    _setSettings(mergedSettings);
    await updateSettings(mergedSettings);
  };

  return { settings, setSettings };
};

export { useSettings };
