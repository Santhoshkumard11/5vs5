import React from "react";
import SoldierCard from "./SoldierCard";
import "../styles/TeamDisplay.css";

function TeamDisplay({ team, onSelect, isActive, selectedSoldier }) {
  return (
    <div className={`team ${isActive ? "active" : ""}`}>
      {team.map((soldier) => (
        <SoldierCard
          key={soldier.id}
          soldier={soldier}
          onClick={() => onSelect(soldier)}
          isSelected={selectedSoldier?.id === soldier.id}
        />
      ))}
    </div>
  );
}

export default TeamDisplay;
