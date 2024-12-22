import { useCallback } from "react";
import { SoundManager } from "../utils/soundEffect";

export const useSound = () => {
  const playSound = useCallback((category, type) => {
    SoundManager.playSound(category, type);
  }, []);

  const stopAllSounds = useCallback(() => {
    SoundManager.stopAll();
  }, []);

  return { playSound, stopAllSounds };
};
