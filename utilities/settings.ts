type Settings = {
  enabled: boolean;
};

const DEFAULT_SETTINGS: Settings = {
  enabled: true,
};

async function updateSettings(settings: Partial<Settings>) {
  return browser.storage.sync.set<Settings>(settings);
}

function getSettings() {
  return browser.storage.sync.get<Settings>(DEFAULT_SETTINGS);
}

export type { Settings };
export { DEFAULT_SETTINGS, updateSettings, getSettings };
