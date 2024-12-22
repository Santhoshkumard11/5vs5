import React from "react";
import "../styles/SoldierCard.css";

function SoldierCard({ soldier, onClick, isSelected }) {
  const healthPercentage = Math.max(0, Math.min(100, soldier.health));

  return (
    <div
      className={`soldier-card ${soldier.health <= 0 ? "disabled" : ""} 
                 ${isSelected ? "selected" : ""} ${soldier.owner}`}
      onClick={() => soldier.health > 0 && onClick()}
    >
      <div className="soldier-icon">{soldier.icon}</div>
      <h3>{soldier.type}</h3>
      <div className="health-bar">
        <div
          className="health-fill"
          style={{ width: `${healthPercentage}%` }}
        />
      </div>
      <div className="stats">
        <p>HP: {soldier.health}</p>
        <p>DMG: {soldier.damage}</p>
        <p>ACC: {(soldier.accuracy * 100).toFixed(0)}%</p>
      </div>
    </div>
  );
}

export default SoldierCard;
