import * as React from "react";
import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import CryptoJs from "crypto-js";
import { Post } from "../../../utils/communication";
import { styled } from "@mui/material/styles";
import SuccessAlert from "../../../components/successalert";
import CardMedia from "@mui/material/CardMedia";

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

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleInputChange = (event) => {
    event.preventDefault();
    if (event.target.name === "username") setUsername(event.target.value);
    if (event.target.name === "password") setPassword(event.target.value);
  };

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const setAlert = (msg) => {
    setAlertMessage(msg);
    setAlertOpen(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
  };

  const makeRegistration = (event) => {
    event.preventDefault();

    if (username == "") {
      setAlert("用户名不能为空");
    } else if (password.length < 8) {
      setAlert("请设置不少于8位的密码");
    } else {
      const EncryptedPasswordString = CryptoJs.MD5(password).toString();
      const url = process.env.REACT_APP_BACKEND_URL + "/api/users/register";
      const body = {
        // "email": EmailAddress,
        username: username,
        password: EncryptedPasswordString,
      };

      Post(
        url,
        body,
        (response) => {
          if (response.code === 200 || response.code === 201) {
            window.location.href = "/";
          } else if (response.code === 400) {
            setAlert("注册信息有误，可能该用户已存在");
          } else {
            setAlert("网络错误，请稍后重试");
          }
        },
        {}
      );
    }
  };

  return (
    <Box
      style={{
        marginTop: "0px",
        fontSize: "10px",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        overflowY: "hidden",
      }}
    >
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box sx={{ width: 100 }}>
            <CardMedia component="img" image="/favicon.ico" fullwidth={true} />
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
                size="Large"
                name="username"
                color="secondary"
                autoComplete="username"
                onChange={(event) => {
                  handleInputChange(event);
                }}
                autoFocus
              />
              {/* <TextField
              margin="normal"
                required
                name="username"
                fullWidth
                id="username"
                label="用户名"
                size="Large"
                color="secondary"
                autoComplete="username"
                autoFocus
              /> */}
              <TextField
                required
                fullWidth
                name="password"
                label="密码"
                type="password"
                id="password"
                onChange={(event) => {
                  handleInputChange(event);
                }}
                autoComplete="new-password"
              />
            </Box>
            <BootstrapButton
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={makeRegistration}
            >
              注册
            </BootstrapButton>
            <Grid container spacing={10}>
              <Grid item xs={6} align="left">
                <Link href="/login" variant="body2">
                  <Typography component="h1" variant="h5">
                    登录账号
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
      <SuccessAlert
        successToastOpen={alertOpen}
        handleSuccessAlertClose={() => setAlertOpen(false)}
        info={alertMessage}
      />
    </Box>
  );
}
