import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import cookie from "react-cookies";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { loginUser } from "../../pages/login/login";
import { Post } from "../../../utils/communication";
import CryptoJs from "crypto-js";
import { useState } from "react";
import SuccessAlert from "../../../components/successalert";
import { useNavigate } from "react-router-dom";

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

function ChangePasswordContent() {
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [canRedirect, setCanRedirect] = useState(false);
  const navigate = useNavigate();

  const showAlert = (message) => {
    setAlertMessage(message);
    setAlertOpen(true);
  };

  const HandleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const oldPassword = data.get("oldPassword");
    const newPassword = data.get("newPassword");
    console.log({
      oldPassword: data.get("oldPassword"),
      newPassword: data.get("newPassword"),
    });
    if (newPassword.length < 8) {
      showAlert("新密码长度小于 8 位");
      return;
    }

    const headers = { Authorization: "Bearer " + cookie.load("token") };
    const encryptedOldPasswordString = CryptoJs.MD5(oldPassword).toString();
    const encryptedNewPasswordString = CryptoJs.MD5(newPassword).toString();
    const url = process.env.REACT_APP_BACKEND_URL + "/api/users/changePassword";
    const body = {
      oldPassword: encryptedOldPasswordString,
      newPassword: encryptedNewPasswordString,
    };
    Post(
      url,
      body,
      (response) => {
        if (response.code === 200) {
          //alert("修改成功");
          cookie.save("token", response.data);
          setCanRedirect(true);
          showAlert("修改成功");
          // TODO: 改回 router 格式
        } else if (response.code === 401) {
          showAlert("原始密码错误");
          //window.location.href = "/dashboard/password";
          // TODO: 改回 router 格式
        } else if (response.code === 400) {
          showAlert("新密码不符合密码规范");
          //window.location.href = "/dashboard/password";
          // TODO: 更改为 alertdialog
        } else {
          showAlert("网络错误，请重试");
        }
      },
      headers
    );
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Box component="form" noValidate onSubmit={HandleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                required
                fullWidth
                name="oldPassword"
                label="原始密码"
                type="password"
                id="oldPassword"
                autoComplete="current-password"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                type="password"
                id="newPassword"
                label="新密码"
                name="newPassword"
                autoComplete="current-password"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            提交修改
          </Button>
        </Box>
      </Box>
      <SuccessAlert
        successToastOpen={alertOpen}
        info={alertMessage}
        handleSuccessAlertClose={() => {
          setAlertOpen(false);
          if (canRedirect) {
            navigate("/dashboard/dashboard");
            //window.location.href = "/dashboard/dashboard";
          }
        }}
      />
      <Copyright sx={{ mt: 5 }} />
    </Container>
  );
}

export default function ChangePassword() {
  if (loginUser()) {
    return <ChangePasswordContent />;
  } else {
    window.location.href = "/";
  }
}
