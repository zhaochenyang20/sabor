import * as React from "react";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import ListIcon from "@mui/icons-material/List";
import TextField from "@mui/material/TextField";
import { useState, useEffect } from "react";
import cookie from "react-cookies";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Button, Stack, Typography } from "@mui/material";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import SuccessAlert from "../../components/successalert";
import FailAlert from "../../components/failalert";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function DeleteDialogSlide({
  deleteDialogOpen,
  setDeleteDialogOpen,
  projectName,
}) {
  let navigate = useNavigate();
  let { projectIndex } = useParams();
  const [success, setSuccess] = useState(false);
  const [fail, setFail] = useState(false);

  const handleCancelClose = () => {
    setDeleteDialogOpen(false);
  };
  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
    deleteProject();
  };

  function deleteProject() {
    let token = cookie.load("token");
    const headers = { Authorization: "Bearer " + token };
    const url =
      process.env.REACT_APP_BACKEND_URL +
      "api/projects/" +
      projectIndex +
      "/delete-project";
    axios
      .get(url, { headers })
      .then((response) => {
        if (response.data.code === 200) {
          setSuccess(true);
          navigate("/dashboard/dashboard");
        }
      })
      .catch(() => {
        setFail(true);
      });
  }

  return (
    <Box>
      <Dialog
        open={deleteDialogOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCancelClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>删除项目</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            确定删除项目“{projectName}”？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={handleCancelClose}>
            取消
          </Button>
          <Button color="error" variant="text" onClick={handleDeleteClose}>
            删除
          </Button>
        </DialogActions>
      </Dialog>
      <SuccessAlert
        successToastOpen={success}
        handleSuccessAlertClose={() => {
          setSuccess(false);
        }}
      />
      <FailAlert
        failToastOpen={fail}
        handleFailAlertClose={() => {
          setFail(false);
        }}
      />
    </Box>
  );
}

export default function ProjectInfo() {
  const [load, setLoad] = useState(false);
  const [modifyName, setModifyName] = useState(false);
  const [modifyDescription, setModifyDescription] = useState(false);
  const [name, setName] = useState("");
  const [index, setIndex] = useState("");
  const [description, setDescription] = useState("");
  const [manager, setManager] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  let { projectIndex } = useParams();
  const [tempName, setTempName] = useState("");
  const [tempDescription, setTempDescription] = useState("");

  useEffect(() => {
    if (!load) getProjectInfo();
  }, []);

  const showAlert = (msg) => {
    setAlertMessage(msg);
    setDialog(true);
  };

  function modifyDescriptionPost(newDescription) {
    let token = cookie.load("token");
    const headers = { Authorization: "Bearer " + token };
    const url =
      process.env.REACT_APP_BACKEND_URL +
      "/api/projects/" +
      projectIndex +
      "/update-project";
    axios
      .post(
        url,
        {
          name: name,
          description: newDescription,
        },
        { headers }
      )
      .then((response) => {
        if (response.data.code === 200) {
          //alert("sucess");
          showAlert("操作成功");
        }
      })
      .catch(() => {
        //alert("fail");
        showAlert("操作失败");
      })
      .finally(() => {
        getProjectInfo();
      });
  }

  function modifyNamePost(newName) {
    let token = cookie.load("token");
    const headers = { Authorization: "Bearer " + token };
    const url =
      process.env.REACT_APP_BACKEND_URL +
      "/api/projects/" +
      projectIndex +
      "/update-project";
    axios
      .post(
        url,
        {
          name: newName,
          description: description,
        },
        { headers }
      )
      .then((response) => {
        if (response.data.code === 200) {
          //alert("sucess");
          showAlert("操作成功");
        }
      })
      .catch((error) => {
        console.log(error.response);
        //alert("fail");
        showAlert("操作失败");
      })
      .finally(() => {
        getProjectInfo();
      });
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
        setIndex(response.data.data.id);
        setName(response.data.data.name);
        setDescription(response.data.data.description);
        setManager(response.data.data.manager);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function getNameText() {
    if (modifyName)
      return (
        <TextField
          defaultValue={name}
          sx={{ pt: 2, pb: 2 }}
          onChange={(event) => {
            setTempName(event.target.value);
          }}
          variant="standard"
        />
      );
    else
      return (
        <Typography
          variant="body1"
          align="right"
          sx={{ pl: 2, pr: 2, color: "text.secondary" }}
          noWrap
        >
          {name}
        </Typography>
      );
  }

  function getDescriptionText() {
    if (modifyDescription)
      return (
        <TextField
          sx={{ pt: 2, pb: 2 }}
          onChange={(event) => {
            setTempDescription(event.target.value);
          }}
          variant="standard"
          defaultValue={description}
        />
      );
    else
      return (
        <Typography
          variant="body1"
          align="right"
          sx={{ pl: 2, pr: 2, color: "text.secondary" }}
          noWrap
        >
          {description || "暂无"}
        </Typography>
      );
  }

  function getNameButton() {
    if (modifyName)
      return (
        <Button
          variant="text"
          onClick={() => {
            setModifyName(!modifyName);
            if (tempName) {
              setName(tempName);
              modifyNamePost(tempName);
            }
          }}
        >
          保存
        </Button>
      );
    else
      return (
        <Button
          variant="text"
          onClick={() => {
            setTempName(name);
            setModifyName(!modifyName);
          }}
        >
          修改
        </Button>
      );
  }

  function getDescriptionButton() {
    if (modifyDescription)
      return (
        <Button
          variant="text"
          onClick={() => {
            setModifyDescription(!modifyDescription);

            setDescription(tempDescription);
            modifyDescriptionPost(tempDescription);
          }}
        >
          保存
        </Button>
      );
    else
      return (
        <Button
          variant="text"
          onClick={() => {
            setTempDescription(description);
            setModifyDescription(!modifyDescription);
          }}
        >
          修改
        </Button>
      );
  }

  return (
    <Paper
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h4">项目管理</Typography>
      <Stack direction="column" spacing={3} sx={{ p: 3, pr: 0 }}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          divider={<Divider orientation="vertical" flexItem />}
        >
          <Stack direction="row" spacing={2}>
            <ListIcon />
            <Typography variant="h6" sx={{ width: 120, pl: 2, pr: 2 }} noWrap>
              项目序号
            </Typography>
          </Stack>
          <Typography
            variant="body1"
            align="right"
            sx={{ pl: 2, pr: 2, color: "text.secondary" }}
            noWrap
          >
            {index}
          </Typography>
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          divider={<Divider orientation="vertical" flexItem />}
        >
          <Stack direction="row" spacing={2}>
            <AccountTreeIcon />
            <Typography variant="h6" sx={{ width: 120, pl: 2, pr: 2 }} noWrap>
              项目名称
            </Typography>
          </Stack>
          {getNameText()}
          {getNameButton()}
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          divider={<Divider orientation="vertical" flexItem />}
        >
          <Stack direction="row" spacing={2}>
            <TextSnippetIcon />
            <Typography variant="h6" sx={{ width: 120, pl: 2, pr: 2 }} noWrap>
              项目说明
            </Typography>
          </Stack>
          {getDescriptionText()}
          {getDescriptionButton()}
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          divider={<Divider orientation="vertical" flexItem />}
        >
          <Stack direction="row" spacing={2}>
            <AccountBoxIcon />
            <Typography variant="h6" sx={{ width: 120, pl: 2, pr: 2 }} noWrap>
              管理员
            </Typography>
          </Stack>
          <Typography
            variant="body1"
            align="right"
            sx={{ pl: 2, pr: 2, color: "text.secondary" }}
            noWrap
          >
            {manager}
          </Typography>
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          divider={<Divider orientation="vertical" flexItem />}
        >
          <Stack direction="row" spacing={2}>
            <DeleteOutlineIcon />
            <Typography variant="h6" sx={{ width: 120, pl: 2, pr: 2 }} noWrap>
              删除项目
            </Typography>
          </Stack>
          <Button
            variant="text"
            onClick={() => {
              setDeleteDialogOpen(true);
            }}
          >
            删除
          </Button>
        </Stack>
      </Stack>
      <DeleteDialogSlide
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
        projectName={name}
      />
      <SuccessAlert
        successToastOpen={dialog}
        handleSuccessAlertClose={() => {
          setDialog(false);
        }}
        info={alertMessage}
      />
    </Paper>
  );
}
