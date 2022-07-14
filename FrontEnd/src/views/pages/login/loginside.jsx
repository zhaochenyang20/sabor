import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import LoginInterface from "./logincolumn";
import CardMedia from "@mui/material/CardMedia";

export default function LoginSide() {
  return (
    <Grid
      container
      component="main"
      sx={{ backgroundColor: "#ffffff", height: "100vh" }}
    >
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={8}
        sx={{ mt: 20, mb: 20 }}
        align="center"
      >
        <Paper sx={{ width: 800 }}>
          <CardMedia
            component="img"
            image="/static/login.svg"
            fullwidth={true}
          />
        </Paper>
      </Grid>
      <Grid item xs={12} sm={8} md={4} component={Paper} elevation={6} square>
        <LoginInterface />
      </Grid>
    </Grid>
  );
}
