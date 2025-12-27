import { parsePullRequestPath } from "@/utilities/route-utils";
import { compact, isEmpty } from "lodash-es";

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

async function updateSettings(settings: Partial<Settings>): Promise<void> {
  return browser.storage.sync.set<Settings>(settings);
}

async function getSettings(): Promise<Settings> {
  let settings = await browser.storage.sync.get<Settings>(DEFAULT_SETTINGS);
  return {
    ...settings,
    includedOrganizations: compact(settings.includedOrganizations),
  };
}

async function isEnabled(): Promise<boolean> {
  const { enabled, includedOrganizations } = await getSettings();
  const { organization } = parsePullRequestPath(window.location.pathname);
  if (!enabled) {
    return false;
  }

  if (isEmpty(includedOrganizations)) {
    return true;
  }

  return includedOrganizations.includes(organization);
}

export type { Settings };
export { DEFAULT_SETTINGS, getSettings, isEnabled, updateSettings };
