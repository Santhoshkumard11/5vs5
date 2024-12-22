import React, { useEffect, useState } from "react";
import { SoundManager } from "../utils/soundEffects";
import "../styles/SoundControl.css";

function SoundControl() {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);

  const handleMuteToggle = () => {
    const muted = SoundManager.toggleMute();
    setIsMuted(muted);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    SoundManager.setVolume(newVolume);
  };

  useEffect(() => {
    const savedVolume = localStorage.getItem("gameVolume");
    if (savedVolume !== null) {
      const volume = parseFloat(savedVolume);
      setVolume(volume);
      SoundManager.setVolume(volume);
    }
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "m") {
        handleMuteToggle();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <div className="sound-control">
      <button
        className={`mute-button ${isMuted ? "muted" : ""}`}
        onClick={handleMuteToggle}
      >
        {isMuted ? "🔇" : "🔊"}
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={volume}
        onChange={handleVolumeChange}
        className="volume-slider"
      />
    </div>
  );
}

export default SoundControl;
