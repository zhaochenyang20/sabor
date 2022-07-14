import * as React from "react";
import MuiAppBar from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";
import { Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import cookie from "react-cookies";
import axios from "axios";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import AccountMenu from "./accountMenu";

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function Bar({ toggleDrawer, open, projectName }) {
  const location = useLocation();
  //const [projectName, setProjectName] = useState("");
  const [load, setLoad] = useState(false);
  let { projectIndex } = useParams();

  function getRole() {
    if (location.pathname.search("admin") !== -1) {
      return "当前角色：管理员";
    } else if (location.pathname.search("system") !== -1) {
      return "当前角色：系统工程师";
    } else if (location.pathname.search("develop") !== -1) {
      return "当前角色：开发工程师";
    } else if (location.pathname.search("QA") !== -1) {
      return "当前角色：质量保证工程师";
    } else return "";
  }

  /*function getProject() {
    let index = location.pathname.search("project");
    if (index !== -1) {
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
          setProjectName("当前项目：" + response.data.data.name);
        })
        .catch((error) => {
          console.log(error);
        });
      setLoad(true);
    } else {
      setProjectName("需求跟踪管理系统");
      setLoad(true);
    }
  }*/

  /*useEffect(() => {
    if (!load) getProject();
  }, []);*/

  return (
    <AppBar position="fixed" open={open}>
      <Toolbar
        sx={{
          pr: "24px", // keep right padding when drawer closed
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={toggleDrawer}
          sx={{
            marginRight: "36px",
            ...(open && { display: "none" }),
          }}
        >
          <MenuIcon />
        </IconButton>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Stack
              direction="row"
              alignItems="right"
              spacing={2}
              divider={<Divider orientation="vertical" flexItem />}
            >
              <Typography variant="h6" color="inherit" noWrap>
                {projectName}
              </Typography>
              <Typography variant="h6" color="inherit" noWrap>
                {getRole()}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
        <AccountMenu />
      </Toolbar>
    </AppBar>
  );
}
