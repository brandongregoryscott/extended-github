import React from "react";
import type {
    TicketNumberInsertPosition,
    TicketNumberPosition,
    UserGroup,
} from "@/enums";
import {
    Accordion,
    Checkbox,
    FormField,
    PullRequestUserGroupSelect,
    TicketNumberInsertPositionSelect,
    TicketNumberPositionSelect,
} from "@/entrypoints/popup/components";
import { useSettings } from "@/entrypoints/popup/hooks";
import { TicketNumberPositions } from "@/enums";
import { cn } from "@/utilities/class-names";
import { joinCsv, splitCsv } from "@/utilities/core-utils";

const InputId = {
    AutoAddTicketToPullRequestTitle:
        "input-auto-add-ticket-to-pull-request-title",
    AutoAssignAuthorToPullRequest: "input-auto-assign-author-to-pull-request",
    DebugLogging: "input-debug-logging",
    Enabled: "input-enabled",
    IncludedOrganizations: "input-included-organizations",
    TicketNumberInsertPosition: "input-ticket-number-insert-position",
    TicketNumberPosition: "input-ticket-number-position",
    TicketPrefixes: "input-ticket-prefixes",
} as const;

function SettingsForm() {
    const { setSettings, settings } = useSettings();
    const { debugLogging, enabled, features } = settings;
    const includedOrganizations = joinCsv(settings.includedOrganizations);
    const ticketPrefixes = joinCsv(features.pullRequest.ticketPrefixes);
    const handleEnabledChange = (enabled: boolean) => {
        setSettings({ enabled });
    };

    const handleIncludedOrganizationsChange = (
        event: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        const value = event.target.value;
        setSettings({ includedOrganizations: splitCsv(value) });
    };

    const handleAutoAssignAuthorChange = (
        autoAssignAuthor: false | UserGroup
    ) => {
        setSettings({ features: { pullRequest: { autoAssignAuthor } } });
    };

    const handleAutoAddTicketToTitleChange = (
        autoAddTicketToTitle: false | UserGroup
    ) => {
        setSettings({ features: { pullRequest: { autoAddTicketToTitle } } });
    };

    const handleTicketPrefixesChange = (
        event: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        const value = event.target.value;
        setSettings({
            features: { pullRequest: { ticketPrefixes: splitCsv(value) } },
        });
    };

    const handleTicketNumberPositionChange = (
        ticketNumberPosition: TicketNumberPosition
    ) => {
        setSettings({
            features: { pullRequest: { ticketNumberPosition } },
        });
    };

    const handleTicketNumberInsertPositionChange = (
        ticketNumberInsertPosition: TicketNumberInsertPosition
    ) => {
        setSettings({
            features: { pullRequest: { ticketNumberInsertPosition } },
        });
    };

    const handleDebugLoggingChange = (debugLogging: boolean) => {
        setSettings({ debugLogging });
    };

    const disabled = !enabled;

    return (
        <div className={cn("display-flex-column", "gap-lg", "padding-lg")}>
            <h2 className={cn("text-align-center")}>Extended GitHub</h2>
            <Accordion defaultIsOpen={true} label="Global settings">
                <div className={cn("display-flex-column", "gap-md")}>
                    <FormField
                        description="Globally enables or disables the extension."
                        inputId={InputId.Enabled}
                        label="Extension enabled">
                        <Checkbox
                            id={InputId.Enabled}
                            label="Enabled"
                            onChange={handleEnabledChange}
                            value={enabled}
                        />
                    </FormField>
                    <FormField
                        description="Comma-separated list of organizations to enable the extension on. If empty, the extension will work on any organization."
                        disabled={disabled}
                        inputId={InputId.IncludedOrganizations}
                        label="Included organizations">
                        <textarea
                            disabled={disabled}
                            id={InputId.IncludedOrganizations}
                            onChange={handleIncludedOrganizationsChange}
                            value={includedOrganizations}
                        />
                    </FormField>
                    <FormField
                        description="Enables logging to help debug UI changes that might break extension features."
                        inputId={InputId.DebugLogging}
                        label="Debug logging">
                        <Checkbox
                            id={InputId.DebugLogging}
                            label="Enabled"
                            onChange={handleDebugLoggingChange}
                            value={debugLogging}
                        />
                    </FormField>
                </div>
            </Accordion>
            <Accordion label="Pull requests">
                <div className={cn("display-flex-column", "gap-md")}>
                    <FormField
                        disabled={disabled}
                        inputId={InputId.AutoAssignAuthorToPullRequest}
                        label="Automatically assign author to pull requests">
                        <PullRequestUserGroupSelect
                            id={InputId.AutoAssignAuthorToPullRequest}
                            onChange={handleAutoAssignAuthorChange}
                            value={features.pullRequest.autoAssignAuthor}
                        />
                    </FormField>
                    <FormField
                        disabled={disabled}
                        inputId={InputId.AutoAddTicketToPullRequestTitle}
                        label="Automatically add ticket number to title">
                        <PullRequestUserGroupSelect
                            id={InputId.AutoAddTicketToPullRequestTitle}
                            onChange={handleAutoAddTicketToTitleChange}
                            value={features.pullRequest.autoAddTicketToTitle}
                        />
                    </FormField>
                    <FormField
                        description="Comma-separated list of allowed ticket prefixes (e.g., ABC,DEF,XYZ). When empty, any prefix matching the default pattern will be allowed."
                        disabled={disabled}
                        inputId={InputId.TicketPrefixes}
                        label="Ticket prefixes">
                        <textarea
                            disabled={disabled}
                            id={InputId.TicketPrefixes}
                            onChange={handleTicketPrefixesChange}
                            value={ticketPrefixes}
                        />
                    </FormField>
                    <FormField
                        description="Controls how the title is checked for the ticket number before the extension adds it."
                        disabled={disabled}
                        inputId={InputId.TicketNumberPosition}
                        label="Ticket number position">
                        <TicketNumberPositionSelect
                            disabled={disabled}
                            id={InputId.TicketNumberPosition}
                            onChange={handleTicketNumberPositionChange}
                            value={features.pullRequest.ticketNumberPosition}
                        />
                    </FormField>
                    {features.pullRequest.ticketNumberPosition ===
                        TicketNumberPositions.Includes && (
                        <FormField
                            description="When the ticket number is missing, controls where it is inserted into the title."
                            disabled={disabled}
                            inputId={InputId.TicketNumberInsertPosition}
                            label="Ticket number insert position">
                            <TicketNumberInsertPositionSelect
                                disabled={disabled}
                                id={InputId.TicketNumberInsertPosition}
                                onChange={
                                    handleTicketNumberInsertPositionChange
                                }
                                value={
                                    features.pullRequest
                                        .ticketNumberInsertPosition
                                }
                            />
                        </FormField>
                    )}
                </div>
            </Accordion>
        </div>
    );
}

export { SettingsForm };
