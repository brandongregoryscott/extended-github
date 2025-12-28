import React from "react";
import { Accordion, Checkbox, FormField } from "@/entrypoints/popup/components";
import { useSettings } from "@/entrypoints/popup/hooks";
import { joinCsv, splitCsv } from "@/utilities/core-utils";
import { cn } from "@/utilities/class-names";

const InputId = {
    Enabled: "input-enabled",
    IncludedOrganizations: "input-included-organizations",
    AutoAssignSelfToPullRequest: "input-auto-assign-self-to-pull-request",
    AutoAssignAuthorToPullRequest: "input-auto-assign-author-to-pull-request",
} as const;

function SettingsForm() {
    const { settings, setSettings } = useSettings();
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

    const handleAutoAssignSelfChange = (autoAssignSelfEnabled: boolean) => {
        setSettings({
            features: { pullRequest: { autoAssignSelfEnabled } },
        });
    };

    const handleAutoAssignAuthorChange = (autoAssignAuthorEnabled: boolean) => {
        setSettings({
            features: { pullRequest: { autoAssignAuthorEnabled } },
        });
    };

    const disabled = !enabled;

    return (
        <div className={cn("display-flex-column", "gap-md", "padding-lg")}>
            <h2 className={cn("text-align-center")}>Extended GitHub</h2>
            <Accordion label="Global settings" defaultIsOpen={true}>
                <div className={cn("display-flex-column", "gap-md")}>
                    <FormField
                        inputId={InputId.Enabled}
                        label="Extension enabled"
                        description="Globally enables or disables the extension.">
                        <Checkbox
                            label="Enabled"
                            id={InputId.Enabled}
                            onChange={handleEnabledChange}
                            value={enabled}
                        />
                    </FormField>
                    <FormField
                        inputId={InputId.IncludedOrganizations}
                        disabled={disabled}
                        label="Included organizations"
                        description="Comma-separated list of organizations to enable the extension on. If empty, the extension will work on any organization.">
                        <textarea
                            id={InputId.IncludedOrganizations}
                            disabled={disabled}
                            onChange={handleIncludedOrganizationsChange}
                            value={includedOrganizations}
                        />
                    </FormField>
                </div>
            </Accordion>
            <Accordion label="Pull requests">
                <div className={cn("display-flex-column", "gap-md")}>
                    <FormField
                        inputId={InputId.AutoAssignSelfToPullRequest}
                        label="Auto-assign self to pull requests">
                        <Checkbox
                            label="Enabled"
                            id={InputId.AutoAssignSelfToPullRequest}
                            onChange={handleAutoAssignSelfChange}
                            value={features.pullRequest.autoAssignSelfEnabled}
                        />
                    </FormField>
                    <FormField
                        inputId={InputId.AutoAssignAuthorToPullRequest}
                        label="Auto-assign author to pull requests">
                        <Checkbox
                            label="Enabled"
                            id={InputId.AutoAssignAuthorToPullRequest}
                            onChange={handleAutoAssignAuthorChange}
                            value={features.pullRequest.autoAssignAuthorEnabled}
                        />
                    </FormField>
                </div>
            </Accordion>
        </div>
    );
}

export { SettingsForm };
