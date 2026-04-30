import { compact, isEmpty, merge } from "lodash-es";
import type {
    TicketNumberInsertPosition,
    TicketNumberPosition,
    UserGroup,
} from "@/enums";
import type { DeepPartial } from "@/types";
import {
    TicketNumberInsertPositions,
    TicketNumberPositions,
    UserGroups,
} from "@/enums";
import { RouteUtils } from "@/utilities/route-utils";

type Settings = {
    /**
     * Enables debug logging for DOM queries and scripts.
     */
    debugLogging: boolean;

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

    /**
     * When `ticketNumberPosition` is `Includes`, controls where the ticket number is inserted
     * into the title if it is not already present.
     */
    ticketNumberInsertPosition: TicketNumberInsertPosition;

    /**
     * Controls where the existing title is checked for the ticket number.
     */
    ticketNumberPosition: TicketNumberPosition;

    /**
     * List of allowed ticket/project prefixes (e.g., ABC, DEF). When empty, any prefix matching
     * the default pattern will be allowed.
     */
    ticketPrefixes: string[];
};

const DEFAULT_SETTINGS: Settings = {
    debugLogging: true,
    enabled: true,
    features: {
        pullRequest: {
            autoAddTicketToTitle: UserGroups.Self,
            autoAssignAuthor: UserGroups.Self,
            ticketNumberInsertPosition: TicketNumberInsertPositions.End,
            ticketNumberPosition: TicketNumberPositions.Includes,
            ticketPrefixes: [],
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

    static async getTicketPrefixes(): Promise<string[]> {
        const settings = await this.getSettings();
        return settings.features.pullRequest.ticketPrefixes;
    }

    static async getTicketNumberPosition(): Promise<TicketNumberPosition> {
        const settings = await this.getSettings();
        return settings.features.pullRequest.ticketNumberPosition;
    }

    static async getTicketNumberInsertPosition(): Promise<TicketNumberInsertPosition> {
        const settings = await this.getSettings();
        return settings.features.pullRequest.ticketNumberInsertPosition;
    }

    static async isDebugLoggingEnabled(): Promise<boolean> {
        const settings = await this.getSettings();
        return settings.debugLogging;
    }

    static getDefaultSettings(): Settings {
        return DEFAULT_SETTINGS;
    }

    static async getSettings(): Promise<Settings> {
        let settings =
            await browser.storage.sync.get<Settings>(DEFAULT_SETTINGS);
        return {
            ...settings,
            features: {
                ...settings.features,
                pullRequest: {
                    ...settings.features.pullRequest,
                    ticketPrefixes: compact(
                        settings.features.pullRequest.ticketPrefixes
                    ),
                },
            },
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
