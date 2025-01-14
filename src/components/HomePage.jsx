import React, { useState } from "react";
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
import { countryList } from "../constants/game";

const HomePage = ({ gameSettings, setGameSettings }) => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(true); // Modal open state
  const [playerInfo, setPlayerInfo] = useState({
    name: "",
    country: "",
    gender: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlayerInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleCountryChange = (event, value) => {
    setPlayerInfo((prev) => ({ ...prev, country: value }));
  };

  const handleModalSubmit = () => {
    if (!playerInfo.name || !playerInfo.country || !playerInfo.gender) {
      alert("Please fill in all fields.");
      return;
    }
    setOpenModal(false);
  };

  const countryOptions = countryList.map((country) => ({
    label: country.country,
    code: country.code,
    flag: `https://flagcdn.com/w40/${country.code}.png`,
  }));

  const handleAgainstPlayer2 = () => {
    setGameSettings({ ...gameSettings, opponentType: "Player 2", playerInfo });
    navigate("/location");
  };

  const handleAgainstCPU = () => {
    setGameSettings({ ...gameSettings, opponentType: "CPU", playerInfo });
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
              onChange={handleInputChange}
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
              onChange={handleCountryChange}
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
              onChange={handleInputChange}
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
              onClick={handleModalSubmit}
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
              fontSize: "20px",
              fontWeight: 500,
              color: "#26355D",
              marginBottom: "30px",
            }}
          >
            Welcome, {playerInfo.name} from {playerInfo.country.label}{" "}
            <img
              loading="lazy"
              width="20"
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
              maxWidth: "350px",
            }}
          >
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#08D9D6",
                "&:hover": { backgroundColor: "#06B6B3" },
              }}
              onClick={handleAgainstCPU}
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
            >
              Play vs Human
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderColor: "#AF47D2",
                color: "#AF47D2",
                "&:hover": { borderColor: "#9436B8", color: "#9436B8" },
              }}
              onClick={() => navigate("/settings")}
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
              onClick={() => navigate("/help")}
            >
              Help
            </Button>
          </Box>
        </Box>
      )}
    </>
  );
};

export default HomePage;
