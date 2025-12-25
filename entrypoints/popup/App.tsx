import { useState, useEffect } from "react";
import "./App.css";
import {
  getSettings,
  updateSettings,
  Settings,
  DEFAULT_SETTINGS,
} from "@/utilities/settings";

function App() {
  const [settings, _setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  const setSettings = async (updatedSettings: Partial<Settings>) => {
    const mergedSettings = { ...settings, ...updatedSettings };
    _setSettings(mergedSettings);
    await updateSettings(mergedSettings);
  };

  useEffect(() => {
    getSettings().then(_setSettings);
  }, []);

  const handleToggleEnabled = async () => {
    const updatedSettings = { ...settings, enabled: !settings.enabled };
    await updateSettings(updatedSettings);
    setSettings(updatedSettings);
  };

  return (
    <>
      <div className="card">
        <button onClick={handleToggleEnabled}>
          count is {settings.enabled.toString()}
        </button>
      </div>
    </>
  );
}

export default App;
