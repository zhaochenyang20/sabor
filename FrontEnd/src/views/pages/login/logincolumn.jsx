import * as React from "react";
import Button from "@mui/material/Button";
// import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CryptoJs from "crypto-js";
import { Post } from "../../../utils/communication";
import { Dialog } from "@mui/material";
import { useState } from "react";
import {
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import cookie from "react-cookies";
import { useNavigate } from "react-router-dom";
import CardMedia from "@mui/material/CardMedia";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

function Copyright(props) {
  return (
    <Typography variant="body2" color="#ffebee" align="center" {...props}>
      {"Copyright © "}
      <Link color="inherit" href="">
        Scissor Seven
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const BootstrapButton = styled(Button)({
  boxShadow: "none",
  textTransform: "none",
  fontSize: 16,
  padding: "6px 12px",
  border: "1px solid",
  lineHeight: 1.5,
  backgroundColor: "#00ab55",
  borderColor: "#00ab55",
  fontFamily: [
    "-apple-system",
    "BlinkMacSystemFont",
    '"Segoe UI"',
    "Roboto",
    '"Helvetica Neue"',
    "Arial",
    "sans-serif",
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(","),
  "&:hover": {
    backgroundColor: "#0069d9",
    borderColor: "#0062cc",
    boxShadow: "none",
  },
  "&:active": {
    boxShadow: "none",
    backgroundColor: "#0062cc",
    borderColor: "#005cbf",
  },
  "&:focus": {
    boxShadow: "0 0 0 0.2rem rgba(0,123,255,.5)",
  },
});

export const userToken = () => {
  return cookie.load("token");
};

export const loginUser = () => {
  return cookie.load("username");
};

export const onLogin = (username, token) => {
  cookie.save("username", username, { path: "/" });
  cookie.save("token", token, { path: "/" });
};

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  let navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const url = process.env.REACT_APP_BACKEND_URL + "/api/users/login";
    let loginInfo = {
      username: username,
      password: CryptoJs.MD5(password).toString(),
    };
    Post(
      url,
      loginInfo,
      (res) => {
        if (res.code === 200 || res.code === 201) {
          onLogin(username, res.data);
          navigate("/dashboard/dashboard");
        } else if (res.code === 401) {
          setAlertVisible(true);
        }
      },
      { Authorization: "" }
    );
  };

  const handleInputChange = (event) => {
    event.preventDefault();
    if (event.target.name === "username") setUsername(event.target.value);
    if (event.target.name === "password") setPassword(event.target.value);
  };

  const handleClose = (event) => {
    event.preventDefault();
    setAlertVisible(false);
  };

  return (
    <Box
      style={{
        height: "100vh",
        fontSize: "10px",
        backgroundRepeat: "no-repeat",
        overflowY: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: 4,
      }}
    >
      <Dialog
        open={alertVisible}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"登录失败"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            用户名或密码错误
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            确定
          </Button>
        </DialogActions>
      </Dialog>
      <Container component="main">
        <Box
          sx={{
            marginTop: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              marginTop: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              component="form"
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: 4,
              }}
              noValidate
            >
              <Box sx={{ width: 100 }}>
                <CardMedia
                  component="img"
                  image="/favicon.ico"
                  fullwidth={true}
                />
              </Box>
              <Box sx={{ width: 300 }}>
                <CardMedia
                  component="img"
                  image="/static/title.svg"
                  fullwidth={true}
                />
              </Box>
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 3 }}
              >
                <Box component="form" noValidate sx={{ mt: 1 }}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="用户名"
                    name="username"
                    size="Large"
                    autoComplete="username"
                    onChange={(event) => {
                      handleInputChange(event);
                    }}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="密码"
                    type="password"
                    id="password"
                    onChange={(event) => {
                      handleInputChange(event);
                    }}
                    autoComplete="current-password"
                  />
                </Box>
                <Box component="form" noValidate sx={{ mt: 1 }}>
                  <BootstrapButton
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    onClick={handleSubmit}
                  >
                    登录
                  </BootstrapButton>
                </Box>
              </Box>
            </Box>
            <Grid container spacing={10}>
              <Grid item xs={6} align="left">
                <Link href="/register" variant="body2">
                  <Typography component="h1" variant="h5">
                    注册账号
                  </Typography>
                </Link>
              </Grid>
              <Grid item xs={6} align="right">
                <Link
                  href="https://docs-scissorseven.app.secoder.net/"
                  variant="body2"
                >
                  <Typography component="h1" variant="h5">
                    用户手册
                  </Typography>
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </Box>
  );
}

export default function LoginInterface() {
  if (loginUser()) {
    window.location.href = "/dashboard/dashboard";
  } else {
    return <Login />;
  }
}
