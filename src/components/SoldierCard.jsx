import React from "react";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import "../styles/SoldierCard.css";

function SoldierCard({ soldier, onClick, isSelected }) {
  const healthPercentage = Math.max(0, Math.min(100, soldier.health));

  const soldierImage = isSelected ? soldier.img.fire : soldier.img.normal;

  return (
    <div
      className={`soldier-card ${soldier.health <= 0 ? "disabled" : ""} 
                 ${isSelected ? "selected" : ""} ${soldier.owner}`}
      onClick={() => soldier.health > 0 && onClick()}
      style={{
        border: isSelected ? "2px solid #1976d2" : "1px solid #ccc",
        borderRadius: "8px",
        padding: "10px",
        boxShadow: isSelected
          ? "0 4px 10px rgba(25, 118, 210, 0.5)"
          : "0 2px 5px rgba(0, 0, 0, 0.2)",
        backgroundColor: "#fff",
        cursor: soldier.health > 0 ? "pointer" : "not-allowed",
        transition: "all 0.3s ease",
        maxWidth: "220px",
        textAlign: "center",
      }}
    >
      <Typography variant="h6" component="h3">
        {soldier.type}
      </Typography>
      <img
        src={soldierImage}
        alt={soldier.type}
        height={200}
        width={200}
        style={{ margin: "10px auto" }}
      />
      <div
        className="health-bar"
        style={{
          height: "10px",
          width: "100%",
          backgroundColor: "#e0e0e0",
          borderRadius: "5px",
          overflow: "hidden",
          margin: "10px 0",
        }}
      >
        <div
          className="health-fill"
          style={{
            width: `${healthPercentage}%`,
            height: "100%",
            backgroundColor: healthPercentage > 50 ? "#0eefaf" : "#f44336",
            transition: "width 0.3s ease",
          }}
        />
      </div>
      <Tooltip
        title={
          <div>
            <Typography variant="body2">HP: {soldier.health}</Typography>
            <Typography variant="body2">DMG: {soldier.damage}</Typography>
            <Typography variant="body2">
              ACC: {(soldier.accuracy * 100).toFixed(0)}%
            </Typography>
          </div>
        }
        arrow
      >
        <div
          style={{
            display: "inline-block",
            padding: "5px 10px",
            backgroundColor: "#e98c8c",
            color: "#fff",
            borderRadius: "5px",
            fontSize: "0.85rem",
            cursor: "help",
            margin: "10px auto",
          }}
        >
          View Stats
        </div>
      </Tooltip>
    </div>
  );
}

export default SoldierCard;
