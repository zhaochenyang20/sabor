import * as React from "react";
import cookie from "react-cookies";
import TextField from "@mui/material/TextField";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Post } from "../../../utils/communication";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import Stack from "@mui/material/Stack";

export default function CreateIteration({ projectIndex }) {
  // createIteration 用于创建迭代
  // const [projectId, setProjectId] = React.useState(undefined);

  const projectId = projectIndex;
  const headers = { Authorization: "Bearer " + cookie.load("token") };
  const [iterationName, setIterationName] = React.useState(undefined);
  const [iterationDescription, setIterationDescription] =
    React.useState(undefined);
  const [iterationDeadline, setIterationDeadline] = React.useState(undefined);
  const [directorUsername, setDirectorUsername] = React.useState(undefined);
  // ! createIteration 的 hook

  const handleInputChange = (event) => {
    event.preventDefault();

    if (event.target.name === "iterationName") {
      setIterationName(event.target.value);
      return;
    }

    if (event.target.name === "iterationDescription") {
      setIterationDescription(event.target.value);
      return;
    }

    if (event.target.name === "directorUsername") {
      setDirectorUsername(event.target.value);
      return;
    }
    // ! createIteration 的 hook
  };

  const createIteration = (event) => {
    // 这个接口用于创建迭代
    event.preventDefault();
    let iterationInfo = {
      name: iterationName,
      description: iterationDescription,
      deadline: iterationDeadline,
      directorUsername: directorUsername,
    };
    if (projectId == 0 || projectId === "" || projectId === undefined) {
      alert("检查项目序号是否合理");
      return;
    }
    if (iterationInfo["name"] === "" || iterationInfo["name"] === undefined) {
      alert("请输入迭代名称");
      return;
    }
    if (
      iterationInfo["description"] === "" ||
      iterationInfo["description"] === undefined
    ) {
      alert("请输入迭代描述");
      return;
    }
    if (
      iterationInfo["directorUsername"] === "" ||
      iterationInfo["directorUsername"] === undefined
    ) {
      alert("请输入迭代负责人");
      return;
    }
    if (
      iterationInfo["deadline"] === null ||
      iterationInfo["deadline"] === undefined
    ) {
      alert("请选择迭代截止时间");
      return;
    }
    var timestamp = Date.parse(new Date());
    var oneDay = 1000 * 60 * 60 * 24; //一天的毫秒数
    timestamp -= oneDay;
    if (iterationInfo["deadline"] <= timestamp) {
      alert("迭代截止时间不得早于当前时间");
      return;
    }
    const url =
      process.env.REACT_APP_BACKEND_URL +
      "api/projects/" +
      projectId.toString() +
      "/create-iter";
    if (url !== null) {
      // console.log(url);
      // console.log(iterationInfo);
      // return;
    }
    Post(
      url,
      iterationInfo,
      (res) => {
        console.log(res);
        if (res.code === 200) {
          alert("创建成功");
        } else if (res.code === 400) {
          if (res.data === "002# Iteration's name check failed") {
            alert("创建失败，可能由于该迭代的名称不符合规定，请检查后提交");
            return;
          }
          if (res.data === "003# Earlier DDL") {
            alert("创建失败，您设置的截止时间早于当前时间");
            return;
          }
          let checkPoint =
            "004# User " +
            iterationInfo["directorUsername"] +
            " does not exist";
          console.log(checkPoint);
          if (res.data == checkPoint) {
            alert("创建失败，该迭代的负责人不存在");
          }
          alert("创建失败，可能是您指定的工程师不存在");
        } else if (res.code === 404) {
          alert("创建失败，该迭代并不存在");
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
        label="迭代需求名称"
        name="iterationName"
        onChange={handleInputChange}
        autoFocuss
      />
      <TextField
        sx={{ m: 2, mx: "auto", width: 1, borderRadius: 0 }}
        variant="standard"
        fullWidth
        required
        label="迭代需求说明"
        name="iterationDescription"
        onChange={handleInputChange}
        autoFocuss
      />
      <TextField
        sx={{ m: 2, mx: "auto", width: 1, borderRadius: 0 }}
        variant="standard"
        fullWidth
        required
        label="迭代负责人"
        name="directorUsername"
        onChange={handleInputChange}
        autoFocuss
      />
      <Stack direction="column">
        <LocalizationProvider
          sx={{ m: 2, mx: "auto", width: 1, borderRadius: 0 }}
          dateAdapter={AdapterDateFns}
        >
          <DatePicker
            label="迭代终止日期"
            sx={{ m: 2, mx: "auto", width: 1, borderRadius: 0 }}
            value={iterationDeadline}
            onChange={(newValue) => {
              const date = new Date(newValue).getTime();
              setIterationDeadline(date);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <Button
          sx={{ m: 2, mx: "auto", width: 1, borderRadius: 0 }}
          variant="outlined"
          onClick={createIteration}
          autoFocus
        >
          确认创建
        </Button>
      </Stack>
    </Box>
  );
}
