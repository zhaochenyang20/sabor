import * as React from "react";
import Paper from "@mui/material/Paper";
import DemandsList from "./demandsList";

export default function Demands() {
  return (
    <Paper
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <DemandsList />
    </Paper>
  );
}
