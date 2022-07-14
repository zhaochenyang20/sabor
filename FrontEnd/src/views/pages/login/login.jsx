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
        fontSize: "10px",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        overflowY: "hidden",
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
            pt: 4,
            pb: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box component="form" noValidate sx={{ width: 800 }}>
              <Grid container direction="row" spacing={6}>
                <Grid item xs={5}>
                  <TextField
                    required
                    fullWidth
                    id="username"
                    label="用户名"
                    size="Large"
                    name="username"
                    sx={{ height: 40 }}
                    autoComplete="username"
                    onChange={(event) => {
                      handleInputChange(event);
                    }}
                  />
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    fullWidth
                    required
                    name="password"
                    label="密码"
                    type="password"
                    id="password"
                    sx={{ height: 40 }}
                    onChange={(event) => {
                      handleInputChange(event);
                    }}
                    autoComplete="current-password"
                  />
                </Grid>
                <Grid item xs={2}>
                  <Button
                    fullWidth
                    type="submit"
                    variant="outlined"
                    sx={{ height: 50 }}
                    onClick={handleSubmit}
                  >
                    登录
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Box>
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
