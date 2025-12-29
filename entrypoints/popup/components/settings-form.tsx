import React from "react";
import { Accordion, Checkbox, FormField } from "@/entrypoints/popup/components";
import { useSettings } from "@/entrypoints/popup/hooks";
import { cn } from "@/utilities/class-names";
import { joinCsv, splitCsv } from "@/utilities/core-utils";

const InputId = {
    AutoAssignAuthorToPullRequest: "input-auto-assign-author-to-pull-request",
    AutoAssignSelfToPullRequest: "input-auto-assign-self-to-pull-request",
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
                        inputId={InputId.AutoAssignSelfToPullRequest}
                        label="Auto-assign self to pull requests">
                        <Checkbox
                            disabled={disabled}
                            id={InputId.AutoAssignSelfToPullRequest}
                            label="Enabled"
                            onChange={handleAutoAssignSelfChange}
                            value={features.pullRequest.autoAssignSelfEnabled}
                        />
                    </FormField>
                    <FormField
                        disabled={disabled}
                        inputId={InputId.AutoAssignAuthorToPullRequest}
                        label="Auto-assign author to pull requests">
                        <Checkbox
                            disabled={disabled}
                            id={InputId.AutoAssignAuthorToPullRequest}
                            label="Enabled"
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
