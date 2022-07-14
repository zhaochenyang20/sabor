import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

export default function SuccessAlert({
  successToastOpen,
  handleSuccessAlertClose,
  info,
}) {
  if (info === undefined || info === null || info === "" || info === []) {
    info = "修改成功！";
  } else {
    info = info.toString();
  }
  return (
    <Dialog
      open={successToastOpen}
      onClose={handleSuccessAlertClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"通知"}</DialogTitle>
      <DialogContent sx={{ minWidth: 300 }}>
        <DialogContentText id="alert-dialog-description">
          {info}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSuccessAlertClose}>确定</Button>
      </DialogActions>
    </Dialog>
  );
}
