import React from "react";
import "../styles/TurnIndicator.css";

function TurnIndicator({ currentTurn, selectedSoldier }) {
  return (
    <div className={`turn-indicator ${currentTurn}`}>
      <div className="turn-content">
        <h2>{currentTurn === "player" ? "🎮 Player Turn" : "🤖 CPU Turn"}</h2>
        {selectedSoldier && currentTurn === "player" && (
          <p className="selected-info">
            Selected: {selectedSoldier.type} ({selectedSoldier.health} HP)
          </p>
        )}
        <div className="turn-instructions">
          {currentTurn === "player" ? (
            selectedSoldier ? (
              <p>Select an enemy target to attack</p>
            ) : (
              <p>Select one of your soldiers to attack</p>
            )
          ) : (
            <p>CPU is planning their move...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default TurnIndicator;
