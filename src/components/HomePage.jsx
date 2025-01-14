import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import { playAudio } from "../utils/gameLogic";
import { buttonClickSound, buttonHoverSound } from "../constants/game";
import FightingGameBackground from "./GameBackground";

const HomePage = ({ gameSettings, setGameSettings }) => {
  const navigate = useNavigate();

  function playHoverSound() {
    try {
      buttonHoverSound.currentTime = 0; // Reset sound to the start
      buttonHoverSound.play();
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  }

  function handleAgainstPlayer2() {
    playAudio(buttonClickSound);
    setGameSettings({
      ...gameSettings,
      opponentType: "Player 2",
    });

    navigate("/location");
  }

  function handleAgainstCPU() {
    playAudio(buttonClickSound);
    setGameSettings({
      ...gameSettings,
      opponentType: "CPU",
    });
    navigate("/location");
  }

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#252A34",
        textAlign: "center",
        padding: "20px",
        gap: 4,
      }}
    >
      <FightingGameBackground />
      <Typography
        variant="h2"
        component="h1"
        sx={{
          fontWeight: "bold",
          marginBottom: "10px",
          color: "#fffff",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
        }}
      >
        Dishum Dishum - 3 Vs 3
      </Typography>
      <Typography
        variant="subtitle1"
        sx={{
          fontSize: "20px",
          fontWeight: 500,
          color: "#26355D",
          marginBottom: "30px",
        }}
      >
        Choose your team and enter the battlefield!
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          width: "100%",
          maxWidth: "350px",
        }}
      >
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#08D9D6",
            color: "#EAEAEA",
            padding: "14px 20px",
            fontSize: "16px",
            textTransform: "uppercase",
            fontWeight: "bold",
            borderRadius: "10px",
            transition: "transform 0.2s, background-color 0.3s",
            "&:hover": {
              backgroundColor: "#06B6B3",
              transform: "scale(1.05)",
            },
          }}
          onClick={handleAgainstCPU}
          onMouseEnter={playHoverSound}
        >
          Play vs CPU
        </Button>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#FF2E63",
            color: "#FFFFFF",
            padding: "14px 20px",
            fontSize: "16px",
            textTransform: "uppercase",
            fontWeight: "bold",
            borderRadius: "10px",
            transition: "transform 0.2s, background-color 0.3s",
            "&:hover": {
              backgroundColor: "#D92655",
              transform: "scale(1.05)",
            },
          }}
          onClick={handleAgainstPlayer2}
          onMouseEnter={playHoverSound}
        >
          Play vs Human
        </Button>
        <Button
          variant="outlined"
          sx={{
            padding: "14px 20px",
            fontSize: "16px",
            textTransform: "uppercase",
            fontWeight: "bold",
            borderRadius: "10px",
            border: "2px solid #AF47D2",
            color: "#AF47D2",
            transition: "transform 0.2s, border-color 0.3s, color 0.3s",
            "&:hover": {
              borderColor: "#9436B8",
              color: "#9436B8",
              transform: "scale(1.05)",
            },
          }}
          onClick={() => {
            playAudio(buttonClickSound);
            navigate("/settings");
          }}
          onMouseEnter={playHoverSound}
        >
          Settings
        </Button>
        <Button
          variant="outlined"
          sx={{
            padding: "14px 20px",
            fontSize: "16px",
            textTransform: "uppercase",
            fontWeight: "bold",
            borderRadius: "10px",
            border: "2px solid #FF8F00",
            color: "#FF8F00",
            transition: "transform 0.2s, border-color 0.3s, color 0.3s",
            "&:hover": {
              borderColor: "#E07C00",
              color: "#E07C00",
              transform: "scale(1.05)",
            },
          }}
          onClick={() => {
            playAudio(buttonClickSound);
            navigate("/help");
          }}
          onMouseEnter={playHoverSound}
        >
          Help
        </Button>
      </Box>
    </Box>
  );
};

export default HomePage;
