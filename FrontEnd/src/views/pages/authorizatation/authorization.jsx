import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";
import cookie from "react-cookies";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";

export default function Authorization() {
  let navigate = useNavigate();
  function handleLogin() {
    cookie.save("username", "", { path: "/" });
    cookie.save("token", "", { path: "/" });
    cookie.remove("username");
    cookie.remove("token");
    navigate("/");
  }
  function handleRegister() {
    navigate("/register");
  }
  return (
    <Box>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap></Typography>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          pt: 8,
          pb: 6,
        }}
      >
        <Container maxWidth="sm">
          <Box
            minHeight="100%"
            minWidth="100%"
            sx={{
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
                image="/static/authorization.svg"
                fullwidth={true}
              />
            </Card>
          </Box>
          <Stack
            sx={{ pt: 4 }}
            direction="row"
            spacing={2}
            justifyContent="center"
          >
            <Button variant="contained" onClick={handleLogin}>
              已有账号，现在登录
            </Button>
            <Button variant="outlined" onClick={handleRegister}>
              没有账号，现在注册
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
