import * as React from "react";
import Box from "@mui/material/Box";
import { Outlet } from "react-router-dom";

export default function QA() {
  return (
    <Box
      component="main"
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === "light"
            ? theme.palette.grey[100]
            : theme.palette.grey[900],
        flexGrow: 1,
        overflow: "auto",
        zIndex: "tooltip",
      }}
    >
      <Outlet />
    </Box>
  );
}
