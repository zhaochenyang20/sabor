import * as React from "react";
import Box from "@mui/material/Box";
import CardMedia from "@mui/material/CardMedia";
import LinearProgress from "@mui/material/LinearProgress";

export default function Loading() {
  return (
    <Box
      sx={{
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        flexDirection: "column",
        display: "flex",
      }}
    >
      <Box sx={{ pt: 6, pb: 6, width: 500 }}>
        <CardMedia
          component="img"
          image="/static/loading.svg"
          fullwidth={true}
        />
      </Box>
      <LinearProgress sx={{ width: 500 }} />
    </Box>
  );
}
