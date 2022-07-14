import * as React from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import { useParams } from "react-router-dom";
import cookie from "react-cookies";
import axios from "axios";
import { useState, useEffect, useReducer } from "react";
//import Alert from "@mui/material/Alert";
//import Snackbar from "@mui/material/Snackbar";

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

export default function HumanInfo({
  type,
  humanName,
  handleDialogClose,
  handleDialogCloseDevelop,
  handleUpdate,
}) {
  const [load, setLoad] = useState(false);
  const [role, setRole] = useState([]);
  const { projectIndex } = useParams();
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  //const [returnMessage, setReturnMessage] = useState("");

  // to keep almost unified interface
  //const showAlert = setReturnMessage;

  //const [successToastOpen, setSuccessToastOpen] = useState(false);
  //const [failToastOpen, setFailToastOpen] = useState(false);

  /*
  function handleSuccessAlertClose() {
    setSuccessToastOpen(false);
  }

  function handleFailAlertClose() {
    setFailToastOpen(false);
  }
    */

  function handleDelete() {
    let token = cookie.load("token");
    const headers = { Authorization: "Bearer " + token };
    const url_find = process.env.REACT_APP_BACKEND_URL + "/api/users/find";
    axios
      .post(url_find, { username: humanName }, { headers })
      .then((response) => {
        let humanId = response.data.data.id;
        const url_delete =
          process.env.REACT_APP_BACKEND_URL +
          "api/projects/" +
          projectIndex +
          "/invite";
        let permission = [];
        if (role.indexOf("系统工程师") !== -1 && type != "system")
          permission.push(1);
        if (role.indexOf("开发工程师") !== -1 && type != "develop")
          permission.push(2);
        if (role.indexOf("质量保证工程师") !== -1 && type != "quality")
          permission.push(3);
        axios
          .post(
            url_delete,
            { invitedUser: humanId, grantedRole: permission },
            { headers }
          )
          .then((deleteResponse) => {
            console.log("funcIds: ", deleteResponse.data.data.funcIds.length);
            console.log("iterIds: ", deleteResponse.data.data.iterIds.length);
            if (
              deleteResponse.data.data.funcIds.length === 0 &&
              deleteResponse.data.data.iterIds.length === 0
            ) {
              handleDialogClose("修改成功");
            } else {
              handleDialogClose();
              handleDialogCloseDevelop(
                deleteResponse.data.data.funcIds,
                deleteResponse.data.data.iterIds
              );
            }
            handleUpdate();
            //handleDialogClose(returnMessage);
          })
          .catch(() => {
            handleDialogClose("修改失败");
            //showAlert("修改失败");
            //setFailToastOpen(true);
          });
      })
      .catch(() => {
        handleDialogClose("修改失败");
        //showAlert("修改失败");
        //setFailToastOpen(true);
      });
    //handleUpdate();
    //handleDialogClose(returnMessage);
  }

  function getTitle(type) {
    if (type === "system") return "系统工程师";
    if (type === "develop") return "开发工程师";
    if (type === "quality") return "质量保证工程师";
  }

  function handleAccept() {
    handleDialogClose("");
  }

  function getProjectInfo() {
    setLoad(true);
    let token = cookie.load("token");
    const headers = { Authorization: "Bearer " + token };
    const url =
      process.env.REACT_APP_BACKEND_URL +
      "api/projects/" +
      projectIndex +
      "/find-one";
    axios
      .get(url, { headers })
      .then((response) => {
        if (response.data.data.systemEngineers.indexOf(humanName) != -1) {
          role.push("系统工程师");
          setRole(role);
        }
        if (response.data.data.developmentEngineers.indexOf(humanName) != -1) {
          role.push("开发工程师");
          setRole(role);
        }
        if (
          response.data.data.qualityAssuranceEngineers.indexOf(humanName) != -1
        ) {
          role.push("质量保证工程师");
          setRole(role);
        }
        forceUpdate();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    if (!load) {
      getProjectInfo();
    }
  });

  return (
    <Box>
      <DialogTitle id="customized-dialog-title">
        删除{getTitle(type)}
      </DialogTitle>
      <DialogContent dividers>
        <Grid>
          <Grid item xs={12} align="center">
            <Avatar {...stringAvatar(humanName)} />
          </Grid>
          <Grid item xs={12} align="center">
            <Typography variant="h6" gutterBottom>
              {humanName}
            </Typography>
          </Grid>
          {role.map((singleRole) => {
            return (
              <Grid item xs={12} key={singleRole} align="center">
                <Typography variant="body2" gutterBottom>
                  {singleRole}
                </Typography>
              </Grid>
            );
          })}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button align="right" autoFocus onClick={handleAccept}>
          取消
        </Button>
        <Button align="center" onClick={handleDelete}>
          删除
        </Button>
      </DialogActions>
      {/*
      <Snackbar
        open={successToastOpen}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={handleSuccessAlertClose}
      >
        <Alert
          onClose={handleSuccessAlertClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          修改成功！
        </Alert>
      </Snackbar>
      <Snackbar
        open={failToastOpen}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={handleFailAlertClose}
      >
        <Alert
          onClose={handleFailAlertClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          修改失败！
        </Alert>
      </Snackbar>
         */}
    </Box>
  );
}
