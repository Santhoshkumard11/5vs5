import React from "react";
import SoldierCard from "./SoldierCard";
import "../styles/TeamDisplay.css";

function LeftTeamDisplay({ team, onSelect, isActive, selectedSoldier }) {
  return (
    <div className={`team-display ${isActive ? "active" : ""}`}>
      <div className="team-column">
        {team.slice(0, 2).map((soldier) => (
          <div key={soldier.id} className="team-slot">
            <SoldierCard
              soldier={soldier}
              onClick={() => {
                onSelect(soldier);
              }}
              isSelected={selectedSoldier?.id === soldier.id}
            />
          </div>
        ))}
      </div>
      {team[2] && (
        <div className={`team-column center-column`}>
          <div className="team-slot">
            <SoldierCard
              soldier={team[2]}
              onClick={() => {
                onSelect(team[2]);
              }}
              isSelected={selectedSoldier?.id === team[2]?.id}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function RightTeamDisplay({ team, onSelect, isActive, selectedSoldier }) {
  return (
    <div className={`team-display ${isActive ? "active" : ""}`}>
      {team[2] && (
        <div className={`team-column center-column`}>
          <div className="team-slot">
            <SoldierCard
              soldier={team[2]}
              onClick={() => {
                onSelect(team[2]);
              }}
              isSelected={selectedSoldier?.id === team[2]?.id}
            />
          </div>
        </div>
      )}
      <div className="team-column">
        {team.slice(0, 2).map((soldier) => (
          <div key={soldier.id} className="team-slot">
            <SoldierCard
              soldier={soldier}
              onClick={() => {
                onSelect(soldier);
              }}
              isSelected={selectedSoldier?.id === soldier.id}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export { LeftTeamDisplay, RightTeamDisplay }; 