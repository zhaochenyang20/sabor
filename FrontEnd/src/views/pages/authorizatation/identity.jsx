import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useNavigate, useParams } from "react-router-dom";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";

export default function Identity() {
  let navigate = useNavigate();
  let { projectIndex, role } = useParams();
  let realRole = "";
  if (role === "system") realRole = "系统工程师";
  else if (role === "QA") realRole = "质量保证工程师";
  else if (role === "develop") realRole = "开发工程师";
  else if (role === "admin") realRole = "管理员";
  function handleConfirm() {
    window.location.href = "/login";
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
          <Typography variant="h4" sx={{ p: 2 }} align="center">
            您不是该项目的{realRole}
          </Typography>
          <Stack
            sx={{ p: 2 }}
            direction="row"
            spacing={2}
            justifyContent="center"
          >
            <Button variant="contained" onClick={handleConfirm}>
              返回
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
