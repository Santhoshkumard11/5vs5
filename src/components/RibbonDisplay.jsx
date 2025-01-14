import React from "react";
import "../styles/Ribbon.css";
import TurnIndicator from "./TurnIndicator";
import { Typography } from "@mui/material";

const RibbonDisplay = ({ gameState, player1Name, progress, opponentType }) => {
  return (
    <div className="top-ribbon">
      {/* Player 1 Section */}
      <div className="player-section left">
        <div className="parallelogram player-name-container">
          <span className="player-name">{player1Name}</span>
        </div>
        <div className="team-health-parallelogram">
          <div
            className="health-fill-parallelogram"
            style={{
              width: `${gameState.player1.teamHealth}%`,
            }}
          ></div>
        </div>
        <div className="rounds-container left">
          {[...Array(3)].map((_, index) => (
            <div
              key={`player1-round-${index}`}
              className={`round-shape ${
                index < gameState.roundsWon.player1 ? "won" : ""
              }`}
            ></div>
          ))}
        </div>
      </div>

      {/* Center Divider */}
      <div>
        <TurnIndicator
          currentTurn={gameState.currentTurn}
          selectedSoldier={gameState.selectedSoldier}
          opponentType={opponentType}
          progress={progress}
        />
      </div>

      {/* Player 2 Section */}
      <div className="player-section">
        <div
          className="parallelogram player-name-container"
          style={{ alignItems: "flex-end" }}
        >
          <span className="player-name">{gameState.player2.name}</span>
        </div>

        <div className="team-health-parallelogram">
          <div
            className="health-fill-parallelogram"
            style={{
              width: `${gameState.player2.teamHealth}%`,
            }}
          ></div>
        </div>
        <div
          className="rounds-container right"
          style={{ alignItems: "flex-start" }}
        >
          {[...Array(3)].map((_, index) => (
            <div
              key={`player2-round-${index}`}
              className={`round-shape ${
                index < gameState.roundsWon.player2 ? "won" : ""
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RibbonDisplay;
