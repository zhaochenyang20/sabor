import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function DevelopDialog({
  developDialogOpen,
  setDevelopDialogOpen,
  functionIds,
  iterationIds,
}) {
  const handleClose = () => {
    setDevelopDialogOpen(false);
  };

  return (
    <Dialog
      open={developDialogOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle>删除失败</DialogTitle>
      <DialogContent>
        <DialogContentText>
          当前开发工程师仍负责{iterationIds.length}个迭代与
          {functionIds.length}
          个需求。请联系系统工程师删除迭代/需求或者更换迭代/需求负责人员。
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} autoFocus>
          确认
        </Button>
      </DialogActions>
    </Dialog>
  );
}
