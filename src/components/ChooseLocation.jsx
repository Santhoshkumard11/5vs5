import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Card,
  CardMedia,
  IconButton,
} from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { playAudio } from "../utils/gameLogic";
import {
  buttonClickBack,
  buttonClickSound,
  buttonHoverSound,
  locationMoveSound,
} from "../constants/game";

const locations = [
  { name: "Japan", image: "img/japan.jpg" },
  {
    name: "New York",
    image: "img/new_york.jpg",
  },
  { name: "Seattle", image: "img/seattle.jpg" },
];

const ChooseLocation = ({ setGameSettings }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleNext = () => {
    playAudio(locationMoveSound);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % locations.length);
  };

  const handlePrev = () => {
    playAudio(locationMoveSound);
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + locations.length) % locations.length
    );
  };

  const handleSelection = (location) => {
    setSelectedLocation(location.name);
  };

  const handleContinue = () => {
    if (selectedLocation) {
      setGameSettings((prevSettings) => ({
        ...prevSettings,
        locationImagePath:
          "./img/" + selectedLocation.replace(" ", "_") + ".jpg",
        locationName: selectedLocation,
      }));

      navigate("/team");
      playAudio(buttonClickSound);
    } else {
      alert("Please select a location to continue.");
    }
  };

  const handleBackToMenu = () => {
    playAudio(buttonClickBack);
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
        background: "linear-gradient(135deg, #08D9D6, #FFFFFF)",
        color: "#000000",
        padding: "20px",
      }}
    >
      {/* Back to Main Menu Button */}
      <Button
        variant="contained"
        color="inherit"
        onClick={handleBackToMenu}
        sx={{
          position: "absolute",
          top: "20px",
          left: "20px",
          border: "2px solid #FF8F00",
          borderRadius: "10px",
          padding: "10px 20px",
          fontSize: "16px",
          color: "#000000",
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
          marginBottom: "10px",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
        }}
      >
        Choose Your Battle Location
      </Typography>
      <Typography component="h6" variant="h6" marginBottom={4}>
        (click on the picture to select)
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          width: "80%",
          maxWidth: "800px",
          marginBottom: "20px",
        }}
      >
        <IconButton
          onClick={handlePrev}
          sx={{
            position: "absolute",
            left: "-50px",
            zIndex: 10,
            backgroundColor: "#26355D",
            color: "#ffffff",
            "&:hover": {
              backgroundColor: "#EAEAEA",
            },
            margin: "-5%",
          }}
        >
          <ArrowBackIos />
        </IconButton>

        <Card
          sx={{
            boxShadow:
              selectedLocation === locations[currentIndex].name
                ? "0 0 20px 4px #ff9800"
                : "none",
            border:
              selectedLocation === locations[currentIndex].name
                ? "2px solid #ff9800"
                : "none",
            width: "100%",
            transition: "transform 0.3s ease-in-out",
            transform: `scale(${
              selectedLocation === locations[currentIndex].name ? 1.05 : 1
            })`,
          }}
        >
          <CardMedia
            component="img"
            image={locations[currentIndex].image}
            alt={locations[currentIndex].name}
            sx={{ height: "400px", objectFit: "cover" }}
            onClick={() => handleSelection(locations[currentIndex])}
          />
          <Typography
            variant="h6"
            sx={{
              padding: "10px",
              backgroundColor: "#EAEAEA",
              color: "#000000",
            }}
          >
            {locations[currentIndex].name}
          </Typography>
        </Card>

        <IconButton
          onClick={handleNext}
          sx={{
            position: "absolute",
            right: "-50px",
            zIndex: 10,
            backgroundColor: "#26355D",
            color: "#ffffff",
            "&:hover": {
              backgroundColor: "#EAEAEA",
            },
            margin: "-5%",
          }}
        >
          <ArrowForwardIos />
        </IconButton>
      </Box>

      <Button
        variant="contained"
        onClick={handleContinue}
        onMouseEnter={() => {
          playAudio(buttonHoverSound);
        }}
        sx={{
          padding: "12px 20px",
          fontSize: "18px",
          marginTop: "20px",
          fontWeight: "bold",
          borderRadius: "10px",
          color: "#ffffff",
          backgroundColor: "#26355D",
          "&:hover": {
            backgroundColor: "#EAEAEA",
          },
        }}
      >
        Continue
      </Button>
    </Box>
  );
};

export default ChooseLocation;
