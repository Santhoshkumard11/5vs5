import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <h1>Five vs Five</h1>
      <div className="menu">
        <button onClick={() => navigate("/location")}>Play vs CPU</button>
        <button onClick={() => navigate("/location")}>Play vs Human</button>
        <button onClick={() => navigate("/settings")}>Settings</button>
        <button
          onClick={() => alert("Rules: Eliminate the enemy team to win.")}
        >
          Help
        </button>
      </div>
    </div>
  );
};

export default HomePage;
