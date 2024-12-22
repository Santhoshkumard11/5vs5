import React from "react";
import "../styles/Modal.css";

function GameOverModal({ winner, onRestart }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Game Over!</h2>
        <p>{winner} Wins!</p>
        <button className="restart-button" onClick={onRestart}>
          Play Again
        </button>
      </div>
    </div>
  );
}

export default GameOverModal;
