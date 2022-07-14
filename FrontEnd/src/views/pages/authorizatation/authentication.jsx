import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";

export default function Authentication() {
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
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap></Typography>
        </Toolbar>
      </AppBar>
      <Box
        minHeight="100%"
        minWidth="100%"
        sx={{
          pt: 4,
          pb: 4,
          pl: 4,
          pr: 4,
          flexDirection: "column",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          alignContent: "center",
        }}
      >
        <Card variant="outlined" sx={{ width: 500 }}>
          <CardMedia
            component="img"
            image="/static/authentication.svg"
            fullwidth={true}
          />
        </Card>
      </Box>
      <LinearProgress sx={{ width: 500 }} />
    </Box>
  );
}
