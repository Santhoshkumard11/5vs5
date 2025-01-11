import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal, Box, Typography, LinearProgress } from "@mui/material";
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
import { levelMoveTimeout } from "../constants/game";
import { PlayersStats } from "./Stats";
import RibbonDisplay from "./RibbonDisplay";

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
    metrics: {
      player1: { successfulHits: 0, misses: 0 },
      player2: { successfulHits: 0, misses: 0 },
    },
    roundsWon: {
      player1: 0,
      player2: 0,
    },
    currentRound: 1,
    finalWinner: null,
    player1: {
      name: "Player 1",
      teamHealth: 100, // Percentage health remaining
    },
    player2: {
      name: "Player 2",
      teamHealth: 100, // Percentage health remaining
    },
  });
  const [showAlertChooseYourTeamPlayer, setShowAlertChooseYourTeamPlayer] =
    useState(false);

  const [showAlertNoDamage, setShowAlertNoDamage] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [progress, setProgress] = useState(100);

  const initializeGame = useCallback(() => {
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
    setCountdown(null);
    setProgress(100);
  });

  const startNewRound = () => {
    initializeGame();
    setGameState((prev) => ({
      ...prev,
      currentRound: prev.currentRound + 1,
    }));
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

  useEffect(() => {
    if (!gameState.gameOver && gameSettings.opponentType === "CPU") {
      const moveTimeout = levelMoveTimeout[gameSettings.difficultyLevel];
      const totalSeconds = Math.ceil(moveTimeout / 1000);
      setCountdown(totalSeconds); // Initialize countdown
      setProgress(100); // Initialize progress bar

      const playerMoveInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev > 1) {
            const newProgress = ((prev - 1) / totalSeconds) * 100;
            setProgress(newProgress);
            return prev - 1;
          }
          clearInterval(playerMoveInterval);
          if (gameSettings.opponentType === "CPU" && !gameState.gameOver) {
            switchTurn(); // Trigger turn switch when the timer ends
          }
          return null;
        });
      }, 1000);

      return () => clearInterval(playerMoveInterval);
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

  const sumTeamHealth = (team) => {
    return Math.round(
      team.reduce((total, character) => total + character.health, 0) / 3
    );
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
        updateMetrics(attacker.owner, true); // Successful hit
      } else {
        SoundManager.playSound("UI", "hit_miss");
        setShowAlertNoDamage(true);
        updateMetrics(attacker.owner, false); // Miss
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
    setGameState((prev) => ({
      ...prev,
      player1: {
        ...prev.player1,
        teamHealth: sumTeamHealth(updatePlayer1Team),
      },
    }));
    setGameState((prev) => ({
      ...prev,
      player2: {
        ...prev.player2,
        teamHealth: sumTeamHealth(updatePlayer2Team),
      },
    }));
  };

  const updateMetrics = (player, isHit) => {
    setGameState((prev) => ({
      ...prev,
      metrics: {
        ...prev.metrics,
        [player]: {
          successfulHits: isHit
            ? prev.metrics[player].successfulHits + 1
            : prev.metrics[player].successfulHits,
          misses: !isHit
            ? prev.metrics[player].misses + 1
            : prev.metrics[player].misses,
        },
      },
    }));
  };

  const applyDamage = (targetId, damage) => {
    const updateTeamHealth = (team) =>
      team.map((soldier) =>
        soldier.id === targetId
          ? { ...soldier, health: Math.max(0, soldier.health - damage) }
          : soldier
      );

    const updatedTeams = {
      player1Team: updateTeamHealth(gameState.player1Team),
      player2Team: updateTeamHealth(gameState.player2Team),
    };

    setGameState((prev) => ({
      ...prev,
      ...updatedTeams,
      airdropBonus: false,
    }));

    return [updatedTeams.player1Team, updatedTeams.player2Team];
  };

  const checkGameState = (updatePlayer1Team, updatePlayer2Team) => {
    const gameOver = checkGameOver(updatePlayer1Team, updatePlayer2Team);
    if (gameOver) {
      const winningPlayer = getWinningPlayer(
        updatePlayer1Team,
        updatePlayer2Team
      );

      setGameState((prev) => {
        const updatedRoundsWon = {
          ...prev.roundsWon,
          [winningPlayer]: prev.roundsWon[winningPlayer] + 1,
        };

        const isFinalWinner =
          updatedRoundsWon[winningPlayer] === 3 ? winningPlayer : null;

        return {
          ...prev,
          gameOver: true,
          winningPlayer: winningPlayer,
          roundsWon: updatedRoundsWon,
          finalWinner: isFinalWinner,
        };
      });

      if (gameSettings.soundEffects) {
        SoundManager.playSound("UI", "victory");
      }
    } else {
      switchTurn();
    }
  };

  const handleNextRound = () => {
    if (!gameState.finalWinner) {
      startNewRound();
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
      <Button
        variant="outlined"
        color="error"
        onClick={() => setShowQuitModal(true)}
        style={{
          position: "absolute",
          bottom: "10px",
          left: "47%",
          zIndex: "1000",
        }}
      >
        Quit Game
      </Button>
      <div className="game-header">
        <RibbonDisplay gameState={gameState} />

        {countdown !== null && (
          <div className="timer-container">
            <Typography variant="h6" className="timer">
              Time left: {countdown}s
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress}
              className="progress-bar"
            />
          </div>
        )}
        <SoundControl />
      </div>

      <PlayersStats gameState={gameState} />

      {/* Game Over Modal for Each Round */}
      {gameState.gameOver && !gameState.finalWinner && (
        <Modal open={gameState.gameOver} onClose={() => {}}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.default",
              borderRadius: 3,
              boxShadow: 24,
              p: 4,
              width: { xs: "90%", sm: "400px" },
            }}
          >
            <Typography
              variant="h5"
              component="h2"
              align="center"
              sx={{ fontWeight: "bold", mb: 2 }}
            >
              🎉 Round Over 🎉
            </Typography>
            <Typography
              variant="body1"
              align="center"
              sx={{ mb: 3, color: "text.secondary" }}
            >
              {gameState.winningPlayer === "player1" ? "Player 1" : "Player 2"}{" "}
              wins this round!
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                onClick={handleNextRound}
                variant="contained"
                color="primary"
                sx={{ textTransform: "none", px: 4 }}
              >
                Start Next Round
              </Button>
            </Box>
          </Box>
        </Modal>
      )}

      {/* Final Game Over Modal */}
      {gameState.finalWinner && (
        <Modal open={Boolean(gameState.finalWinner)} onClose={() => {}}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.default",
              borderRadius: 3,
              boxShadow: 24,
              p: 4,
              width: { xs: "90%", sm: "450px" },
              textAlign: "center",
            }}
          >
            <Typography
              variant="h4"
              component="h2"
              sx={{ fontWeight: "bold", color: "error.main", mb: 2 }}
            >
              🎯 Game Over 🎯
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
              {gameState.finalWinner === "player1" ? "Player 1" : "Player 2"}{" "}
              emerges victorious!
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 2,
                alignItems: "center",
                mt: 4,
              }}
            >
              <Button
                onClick={() => navigate("/")}
                variant="contained"
                color="success"
                sx={{
                  px: 4,
                  py: 1.5,
                  fontWeight: "bold",
                  textTransform: "none",
                }}
              >
                🏠 Back to Home
              </Button>
            </Box>
          </Box>
        </Modal>
      )}

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
