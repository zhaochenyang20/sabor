import * as React from "react";
import cookie from "react-cookies";
import TextField from "@mui/material/TextField";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import Button from "@mui/material/Button";
import { Post } from "../../../utils/communication";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";

export default function UpdateIteration({ projectIndex }) {
  // createIteration 用于创建迭代
  // const [projectId, setProjectId] = React.useState(undefined);
  const projectId = projectIndex;
  const headers = { Authorization: "Bearer " + cookie.load("token") };
  const [oldId, setOldId] = React.useState(undefined);
  const [newIterationName, setNewIterationName] = React.useState(undefined);
  const [newIterationDescription, setNewIterationDescription] =
    React.useState(undefined);
  const [newDeadline, setNewDeadline] = React.useState(undefined);
  const [newDirectorUsername, setNewDirectorUsername] =
    React.useState(undefined);
  const [newIterationStatus, setNewIterationStatus] = React.useState(undefined);
  // ! updateIteration 的 hook

  const handleNewStateChange = (event) => {
    setNewIterationStatus(event.target.value);
    console.log(newIterationStatus);
  };

  const handleInputChange = (event) => {
    event.preventDefault();

    // if (event.target.name === "projectId") {
    //   setProjectId(event.target.value);
    //   return;
    // }
    if (event.target.name === "oldId") {
      setOldId(event.target.value);
      return;
    }
    if (event.target.name === "newIterationName") {
      setNewIterationName(event.target.value);
      return;
    }
    if (event.target.name === "newIterationDescription") {
      setNewIterationDescription(event.target.value);
      return;
    }
    if (event.target.name === "newDirectorUsername") {
      setNewDirectorUsername(event.target.value);
      return;
    }
    // ! uopdateIteration 的 hook
  };

  const updateIteration = (event) => {
    // 这个接口用于更新迭代
    event.preventDefault();
    let newIterationInfo = {
      id: new Number(oldId), // 旧的迭代 Id，默认值为 0
      name: newIterationName,
      description: newIterationDescription,
      deadline: newDeadline,
      directorUsername: newDirectorUsername,
      state: new Number(newIterationStatus),
    };
    let checkPoint = 0;
    if (projectId == 0 || projectId === "" || projectId === undefined) {
      alert("检查项目序号是否合理");
      return;
    }
    if (newIterationInfo["id"] === "" || newIterationInfo["id"] === undefined) {
      alert("请输入迭代序号");
      return;
    }
    if (
      newIterationInfo["id"] == 0 ||
      newIterationInfo["id" === ""] ||
      newIterationInfo["id"] === undefined
    ) {
      alert("请输入原始需求 id");
      return;
    }
    // if (
    //   newIterationInfo["id"] == 0 ||
    //   newIterationInfo["id" === ""] ||
    //   newIterationInfo["id"] === undefined
    // ) {
    //   alert("请输入原始需求 id");
    //   return;
    // }
    if (newIterationInfo["id"] < 1) {
      alert("请输入符合标准的原始需求 id");
      return;
    }
    if (newIterationInfo["id"] % 1 !== 0) {
      alert("请输入符合标准的原始需求 id");
      return;
    }
    if (newIterationInfo["name"] === undefined) {
      checkPoint += 1;
    }
    if (newIterationInfo["description"] === undefined) {
      checkPoint += 1;
    }
    if (newIterationInfo["directorUsername"] === undefined) {
      checkPoint += 1;
    }
    if (newIterationInfo["status"] === undefined) {
      checkPoint += 1;
    }
    if (newIterationInfo["deadline"] === undefined) {
      checkPoint += 1;
    }
    if (checkPoint === 5) {
      alert("您似乎未做出任何修改，请检查后提交");
      return;
    }
    var timestamp = Date.parse(new Date());
    var oneDay = 1000 * 60 * 60 * 24; //一天的毫秒数
    timestamp -= oneDay;
    if (
      newIterationInfo["deadline"] !== undefined &&
      newIterationInfo["deadline"] <= timestamp
    ) {
      alert("新的迭代截止时间不得早于当前时间");
      return;
    }
    const url =
      process.env.REACT_APP_BACKEND_URL +
      "api/projects/" +
      projectId.toString() +
      "/create-iter";
    if (url !== null) {
      // console.log(url);
      // console.log(newIterationInfo);
      // return;
    }
    Post(
      url,
      newIterationInfo,
      (res) => {
        console.log(res);
        if (res.code === 200) {
          let id = res.data;
          let info = "修改第" + id.toString() + "迭代信息成功";
          alert(info);
        } else if (res.code === 400) {
          if (res.data === "002# Iteration's name check failed") {
            alert("失败，可能由于该迭代的名称不符合规定，请检查后提交");
            return;
          }
          if (res.data === "003# Earlier DDL") {
            alert("失败，您设置的截止时间早于当前时间");
            return;
          }
          let checkPoint =
            "004# User " +
            newIterationInfo["directorUsername"].toString() +
            " does not exist";
          if (res.data === checkPoint) {
            alert("更新失败，可能是该迭代的负责人不存在");
          }
          alert("更新失败，该迭代的负责人不存在");
        } else if (res.code === 404) {
          alert("修改失败，该迭代并不存在");
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
        label="迭代需求序号"
        name="oldId"
        onChange={handleInputChange}
        autoFocuss
      />
      <TextField
        sx={{ m: 2, mx: "auto", width: 1, borderRadius: 0 }}
        variant="standard"
        fullWidth
        label="迭代需求名称"
        name="newIterationName"
        onChange={handleInputChange}
        autoFocuss
      />
      <TextField
        sx={{ m: 2, mx: "auto", width: 1, borderRadius: 0 }}
        variant="standard"
        fullWidth
        label="完成迭代说明"
        name="newIterationDescription"
        onChange={handleInputChange}
        autoFocuss
      />
      <TextField
        sx={{ m: 2, mx: "auto", width: 1, borderRadius: 0 }}
        variant="standard"
        fullWidth
        label="新迭代说明"
        name="newIterationDescription"
        onChange={handleInputChange}
        autoFocuss
      />
      <TextField
        sx={{ m: 2, mx: "auto", width: 1, borderRadius: 0 }}
        variant="standard"
        fullWidth
        label="新迭代完成人员"
        name="newDirectorUsername"
        onChange={handleInputChange}
        autoFocuss
      />
      <Stack direction="column">
        <LocalizationProvider
          sx={{ m: 2, mx: "auto", width: 1, borderRadius: 0 }}
          variant="standard"
          dateAdapter={AdapterDateFns}
        >
          <DatePicker
            sx={{ m: 2, mx: "auto", width: 1, borderRadius: 0 }}
            label="迭代终止日期"
            value={newDeadline}
            onChange={(newValue) => {
              const date = new Date(newValue).getTime();
              setNewDeadline(date);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <FormControl
          sx={{ m: 2, mx: "auto", width: 1, borderRadius: 0 }}
          variant="standard"
          fullWidth
        >
          <InputLabel id="demo-simple-select-label">新的交付状态</InputLabel>
          <Select
            sx={{ m: 2, mx: "auto", width: 1, borderRadius: 0 }}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={newIterationStatus}
            label="newState"
            onChange={handleNewStateChange}
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
          onClick={updateIteration}
          autoFocus
        >
          确认更新
        </Button>
      </Stack>
    </Box>
  );
}
