import * as React from "react";
import cookie from "react-cookies";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Post } from "../../../utils/communication";

export default function UpdateOrigin({ projectIndex }) {
  // updateOriginRequire 用于更新原始需求
  // const [projectId, setProjectId] = React.useState(undefined);
  const projectId = projectIndex;
  const headers = { Authorization: "Bearer " + cookie.load("token") };

  const [originRequireId, setOriginRequireId] = React.useState(undefined);
  const [newOriginRequireName, setNewOriginRequireName] =
    React.useState(undefined);
  const [newOriginRequireDescription, setNewOriginRequireDescription] =
    React.useState(undefined);
  const [newState, setNewState] = React.useState(undefined);
  // ! updateOriginRequire 的 hook

  const handleInputChange = (event) => {
    event.preventDefault();
    // if (event.target.name === "projectId") {
    //   setProjectId(event.target.value);
    //   return;
    // }
    if (event.target.name === "originRequireId") {
      setOriginRequireId(event.target.value);
      return;
    }
    if (event.target.name === "newOriginRequireName") {
      setNewOriginRequireName(event.target.value);
      return;
    }

    if (event.target.name === "newOriginRequireDescription") {
      setNewOriginRequireDescription(event.target.value);
      return;
    }

    // ! uopdateOriginRequireState 的 hook
  };

  const handleNewOriginRequireState = (event) => {
    setNewState(event.target.value);
    console.log(newState);
  };

  const updateOriginRequire = (event) => {
    // 这个接口用于更新原始需求
    event.preventDefault();
    let updateOriginRequire = {
      id: new Number(originRequireId), // 注意，这里是某个 orgginRequire 的 id，不是 url 里的 projectId
      name: newOriginRequireName, // 某个原始需求的新名称
      description: newOriginRequireDescription, // 某个原始需求的新描述
      state: newState, // 1~4: 初始化，已分解，进行中，已交付
    };
    if (projectId == 0 || projectId === "" || projectId === undefined) {
      alert("检查项目序号是否合理");
      return;
    }
    if (
      updateOriginRequire["id"] == 0 ||
      updateOriginRequire["id" === ""] ||
      updateOriginRequire["id"] === undefined
    ) {
      alert("请输入原始需求 id");
      return;
    }
    if (updateOriginRequire["id"] < 1) {
      alert("请输入符合标准的原始需求 id");
      return;
    }
    if (updateOriginRequire["id"] % 1 !== 0) {
      alert("请输入符合标准的原始需求 id");
      return;
    }
    let checkPoint = 0;
    if (
      updateOriginRequire["name"] === "请输入原始需求的新名称" ||
      updateOriginRequire["name"] === "" ||
      updateOriginRequire["name"] === undefined
    ) {
      checkPoint += 1;
    }
    if (
      updateOriginRequire["description"] === "请输入原始需求的新说明" ||
      updateOriginRequire["description"] === "" ||
      updateOriginRequire["description"] === undefined
    ) {
      checkPoint += 1;
    }
    if (
      updateOriginRequire["state"] === "请输入原始需求的新交付状态" ||
      updateOriginRequire["state"] == 0 ||
      updateOriginRequire["state"] === undefined ||
      updateOriginRequire["state"] === ""
    ) {
      checkPoint += 1;
    }
    if (checkPoint === 3) {
      alert("您似乎没有做出任何更改，请检查后提交"); // 如果没有做出任何更改，则不提交
      return;
    }
    const url =
      process.env.REACT_APP_BACKEND_URL +
      "api/projects/" +
      projectId.toString() +
      "/update-ori-require";
    if (url !== null) {
      // console.log(url);
      // console.log(updateOriginRequire);
      // return;
    }
    Post(
      url,
      updateOriginRequire,
      (res) => {
        console.log(res);
        if (res.code === 200) {
          alert("更新成功");
        } else if (res.code === 400) {
          alert("更新失败，您可能使用了与之前的原始需求重复的名称");
        } else if (res.code === 404) {
          alert("更新失败，可能是因为原始取需求并不存在，请检查后提交");
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
        label="原始需求序号"
        name="originRequireId"
        onChange={handleInputChange}
        autoFocuss
      />
      <TextField
        sx={{ m: 2, mx: "auto", width: 1, borderRadius: 0 }}
        variant="standard"
        fullWidth
        label="新需求名称"
        name="newOriginRequireName"
        onChange={handleInputChange}
        autoFocuss
      />
      <TextField
        sx={{ m: 2, mx: "auto", width: 1, borderRadius: 0 }}
        variant="standard"
        label="新原始需求说明"
        name="newOriginRequireDescription"
        onChange={handleInputChange}
      />
      <FormControl
        sx={{ m: 2, mx: "auto", width: 1, borderRadius: 0 }}
        fullWidth
      >
        <InputLabel id="demo-simple-select-label">新的交付状态</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={newState}
          label="newState"
          onChange={handleNewOriginRequireState}
        >
          <MenuItem value={1}>初始化</MenuItem>
          <MenuItem value={2}>已分解</MenuItem>
          <MenuItem value={3}>进行中</MenuItem>
          <MenuItem value={4}>已交付</MenuItem>
        </Select>
      </FormControl>
      <Button
        sx={{ m: 2, mx: "auto", width: 1, borderRadius: 0 }}
        variant="outlined"
        onClick={updateOriginRequire}
        autoFocus
      >
        确认修改
      </Button>
    </Box>
  );
}
