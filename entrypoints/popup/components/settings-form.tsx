import React from "react";
import type { UserGroup } from "@/enums";
import {
    Accordion,
    Checkbox,
    FormField,
    PullRequestUserGroupSelect,
} from "@/entrypoints/popup/components";
import { useSettings } from "@/entrypoints/popup/hooks";
import { cn } from "@/utilities/class-names";
import { joinCsv, splitCsv } from "@/utilities/core-utils";

const InputId = {
    AutoAddTicketToPullRequestTitle:
        "input-auto-add-ticket-to-pull-request-title",
    AutoAssignAuthorToPullRequest: "input-auto-assign-author-to-pull-request",
    Enabled: "input-enabled",
    IncludedOrganizations: "input-included-organizations",
} as const;

function SettingsForm() {
    const { setSettings, settings } = useSettings();
    const { enabled, features } = settings;
    const includedOrganizations = joinCsv(settings.includedOrganizations);
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
                </div>
            </Accordion>
        </div>
    );
}

export { SettingsForm };
