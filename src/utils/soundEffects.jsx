// Sound effect class with volume control and error handling
class SoundEffect {
  constructor(audioPath) {
    this.audio = new Audio(audioPath);
    this.audio.volume = 0.5; // Default volume at 50%
  }

  play() {
    try {
      // Reset audio to start if it's already playing
      this.audio.currentTime = 0;
      // Return the promise of playing
      return this.audio.play();
    } catch (error) {
      console.warn("Sound effect failed to play:", error);
    }
  }

  setVolume(volume) {
    // Ensure volume is between 0 and 1
    this.audio.volume = Math.max(0, Math.min(1, volume));
  }
}

// Create sound effects for each soldier type and action
const SoundEffects = {
  "ASSAULT RIFLE": {
    attack: new SoundEffect("/sounds/assault-attack.wav"),
    hit: new SoundEffect("/sounds/assault-hit.wav"),
    death: new SoundEffect("/sounds/soldier-death.wav"),
  },
  SNIPER: {
    attack: new SoundEffect("/sounds/sniper-attack.wav"),
    hit: new SoundEffect("/sounds/sniper-hit.wav"),
    death: new SoundEffect("/sounds/soldier-death.wav"),
  },
  MEDIC: {
    attack: new SoundEffect("/sounds/medic-attack.wav"),
    heal: new SoundEffect("/sounds/medic-heal.wav"),
    death: new SoundEffect("/sounds/soldier-death.wav"),
  },
  "MACHINE GUN": {
    attack: new SoundEffect("/sounds/machinegun-attack.wav"),
    hit: new SoundEffect("/sounds/machinegun-hit.wav"),
    death: new SoundEffect("/sounds/soldier-death.wav"),
  },
  SHOTGUN: {
    attack: new SoundEffect("/sounds/shotgun-attack.wav"),
    hit: new SoundEffect("/sounds/shotgun-hit.wav"),
    death: new SoundEffect("/sounds/soldier-death.wav"),
  },
  UI: {
    select: new SoundEffect("/sounds/select.wav"),
    hit_miss: new SoundEffect("/sounds/hit-miss.wav"),
    error: new SoundEffect("/sounds/error.ogg"),
    victory: new SoundEffect("/sounds/you_win.ogg"),
    defeat: new SoundEffect("/sounds/you_lose.ogg"),
    airdrop: new SoundEffect("/sounds/airdrop.ogg"),
    player_1: new SoundEffect("/sounds/player_1.ogg"),
    player_2: new SoundEffect("/sounds/player_2.ogg"),
    begin: new SoundEffect("/sounds/begin.ogg"),
    prepareYourself: new SoundEffect("/sounds/prepare_yourself.ogg"),
  },
};

// Sound Manager to control all game sounds
export class SoundManager {
  static isMuted = false;
  static volume = 0.5;

  static toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  static setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    // Update volume for all sound effects
    Object.values(SoundEffects).forEach((category) => {
      Object.values(category).forEach((sound) => {
        sound.setVolume(this.volume);
      });
    });
  }

  static playSound(category, type) {
    if (this.isMuted) return;

    try {
      SoundEffects[category][type]?.play();
    } catch (error) {
      console.warn(`Failed to play sound: ${category}-${type}`, error);
    }
  }
}
function speakText(
  text,
  { pitch = 1, rate = 1, volume = 1, voice = null } = {}
) {
  if (!text || typeof text !== "string") {
    console.error("Invalid text provided for speech synthesis.");
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Create a new SpeechSynthesisUtterance
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.pitch = pitch; // Pitch (default: 1, range: 0 - 2)
  utterance.rate = rate; // Speed rate (default: 1, range: 0.1 - 10)
  utterance.volume = volume; // Volume (default: 1, range: 0 - 1)

  // Set a specific voice if provided
  if (voice) {
    const availableVoices = window.speechSynthesis.getVoices();
    const selectedVoice = availableVoices.find((v) => v.name === voice);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    } else {
      console.warn(
        "Requested voice not available. Default voice will be used."
      );
    }
  }

  // Handle errors during speech
  utterance.onerror = (error) => {
    console.error("Error during speech synthesis:", error);
  };

  // Speak the text
  window.speechSynthesis.speak(utterance);
}

export { SoundEffects, speakText };
