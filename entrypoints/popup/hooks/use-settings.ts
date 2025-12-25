import {
  DEFAULT_SETTINGS,
  getSettings,
  Settings,
  updateSettings,
} from "@/utilities/settings";
import { useEffect } from "react";

const useSettings = () => {
  const [settings, _setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  useEffect(() => {
    getSettings().then(_setSettings);
  }, []);

  const setSettings = async (
    updatedSettings: Partial<Settings> | ((settings: Settings) => Settings)
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
