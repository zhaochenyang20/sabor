import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import { useNavigate } from "react-router-dom";
import Toolbar from "@mui/material/Toolbar";
//import cookie from "react-cookies";
import { useParams, useLocation } from "react-router-dom";
import EventAvailableIcon from "@mui/icons-material/EventAvailableOutlined";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import GroupWorkIcon from "@mui/icons-material/GroupWork";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import LoopIcon from "@mui/icons-material/Loop";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import TimelapseIcon from "@mui/icons-material/Timelapse";
import GroupsIcon from "@mui/icons-material/Groups";
import GitHubIcon from "@mui/icons-material/GitHub";
import AddchartIcon from "@mui/icons-material/Addchart";
import DeveloperBoardIcon from "@mui/icons-material/DeveloperBoard";

const drawerWidth = 240;

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "fixed",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

export default function ListDrawer({ toggleDrawer, open, notifyOutlet }) {
  let navigate = useNavigate();
  let { projectIndex } = useParams();

  function getFunctionalButtons() {
    let location = useLocation();
    if (location.pathname.search("admin") !== -1) {
      return (
        <React.Fragment>
          <ListSubheader
            component="div"
            inset
            onClick={() => {
              navigate("/dashboard/admin/project" + projectIndex);
            }}
          >
            ?????????
          </ListSubheader>
          <ListItemButton
            onClick={() => {
              navigate("/dashboard/admin/project" + projectIndex + "/project");
            }}
          >
            <ListItemIcon>
              <TimelapseIcon />
            </ListItemIcon>
            <ListItemText primary="????????????" />
          </ListItemButton>
          <ListItemButton
            onClick={() => {
              navigate("/dashboard/admin/project" + projectIndex + "/human");
            }}
          >
            <ListItemIcon>
              <GroupsIcon />
            </ListItemIcon>
            <ListItemText primary="????????????" />
          </ListItemButton>
          <ListItemButton
            onClick={() => {
              navigate("/dashboard/admin/project" + projectIndex + "/git");
            }}
          >
            <ListItemIcon>
              <GitHubIcon />
            </ListItemIcon>
            <ListItemText primary="Git??????" />
          </ListItemButton>
        </React.Fragment>
      );
    }
    if (location.pathname.search("system") !== -1) {
      return (
        <React.Fragment>
          <ListSubheader
            component="div"
            inset
            onClick={() => {
              navigate("/dashboard/system/project" + projectIndex);
            }}
          >
            ???????????????
          </ListSubheader>
          <ListItemButton
            onClick={() => {
              navigate("/dashboard/system/project" + projectIndex + "/require");
            }}
          >
            <ListItemIcon>
              <AddchartIcon />
            </ListItemIcon>
            <ListItemText primary="????????????" />
          </ListItemButton>
          <ListItemButton
            onClick={() => {
              navigate("/dashboard/system/project" + projectIndex + "/service");
            }}
          >
            <ListItemIcon>
              <DeveloperBoardIcon />
            </ListItemIcon>
            <ListItemText primary="????????????" />
          </ListItemButton>
          <ListItemButton
            onClick={() => {
              navigate(
                "/dashboard/system/project" + projectIndex + "/iteration"
              );
            }}
          >
            <ListItemIcon>
              <LoopIcon />
            </ListItemIcon>
            <ListItemText primary="????????????" />
          </ListItemButton>
        </React.Fragment>
      );
    }
    if (location.pathname.search("develop") !== -1) {
      return (
        <React.Fragment>
          <ListSubheader
            component="div"
            inset
            onClick={() => {
              navigate("/dashboard/develop/project" + projectIndex);
            }}
          >
            ???????????????
          </ListSubheader>
          <ListItemButton
            onClick={() => {
              navigate(
                "/dashboard/develop/project" + projectIndex + "/iteration"
              );
            }}
          >
            <ListItemIcon>
              <LoopIcon />
            </ListItemIcon>
            <ListItemText primary="????????????" />
          </ListItemButton>
          <ListItemButton
            onClick={() => {
              navigate(
                "/dashboard/develop/project" + projectIndex + "/demands"
              );
            }}
          >
            <ListItemIcon>
              <FactCheckIcon />
            </ListItemIcon>
            <ListItemText primary="????????????" />
          </ListItemButton>
        </React.Fragment>
      );
    }
    if (location.pathname.search("QA") !== -1) {
      return (
        <React.Fragment>
          <ListSubheader
            component="div"
            inset
            onClick={() => {
              navigate("/dashboard/QA/project" + projectIndex);
            }}
          >
            ?????????????????????
          </ListSubheader>
          <ListItemButton
            onClick={() => {
              navigate("/dashboard/QA/project" + projectIndex + "/iteration");
            }}
          >
            <ListItemIcon>
              <EventAvailableIcon />
            </ListItemIcon>
            <ListItemText primary="????????????" />
          </ListItemButton>
          <ListItemButton
            onClick={() => {
              navigate(
                "/dashboard/QA/project" + projectIndex + "/merge-request"
              );
            }}
          >
            <ListItemIcon>
              <AccountTreeIcon />
            </ListItemIcon>
            <ListItemText primary="????????????" />
          </ListItemButton>
          <ListItemButton
            onClick={() => {
              navigate("/dashboard/QA/project" + projectIndex + "/issue");
            }}
          >
            <ListItemIcon>
              <ReportProblemIcon />
            </ListItemIcon>
            <ListItemText primary="????????????" />
          </ListItemButton>
          <ListItemButton
            onClick={() => {
              navigate("/dashboard/QA/project" + projectIndex + "/activation");
            }}
          >
            <ListItemIcon>
              <GroupWorkIcon />
            </ListItemIcon>
            <ListItemText primary="???????????????" />
          </ListItemButton>
          <ListItemButton
            onClick={() => {
              navigate("/dashboard/QA/project" + projectIndex + "/ability");
            }}
          >
            <ListItemIcon>
              <ShowChartIcon />
            </ListItemIcon>
            <ListItemText primary="????????????" />
          </ListItemButton>
        </React.Fragment>
      );
    }
  }

  return (
    <Drawer variant="permanent" open={open}>
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          px: [1],
        }}
      >
        <IconButton onClick={toggleDrawer}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <List component="nav">
        <React.Fragment>
          <ListSubheader component="div" inset>
            ????????????
          </ListSubheader>
          <ListItemButton
            onClick={() => {
              notifyOutlet();
              navigate("/dashboard/dashboard");
            }}
          >
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="????????????" />
          </ListItemButton>
          <ListItemButton
            onClick={() => {
              notifyOutlet();
              navigate("/dashboard/create");
            }}
          >
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="????????????" />
          </ListItemButton>
        </React.Fragment>
        <Divider sx={{ my: 1 }} />
        {getFunctionalButtons()}
      </List>
    </Drawer>
  );
}
