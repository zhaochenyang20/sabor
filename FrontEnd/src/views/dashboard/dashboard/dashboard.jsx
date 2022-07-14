import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import Projects from "../projects/projects";
import cookie from "react-cookies";
import { useState, useEffect } from "react";
import { loginUser } from "../../pages/login/login";

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

function Dashboard(props) {
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
      <Container maxWidth="lg" sx={{}}>
        <Grid container spacing={4} alignItems="flex-start">
          <Grid item xs={12} md={8} lg={9}>
            <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
              <Projects props={props} />
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
                    个人信息
                  </Typography>
                </Box>
                <Typography component="h2" variant="h4">
                  {username}
                </Typography>
                <Typography color="text.secondary" sx={{ flex: 1 }}>
                  需求管理跟踪系统
                </Typography>
              </React.Fragment>
            </Paper>
          </Grid>
        </Grid>
        <Copyright sx={{ pt: 4 }} />
      </Container>
    </Box>
  );
}

export default function DashboardInterface() {
  if (loginUser()) {
    return <Dashboard />;
  } else {
    window.location.href = "/";
  }
}
