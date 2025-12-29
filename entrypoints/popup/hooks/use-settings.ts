import { merge } from "lodash-es";
import { useEffect, useState } from "react";
import type { DeepPartial } from "@/types";
import type { Settings } from "@/utilities/settings-utils";
import { SettingsUtils } from "@/utilities/settings-utils";

const useSettings = () => {
    // eslint-disable-next-line react/hook-use-state -- The setter fn is intentionally wrapped so we can persist the settings to browser storage
    const [settings, _setSettings] = useState<Settings>(
        SettingsUtils.getDefaultSettings()
    );
    useEffect(() => {
        SettingsUtils.getSettings().then(_setSettings);
    }, []);

    const setSettings = async (update: DeepPartial<Settings>) => {
        const mergedSettings = merge({}, settings, update);
        _setSettings(mergedSettings);
        await SettingsUtils.updateSettings(mergedSettings);
    };

    return { setSettings, settings };
};

export { useSettings };
