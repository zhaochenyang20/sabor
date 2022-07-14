import * as React from "react";
import Box from "@mui/material/Box";
import CardMedia from "@mui/material/CardMedia";

export default function Empty({ width }) {
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
      <Box sx={{ width: { width } }}>
        <CardMedia component="img" image="/static/empty.svg" fullwidth={true} />
      </Box>
    </Box>
  );
}
