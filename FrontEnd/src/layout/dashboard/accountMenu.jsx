import * as React from "react";
import Box from "@mui/material/Box";
import KeyIcon from "@mui/icons-material/Key";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate, useParams } from "react-router-dom";
import Logout from "@mui/icons-material/Logout";
import cookie from "react-cookies";
import BadgeIcon from "@mui/icons-material/Badge";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import { Typography } from "@mui/material";
import { Get } from "../../utils/communication";
import { Avatar } from "@mui/material";

export default function AccountMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  let navigate = useNavigate();
  const [projectName, setProjectName] = React.useState("");
  const [loadProjectName, setLoadProjectName] = React.useState(false);
  const { projectIndex } = useParams();

  function stringToColor(string) {
    var hash = 0;
    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    var color = "#";
    for (let i = 0; i < 3; i++) {
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

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getProjectName = () => {
    if (getRole() === "") {
      setLoadProjectName(true);
      return "";
    } else {
      const url =
        process.env.REACT_APP_BACKEND_URL +
        "api/projects/" +
        projectIndex +
        "/find-one";
      const body = {
        id: projectIndex,
      };
      const headers = {
        Authorization: "Bearer " + cookie.load("token"),
      };
      Get(
        url,
        body,
        (response) => {
          if (response.code === 200) {
            setProjectName(response.data.name);
            setLoadProjectName(true);
          }
        },
        headers
      );
    }
  };

  React.useEffect(() => {
    if (!loadProjectName) getProjectName();
  }, []);

  const getRole = () => {
    let url = location.pathname;
    if (url.search("develop") !== -1) {
      return "开发工程师";
    } else if (url.search("QA") !== -1) {
      return "质量保证工程师";
    } else if (url.search("system") !== -1) {
      return "系统工程师";
    } else if (url.search("admin") !== -1) {
      return "管理员";
    } else {
      return "";
    }
  };

  const exit = () => {
    cookie.save("username", "", { path: "/" });
    cookie.save("token", "", { path: "/" });
    cookie.remove("username");
    cookie.remove("token");
    navigate("/");
  };

  function IF() {
    if (getRole() === "") {
      return <React.Fragment />;
    } else {
      return (
        <React.Fragment>
          <Divider />
          <MenuItem>
            <BadgeIcon fontSize="medium" />
            <Typography sx={{ marginLeft: 3, marginRight: 2 }}>
              {projectName}
            </Typography>
          </MenuItem>
          <MenuItem>
            <BuildCircleIcon fontSize="medium" />
            <Typography sx={{ marginLeft: 3, marginRight: 2 }}>
              {getRole()}
            </Typography>
          </MenuItem>
        </React.Fragment>
      );
    }
  }

  return (
    <React.Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Tooltip title="INFO">
          <IconButton
            onClick={handleClick}
            size="large"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar {...stringAvatar(cookie.load("username"))} />
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box
          sx={{
            marginLeft: 2,
            marginRight: 3.5,
            marginTop: 1,
            marginBottom: 1,
          }}
        >
          <MenuItem>
            <Box
              align="center"
              sx={{
                display: "flex",
                alignItems: "center",
                marginTop: 1,
                marginBottom: 1,
                marginLeft: 2,
              }}
            >
              <FingerprintIcon fontSize="large" />
              <Typography variant="h5" sx={{ marginLeft: 1, marginRight: 1 }}>
                {cookie.load("username")}
              </Typography>
            </Box>
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={() => {
              navigate("/dashboard/password");
            }}
          >
            <ListItemIcon>
              <KeyIcon fontSize="medium" />
            </ListItemIcon>
            <Typography sx={{ marginLeft: 3, marginRight: 2 }}>
              修改密码
            </Typography>
          </MenuItem>
          <MenuItem onClick={exit}>
            <ListItemIcon>
              <Logout fontSize="medium" />
            </ListItemIcon>
            <Typography sx={{ marginLeft: 3, marginRight: 2 }}>退出</Typography>
          </MenuItem>
        </Box>
      </Menu>
    </React.Fragment>
  );
}
