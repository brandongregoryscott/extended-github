import { FormField } from "@/entrypoints/popup/components/form-field";
import { useSettings } from "@/entrypoints/popup/hooks";
import { joinCsv, splitCsv } from "@/utilities/core-utils";
import React from "react";

const InputId = {
  Enabled: "input-enabled",
  IncludedOrganizations: "input-included-organizations",
} as const;

function SettingsForm() {
  const { settings, setSettings } = useSettings();
  const { enabled } = settings;
  const includedOrganizations = joinCsv(settings.includedOrganizations);
  const handleToggleEnabled = (event: React.ChangeEvent<HTMLInputElement>) => {
    const enabled = event.target.checked;
    setSettings({ enabled });
  };

  const handleIncludedOrganizationsChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    setSettings({ includedOrganizations: splitCsv(value) });
  };

  return (
    <div className="display-flex-column gap-md padding-lg">
      <h2 className="text-align-center">Extended GitHub</h2>
      <FormField
        inputId={InputId.Enabled}
        label="Extension enabled"
        description="Globally enables or disables the extension."
      >
        <label className="display-flex gap-sm user-select-none">
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
        label="Included organizations"
        description="Comma-separated list of organizations to enable the extension on. If empty, the extension will work on any organization."
      >
        <textarea
          id={InputId.IncludedOrganizations}
          onChange={handleIncludedOrganizationsChange}
          value={includedOrganizations}
        />
      </FormField>
    </div>
  );
}

export { SettingsForm };
