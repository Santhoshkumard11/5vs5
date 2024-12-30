import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal, Box, Typography } from "@mui/material";
import TeamDisplay from "./TeamDisplay";
import TurnIndicator from "./TurnIndicator";
import AirdropModal from "./AirdropModal";
import GameOverModal from "./GameOverModal";
import {
  createTeam,
  isValidAction,
  checkGameOver,
  getAIMove,
  getWinningPlayer,
} from "../utils/gameLogic";
import { calculateDamage } from "../utils/calculations";
import "../styles/Game.css";
import { SoundManager } from "../utils/soundEffects";
import SoundControl from "./SoundControl";

import AlertComponent from "./Alerts";

function Game({ gameSettings, setGameSettings }) {
  const navigate = useNavigate();
  const [showQuitModal, setShowQuitModal] = useState(false);
  const [gameState, setGameState] = useState({
    player1Team: [],
    player2Team: [],
    currentTurn: "player1",
    selectedSoldier: null,
    airdropActive: false,
    gameOver: false,
    airdropBonus: false,
    lastAction: null,
  });
  const [showAlertChooseYourTeamPlayer, setShowAlertChooseYourTeamPlayer] =
    useState(false);

  const [showAlertNoDamage, setShowAlertNoDamage] = useState(false);

  const initializeGame = () => {
    const player1Team = createTeam("player1", gameSettings.player1Selection);
    const player2Team = createTeam("player2", gameSettings.player2Selection);
    setGameState({
      ...gameState,
      player1Team,
      player2Team,
      currentTurn: "player1",
      selectedSoldier: null,
      gameOver: false,
      lastAction: null,
      currentRound: 1,
      player1TeamScore: 0,
      player2TeamScore: 0,
    });
  };

  const executeCPUTurn = () => {
    const move = getAIMove(gameState.player2Team, gameState.player1Team);
    if (move) {
      handleAction(move.attacker, move.target);
    }
  };

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (
      gameState.currentTurn === "player2" &&
      !gameState.gameOver &&
      gameSettings.opponentType === "CPU"
    ) {
      const cpuTurnTimeout = setTimeout(() => {
        executeCPUTurn();
      }, 2500);

      return () => clearTimeout(cpuTurnTimeout);
    }
  }, [gameState.currentTurn, gameState.gameOver]);

  const handleSoldierSelect = (soldier) => {
    const currentTeam =
      gameState.currentTurn === "player1"
        ? gameState.player1Team
        : gameState.player2Team;

    if (
      currentTeam.filter((teamSoldier) => teamSoldier.id === soldier.id)
        .length !== 0
    ) {
      if (gameState.selectedSoldier?.id === soldier.id) {
        setGameState({
          ...gameState,
          selectedSoldier: null,
        });
        return;
      }
      setGameState({
        ...gameState,
        selectedSoldier: soldier,
      });
    } else {
      if (gameState.selectedSoldier !== null) {
        handleAction(gameState.selectedSoldier, soldier);
      } else {
        setShowAlertChooseYourTeamPlayer(true);
      }
    }
  };

  const handleAction = (attacker, target) => {
    if (!isValidAction(attacker, target)) {
      SoundManager.playSound("UI", "error");
      return;
    }

    SoundManager.playSound(attacker.type.toUpperCase(), "attack");
    const damage = calculateDamage(attacker, target, gameState.airdropBonus);

    setTimeout(() => {
      if (damage > 0) {
        SoundManager.playSound(attacker.type.toUpperCase(), "hit");
      } else {
        SoundManager.playSound("UI", "hit_miss");
        setShowAlertNoDamage(true);
      }
    }, 200);

    setGameState((prev) => ({
      ...prev,
      lastAction: {
        attacker: attacker.type,
        target: target.type,
        damage: damage,
      },
    }));

    const [updatePlayer1Team, updatePlayer2Team] = applyDamage(
      target.id,
      damage
    );
    checkGameState(updatePlayer1Team, updatePlayer2Team);
  };

  const applyDamage = (targetId, damage) => {
    const updateTeam = (team) =>
      team.map((soldier) =>
        soldier.id === targetId
          ? { ...soldier, health: Math.max(0, soldier.health - damage) }
          : soldier
      );

    const updatePlayer1Team = updateTeam(gameState.player1Team);
    const updatePlayer2Team = updateTeam(gameState.player2Team);

    setGameState((prev) => ({
      ...prev,
      player1Team: updatePlayer1Team,
      player2Team: updatePlayer2Team,
      airdropBonus: false,
    }));
    return [updatePlayer1Team, updatePlayer2Team];
  };

  const checkGameState = (updatePlayer1Team, updatePlayer2Team) => {
    const gameOver = checkGameOver(updatePlayer1Team, updatePlayer2Team);
    if (gameOver) {
      const winningPlayer = getWinningPlayer(
        updatePlayer1Team,
        updatePlayer2Team
      );
      SoundManager.playSound("UI", winningPlayer);
      SoundManager.playSound("UI", "victory");
      setGameState((prev) => ({
        ...prev,
        gameOver: true,
        winningPlayer: winningPlayer,
      }));
    } else {
      switchTurn();
    }
  };

  const switchTurn = () => {
    setGameState((prev) => ({
      ...prev,
      currentTurn: prev.currentTurn === "player1" ? "player2" : "player1",
      selectedSoldier: null,
    }));
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <Button
          variant="outlined"
          color="error"
          onClick={() => setShowQuitModal(true)}
          style={{ position: "absolute", top: "10px", left: "10px" }}
        >
          Quit Game
        </Button>
        <TurnIndicator
          currentTurn={gameState.currentTurn}
          selectedSoldier={gameState.selectedSoldier}
        />
        <SoundControl />
      </div>

      {gameState.lastAction && (
        <div className="action-log">
          <p>
            {gameState.lastAction.attacker} dealt {gameState.lastAction.damage}{" "}
            damage to {gameState.lastAction.target}
          </p>
        </div>
      )}

      <div className="battlefield">
        <TeamDisplay
          team={gameState.player1Team}
          onSelect={handleSoldierSelect}
          isActive={gameState.currentTurn === "player1"}
          selectedSoldier={gameState.selectedSoldier}
        />
        <TeamDisplay
          team={gameState.player2Team}
          onSelect={handleSoldierSelect}
          isActive={gameState.currentTurn === "player2"}
          selectedSoldier={gameState.selectedSoldier}
        />
      </div>

      {gameState.airdropActive && (
        <AirdropModal
          onAnswer={(correct) => {
            setGameState((prev) => ({
              ...prev,
              airdropActive: false,
              airdropBonus: correct,
            }));
          }}
        />
      )}

      {gameState.gameOver && (
        <GameOverModal
          winner={
            gameState.player1Team.some((s) => s.health > 0)
              ? "Player 1"
              : "Player 2"
          }
          onRestart={initializeGame}
        />
      )}
      <Modal
        open={showQuitModal}
        onClose={() => setShowQuitModal(false)}
        aria-labelledby="quit-game-modal"
        aria-describedby="quit-game-confirmation"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography id="quit-game-modal" variant="h6" component="h2">
            Quit Game
          </Typography>
          <Typography id="quit-game-confirmation" sx={{ mt: 2 }}>
            Are you sure you want to quit the game?
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Button
              onClick={() => navigate("/")}
              variant="contained"
              color="error"
              sx={{ mr: 2 }}
            >
              Yes
            </Button>
            <Button onClick={() => setShowQuitModal(false)} variant="outlined">
              No
            </Button>
          </Box>
        </Box>
      </Modal>
      {showAlertChooseYourTeamPlayer && (
        <AlertComponent
          message={"Please select a player from your team!"}
          severity="warning"
          onClose={() => setShowAlertChooseYourTeamPlayer(false)}
        />
      )}
      {showAlertNoDamage && (
        <AlertComponent
          message={"No damage dealt!"}
          severity="info"
          onClose={() => setShowAlertNoDamage(false)}
        />
      )}
    </div>
  );
}

export default Game;
