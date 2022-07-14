import * as React from "react";
import cookie from "react-cookies";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Post } from "../../../utils/communication";
import Box from "@mui/material/Box";

export default function CreateSystem({ projectIndex }) {
  // createSystemService 用于创建系统服务
  // const [projectId, setProjectId] = React.useState(undefined);
  const projectId = projectIndex;
  const headers = { Authorization: "Bearer " + cookie.load("token") };
  const [systemServiceName, setSystemServiceName] = React.useState(undefined);
  const [systemServiceDescription, setSystemServiceDescription] =
    React.useState(undefined);
  // ! createSystemService 的 hook

  const handleInputChange = (event) => {
    event.preventDefault();
    // if (event.target.name === "projectId") {
    //   setProjectId(event.target.value);
    //   return;
    // }
    if (event.target.name === "systemServiceName") {
      setSystemServiceName(event.target.value);
      return;
    }
    if (event.target.name === "systemServiceDescription") {
      setSystemServiceDescription(event.target.value);
      return;
    }
    // ! createSystemService 的 hook
  };

  const createSystemService = (event) => {
    // 这个接口用于创建系统服务
    event.preventDefault();
    let systemInfo = {
      name: systemServiceName, // 不存在则create
      description: systemServiceDescription, // create时必选
    };
    if (projectId == 0 || projectId === "" || projectId === undefined) {
      alert("检查项目序号是否合理");
      return;
    }
    if (
      (systemInfo["name"] === "") |
        (systemInfo["name"] === "请输入系统服务名称") ||
      systemInfo["name"] === undefined
    ) {
      alert("请输入服务名称");
      return;
    } else if (
      systemInfo["description"] === "" ||
      systemInfo["description"] === "请输入系统服务说明" ||
      systemInfo["description"] === undefined
    ) {
      alert("请输入服务说明");
      return;
    }
    const url =
      process.env.REACT_APP_BACKEND_URL +
      "api/projects/" +
      projectId.toString() +
      "/update-sys-serv";
    if (url !== null) {
      // console.log(url);
      // console.log(systemInfo);
      // return;
    }
    Post(
      url,
      systemInfo,
      (res) => {
        console.log(res);
        if (res.code === 200) {
          alert("创建成功");
        } else if (res.code === 400) {
          if (res.data === "001# system service's name check failed") {
            alert(
              "创建失败，可能由于该软件系统服务的名称不符合规定，请检查后提交"
            );
          }
          if (res.data === "004# New name check failed") {
            alert("创建失败，新的软件系统服务名称不符合规范");
          }
          if (res.data === "005# New name duplicates") {
            alert("创建失败，新的软件系统服务名称与已有的重复");
          }
        } else if (res.code === 404) {
          alert("创建失败，该项目并不存在");
        } else {
          alert("创建失败，可能是由于您不是系统工程师");
        }
      },
      headers
    );
  };

  return (
    <Box
      sx={{
        p: 2,
        mx: "auto",
        display: "block",
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
      }}
    >
      {/* <TextField
        margin="normal"
        required
        fullWidth
        label="项目序号"
        name="projectId"
        onChange={handleInputChange}
        variant="filled"
        autoFocuss
      /> */}
      <TextField
        sx={{ m: 2, mx: "auto", width: 1, borderRadius: 0 }}
        variant="standard"
        required
        fullWidth
        label="软件系统服务名称"
        name="systemServiceName"
        onChange={handleInputChange}
        autoFocuss
      />
      <TextField
        sx={{ m: 2, mx: "auto", width: 1, borderRadius: 0 }}
        variant="standard"
        fullWidth
        required
        label="软件系统服务说明"
        name="systemServiceDescription"
        onChange={handleInputChange}
        autoFocuss
      />
      <Button
        sx={{ m: 2, mx: "auto", width: 1, borderRadius: 0 }}
        variant="outlined"
        onClick={createSystemService}
        autoFocus
      >
        确认创建
      </Button>
    </Box>
  );
}
