import React from "react";
import "../styles/TurnIndicator.css";

function TurnIndicator({ currentTurn, selectedSoldier, opponentType }) {
  return (
    <div className={`turn-indicator ${currentTurn}`}>
      <div className="turn-content">
        {opponentType === "CPU" ? (
          <h2>
            {currentTurn === "player1" ? "🎮 Player Turn" : "🤖 CPU Turn"}
          </h2>
        ) : (
          <h2>
            {currentTurn === "player1"
              ? "🎮 Player 1 Turn"
              : "🎮 Player 2 Turn"}
          </h2>
        )}
        {selectedSoldier ? (
          <p className="selected-info">
            Selected: {selectedSoldier.type} ({selectedSoldier.health} HP)
          </p>
        ) : (
          <p>...</p>
        )}
        <div className="turn-instructions">
          {currentTurn === "player1" ? (
            selectedSoldier ? (
              <p>Select an enemy target to attack</p>
            ) : (
              <p>Select one of your soldiers to attack</p>
            )
          ) : (
            <p>Player 2 is planning their move...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default TurnIndicator;
