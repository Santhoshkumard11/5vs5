import React, { useState, useEffect } from "react";
import TeamDisplay from "./TeamDisplay";
import TurnIndicator from "./TurnIndicator";
import AirdropModal from "./AirdropModal";
import GameOverModal from "./GameOverModal";
import {
  createTeam,
  isValidAction,
  checkGameOver,
  getAIMove,
} from "../utils/gameLogic";
import { calculateDamage } from "../utils/calculations";
import "../styles/Game.css";
import { SoundManager, speakText } from "../utils/soundEffects";
import SoundControl from "./SoundControl";

function Game() {
  const [gameState, setGameState] = useState({
    playerTeam: [],
    cpuTeam: [],
    currentTurn: "player",
    selectedSoldier: null,
    airdropActive: false,
    gameOver: false,
    airdropBonus: false,
    lastAction: null,
  });

  const initializeGame = () => {
    const playerTeam = createTeam("player");
    const cpuTeam = createTeam("cpu");
    setGameState({
      ...gameState,
      playerTeam,
      cpuTeam,
      currentTurn: "player",
      selectedSoldier: null,
      gameOver: false,
      lastAction: null,
    });
  };

  const executeCPUTurn = () => {
    const move = getAIMove(gameState.cpuTeam, gameState.playerTeam);
    if (move) {
      handleAction(move.attacker, move.target);
    }
  };

  useEffect(() => {
    initializeGame();
  }, []);

  // Handle CPU turn
  useEffect(() => {
    if (gameState.currentTurn === "cpu" && !gameState.gameOver) {
      const cpuTurnTimeout = setTimeout(() => {
        executeCPUTurn();
      }, 2500); // Add delay for better UX

      return () => clearTimeout(cpuTurnTimeout);
    }
  }, [gameState.currentTurn, gameState.gameOver]);

  const handleSoldierSelect = (soldier) => {
    SoundManager.playSound("UI", "select");
    if (gameState.currentTurn === "player" && soldier.owner === "player") {
      setGameState({
        ...gameState,
        selectedSoldier: soldier,
      });
    }
  };

  const handleTargetSelect = (target) => {
    if (!gameState.selectedSoldier || target.owner === "player") return;

    handleAction(gameState.selectedSoldier, target);
  };

  const handleAction = (attacker, target) => {
    if (!isValidAction(attacker, target)) {
      SoundManager.playSound("UI", "error");
      return;
    }

    // Play attack sound
    SoundManager.playSound(attacker.type.toUpperCase(), "attack");

    const damage = calculateDamage(attacker, target, gameState.airdropBonus);
    // Add slight delay for hit sound
    setTimeout(() => {
      if (damage > 0) {
        SoundManager.playSound(attacker.type.toUpperCase(), "hit");
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
    const damageText = `${attacker.type} dealt ${damage}
            damage to ${target.type}`;
    // this will speak what damage was dealt to which opponent
    // speakText(damageText);

    checkGameState();
    applyDamage(target.id, damage);
  };

  const applyDamage = (targetId, damage) => {
    const updateTeam = (team) =>
      team.map((soldier) =>
        soldier.id === targetId
          ? { ...soldier, health: Math.max(0, soldier.health - damage) }
          : soldier
      );

    setGameState((prev) => ({
      ...prev,
      playerTeam: updateTeam(prev.playerTeam),
      cpuTeam: updateTeam(prev.cpuTeam),
      airdropBonus: false,
    }));
  };

  const checkGameState = () => {
    const gameOver = checkGameOver(gameState.playerTeam, gameState.cpuTeam);
    if (gameOver) {
      const playerWon = gameState.playerTeam.some((s) => s.health > 0);
      SoundManager.playSound("UI", playerWon ? "victory" : "defeat");
      setGameState((prev) => ({ ...prev, gameOver: true }));
    } else {
      triggerAirdropChance();
      switchTurn();
    }
  };

  const triggerAirdropChance = () => {
    if (Math.random() / 3 === 0) {
      SoundManager.playSound("UI", "airdrop");
      setGameState((prev) => ({ ...prev, airdropActive: true }));
    }
  };

  const switchTurn = () => {
    if (gameState.currentTurn === "cpu") {
      SoundManager.playSound("UI", "player_2");
    } else {
      SoundManager.playSound("UI", "player_1");
    }
    setGameState((prev) => ({
      ...prev,
      currentTurn: prev.currentTurn === "player" ? "cpu" : "player",
      selectedSoldier: null,
    }));
  };

  return (
    <div className="game-container">
      <div className="game-header">
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
          team={gameState.playerTeam}
          onSelect={handleSoldierSelect}
          isActive={gameState.currentTurn === "player"}
          selectedSoldier={gameState.selectedSoldier}
        />
        <TeamDisplay
          team={gameState.cpuTeam}
          onSelect={handleTargetSelect}
          isActive={gameState.currentTurn === "cpu"}
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
            gameState.playerTeam.some((s) => s.health > 0) ? "Player" : "CPU"
          }
          onRestart={initializeGame}
        />
      )}
    </div>
  );
}

export default Game;
