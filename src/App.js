import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Game from "./components/Game";
import HomePage from "./components/HomePage";
import Settings from "./components/Settings";
import ChooseLocation from "./components/ChooseLocation";
import Help from "./components/Help";
import { useState } from "react";
import TeamSelection from "./components/ChooseTeam";

function App() {
  const [gameSettings, setGameSettings] = useState({
    location: "",
    commentaryFlag: false,
    voiceMode: false,
    volume: 0.5,
    difficultyLevel: "Easy",
    bulletColor: "red",
    player1Selection: [],
    player2Selection: [],
    gameSoundMode: "human",
  });

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              gameSettings={gameSettings}
              setGameSettings={setGameSettings}
            />
          }
        />
        <Route
          path="/settings"
          element={
            <Settings
              gameSettings={gameSettings}
              setGameSettings={setGameSettings}
            />
          }
        />
        <Route
          path="/location"
          element={
            <ChooseLocation
              gameSettings={gameSettings}
              setGameSettings={setGameSettings}
            />
          }
        />
        <Route
          path="/team"
          element={
            <TeamSelection
              gameSettings={gameSettings}
              setGameSettings={setGameSettings}
            />
          }
        />
        <Route
          path="/game"
          element={
            <Game
              gameSettings={gameSettings}
              setGameSettings={setGameSettings}
            />
          }
        />
        <Route path="/help" element={<Help />} />
      </Routes>
    </Router>
  );
}

export default App;
