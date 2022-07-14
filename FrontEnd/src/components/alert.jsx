import * as React from "react";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

export default function AlertDialog({ toastOpen, handleAlertClose, info }) {
  return (
    <Snackbar
      open={toastOpen}
      autoHideDuration={2000}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      onClose={handleAlertClose}
    >
      <Alert
        onClose={handleAlertClose}
        severity="success"
        sx={{ width: "100%" }}
      >
        {info}
      </Alert>
    </Snackbar>
  );
}
