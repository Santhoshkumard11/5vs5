import React from "react";
import { useNavigate } from "react-router-dom";
import "./ChooseLocation.css";

const locations = ["Japan", "New York", "Alaska"];

const ChooseLocation = () => {
  const navigate = useNavigate();

  return (
    <div className="choose-location">
      <h2>Select Battle Location</h2>
      <div className="location-list">
        {locations.map((location) => (
          <button
            key={location}
            onClick={() => navigate("/game", { state: { location } })}
          >
            {location}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChooseLocation;
