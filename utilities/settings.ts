type Settings = {
  /**
   * Globally enables or disables the extension.
   */
  enabled: boolean;

  /**
   * List of organizations to enable the extension on. If empty, the extension will work on any organization.
   */
  includedOrganizations: string[];
};

const DEFAULT_SETTINGS: Settings = {
  enabled: true,
  includedOrganizations: [],
};

async function updateSettings(settings: Partial<Settings>) {
  return browser.storage.sync.set<Settings>(settings);
}

function getSettings() {
  return browser.storage.sync.get<Settings>(DEFAULT_SETTINGS);
}

export type { Settings };
export { DEFAULT_SETTINGS, updateSettings, getSettings };
