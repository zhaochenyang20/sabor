import * as React from "react";
import Button from "@mui/material/Button";
import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Selection from "./selection";

export default function BindSR({
  dialogOpen,
  handleSuccess,
  handleCancel,
  data,
  title,
}) {
  const [originalId, setOriginalId] = useState(0);
  const [functionalId, setFunctionalId] = useState(0);

  let functionalList = data.find((ele) => ele.id === originalId);
  if (!functionalList) functionalList = [];
  else functionalList = functionalList.functionalRequirements;

  return (
    <Dialog open={dialogOpen} minWidth={480}>
      <DialogTitle> {title} </DialogTitle>
      <DialogContent Content>
        <Selection
          originRequireList={data.map((ele) => {
            return {
              name: ele.name,
              id: ele.id,
            };
          })}
          id={originalId}
          setId={setOriginalId}
          required
          description={"请选择原始需求"}
        />
        <Selection
          originRequireList={functionalList}
          id={functionalId}
          setId={setFunctionalId}
          description={"请选择功能需求"}
          required
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setOriginalId(0);
            setFunctionalId(0);
            handleCancel();
          }}
        >
          {" "}
          取消{" "}
        </Button>
        <Button
          onClick={() => {
            handleSuccess(originalId, functionalId);
            setOriginalId(0);
            setFunctionalId(0);
          }}
          disabled={!originalId || !functionalId}
        >
          {" "}
          确定{" "}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
