export const levelColors = {
  Easy: "success", // Green for Easy
  Medium: "info", // Blue for Medium
  Hard: "warning", // Orange for Hard
  Insane: "error", // Red for Insane
};

export const levelMoveTimeout = {
  Easy: 15000, // 15 seconds for Easy
  Medium: 10000, // 10 seconds for Medium
  Hard: 7000, // 7 seconds for Hard
  Insane: 5000, // 5 seconds for Insane
};


export const buttonHoverSound = new Audio("./sounds/button-hover.wav");
export const buttonClickBack = new Audio("./sounds/button-click-back.wav");
export const buttonClickSound = new Audio("./sounds/button-click.wav");
export const buttonClickFight = new Audio("./sounds/button-click-fight.wav");
export const soldierSelectSound = new Audio("./sounds/soldier-select.wav");

export const locationMoveSound = new Audio("./sounds/location-move.wav");