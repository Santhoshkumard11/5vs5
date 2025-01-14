import React, { useState } from "react";
import { Box, Button, Typography, Paper, Stack } from "@mui/material";
import { handleVoiceCommands } from "../utils/gameLogic";

const SpeechRecognitionComponent = ({ handleAction, gameState }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState(null);

  // Initialize SpeechRecognition
  const initializeRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition.");
      return null;
    }

    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = "en-US";

    recognitionInstance.onresult = (event) => {
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          console.log("Final transcript:", transcriptPart);
          setTranscript(transcriptPart);
          if (transcriptPart.length > 15 && transcriptPart.includes("attack")) {
            handleVoiceCommands(transcriptPart, handleAction, gameState);
          } else {
            console.log("Not a valid command");
          }
        } else {
          interimTranscript += transcriptPart;
        }
      }
    };

    recognitionInstance.onerror = (event) => {
      console.error("Speech recognition error detected:", event.error);
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
    };

    setRecognition(recognitionInstance);
    return recognitionInstance;
  };

  const startListening = () => {
    if (!recognition) {
      const recognitionInstance = initializeRecognition();
      if (!recognitionInstance) {
        return; // Exit if initialization failed
      }
      setRecognition(recognitionInstance);
      recognitionInstance.start(); // Start the recognition immediately
    } else {
      try {
        recognition.start(); // Start recognition if already initialized
      } catch {
        console.log("Can't start the recognition...");
      }
    }
    setIsListening(true);
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
    setIsListening(false);
  };

  const clearTranscript = () => {
    setTranscript("");
  };

  return (
    <Box
      sx={{
        padding: 1,
        maxWidth: 300,
        maxHeight: 177,
        marginTop: 2,
        textAlign: "center",
        background: "rgba(255, 255, 255, 0.9)",
        borderRadius: 4,
      }}
    >
      <Typography variant="h6" sx={{ marginBottom: 1 }}>
        Voice Mode
      </Typography>
      <Stack
        direction="row"
        spacing={1}
        justifyContent="center"
        sx={{ marginBottom: 1 }}
      >
        <Button
          variant="contained"
          color="success"
          onClick={startListening}
          disabled={isListening}
          size="small"
        >
          Start
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={stopListening}
          disabled={!isListening}
          size="small"
        >
          Stop
        </Button>
        <Button variant="outlined" onClick={clearTranscript} size="small">
          Clear
        </Button>
      </Stack>
      <Paper
        variant="outlined"
        sx={{
          padding: 1.5,
          minHeight: 60,
          backgroundColor: "#f9f9f9",
          textAlign: "left",
          maxWidth: 250,
        }}
      >
        <Typography variant="subtitle1" sx={{ marginBottom: 0.5 }}>
          Transcript:
        </Typography>
        <Typography
          variant="body2"
          sx={{ whiteSpace: "pre-wrap", fontSize: "0.875rem" }}
        >
          {transcript || "Start speaking to see the transcript here..."}
        </Typography>
      </Paper>
    </Box>
  );
};

export default SpeechRecognitionComponent;
