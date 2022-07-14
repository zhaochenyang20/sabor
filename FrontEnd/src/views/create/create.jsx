import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { Post } from "../../utils/communication";
import Container from "@mui/material/Container";
import { loginUser } from "../pages/login/login";
import cookie from "react-cookies";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SuccessAlert from "../../components/successalert";
import CreateNewFolderOutlinedIcon from "@mui/icons-material/CreateNewFolderOutlined";
import { Avatar } from "@mui/material";

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

function CreateProject() {
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [canRedirect, setCanRedirect] = useState(false);
  const navigate = useNavigate();

  const showAlert = (message) => {
    setAlertOpen(true);
    setAlertMessage(message);
  };

  function confirm(event) {
    event.preventDefault();
    const url = process.env.REACT_APP_BACKEND_URL + "api/projects/create";
    let projectName = document.getElementById("projectName").value;
    let description = document.getElementById("description").value;
    if (projectName === "") {
      showAlert("请输入项目名称");
      return;
    }
    /* It's optional
  if (description === "") {
    showAlert("请输入项目简介与描述");
    return;
  }
    */
    const headers = { Authorization: "Bearer " + cookie.load("token") };
    const CreateProjectInfo = {
      projectName: projectName,
      description: description,
      managerName: loginUser(),
    };
    Post(
      url,
      CreateProjectInfo,
      (res) => {
        if (res.code === 200 || res.code === 201) {
          showAlert("创建项目成功");
          setCanRedirect(true);
        } else {
          showAlert("创建失败，请稍后重试");
        }
      },
      headers
    );
  }

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          marginBottom: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      ></Box>
      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          "& .MuiTextField-root": { width: "62.3ch" },
        }}
        noValidate
        autoComplete="off"
      >
        <Box
          sx={{
            marginBottom: 4,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Box sx={{ marginRight: "5ch" }}>
            <Typography variant="h6" align="left">
              创建项目，开启你的一站式管理工具
            </Typography>
          </Box>
          <Box>
            <Button
              variant="outlined"
              onClick={confirm}
              style={{ float: "right" }}
            >
              确认生成项目
            </Button>
          </Box>
        </Box>
        <Box align="center" sx={{ marginBottom: 3 }}>
          <TextField
            id="projectName"
            label="项目名称"
            required
            fullWidth
            autoFocus
            variant="outlined"
          />
        </Box>
        <Box align="center">
          <TextField
            id="description"
            label="项目简介与描述"
            fullWidth
            multiline
            rows={6}
          />
        </Box>
        <Copyright sx={{ pt: 4 }} />
      </Box>
      <SuccessAlert
        successToastOpen={alertOpen}
        info={alertMessage}
        handleSuccessAlertClose={() => {
          setAlertOpen(false);
          if (canRedirect) {
            navigate("/dashboard/dashboard");
          }
        }}
      />
    </Container>
  );
}

export default function CreateProjectInterface() {
  if (loginUser()) {
    return <CreateProject />;
  } else {
    window.location.href = "/";
  }
}
