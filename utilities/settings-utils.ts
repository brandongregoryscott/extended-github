import { compact, isEmpty, merge } from "lodash-es";
import type { UserGroup } from "@/enums";
import type { DeepPartial } from "@/types";
import { UserGroups } from "@/enums";
import { RouteUtils } from "@/utilities/route-utils";

type Settings = {
    /**
     * Globally enables or disables the extension.
     */
    enabled: boolean;

    /**
     * Feature-specific settings
     */
    features: FeatureSettings;

    /**
     * List of organizations to enable the extension on. If empty, the extension will work on any organization.
     */
    includedOrganizations: string[];
};

type FeatureSettings = {
    pullRequest: PullRequestFeatureSettings;
};

type PullRequestFeatureSettings = {
    /**
     * Automatically add ticket number to title
     */
    autoAddTicketToTitle: false | UserGroup;

    /**
     * Automatically assign the pull request author
     */
    autoAssignAuthor: false | UserGroup;
};

const DEFAULT_SETTINGS: Settings = {
    enabled: true,
    features: {
        pullRequest: {
            autoAddTicketToTitle: UserGroups.Self,
            autoAssignAuthor: UserGroups.Self,
        },
    },
    includedOrganizations: [],
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

    static async isAutoAssignAuthorEnabled(): Promise<false | UserGroup> {
        const globallyEnabled = await this.isEnabled();
        if (!globallyEnabled) {
            return false;
        }

        const settings = await this.getSettings();
        return settings.features.pullRequest.autoAssignAuthor;
    }

    static async isAutoAddTicketToTitleEnabled(): Promise<false | UserGroup> {
        const globallyEnabled = await this.isEnabled();
        if (!globallyEnabled) {
            return false;
        }

        const settings = await this.getSettings();
        return settings.features.pullRequest.autoAddTicketToTitle;
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

    static async updateSettings(update: DeepPartial<Settings>): Promise<void> {
        const settings = await this.getSettings();
        const mergedSettings = merge({}, settings, update);
        return browser.storage.sync.set<Settings>(mergedSettings);
    }
}

export type { FeatureSettings, PullRequestFeatureSettings, Settings };
export { SettingsUtils };
