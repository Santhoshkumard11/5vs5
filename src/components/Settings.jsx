import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Slider,
  MenuItem,
  Select,
  Switch,
  FormControlLabel,
  Modal,
  IconButton,
} from "@mui/material";
import { ArrowUpward, ArrowDownward, Close } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Settings = ({ gameSettings }) => {
  const navigate = useNavigate();
  const [volume, setVolume] = useState(50);
  const [bulletColor, setBulletColor] = useState("#ff0000");
  const [commentary, setCommentary] = useState(false);
  const [speechPlay, setSpeechPlay] = useState(false);
  const [gameSound, setGameSound] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [soldierNames, setSoldierNames] = useState([
    "Assault Rifle",
    "Shotgun",
    "Machine Gun",
    "Sniper",
    "Medic",
  ]);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const moveSoldier = (index, direction) => {
    const updatedNames = [...soldierNames];
    const swapIndex = index + direction;

    if (swapIndex >= 0 && swapIndex < updatedNames.length) {
      const temp = updatedNames[index];
      updatedNames[index] = updatedNames[swapIndex];
      updatedNames[swapIndex] = temp;
      setSoldierNames(updatedNames);
    }
  };
  const handleBackToMenu = () => {
    navigate("/");
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        background: "linear-gradient(135deg, #1e88e5, #1565c0)",
        color: "#ffffff",
        padding: "20px",
      }}
    >
      {/* Back to Main Menu Button */}
      <Button
        variant="outlined"
        color="inherit"
        onClick={handleBackToMenu}
        sx={{
          position: "absolute",
          top: "20px",
          left: "20px",
          border: "2px solid #ffffff",
          color: "#ffffff",
          textTransform: "uppercase",
          fontWeight: "bold",
        }}
      >
        Back to Main Menu
      </Button>
      <Typography
        variant="h3"
        component="h1"
        sx={{
          fontWeight: "bold",
          marginBottom: "20px",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
        }}
      >
        Settings
      </Typography>

      {/* Soldier Customization */}
      <Typography variant="h5" sx={{ marginBottom: "10px" }}>
        Customize Soldier Names
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          marginBottom: "20px",
        }}
      >
        {soldierNames.map((name, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#ffffff",
              color: "#000",
              padding: "10px",
              borderRadius: "8px",
              width: "300px",
              justifyContent: "space-between",
            }}
          >
            <TextField
              variant="outlined"
              value={name}
              onChange={(e) => {
                const updatedNames = [...soldierNames];
                updatedNames[index] = e.target.value;
                setSoldierNames(updatedNames);
              }}
              sx={{ width: "70%" }}
            />
            <Box>
              <IconButton
                onClick={() => moveSoldier(index, -1)}
                disabled={index === 0}
                sx={{ color: index === 0 ? "rgba(0, 0, 0, 0.3)" : "#000" }}
              >
                <ArrowUpward />
              </IconButton>
              <IconButton
                onClick={() => moveSoldier(index, 1)}
                disabled={index === soldierNames.length - 1}
                sx={{
                  color:
                    index === soldierNames.length - 1
                      ? "rgba(0, 0, 0, 0.3)"
                      : "#000",
                }}
              >
                <ArrowDownward />
              </IconButton>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Volume Control */}
      <Typography variant="h5" sx={{ marginBottom: "10px" }}>
        Volume
      </Typography>
      <Slider
        value={volume}
        onChange={(e, value) => setVolume(value)}
        aria-label="Volume"
        valueLabelDisplay="auto"
        sx={{ width: "300px", marginBottom: "20px", color: "#ffffff" }}
      />

      {/* Bullet Color */}
      <Typography variant="h5" sx={{ marginBottom: "10px" }}>
        Bullet Color
      </Typography>
      <Select
        value={bulletColor}
        onChange={(e) => setBulletColor(e.target.value)}
        sx={{
          backgroundColor: "#ffffff",
          width: "300px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <MenuItem value="#ff0000">Red</MenuItem>
        <MenuItem value="#00ff00">Green</MenuItem>
        <MenuItem value="#0000ff">Blue</MenuItem>
      </Select>

      {/* Toggles */}
      <FormControlLabel
        control={
          <Switch
            checked={gameSound}
            onChange={(e) => setGameSound(e.target.checked)}
            color="primary"
          />
        }
        label="Enable Human Game Sound"
        sx={{ marginBottom: "20px", color: "#ffffff" }}
      />
      <FormControlLabel
        control={
          <Switch
            checked={commentary}
            onChange={(e) => setCommentary(e.target.checked)}
            color="primary"
          />
        }
        label="Enable AI Commentary"
        sx={{ marginBottom: "20px", color: "#ffffff" }}
      />
      <FormControlLabel
        control={
          <Switch
            checked={speechPlay}
            onChange={(e) => setSpeechPlay(e.target.checked)}
            color="primary"
          />
        }
        label="Enable Speech Play"
        sx={{ marginBottom: "20px", color: "#ffffff" }}
      />

      {/* Show Controls */}
      <Button variant="contained" color="secondary" onClick={handleOpenModal}>
        Show Controls
      </Button>

      {/* Modal for Controls */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#ffffff",
            color: "#000000",
            padding: "20px",
            borderRadius: "10px",
            width: "400px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.25)",
            textAlign: "center",
          }}
        >
          <IconButton
            onClick={handleCloseModal}
            sx={{ position: "absolute", top: "10px", right: "10px" }}
          >
            <Close />
          </IconButton>
          <Typography variant="h5" sx={{ marginBottom: "20px" }}>
            Controls
          </Typography>
          <Typography variant="body1">
            Use Mouse to Click and Navigate
          </Typography>
        </Box>
      </Modal>
    </Box>
  );
};

export default Settings;
