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
  Stack,
  Grid,
  Grid2,
} from "@mui/material";
import {
  ArrowUpward,
  ArrowDownward,
  Close,
  VolumeUp,
  VolumeDown,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Settings = ({ gameSettings, setGameSettings }) => {
  const navigate = useNavigate();
  const [volume, setVolume] = useState(0.5);
  const [bulletColor, setBulletColor] = useState("#ff0000");
  const [language, setLanguage] = useState("English");
  const [commentary, setCommentary] = useState(true);
  const [speechPlay, setSpeechPlay] = useState(false);
  const [gameSound, setGameSound] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [pollyCommentary, setPollyCommentary] = useState(false);
  const [
    showAlertNoPollyCommentaryServer,
    setShowAlertNoPollyCommentaryServer,
  ] = useState(false);
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
    setGameSettings((prevSettings) => ({
      ...prevSettings,
      commentaryFlag: commentary,
      volume: volume,
      pollyCommentary: pollyCommentary,
    }));
    navigate("/");
  };

  const handleCloseSetPollyCommentary = () =>
    setShowAlertNoPollyCommentaryServer(false);

  const handleSetPollyCommentary = (e) => {
    fetch("http://127.0.0.1:8000/docs", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        setPollyCommentary(e.target.checked);
      })
      .catch((error) => {
        console.error("Error:", error);
        setShowAlertNoPollyCommentaryServer(true);
      });
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
        background: "linear-gradient(135deg, #26355D, #AF47D2)",
        color: "#ffffff",
        padding: "20px",
      }}
    >
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
          background: "linear-gradient(135deg, #26355D, #AF47D2)",
        }}
      >
        Back to Main Menu
      </Button>
      <Typography
        variant="h3"
        component="h1"
        sx={{
          fontWeight: "bold",
          marginBottom: "2%",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
        }}
      >
        Settings
      </Typography>
      <Grid2 container spacing={4} sx={12}>
        {/* Left Column */}
        <Grid2 item xs={12} md={6}>
          {/* Soldier Customization */}
          <Typography variant="h5" sx={{ marginBottom: "10px" }}>
            Customize Soldier Names
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
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
        </Grid2>

        {/* Right Column */}
        <Grid2
          item
          xs={12}
          md={6}
          alignItems={"start"}
          marginLeft={10}
          alignContent={"flex-start"}
          display={"flex"}
          flexDirection={"column"}
        >
          {/* Volume Control */}
          <Stack
            spacing={2}
            direction="row"
            sx={{ alignItems: "start", mb: 3 }}
          >
            <VolumeDown />
            <Slider
              value={volume}
              onChange={(e, value) => setVolume(value)}
              aria-label="Volume"
              valueLabelDisplay="auto"
              min="0"
              max="1"
              step="0.1"
              sx={{ width: "300px", color: "#ffffff" }}
            />
            <VolumeUp />
          </Stack>

          {/* Bullet Color */}
          <Box marginTop={1} alignContent={"start"}>
            <Typography variant="h5" sx={{ marginBottom: "5px" }}>
              Bullet Color
            </Typography>
            <Select
              value={bulletColor}
              onChange={(e) => setBulletColor(e.target.value)}
              sx={{
                backgroundColor: "#ffffff",
                width: "150px",
                borderRadius: "8px",
                marginBottom: "10px",
              }}
            >
              <MenuItem value="#ff0000">Red</MenuItem>
              <MenuItem value="#00ff00">Green</MenuItem>
              <MenuItem value="#0000ff">Blue</MenuItem>
            </Select>
          </Box>

          {/* Language Selection */}
          <Box marginTop={1} alignContent={"start"}>
            <Typography variant="h5" sx={{ marginBottom: "5px" }}>
              Language
            </Typography>
            <Select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              sx={{
                backgroundColor: "#ffffff",
                width: "150px",
                borderRadius: "8px",
                marginBottom: "10px",
              }}
            >
              <MenuItem value="English">🇺🇸 English</MenuItem>
              <MenuItem value="Spanish">🇪🇸 Spanish</MenuItem>
              <MenuItem value="French">🇫🇷 French</MenuItem>
              <MenuItem value="German">🇩🇪 German</MenuItem>
            </Select>
          </Box>

          {/* Toggles */}
          <Box
            marginTop={3}
            alignContent={"left"}
            display={"flex"}
            flexDirection={"column"}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={gameSound}
                  onChange={(e) => setGameSound(e.target.checked)}
                  color="primary"
                  disabled="true"
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
                  checked={pollyCommentary}
                  onChange={(e) => {
                    handleSetPollyCommentary(e);
                  }}
                  color="primary"
                />
              }
              label="Enable AWS Polly Commentary"
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
          </Box>
        </Grid2>
      </Grid2>
      {/* Show Controls */}
      <Button
        variant="contained"
        color="secondary"
        onClick={handleOpenModal}
        sx={{ marginTop: "20px" }}
      >
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
      <Modal
        open={showAlertNoPollyCommentaryServer}
        onClose={handleCloseSetPollyCommentary}
      >
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
            onClick={handleCloseSetPollyCommentary}
            sx={{ position: "absolute", top: "10px", right: "10px" }}
          >
            <Close />
          </IconButton>
          <Typography variant="h5" sx={{ marginBottom: "20px" }}>
            FastAPI server is not running!
          </Typography>
          <Typography variant="h6">
            Note: Follow the instructions in{" "}
            <a
              href="https://github.com/Santhoshkumard11/aws_polly"
              target="_blank"
              rel="noopener noreferrer"
            >
              this
            </a>{" "}
            repo to run the server
          </Typography>
          <Typography variant="body1">
            Please start the server and try again. It should run on port 8000.
          </Typography>
        </Box>
      </Modal>
    </Box>
  );
};

export default Settings;
