import React, { useState } from "react";
import { AWS_QUESTIONS } from "../constants/questions";
import "../styles/Modal.css";

function AirdropModal({ onAnswer }) {
  const [question] = useState(
    AWS_QUESTIONS[Math.floor(Math.random() * AWS_QUESTIONS.length)]
  );

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>⚡ AWS Challenge! ⚡</h2>
        <p>Answer correctly for 2x damage bonus!</p>
        <div className="question">
          <h3>{question.question}</h3>
          <div className="options">
            {question.options.map((option, index) => (
              <button
                key={index}
                className="option-button"
                onClick={() => onAnswer(index === question.correct)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AirdropModal;
