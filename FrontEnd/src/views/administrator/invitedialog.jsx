import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import cookie from "react-cookies";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import { Typography, IconButton } from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";

function stringToColor(string) {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
}

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name[0]}`,
  };
}

export default function InviteDialog({
  type,
  handleDialogClose,
  handleUpdate,
}) {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState(0);
  const [role, setRole] = useState([]);
  const [project, setProject] = useState({});
  const [load, setLoad] = useState(false);
  const [addable, setAddable] = useState(true);
  const [infomation, setInfomation] = useState(
    <Typography>查找用户进行邀请</Typography>
  );
  const { projectIndex } = useParams();

  //const [ returnMessage, setReturnMessage] = useState("");
  //const showAlert = setReturnMessage;

  function getProjectInfo() {
    let token = cookie.load("token");
    setLoad(true);
    const headers = { Authorization: "Bearer " + token };
    const url =
      process.env.REACT_APP_BACKEND_URL +
      "api/projects/" +
      projectIndex +
      "/find-one";
    axios
      .get(url, { headers })
      .then((response) => {
        setProject(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleCancel() {
    handleDialogClose("");
  }

  function getTitle(type) {
    if (type === "system") return "系统工程师";
    if (type === "develop") return "开发工程师";
    if (type === "quality") return "质量保证工程师";
  }

  function handleInvite() {
    let token = cookie.load("token");
    const headers = { Authorization: "Bearer " + token };
    const url =
      process.env.REACT_APP_BACKEND_URL +
      "api/projects/" +
      projectIndex +
      "/invite";
    let permission = [];
    if (type === "system" && role.indexOf("系统工程师") === -1) {
      role.push("系统工程师");
      setRole(role);
    }
    if (type === "develop" && role.indexOf("开发工程师") === -1) {
      role.push("开发工程师");
      setRole(role);
    }
    if (type === "quality" && role.indexOf("质量保证工程师") === -1) {
      role.push("质量保证工程师");
      setRole(role);
    }
    if (role.indexOf("系统工程师") !== -1) permission.push(1);
    if (role.indexOf("开发工程师") !== -1) permission.push(2);
    if (role.indexOf("质量保证工程师") !== -1) permission.push(3);
    axios
      .post(url, { invitedUser: userId, grantedRole: permission }, { headers })
      .then((inviteResponse) => {
        if (inviteResponse.data.code === 200) {
          handleDialogClose("修改成功");
          //showAlert("修改成功");
        } else {
          handleDialogClose("修改失败");
          //showAlert("修改失败");
        }
        handleUpdate();
        //handleDialogClose(returnMessage);
      })
      .catch(() => {
        handleDialogClose("修改失败");
        //showAlert("修改失败");
        //handleDialogClose(returnMessage);
      });
  }

  function handleNameChange(name) {
    setUsername(name);
    setAddable(true);
  }

  function handleSearch() {
    let token = cookie.load("token");
    const headers = { Authorization: "Bearer " + token };
    const url_find = process.env.REACT_APP_BACKEND_URL + "/api/users/find";
    axios
      .post(url_find, { username: username }, { headers })
      .then((response) => {
        setUserId(response.data.data.id);
        let tempRole = [];
        if (project.systemEngineers.indexOf(username) != -1) {
          tempRole.push("系统工程师");
        }
        if (project.developmentEngineers.indexOf(username) != -1) {
          tempRole.push("开发工程师");
        }
        if (project.qualityAssuranceEngineers.indexOf(username) != -1) {
          tempRole.push("质量保证工程师");
        }
        setRole(tempRole);
        setAddable(false);
        setInfomation(
          <Grid>
            <Grid item xs={12} align="center">
              <Avatar {...stringAvatar(username)} />
            </Grid>
            <Grid item xs={12} align="center">
              <Typography variant="h6" gutterBottom>
                {username}
              </Typography>
            </Grid>
            {tempRole.map((singleRole) => {
              return (
                <Grid item xs={12} key={singleRole} align="center">
                  <Typography variant="body2" gutterBottom>
                    {singleRole}
                  </Typography>
                </Grid>
              );
            })}
          </Grid>
        );
      })
      .catch(() => {
        setAddable(true);
        setInfomation(
          <Grid>
            <Grid item xs={12} align="center">
              <WarningIcon fontSize="large" color="error" />
            </Grid>
            <Grid item xs={12} align="center">
              <Typography variant="body2" gutterBottom>
                用户“{username}”不存在
              </Typography>
            </Grid>
          </Grid>
        );
      });
  }

  useEffect(() => {
    if (!load) {
      getProjectInfo();
    }
  });

  return (
    <Box sx={{ textOverflow: "ellipsis" }}>
      <DialogTitle id="customized-dialog-title">
        邀请{getTitle(type)}
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={1} justifyContent="center">
          <Grid item xs={8} align="center">
            <TextField
              id="outlined-basic"
              label="用户名"
              variant="outlined"
              onChange={(event) => {
                handleNameChange(event.target.value);
              }}
            />
          </Grid>
          <Grid item xs={1} align="center">
            <IconButton sx={{ mt: 1, mb: 2 }} onClick={handleSearch}>
              <SearchIcon />
            </IconButton>
          </Grid>
          <Grid item xs={12} align="center">
            {infomation}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button align="right" autoFocus onClick={handleCancel}>
          取消
        </Button>
        <Button align="center" disabled={addable} onClick={handleInvite}>
          添加
        </Button>
      </DialogActions>
    </Box>
  );
}
