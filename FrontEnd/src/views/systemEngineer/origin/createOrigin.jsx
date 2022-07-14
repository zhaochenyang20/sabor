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

export default function CreateOrigin({ projectIndex }) {
  // createOriginRequire 用于创建一个原始需求
  // const [projectId, setProjectId] = React.useState(undefined);
  const projectId = new Number(projectIndex);
  const headers = { Authorization: "Bearer " + cookie.load("token") };
  const [originRequireName, setOriginRequireName] = React.useState(undefined);
  const [originRequireDescription, setOriginRequireDescription] =
    React.useState(undefined);
  const [originRequireState, setOriginRequireState] = React.useState(undefined);
  // ! createOriginRequireState 的 hook

  const handleInputChange = (event) => {
    event.preventDefault();
    // if (event.target.name === "projectId") {
    //   setProjectId(event.target.value);
    //   return;
    // }
    if (event.target.name === "originRequireName") {
      setOriginRequireName(event.target.value);
      return;
    }
    if (event.target.name === "originRequireDescription") {
      setOriginRequireDescription(event.target.value);
      return;
    }
    // ! createOriginRequireState 的 hook
  };

  const handleOriginRequireState = (event) => {
    setOriginRequireState(event.target.value);
    console.log(originRequireState);
  };

  const createOriginRequire = (event) => {
    // 这个接口用于创造原始需求
    event.preventDefault();
    let originRequire = {
      name: originRequireName,
      description: originRequireDescription,
      state: originRequireState, // 1~4: 初始化，已分解，进行中，已交付
    };
    // alert(projectId);
    if (projectId == 0 || projectId === "" || projectId === undefined) {
      alert("检查项目序号是否合理");
      return;
    }
    if (
      originRequire["name"] === "请录入原始需求名称" ||
      originRequire["name"] === "" ||
      originRequire["name"] === undefined
    ) {
      alert("请输入原始需求名称");
      return;
    } else if (
      originRequire["description"] === "请录入原始需求说明" ||
      originRequire["description"] === "" ||
      originRequire["description"] === undefined
    ) {
      alert("请输入原始需求说明");
      return;
    } else if (
      originRequire["state"] === "请设置交付状态" ||
      originRequire["state"] == 0 ||
      originRequire["state"] === undefined
    ) {
      alert("请选择原始需求状态");
      return;
    }
    const url =
      process.env.REACT_APP_BACKEND_URL +
      "api/projects/" +
      projectId.toString() +
      "/create-ori-require";
    if (url !== null) {
      // console.log(url);
      // console.log(originRequire);
      // return;
    }
    Post(
      url,
      originRequire,
      (res) => {
        console.log(res);
        if (res.code == 200) {
          alert("创建成功");
        } else if (res.code == 400) {
          alert("创建失败，您可能使用了与之前的某个原始需求重复的名称");
        } else if (res.code == 404) {
          alert("创建失败，可能是因为该项目并不存在，请检查后提交");
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
        margin="normal"
        required
        fullWidth
        label="原始需求名称"
        name="originRequireName"
        onChange={handleInputChange}
        variant="standard"
        autoFocuss
      />
      <TextField
        sx={{ m: 2, mx: "auto", width: 1, borderRadius: 0 }}
        label="原始需求说明"
        required
        name="originRequireDescription"
        onChange={handleInputChange}
        variant="standard"
      />
      <FormControl
        sx={{ m: 2, mx: "auto", width: 1, borderRadius: 0 }}
        fullWidth
      >
        <InputLabel>交付状态</InputLabel>
        <Select
          value={originRequireState}
          label="state"
          variant="standard"
          onChange={handleOriginRequireState}
        >
          <MenuItem value={1}>初始化</MenuItem>
          <MenuItem value={2}>已分解</MenuItem>
          <MenuItem value={3}>进行中</MenuItem>
          <MenuItem value={4}>已交付</MenuItem>
        </Select>
      </FormControl>
      <Button
        sx={{ m: 2, mx: "auto", width: 1, borderRadius: 0 }}
        onClick={createOriginRequire}
        variant="outlined"
        autoFocus
      >
        确定创建
      </Button>
    </Box>
  );
}
