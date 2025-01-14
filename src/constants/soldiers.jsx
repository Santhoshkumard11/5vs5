export const SOLDIER_TYPES = {
  ASSAULT: {
    type: "Assault Rifle",
    damage: 20,
    accuracy: 0.8,
    range: 3,
    health: 100,
    icon: "🔫",
    img: {
      normal: "./img/assault-rifle.png",
      fire: "./img/assault-rifle-fire.png",
      cursor: "./img/aim-1.png",
    },
  },
  SNIPER: {
    type: "Sniper",
    damage: 40,
    accuracy: 0.7,
    range: 5,
    health: 80,
    icon: "🎯",
    img: {
      normal: "./img/sniper.png",
      fire: "./img/sniper-fire.png",
      cursor: "./img/aim-1.png",
    },
  },
  MEDIC: {
    type: "Medic",
    damage: 10,
    accuracy: 0.9,
    range: 2,
    health: 90,
    healAmount: 30,
    icon: "⚕️",
    img: {
      normal: "./img/medic.png",
      fire: "./img/medic-fire.png",
      cursor: "./img/aim-1.png",
    },
  },
  MACHINE_GUN: {
    type: "Machine Gun",
    damage: 25,
    accuracy: 0.75,
    range: 4,
    health: 100,
    icon: "🔫",
    img: {
      normal: "./img/machine-gun.png",
      fire: "./img/machine-gun-fire.png",
      cursor: "./img/aim-1.png",
    },
  },
  SHOTGUN: {
    type: "Shotgun",
    damage: 35,
    accuracy: 0.85,
    range: 1,
    health: 100,
    icon: "💥",
    img: {
      normal: "./img/shotgun.png",
      fire: "./img/shotgun-fire.png",
      cursor: "./img/aim-1.png",
    },
  },
};
