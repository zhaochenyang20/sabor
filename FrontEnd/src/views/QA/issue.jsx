import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import cookie from "react-cookies";
import { useState, useEffect } from "react";
// import AssignmentIcon from "@mui/icons-material/Assignment";
import IssueData from "./data/issueData";

// function preventDefault(event) {
// event.preventDefault();
// }

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="">
        Scissor Seven
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function Issue() {
  const [username, setUsername] = useState("");
  function getUserInfo() {
    setUsername(cookie.load("username"));
    return {
      username: cookie.load("username"),
    };
  }

  useEffect(() => {
    getUserInfo();
  });

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          overflow: "auto",
        }}
      >
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={4} alignItems="flex-start">
            {/* Chart */}
            <Grid item xs={12} md={8} lg={9}>
              <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                {/* <Router> */}
                <IssueData />
                {/* </Router> */}
              </Paper>
            </Grid>
            <Grid item xs={12} md={4} lg={3}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <React.Fragment>
                  <Box>
                    <Typography
                      component="h2"
                      variant="h6"
                      color="primary"
                      gutterBottom
                    >
                      质量保证工程师
                    </Typography>
                  </Box>
                  <Typography component="h2" variant="h4">
                    {username}
                  </Typography>
                </React.Fragment>
              </Paper>
            </Grid>
          </Grid>
          <Copyright sx={{ pt: 4 }} />
        </Container>
      </Box>
    </Box>
  );
}
