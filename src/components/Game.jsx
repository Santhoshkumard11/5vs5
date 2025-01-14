import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal, Box, Typography } from "@mui/material";
import { LeftTeamDisplay, RightTeamDisplay } from "./TeamDisplay";
import AirdropModal from "./AirdropModal";
import GameOverModal from "./GameOverModal";
import {
  createTeam,
  isValidAction,
  checkGameOver,
  getAIMove,
  getWinningPlayer,
  sendAudioTextToPythonServer,
  playAudio,
} from "../utils/gameLogic";
import { calculateDamage } from "../utils/calculations";
import "../styles/Game.css";
import { SoundManager } from "../utils/soundEffects";
import SoundControl from "./SoundControl";

import AlertComponent from "./Alerts";
import {
  buttonClickBack,
  buttonClickSound,
  buttonHoverSound,
  gameLevelSound,
  levelMoveTimeout,
} from "../constants/game";
import { PlayersStats } from "./Stats";
import RibbonDisplay from "./RibbonDisplay";
import getCommentaryText from "../utils/bedrock";
import SpeechRecognitionComponent from "./SpeechRecognition";

import FightingGameBackground from "./GameBackground";

function Game({ gameSettings, setGameSettings }) {
  const navigate = useNavigate();
  const [showQuitModal, setShowQuitModal] = useState(false);
  const [useCustomCursor, setUseCustomCursor] = useState("default");

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
      name: gameSettings.opponentType,
      teamHealth: 100, // Percentage health remaining
    },
  });
  const [showAlertChooseYourTeamPlayer, setShowAlertChooseYourTeamPlayer] =
    useState(false);

  const [countdown, setCountdown] = useState(null);
  const [progress, setProgress] = useState(100);
  const moveTimeout = levelMoveTimeout[gameSettings.difficultyLevel];
  const totalSeconds = Math.ceil(moveTimeout / 1000);

  const synth = window.speechSynthesis;

  const voices = synth.getVoices();

  const femaleVoice = voices.filter(
    (voice) => voice.name.includes("Samantha") && voice.lang === "en-US"
  )[0];

  const maleVoice = voices.filter(
    (voice) => voice.name.includes("Daniel") && voice.lang === "en-GB"
  )[0];

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
    setCountdown(null);
    setProgress(100);
  };

  const handleTextToSpeech = (text, character = "female") => {
    if (!window.speechSynthesis) {
      alert("Text-to-Speech is not supported in this browser.");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US"; // Set the language (optional)
    // female voice
    utterance.voice = femaleVoice;

    if (character === "male") {
      utterance.voice = maleVoice;
      utterance.lang = "en-GB";
    }
    window.speechSynthesis.speak(utterance);
  };

  const startNewRound = () => {
    initializeGame();
    setGameState((prev) => ({
      ...prev,
      currentRound: prev.currentRound + 1,
    }));
    playAudio(gameLevelSound[gameState.currentRound+1]);
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
      setCountdown(totalSeconds); // Initialize countdown
      setProgress(100); // Initialize progress bar

      const playerMoveInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev > 0) {
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
    SoundManager.playSound("UI", "select");
    setUseCustomCursor(soldier.img.cursor);
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

  async function handleCommentary(target, damage) {
    const gameContext = {
      player1: gameState.player1.name,
      p1SuccessfulHits: gameState.metrics.player1.successfulHits,
      p1HitMiss: gameState.metrics.player1.misses,
      p1t1Name: gameState.player1Team[0].type,
      p1t1health: gameState.player1Team[0].health,
      p1t2Name: gameState.player1Team[1].type,
      p1t2health: gameState.player1Team[1].health,
      p1t3Name: gameState.player1Team[2].type,
      p1t3health: gameState.player1Team[2].health,
      player2: gameState.player2.name,
      p2SuccessfulHits: gameState.metrics.player2.successfulHits,
      p2HitMiss: gameState.metrics.player2.misses,
      p2t1Name: gameState.player2Team[0].type,
      p2t1health: gameState.player2Team[0].health,
      p2t2Name: gameState.player2Team[1].type,
      p2t2health: gameState.player2Team[1].health,
      p2t3Name: gameState.player2Team[2].type,
      p2t3health: gameState.player2Team[2].health,
      currentPlayerName:
        gameState.currentTurn === "player1"
          ? gameState.player1.name
          : gameState.player2.name,
      oppositePlayerName:
        gameState.currentTurn === "player1"
          ? gameState.player2.name
          : gameState.player1.name,
      currentPlayerTeamMember: gameState.selectedSoldier?.type || "",
      opponentTeamMember: target || "",
      currentDamage: damage || 0,
      currentPlayerTimeLeft: countdown || 0,
      currentRound: gameState.currentRound,
      p1RoundWins: gameState.roundsWon.player1,
      p2RoundWins: gameState.roundsWon.player2,
    };

    const latestCommentaryText = await getCommentaryText(gameContext);

    if (gameSettings.pollyCommentary) {
      sendAudioTextToPythonServer(latestCommentaryText);
    } else {
      handleTextToSpeech(latestCommentaryText.male, "male");
      handleTextToSpeech(latestCommentaryText.female, "female");
    }
  }

  const handleAction = (attacker, target) => {
    if (!isValidAction(attacker, target)) {
      SoundManager.playSound("UI", "error");
      return;
    }

    const damage = calculateDamage(attacker, target, gameState.airdropBonus);
    if (gameSettings.commentaryFlag) handleCommentary(target.type, damage);

    SoundManager.playSound(attacker.type.toUpperCase(), "attack");

    setTimeout(() => {
      if (damage > 0) {
        SoundManager.playSound(attacker.type.toUpperCase(), "hit");
        updateMetrics(attacker.owner, true); // Successful hit
      } else {
        SoundManager.playSound("UI", "hit_miss");
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
      playAudio(buttonClickSound);
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
        variant="contained"
        color="error"
        onClick={() => {
          playAudio(buttonClickSound);
          setShowQuitModal(true);
        }}
        onMouseEnter={() => playAudio(buttonHoverSound)}
        style={{
          position: "absolute",
          bottom: "10px",
          left: "47%",
          zIndex: "1000",
          background: "linear-gradient(90deg, #26355D, #AF47D2)",
        }}
      >
        Quit Game
      </Button>
      <div className="game-header">
        <RibbonDisplay
          gameState={gameState}
          player1Name={gameSettings.playerInfo.name}
          progress={progress}
          opponentType={gameSettings.opponentType}
        />
        <SoundControl handleAction={handleAction} gameState={gameState} />
      </div>

      <PlayersStats gameState={gameState} />

      <FightingGameBackground />

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
              {gameState.winningPlayer === "player1"
                ? gameSettings.playerInfo.name
                : "Player 2"}{" "}
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
              {gameState.finalWinner === "player1"
                ? gameSettings.playerInfo.name
                : "Player 2"}{" "}
              emerges victorious!
            </Typography>
            <Typography>
              Take a screenshot of this page and share with your friends!
            </Typography>
            <Typography>#sandyinspires</Typography>
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
                onClick={() => {
                  playAudio(buttonClickBack);
                  navigate("/");
                }}
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
        <AlertComponent
          message={`${gameState.lastAction.attacker} dealt ${gameState.lastAction.damage} damage to ${gameState.lastAction.target}`}
          severity="warning"
          onClose={() => {
            setGameState((prev) => ({
              ...prev,
              lastAction: null,
            }));
          }}
        />
      )}

      <div className="timer-container">
        {countdown ? (
          <Typography variant="h3" className="timer">
            {countdown}
          </Typography>
        ) : (
          <Typography variant="h3" className="timer">
            Time Out!
          </Typography>
        )}
      </div>

      {gameState.player1Team && gameState.player2Team && (
        <div
          className="battlefield"
          style={{
            cursor:
              useCustomCursor !== "default"
                ? `url(${useCustomCursor}) 10 10, auto`
                : "default",
          }}
        >
          <LeftTeamDisplay
            team={gameState.player1Team}
            onSelect={handleSoldierSelect}
            isActive={gameState.currentTurn === "player1"}
            selectedSoldier={gameState.selectedSoldier}
            leftTeam={true}
          />
          {gameState.player2.name === "CPU" && (
            <SpeechRecognitionComponent
              handleAction={handleAction}
              gameState={gameState}
            />
          )}
          <RightTeamDisplay
            team={gameState.player2Team}
            onSelect={handleSoldierSelect}
            isActive={gameState.currentTurn === "player2"}
            selectedSoldier={gameState.selectedSoldier}
            leftTeam={false}
          />
        </div>
      )}

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
              onClick={() => {
                playAudio(buttonClickSound);
                navigate("/");
              }}
              variant="contained"
              color="error"
              sx={{ mr: 2 }}
            >
              Yes
            </Button>
            <Button
              onClick={() => {
                playAudio(buttonClickSound);
                setShowQuitModal(false);
              }}
              variant="outlined"
            >
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
    </div>
  );
}

export default Game;
