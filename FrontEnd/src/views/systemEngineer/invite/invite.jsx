import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Post } from "../../../utils/communication";
import cookie from "react-cookies";
import { useParams } from "react-router-dom";

export default function Invite({ handleDialogClose, handleUpdate }) {
  const [username, setUsername] = React.useState("");
  const [system, setSystem] = React.useState(false);
  const [developer, setDeveloper] = React.useState(false);
  const [QA, setQA] = React.useState(false);
  const { projectIndex } = useParams();

  const handleSubmit = (event) => {
    event.preventDefault();
    const headers = { Authorization: "Bearer " + cookie.load("token") };

    const url_find = process.env.REACT_APP_BACKEND_URL + "/api/users/find";
    Post(
      url_find,
      { username: username },
      (res) => {
        if (res.code !== 200) {
          alert("Unknown Username 用户不存在");
        } else {
          let id = res.data.id;
          let permission = [];
          if (system === true) permission.push(1);
          if (developer === true) permission.push(2);
          if (QA === true) permission.push(3);

          const url_invite =
            process.env.REACT_APP_BACKEND_URL +
            "api/projects/" +
            projectIndex.toString() +
            "/invite";

          const body = {
            invitedUser: id,
            grantedRole: permission,
          };

          Post(
            url_invite,
            body,
            (res) => {
              if (res.code === 200) {
                alert("邀请成功");
                handleUpdate();
              } else if (res.code === 400) {
                alert("Unknown Username 用户不存在");
              } else if (res.code === 401) {
                alert("Please Log In 请登录后操作");
              } else if (res.code === 403) {
                alert("No Permission 无权限执行此操作");
              } else if (res.code === 404) {
                alert("Unknown Project 项目不存在");
              }
            },
            headers
          );
        }
        handleDialogClose();
      },
      headers
    );
  };

  const handleChange = (event) => {
    event.preventDefault();
    if (event.target.name === "username") setUsername(event.target.value);
    if (event.target.name === "system") setSystem(!system);
    if (event.target.name === "developer") setDeveloper(!developer);
    if (event.target.name === "QA") setQA(!QA);
  };

  return (
    // <ThemeProvider theme={theme}>
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box>
        <Box>
          <Typography sx={{ mx: "auto", m: 4 }} align="center" variant="h6">
            邀请成员
          </Typography>
        </Box>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="user"
            required
            fullWidth
            id="username"
            label="用户名"
            name="username"
            autoFocus
            onChange={(event) => {
              handleChange(event);
            }}
          />
          <Box
            sx={{
              marginTop: 4,
              marginBottom: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <FormGroup aria-label="position">
              <FormControlLabel
                value="system"
                name="system"
                control={<Switch color="primary" />}
                label="系统工程师"
                labelPlacement="right"
                onChange={handleChange}
              />
              <FormControlLabel
                value="developer"
                name="developer"
                control={<Switch color="primary" />}
                label="开发工程师"
                labelPlacement="right"
                onChange={handleChange}
              />
              <FormControlLabel
                value="QA"
                name="QA"
                control={<Switch color="primary" />}
                label="质量保证工程师"
                labelPlacement="right"
                onChange={handleChange}
              />
            </FormGroup>
          </Box>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleSubmit}
          >
            添加成员
          </Button>
        </Box>
      </Box>
      {/* <Copyright sx={{ mt: 8, mb: 4 }} /> */}
    </Container>
    // </ThemeProvider>
  );
}
