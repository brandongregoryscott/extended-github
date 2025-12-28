import { RouteUtils } from "@/utilities/route-utils";
import { compact, get as lodashGet, isEmpty } from "lodash-es";

type Settings = {
    /**
     * Globally enables or disables the extension.
     */
    enabled: boolean;

    /**
     * List of organizations to enable the extension on. If empty, the extension will work on any organization.
     */
    includedOrganizations: string[];

    /**
     * Feature-specific settings
     */
    features: FeatureSettings;
};

type FeatureSettings = {
    pullRequest: PullRequestFeatureSettings;
};

type PullRequestFeatureSettings = {
    /**
     * Whether to automatically assign your own user to a pull request you authored
     */
    autoAssignSelfEnabled: boolean;

    /**
     * Whether to automatically assign the pull request author, including other users
     */
    autoAssignAuthorEnabled: boolean;
};

const DEFAULT_SETTINGS: Settings = {
    enabled: true,
    includedOrganizations: [],
    features: {
        pullRequest: {
            autoAssignSelfEnabled: true,
            autoAssignAuthorEnabled: false,
        },
    },
};

class SettingsUtils {
    /**
     * Returns whether the extension is globally enabled or not. Specific features may still be disabled
     * and should be checked separately.
     */
    static async isEnabled(): Promise<boolean> {
        const { enabled, includedOrganizations } = await this.getSettings();
        const { organization } = RouteUtils.parsePullRequestPath(
            window.location.pathname
        );
        if (!enabled) {
            return false;
        }

        const enabledByOrganization =
            isEmpty(includedOrganizations) ||
            includedOrganizations.includes(organization);

        return enabledByOrganization;
    }

    static getDefaultSettings(): Settings {
        return DEFAULT_SETTINGS;
    }

    static async getSettings(): Promise<Settings> {
        let settings =
            await browser.storage.sync.get<Settings>(DEFAULT_SETTINGS);
        return {
            ...settings,
            includedOrganizations: compact(settings.includedOrganizations),
        };
    }

    static async updateSettings(settings: Partial<Settings>): Promise<void> {
        return browser.storage.sync.set<Settings>(settings);
    }
}

export type { FeatureSettings, PullRequestFeatureSettings, Settings };
export { SettingsUtils };
