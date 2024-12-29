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

const locations = [
  { name: "Japan", image: "img/japan.jpg" },
  {
    name: "New York",
    image: "img/new_york.jpg",
  },
  { name: "Seattle", image: "img/seattle.jpg" },
];

const ChooseLocation = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % locations.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + locations.length) % locations.length
    );
  };

  const handleSelection = (location) => {
    setSelectedLocation(location.name);
  };

  const handleContinue = () => {
    if (selectedLocation) {
      navigate("/game", { state: { location: selectedLocation } });
    } else {
      alert("Please select a location to continue.");
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
        Choose Your Battle Location
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
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            color: "#ffffff",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.2)",
            },
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
              backgroundColor: "#000000a0",
              color: "#ffffff",
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
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            color: "#ffffff",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.2)",
            },
          }}
        >
          <ArrowForwardIos />
        </IconButton>
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={handleContinue}
        sx={{
          padding: "12px 20px",
          fontSize: "18px",
          textTransform: "uppercase",
          fontWeight: "bold",
          borderRadius: "30px",
        }}
      >
        Continue
      </Button>
    </Box>
  );
};

export default ChooseLocation;
