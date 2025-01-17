import React, { useState, useEffect } from "react";
import { Alert, Snackbar, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function AlertComponent({ message, severity = "info", onClose }) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(false);
      if (onClose) onClose();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = (_, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
    if (onClose) onClose();
  };

  return (
    <Snackbar
      open={open}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        severity={severity}
        onClose={handleClose}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={handleClose}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
      >
        {message}
      </Alert>
    </Snackbar>
  );
}

export default AlertComponent;
