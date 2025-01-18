import React from "react";
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Help = () => {
  const navigate = useNavigate();
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
        background: "linear-gradient(135deg, #26355D, #AF47D2)",
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
          marginBottom: "30px",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
        }}
      >
        Help & Instructions
      </Typography>

      {/* Game Rules Section */}
      <Typography
        variant="h5"
        sx={{
          marginBottom: "20px",
          fontWeight: "bold",
          textDecoration: "underline",
        }}
      >
        Game Rules
      </Typography>
      <List sx={{ maxWidth: "600px", marginBottom: "30px" }}>
        <ListItem>
          <ListItemText primary="1. The goal is to eliminate the enemy team or disarm them to render them harmless." />
        </ListItem>
        <ListItem>
          <ListItemText primary="2. Each team consists of five soldiers: Assault Rifle, Shotgun, Machine Gun, Sniper, and Medic." />
        </ListItem>
        <ListItem>
          <ListItemText primary="3. Soldiers have unique abilities and accuracy levels. Use them strategically." />
        </ListItem>
        <ListItem>
          <ListItemText primary="4. Each soldier's HP is displayed. When it reaches zero, they are eliminated." />
        </ListItem>
        <ListItem>
          <ListItemText primary="5. Answer AWS-related questions during gameplay to deal bonus damage (200%)." />
        </ListItem>
      </List>

      {/* How to Play Section */}
      <Typography
        variant="h5"
        sx={{
          marginBottom: "20px",
          fontWeight: "bold",
          textDecoration: "underline",
        }}
      >
        How to Play
      </Typography>
      <List sx={{ maxWidth: "600px", marginBottom: "30px" }}>
        <ListItem>
          <ListItemText primary="1. Start the game by selecting CPU or Human mode." />
        </ListItem>
        <ListItem>
          <ListItemText primary="2. Choose a battlefield location (e.g., Japan, New York, Alaska)." />
        </ListItem>
        <ListItem>
          <ListItemText primary="3. Use arrow keys or mouse to navigate and select your actions." />
        </ListItem>
        <ListItem>
          <ListItemText primary="4. On your turn, select a soldier, view their stats, and choose an enemy to attack." />
        </ListItem>
        <ListItem>
          <ListItemText primary="5. Strategically use soldiers to deal maximum damage or answer bonus questions for higher damage." />
        </ListItem>
        <ListItem>
          <ListItemText primary="6. Continue until one team is fully eliminated or disarmed." />
        </ListItem>
      </List>
    </Box>
  );
};

export default Help;
