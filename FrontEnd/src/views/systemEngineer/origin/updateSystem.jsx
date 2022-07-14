import * as React from "react";
import cookie from "react-cookies";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Post } from "../../../utils/communication";
import Box from "@mui/material/Box";

export default function UpdateOrigin({ projectIndex }) {
  // updateOriginRequire 用于更新原始需求
  // const [projectId, setProjectId] = React.useState(undefined);
  const projectId = projectIndex;
  const headers = { Authorization: "Bearer " + cookie.load("token") };
  const [oldName, setOldName] = React.useState(undefined);
  const [newSystemInfoName, setNewSystemInfoName] = React.useState(undefined);
  const [newSystemInfoDescription, setNewSystemInfoDescription] =
    React.useState(undefined);
  // ! uopdateStstemService 的 hook

  const handleInputChange = (event) => {
    event.preventDefault();
    // if (event.target.name === "projectId") {
    //   setProjectId(event.target.value);
    //   return;
    // }
    if (event.target.name === "oldName") {
      setOldName(event.target.value);
      return;
    }
    if (event.target.name === "newSystemInfoName") {
      setNewSystemInfoName(event.target.value);
      return;
    }
    if (event.target.name === "newSystemInfoDescription") {
      setNewSystemInfoDescription(event.target.value);
      return;
    }
    // ! uopdateSystemService 的 hook
  };

  const updateSystemService = (event) => {
    // 这个接口用于更新系统服务
    event.preventDefault();
    let newSystemInfo = {
      name: oldName,
      newName: newSystemInfoName, // 可选
      description: newSystemInfoDescription, //可选，但是 newName 和 description 必须存在一个
    };
    if (projectId == 0 || projectId === "" || projectId === undefined) {
      alert("检查项目序号是否合理");
      return;
    }
    if (newSystemInfo["name"] === "" || newSystemInfo["name"] === undefined) {
      alert("请输入原始服务名称");
      return;
    }
    let checkPoint = 0;
    if (
      newSystemInfo["newName"] === "" ||
      newSystemInfo["newName"] === undefined
    ) {
      checkPoint += 1;
    }
    if (
      newSystemInfo["description"] === "" ||
      newSystemInfo["description"] === undefined
    ) {
      checkPoint += 1;
    }
    if (checkPoint === 2) {
      alert("您似乎并未做出任何修改");
      return;
    }
    const url =
      process.env.REACT_APP_BACKEND_URL +
      "api/projects/" +
      projectId.toString() +
      "/update-sys-serv";
    if (url !== null) {
      // console.log(url);
      // console.log(newSystemInfo);
      // return;
    }
    Post(
      url,
      newSystemInfo,
      (res) => {
        console.log(res);
        if (res.code === 200) {
          let id = res.data;
          alert("修改第" + id.toString() + "号需求成功");
        } else if (res.code === 400) {
          if (res.data === "001# system service's name check failed") {
            alert(
              "创建失败，可能由于该软件系统服务的名称不符合规定，请检查后提交"
            );
          }
          if (res.data === "003# Create but no description") {
            alert("创建成功，但是该软件系统服务描述没有说明");
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
        label="原始软件系统服务名称"
        name="oldName"
        onChange={handleInputChange}
        autoFocuss
      />
      <TextField
        sx={{ m: 2, mx: "auto", width: 1, borderRadius: 0 }}
        variant="standard"
        fullWidth
        label="新软件系统服务名称"
        name="newSystemInfoName"
        onChange={handleInputChange}
        autoFocuss
      />
      <TextField
        sx={{ m: 2, mx: "auto", width: 1, borderRadius: 0 }}
        variant="standard"
        fullWidth
        label="新软件系统服务说明"
        name="newSystemInfoDescription"
        onChange={handleInputChange}
        autoFocuss
      />
      <Button
        sx={{ m: 2, mx: "auto", width: 1, borderRadius: 0 }}
        variant="outlined"
        onClick={updateSystemService}
        autoFocus
      >
        确认更新
      </Button>
    </Box>
  );
}
