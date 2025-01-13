import React from "react";
import "../styles/SoldierCard.css";

function SoldierCard({ soldier, onClick, isSelected }) {
  const healthPercentage = Math.max(0, Math.min(100, soldier.health));

  const soldierImage = isSelected ? soldier.img.fire : soldier.img.normal;

  return (
    <div
      className={`soldier-card ${soldier.health <= 0 ? "disabled" : ""} 
                 ${isSelected ? "selected" : ""} ${soldier.owner}`}
      onClick={() => soldier.health > 0 && onClick()}
    >
      <h3>{soldier.type}</h3>
      <img src={soldierImage} alt={soldier.type} height={200} width={200} />
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
