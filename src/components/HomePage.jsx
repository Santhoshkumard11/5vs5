import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogContent,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import FightingGameBackground from "./GameBackground";
import {
  buttonClickSound,
  buttonHoverSound,
  countryList,
} from "../constants/game";
import { playAudio } from "../utils/gameLogic";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const HomePage = ({ gameSettings, setGameSettings }) => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false); // Modal open state
  const [newPlayer, setNewPlayer] = useState(false); // Modal open state
  const [playerInfo, setPlayerInfo] = useState({
    name: "",
    country: "",
    gender: "",
    id: "",
  });

  const client = new DynamoDBClient({
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    },
  });

  async function registerNewUser(id) {
    const params = {
      TableName: "players",
      Item: {
        id: { S: id },
        country: { S: playerInfo.country.label },
        Gender: { S: playerInfo.gender },
        Name: { S: playerInfo.name },
        timestamp: { S: new Date().toISOString() },
      },
    };

    try {
      const data = await client.send(new PutItemCommand(params));
      console.log("result : " + JSON.stringify(data));
    } catch (error) {
      console.error("Error:", error);
    }
  }

  // Check local storage on mount
  useEffect(() => {
    const storedPlayerInfo = JSON.parse(localStorage.getItem("playerInfo"));
    if (storedPlayerInfo) {
      setPlayerInfo(storedPlayerInfo);
    } else {
      setOpenModal(true); // Open modal if no player info is found
      setNewPlayer(true);
    }
  }, []);

  const handleInputChange = (field, value) => {
    setPlayerInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Save player info to local storage and close modal
  const handleSavePlayerInfo = () => {
    const newUserId = Date.now().toString();
    const newPlayerInfo = {
      ...playerInfo,
      id: newUserId,
    };
    localStorage.setItem("playerInfo", JSON.stringify(newPlayerInfo));
    setOpenModal(false);
    setGameSettings((prevSettings) => ({
      ...prevSettings,
      playerInfo: newPlayerInfo,
    }));
    registerNewUser(newUserId);
  };

  const countryOptions = countryList.map((country) => ({
    label: country.country,
    code: country.code,
    flag: `https://flagcdn.com/w40/${country.code}.png`,
  }));

  const handleAgainstPlayer2 = () => {
    setGameSettings({ ...gameSettings, opponentType: "Player 2", playerInfo });
    playAudio(buttonClickSound);
    navigate("/location");
  };

  const handleAgainstCPU = () => {
    setGameSettings({ ...gameSettings, opponentType: "CPU", playerInfo });
    playAudio(buttonClickSound);
    navigate("/location");
  };

  return (
    <>
      {/* Player Input Modal */}
      <Dialog
        open={openModal}
        onClose={() => {}}
        disableBackdropClick
        disableEscapeKeyDown
      >
        <DialogContent>
          <Typography
            variant="h5"
            sx={{ mb: 3, fontWeight: "bold", textAlign: "center" }}
          >
            Player Details
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: "100%",
            }}
          >
            <TextField
              name="name"
              label="Name"
              value={playerInfo.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              fullWidth
            />
            <Autocomplete
              options={countryOptions} // Array of country objects
              getOptionLabel={(option) => option.label || ""} // Ensure a string is always returned
              renderOption={(props, option) => (
                <Box
                  component="li"
                  {...props}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <img
                    loading="lazy"
                    width="20"
                    src={option.flag} // Ensure the `flag` URL is valid
                    alt=""
                  />
                  {option.label}
                </Box>
              )}
              renderInput={(params) => (
                <TextField {...params} label="Country" />
              )}
              value={playerInfo.country.label}
              onChange={(event, newValue) =>
                handleInputChange("country", newValue)
              }
              isOptionEqualToValue={(option, value) =>
                option.label === value.label
              } // Ensure comparison is based on label
              noOptionsText="No countries found"
            />
            <Typography variant="h6" sx={{ mt: 1 }}>
              Gender
            </Typography>
            <RadioGroup
              name="gender"
              value={playerInfo.gender}
              onChange={(e) => handleInputChange("gender", e.target.value)}
              row
            >
              <FormControlLabel value="Male" control={<Radio />} label="Male" />
              <FormControlLabel
                value="Female"
                control={<Radio />}
                label="Female"
              />
              <FormControlLabel
                value="Other"
                control={<Radio />}
                label="Other"
              />
            </RadioGroup>
            <Button
              variant="contained"
              onClick={handleSavePlayerInfo}
              sx={{
                mt: 3,
                backgroundColor: "#08D9D6",
                "&:hover": { backgroundColor: "#06B6B3" },
              }}
            >
              Submit
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Home Page Content */}
      {!openModal && (
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
              color: "#000000",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
            }}
          >
            Dishum Dishum - 3 Vs 3
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              fontSize: "25px",
              fontWeight: 500,
              color: "#26355D",
              marginBottom: "30px",
            }}
          >
            Welcome{!newPlayer && " back"}, {playerInfo.name} from{" "}
            {playerInfo.country.label}{" "}
            <img
              loading="lazy"
              width="30"
              src={playerInfo.country.flag}
              alt={playerInfo.country.label}
            />
            !
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              width: "100%",
              maxWidth: "250px",
            }}
          >
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#08D9D6",
                "&:hover": { backgroundColor: "#06B6B3" },
              }}
              onClick={handleAgainstCPU}
              onMouseEnter={() => playAudio(buttonHoverSound)}
            >
              Play vs CPU
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#FF2E63",
                "&:hover": { backgroundColor: "#D92655" },
              }}
              onClick={handleAgainstPlayer2}
              onMouseEnter={() => playAudio(buttonHoverSound)}
            >
              Play vs Human
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#FF2E63",
                "&:hover": { backgroundColor: "#D92655" },
              }}
              disabled={true}
            >
              Play Online
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#FF2E63",
                "&:hover": { backgroundColor: "#D92655" },
              }}
              onMouseEnter={() => playAudio(buttonHoverSound)}
              disabled={true}
            >
              Leaderboard (oneline)
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderColor: "#AF47D2",
                color: "#AF47D2",
                "&:hover": { borderColor: "#9436B8", color: "#9436B8" },
              }}
              onClick={() => {
                playAudio(buttonClickSound);
                navigate("/settings");
              }}
              onMouseEnter={() => playAudio(buttonHoverSound)}
            >
              Settings
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderColor: "#FF8F00",
                color: "#FF8F00",
                "&:hover": { borderColor: "#E07C00", color: "#E07C00" },
              }}
              onClick={() => {
                playAudio(buttonClickSound);
                navigate("/help");
              }}
              onMouseEnter={() => playAudio(buttonHoverSound)}
            >
              Help
            </Button>
          </Box>
          <Typography variant="h6">With 💖 by Sandy Inspires</Typography>
          <Typography variant="body1">
            <a
              href="https://www.linkedin.com/in/santhosh-kumard/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Connect on LinkedIn
            </a>
          </Typography>
        </Box>
      )}
    </>
  );
};

export default HomePage;
