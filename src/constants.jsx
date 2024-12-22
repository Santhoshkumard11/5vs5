const SOLDIER_TYPES = {
  ASSAULT: {
    type: "Assault Rifle",
    damage: 20,
    accuracy: 0.8,
    range: 3,
    health: 100,
  },
  SNIPER: {
    type: "Sniper",
    damage: 40,
    accuracy: 0.7,
    range: 5,
    health: 80,
  },
  MEDIC: {
    type: "Medic",
    damage: 10,
    accuracy: 0.9,
    range: 2,
    health: 90,
    healAmount: 30,
  },
  MACHINE_GUN: {
    type: "Machine Gun",
    damage: 25,
    accuracy: 0.75,
    range: 4,
    health: 100,
  },
  SHOTGUN: {
    type: "Shotgun",
    damage: 35,
    accuracy: 0.85,
    range: 1,
    health: 100,
  },
};

export { SOLDIER_TYPES };
