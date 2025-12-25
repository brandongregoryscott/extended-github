import { FormField } from "@/entrypoints/popup/components/form-field";
import { useSettings } from "@/entrypoints/popup/hooks";

function SettingsForm() {
  const { settings, setSettings } = useSettings();
  const handleToggleEnabled = () => {
    setSettings((settings) => ({ ...settings, enabled: !settings.enabled }));
  };

  return (
    <div className="display-flex-column gap-md padding-lg">
      <h2 className="text-align-center">Extended GitHub</h2>
      <FormField label="Extension enabled">
        <label className="display-flex gap-sm user-select-none">
          <input
            type="checkbox"
            onChange={handleToggleEnabled}
            checked={settings.enabled}
          />
          {settings.enabled ? "Enabled" : "Disabled"}
        </label>
      </FormField>
    </div>
  );
}

export { SettingsForm };
