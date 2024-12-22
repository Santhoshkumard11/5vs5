import React, { useContext } from "react";
import { GameContext } from "../GameContext";
import "./Settings.css";

const Settings = () => {
  const { settings, setSettings } = useContext(GameContext);

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="settings-page">
      <h2>Settings</h2>
      <label>
        <input
          type="checkbox"
          checked={settings.commentary}
          onChange={() => toggleSetting("commentary")}
        />
        Enable Commentary
      </label>
      <label>
        <input
          type="checkbox"
          checked={settings.speechEnabled}
          onChange={() => toggleSetting("speechEnabled")}
        />
        Enable Speech
      </label>
      <button onClick={() => alert("Saved!")}>Save</button>
    </div>
  );
};

export default Settings;
