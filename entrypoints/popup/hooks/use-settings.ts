import type { Settings } from "@/utilities/settings-utils";
import { SettingsUtils } from "@/utilities/settings-utils";
import { useEffect, useState } from "react";

const useSettings = () => {
    const [settings, _setSettings] = useState<Settings>(
        SettingsUtils.getDefaultSettings()
    );
    useEffect(() => {
        SettingsUtils.getSettings().then(_setSettings);
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
        await SettingsUtils.updateSettings(mergedSettings);
    };

    return { settings, setSettings };
};

export { useSettings };
