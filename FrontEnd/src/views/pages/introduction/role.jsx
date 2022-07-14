import * as React from "react";
import Box from "@mui/material/Box";
import CardMedia from "@mui/material/CardMedia";

export default function RoleIntroduction({ path, width }) {
  return (
    <Box
      minHeight="100%"
      minWidth="100%"
      sx={{
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        pt: 4,
        pb: 4,
        pl: 4,
        pr: 4,
        flexDirection: "column",
        display: "flex",
        backgroundColor: "0xffffff",
      }}
    >
      <Box sx={{ width: { width } }}>
        <CardMedia component="img" image={path} fullwidth={true} />
      </Box>
    </Box>
  );
}
