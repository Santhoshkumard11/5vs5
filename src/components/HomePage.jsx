import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";

const HomePage = ({ gameSettings, setGameSettings }) => {
  const navigate = useNavigate();

  function handleAgainstPlayer2() {
    setGameSettings({
      ...gameSettings,
      opponentType: "Player 2",
    });

    navigate("/location");
  }

  function handleAgainstCPU() {
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
        background: "linear-gradient(135deg, #1e88e5, #1565c0)",
        color: "#ffffff",
        textAlign: "center",
      }}
    >
      <Typography
        variant="h2"
        component="h1"
        sx={{
          fontWeight: "bold",
          marginBottom: "30px",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
        }}
      >
        Dishum Dishum - 3 Vs 3
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          sx={{
            padding: "12px 20px",
            fontSize: "18px",
            textTransform: "uppercase",
            fontWeight: "bold",
            borderRadius: "30px",
          }}
          onClick={handleAgainstCPU}
        >
          Play vs CPU
        </Button>
        <Button
          variant="contained"
          color="secondary"
          sx={{
            padding: "12px 20px",
            fontSize: "18px",
            textTransform: "uppercase",
            fontWeight: "bold",
            borderRadius: "30px",
          }}
          onClick={handleAgainstPlayer2}
        >
          Play vs Human
        </Button>
        <Button
          variant="outlined"
          color="inherit"
          sx={{
            padding: "12px 20px",
            fontSize: "18px",
            textTransform: "uppercase",
            fontWeight: "bold",
            borderRadius: "30px",
            border: "2px solid #ffffff",
            color: "#ffffff",
          }}
          onClick={() => navigate("/settings")}
        >
          Settings
        </Button>
        <Button
          variant="outlined"
          color="inherit"
          sx={{
            padding: "12px 20px",
            fontSize: "18px",
            textTransform: "uppercase",
            fontWeight: "bold",
            borderRadius: "30px",
            color: "#ffffff",
            textDecoration: "underline",
          }}
          onClick={() => navigate("/help")}
        >
          Help
        </Button>
      </Box>
    </Box>
  );
};

export default HomePage;
