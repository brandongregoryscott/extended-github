import React from "react";
import { Accordion, FormField } from "@/entrypoints/popup/components";
import { useSettings } from "@/entrypoints/popup/hooks";
import { joinCsv, splitCsv } from "@/utilities/core-utils";
import { cn } from "@/utilities/class-names";

const InputId = {
    Enabled: "input-enabled",
    IncludedOrganizations: "input-included-organizations",
} as const;

function SettingsForm() {
    const { settings, setSettings } = useSettings();
    const { enabled } = settings;
    const includedOrganizations = joinCsv(settings.includedOrganizations);
    const handleToggleEnabled = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const enabled = event.target.checked;
        setSettings({ enabled });
    };

    const handleIncludedOrganizationsChange = (
        event: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        const value = event.target.value;
        setSettings({ includedOrganizations: splitCsv(value) });
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
                        <label className={cn("display-flex", "gap-sm")}>
                            <input
                                id={InputId.Enabled}
                                type="checkbox"
                                onChange={handleToggleEnabled}
                                checked={enabled}
                            />
                            {enabled ? "Enabled" : "Disabled"}
                        </label>
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
        </div>
    );
}

export { SettingsForm };
