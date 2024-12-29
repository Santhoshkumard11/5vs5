import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  CardActionArea,
  IconButton,
  Button,
} from "@mui/material";
import { ArrowUpward, ArrowDownward, Delete } from "@mui/icons-material";
import { SOLDIER_TYPES } from "../constants/soldiers";

const TeamSelection = ({ gameSettings, setGameSettings }) => {
  const navigate = useNavigate();
  const [player1Selection, setPlayer1Selection] = useState([]);
  const [cpuSelection, setCpuSelection] = useState([]);
  const [player2Selection, setPlayer2Selection] = useState([]);
  const [currentSelection, setCurrentSelection] = useState("Player 1");
  const [isPlayer1Ready, setIsPlayer1Ready] = useState(false);
  const [isPlayer2Ready, setIsPlayer2Ready] = useState(false);

  const players = Object.entries(SOLDIER_TYPES).map(([key, value]) => ({
    id: key,
    ...value,
  }));

  const handlePlayerClick = (player) => {
    const selectionList =
      currentSelection === "Player 1"
        ? player1Selection
        : gameSettings.opponentType === "Player 2"
        ? player2Selection
        : [];

    if (
      selectionList.length < 3 &&
      !selectionList.some((p) => p.id === player.id)
    ) {
      if (currentSelection === "Player 1") {
        setPlayer1Selection([...player1Selection, player]);
      } else {
        setPlayer2Selection([...player2Selection, player]);
      }
    }
  };

  const handleRemovePlayer = (index) => {
    if (currentSelection === "Player 1") {
      const updatedSelection = [...player1Selection];
      updatedSelection.splice(index, 1);
      setPlayer1Selection(updatedSelection);
      setIsPlayer1Ready(false);
    } else {
      const updatedSelection = [...player2Selection];
      updatedSelection.splice(index, 1);
      setPlayer2Selection(updatedSelection);
      setIsPlayer2Ready(false);
    }
  };

  const handleMovePlayer = (index, direction) => {
    const selectionList =
      currentSelection === "Player 1"
        ? player1Selection
        : gameSettings.opponentType === "Player 2"
        ? player2Selection
        : [];

    const updatedSelection = [...selectionList];
    const [movedPlayer] = updatedSelection.splice(index, 1);
    const newIndex = index + direction;

    if (newIndex >= 0 && newIndex <= updatedSelection.length) {
      updatedSelection.splice(newIndex, 0, movedPlayer);
      if (currentSelection === "Player 1") {
        setPlayer1Selection(updatedSelection);
      } else {
        setPlayer2Selection(updatedSelection);
      }
    }
  };

  const handleReady = () => {
    if (currentSelection === "Player 1") {
      setIsPlayer1Ready(true);

      if (gameSettings.opponentType === "CPU") {
        // Automatically select three random soldiers for CPU
        const shuffledPlayers = players.sort(() => 0.5 - Math.random());
        setCpuSelection(shuffledPlayers.slice(0, 3));
      } else {
        setCurrentSelection("Player 2");
      }
    } else {
      setIsPlayer2Ready(true);
    }
  };

  const handleStartGame = () => {
    setGameSettings({
      ...gameSettings,
      player1Selection: player1Selection,
      player2Selection:
        gameSettings.opponentType === "CPU" ? cpuSelection : player2Selection,
    });
    navigate("/game");
  };

  const renderTeam = (selection) => (
    <Box>
      {selection.map((player, index) => (
        <Box
          key={player.id}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={1}
          sx={{
            bgcolor: "#e8e8e8",
            padding: 1,
            borderRadius: "8px",
            width: "100%",
          }}
        >
          <Typography>
            {index + 1}. {player.type} {player.icon}
          </Typography>
          <Box>
            <IconButton
              onClick={() => handleMovePlayer(index, -1)}
              disabled={index === 0}
            >
              <ArrowUpward />
            </IconButton>
            <IconButton
              onClick={() => handleMovePlayer(index, 1)}
              disabled={index === selection.length - 1}
            >
              <ArrowDownward />
            </IconButton>
            <IconButton onClick={() => handleRemovePlayer(index)}>
              <Delete />
            </IconButton>
          </Box>
        </Box>
      ))}
    </Box>
  );

  return (
    <Grid container sx={{ height: "100vh", overflow: "hidden" }}>
      {/* Player 1 Panel */}
      <Grid item xs={4} sx={{ padding: 2, borderRight: "1px solid #ddd" }}>
        <Typography variant="h5" textAlign="center" gutterBottom>
          Player 1
        </Typography>
        {renderTeam(player1Selection)}
        <Button
          variant="contained"
          color="primary"
          onClick={handleReady}
          disabled={player1Selection.length !== 3 || isPlayer1Ready}
          sx={{ mt: 2, width: "100%" }}
        >
          {isPlayer1Ready ? "Ready!" : "Ready"}
        </Button>
      </Grid>

      {/* Center Panel */}
      <Grid item xs={4} sx={{ padding: 2 }}>
        <Typography variant="h4" textAlign="center" gutterBottom>
          Choose Your Team
        </Typography>
        <Grid container spacing={2}>
          {players.map((player) => (
            <Grid item xs={4} key={player.id}>
              <Card>
                <CardActionArea onClick={() => handlePlayerClick(player)}>
                  <CardContent>
                    <Typography variant="h6">
                      {player.type} {player.icon}
                    </Typography>
                    <Typography variant="body2">
                      Health: {player.health}
                    </Typography>
                    <Typography variant="body2">
                      Damage: {player.damage}
                    </Typography>
                    <Typography variant="body2">
                      Accuracy: {player.accuracy * 100}%
                    </Typography>
                    <Typography variant="body2">
                      Range: {player.range}
                    </Typography>
                    {player.healAmount && (
                      <Typography variant="body2">
                        Heal: {player.healAmount}
                      </Typography>
                    )}
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>

      {/* Player 2 or CPU Panel */}
      <Grid item xs={4} sx={{ padding: 2, borderLeft: "1px solid #ddd" }}>
        <Typography variant="h5" textAlign="center" gutterBottom>
          {gameSettings.opponentType === "CPU" ? "CPU" : "Player 2"}
        </Typography>
        {gameSettings.opponentType === "CPU"
          ? renderTeam(cpuSelection)
          : renderTeam(player2Selection)}
        {gameSettings.opponentType !== "CPU" && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleReady}
            disabled={player2Selection.length !== 3 || isPlayer2Ready}
            sx={{ mt: 2, width: "100%" }}
          >
            {isPlayer2Ready ? "Ready!" : "Ready"}
          </Button>
        )}
      </Grid>

      {/* Bottom Center: Let's Fight Button */}
      <Box
        position="fixed"
        bottom={16}
        left="50%"
        sx={{
          transform: "translateX(-50%)",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          disabled={
            !isPlayer1Ready ||
            (gameSettings.opponentType !== "CPU" && !isPlayer2Ready)
          }
          onClick={handleStartGame}
        >
          Let's Fight!
        </Button>
      </Box>
    </Grid>
  );
};

export default TeamSelection;