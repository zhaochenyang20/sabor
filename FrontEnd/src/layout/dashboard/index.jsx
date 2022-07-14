import * as React from "react";
import Bar from "./appBar";
import ListDrawer from "./drawer";
import { Outlet } from "react-router-dom";
// material
import { styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import cookie from "react-cookies";
import axios from "axios";
// ----------------------------------------------------------------------

const drawerWidth = 240;

const APP_BAR_MOBILE = 96;
const APP_BAR_DESKTOP = 96;

const RootStyle = styled("div")({
  display: "flex",
  overflow: "hidden",
});

const MainStyle = styled("div")(({ theme, open }) => ({
  flexGrow: 1,
  overflow: "auto",
  minHeight: "100%",
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up("lg")]: {
    paddingTop: APP_BAR_DESKTOP,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  ...(open
    ? {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      }
    : {
        width: `calc(100% - ${theme.spacing(7)})`,
        marginLeft: theme.spacing(7),
        [theme.breakpoints.up("sm")]: {
          width: `calc(100% - ${theme.spacing(9)})`,
          marginLeft: theme.spacing(9),
        },
        transition: theme.transitions.create(["width", "margin"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      }),
}));

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const [open, setOpen] = useState(true);
  const [projectName, setProjectName] = useState("");
  const [load, setLoad] = useState(false);
  let { projectIndex } = useParams();
  let location = useLocation();

  function getProject() {
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
  }

  function notifyOutlet() {
    setProjectName("需求跟踪管理系统");
  }

  const toggleDrawer = () => {
    setOpen(!open);
  };

  useEffect(() => {
    if (!load) getProject();
  }, []);

  return (
    <RootStyle>
      <Bar toggleDrawer={toggleDrawer} open={open} projectName={projectName} />
      <ListDrawer
        toggleDrawer={toggleDrawer}
        open={open}
        notifyOutlet={notifyOutlet}
      />
      <CssBaseline />
      <MainStyle open={open}>
        <Outlet />
      </MainStyle>
    </RootStyle>
  );
}
