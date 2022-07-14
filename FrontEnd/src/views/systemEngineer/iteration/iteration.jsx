import * as React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import { Icon } from "@iconify/react";
import { MenuItem } from "@mui/material";
import Container from "@mui/material/Container";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import { Card, Stack, TableContainer, TablePagination } from "@mui/material";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { useState, useEffect, useReducer } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { Post } from "../../../utils/communication";
import cookie from "react-cookies";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import axios from "axios";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import Selection from "../../../components/selection";
import SuccessAlert from "../../../components/successalert";
import FailAlert from "../../../components/failalert";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Row from "../../../components/row";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import getDictionary from "../../../utils/dictionary";
import { useParams } from "react-router-dom";
import { set } from "lodash";
import BindSR from "../../../components/bindsr";
import SRDetail from "../../../components/srdetail";

Iconify.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  sx: PropTypes.object,
};

function Iconify({ icon, sx, ...other }) {
  return <Box component={Icon} icon={icon} sx={{ ...sx }} {...other} />;
}

export default function Iteration() {
  const [addRequirementOpen, setAddRequirementOpen] = useState(false);
  const [iterationName, setIterationName] = React.useState(undefined);
  const [iterationDescription, setIterationDescription] =
    React.useState(undefined);
  let timeStamp = Date.parse(new Date(new Date().setHours(0, 0, 0, 0)));
  const [iterationDeadline, setIterationDeadline] = React.useState(timeStamp);
  const [directorUsername, setDirectorUsername] = React.useState(undefined);
  // ! createIteration 的 hook

  const [oldId, setOldId] = React.useState(undefined);
  const [newIterationName, setNewIterationName] = React.useState(undefined);
  const [newIterationDescription, setNewIterationDescription] =
    React.useState(undefined);
  const [newDeadline, setNewDeadline] = React.useState(timeStamp);
  const [newDirectorUsername, setNewDirectorUsername] =
    React.useState(undefined);
  const [newIterationStatus, setNewIterationStatus] = React.useState(undefined);
  // ! updateIteration 的 hook

  const [deleteRequirementOpen, setDeleteRequirementOpen] =
    React.useState(false);
  // ! deleteOriginRequire 的 hook

  const [functionalRequirementId, setFunctionalRequirementId] =
    React.useState(undefined);
  const [newFunctionName, setNewFunctionalName] = React.useState(undefined);
  const [newFunctionDescription, setNewFunctionalDescription] =
    React.useState(undefined);
  const [newFunctionalState, setNewFucntionalState] = React.useState(undefined);
  const [newSystemServiceId, setNewSystemServiceId] = React.useState(undefined);
  const [newIterationId, setNewIterationId] = React.useState(undefined);
  const [newDeveloperId, setNewDeveloperId] = React.useState(undefined);
  //! 修改功能需求的 hook

  const [fullIterationList, setFullIterationList] = useState([]);
  const [functionalDict, setFunctionalDict] = useState([]);
  const [loadOriginFinished, setLoadOriginFinished] = React.useState(false);
  const [loadFunctionStarted, setLoadFunctionStarted] = useState(false);
  const [loadMiscStatus, setLoadMiscStatus] = useState(false);

  const { projectIndex } = useParams();
  const projectId = projectIndex;
  const headers = { Authorization: "Bearer " + cookie.load("token") };
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [modifyDialogOpen, setModifyDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [dialogId, setDialogId] = useState(0);
  //! 这个 dialogId 在需求管理中实际上是 IR 序号

  const [modifyRequirementOpen, setModifyRequirementOpen] = useState(false);
  const [functionId, setFunctionId] = useState(0);
  const [functionalName, setFunctionalName] = useState(undefined);
  const [originRequirementId, setOriginRequirementId] = useState(undefined);
  const [functionalDescription, setFunctionalDescription] = useState(undefined);
  //! 传递给子组件，用来设置功能需求

  const [systemServiceId, setSystemServiceId] = useState(undefined);
  const [developerId, setDeveloperId] = useState(undefined);
  const [createDate, setCreateDate] = useState(undefined);
  const [deliveryIterationId, setDeliveryIterationId] = useState(undefined);
  const [description, setDescription] = useState(undefined);
  const [functionDeveloperId, setFunctionDeveloperId] = useState(undefined);
  const [distributorId, setDistributorId] = useState(undefined);
  const [id, setId] = useState(undefined);
  const [name, setName] = useState(undefined);
  const [functionOriginalRequirementId, setFunctionOriginalRequirementId] =
    useState(undefined);
  const [functionProjectId, setFunctionProjectId] = useState(undefined);
  const [functionState, setFunctionState] = useState(undefined);
  const [updateDate, setUpdateDate] = useState(undefined);
  const [functionInfoOpen, setFunctionInfoOpen] = useState(false);
  //! 查看功能详情的 hook

  const [originRequireList, setOriginRequireList] = useState([]);
  const [deleteIterationId, setDeleIterationId] = useState(undefined);

  const [successToastOpen, setSuccessToastOpen] = useState(false);
  const [failToastOpen, setFailToastOpen] = useState(false);
  const [info, setInfo] = useState(undefined);
  const [isCreate, setIsCreate] = useState(false);

  //let userList = [];
  //let devloperNameList = [];
  const [userList, setUserList] = useState([]);
  const [devloperList, setDevloperList] = useState([]);
  const [systemList, setSystemList] = useState([]);

  //let infoDict = getDictionary(projectId);
  //let DevloperDict = infoDict.devloperDict;

  const handleSuccessAlertClose = () => {
    setSuccessToastOpen(false);
    if (isCreate) {
      //window.location.reload();
      setIsCreate(false);
    }
  };

  function getSystemList() {
    const url =
      process.env.REACT_APP_BACKEND_URL +
      "api/projects/" +
      projectId +
      "/find-all-sys-serv";
    return axios.get(url, { headers }).then((response) => {
      let tmpList = [];
      for (let i = 0; i < response.data.data.length; i++) {
        let tmp = {
          id: response.data.data[i].id,
          name: response.data.data[i].name,
        };
        tmpList.push(tmp);
      }
      setSystemList(tmpList);
    });
  }

  /*
  function getUserList() {
    const url = process.env.REACT_APP_BACKEND_URL + "api/users/find";
    return axios
      .get(url, { headers })
      .then((response) => {
        userList = response.data.data;
        getDeveloperList();
      })
      .catch((error) => {
        console.log("error is : " + error);
      });
  }

  function getMetalist() {
    const url =
      process.env.REACT_APP_BACKEND_URL +
      "api/projects/" +
      projectId +
      "/find-one";
    return axios
      .get(url, { headers })
      .then((response) => {
        devloperNameList = response.data.data.developmentEngineers;
        getUserList();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function getDeveloperList() {
    let tempList = [];
    for (let i = 0; i < userList.length; i++) {
      if (devloperNameList.indexOf(userList[i].username) !== -1) {
        let temp = {
          id: userList[i].id,
          name: userList[i].username,
        };
        tempList.push(temp);
      }
    }
    setDevloperList(tempList);
    }
    */

  async function getMetalist() {
    let tmpUserList = [];
    let tmpDevList = [];
    axios
      .get(
        new URL(
          `/api/projects/${projectId}/find-one`,
          process.env.REACT_APP_BACKEND_URL
        ).toString(),
        { headers }
      )
      .then((response) => {
        tmpDevList = response.data.data.developmentEngineers;
        return axios.get(
          new URL(
            "/api/users/find",
            process.env.REACT_APP_BACKEND_URL
          ).toString(),
          { headers }
        );
      })
      .then((response) => {
        tmpUserList = response.data.data;
        setUserList(tmpUserList);
        setDevloperList(
          tmpUserList.filter((x) => tmpDevList.includes(x.username))
        );
      })

      .catch((error) => {
        console.log(error);
      });
  }

  const handleFailAlertClose = () => {
    setFailToastOpen(false);
  };

  function getIrlist() {
    const url =
      process.env.REACT_APP_BACKEND_URL +
      "api/projects/" +
      projectId +
      "/find-all-ori-require";
    return axios
      .get(url, { headers })
      .then((response) => {
        console.log("response.data.data");
        console.log(response.data.data);
        setOriginRequireList(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  //! 获得原始需求列表
  function getRequirementList() {
    const url =
      process.env.REACT_APP_BACKEND_URL +
      "api/projects/" +
      projectId.toString() +
      "/find-all-iter";
    return axios
      .get(url, { headers })
      .then((response) => {
        setFullIterationList(response.data.data);
        setLoadOriginFinished(true);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  //! 获得功能需求字典
  function getFunctionDict() {
    return;
    /*
    return Promise.allSettled(
      fullIterationList.map((requirement) => {
        const functional_url =
          process.env.REACT_APP_BACKEND_URL +
          "api/projects/" +
          projectId +
          "/find-all-func-require/iter/" +
          requirement.id.toString();
        return axios.get(functional_url, { headers });
      })
    ).then((response) => {
      setLoadFunctionStarted(true);
      let tempDict = new Array();
      for (let index in response) {
        for (let functionIndex in response[index].value.data.data) {
          //! response[index].value.data.data[functionIndex] 是每个单独的 SR
          //! 记录着 projectId 和 originRequirementId
          let originRequirementId =
            response[index].value.data.data[functionIndex].deliveryIterationId;
          if (tempDict[originRequirementId] === undefined) {
            tempDict[originRequirementId] = new Array();
            tempDict[originRequirementId.toString()].push(
              response[index].value.data.data[functionIndex]
            );
          } else {
            tempDict[originRequirementId.toString()].push(
              response[index].value.data.data[functionIndex]
            );
          }
        }
      }
      setFunctionalDict(tempDict);
      });
      */
  }

  const handleNewStateChange = (event) => {
    setNewIterationStatus(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddDialogCancelClose = () => {
    setFunctionalName(undefined);
    setFunctionalDescription(undefined);
    setSystemServiceId(undefined);
    setDeveloperId(undefined);
    setOriginRequirementId(undefined);
    setAddDialogOpen(false);
  };

  const handleAddOriginRequirementAcceptClose = () => {
    setAddRequirementOpen(true);
  };

  const handleAddOriginRequirementCancelClose = () => {
    setIterationName(undefined);
    setIterationDescription(undefined);
    setDirectorUsername(undefined);
    setAddRequirementOpen(false);
    setNewDeveloperId(undefined);
  };

  const handleModifyOriginRequirementCancelClose = () => {
    setOldId(undefined);
    setNewIterationStatus(undefined);
    setNewIterationName(undefined);
    setNewIterationDescription(undefined);
    setNewDeadline(undefined);
    setNewDirectorUsername(undefined);
    setModifyRequirementOpen(false);
    setNewDeveloperId(undefined);
  };

  const handleModifyDialogCancelClose = () => {
    setNewFunctionalName(undefined);
    setNewFunctionalDescription(undefined);
    setNewFucntionalState(undefined);
    setNewSystemServiceId(undefined);
    setNewIterationId(undefined);
    setNewDeveloperId(undefined);
    setModifyDialogOpen(false);
  };

  const showAlert = (message) => {
    setInfo(message);
    setFailToastOpen(true);
  };

  const handleAddDialogAcceptClose = (originalId, functionalId) => {
    setAddDialogOpen(false);
    event.preventDefault();
    const url =
      process.env.REACT_APP_BACKEND_URL +
      "api/projects/" +
      projectId.toString() +
      "/create-func-require";
    let Body = {
      id: functionalId,
      iterationId: dialogId,
    };
    setFunctionalName(undefined);
    setFunctionalDescription(undefined);
    setSystemServiceId(undefined);
    setDeveloperId(undefined);
    setOriginRequirementId(undefined);
    /*
    if (Body["name"] === "" || Body["name"] === undefined) {
      setInfo("请输入功能需求名称");
      setFailToastOpen(true);
      return;
    }
    if (
      Body["originalRequirementId"] === undefined ||
      Body["originalRequirementId"] === "" ||
      Body["originalRequirementId"] === null
    ) {
      setInfo("请选择原始需求");
      setFailToastOpen(true);
      return;
    }
    if (Body["description"] === "" || Body["description"] === undefined) {
      setInfo("请输入功能需求说明");
      setFailToastOpen(true);
      return;
      }
      */
    axios
      .post(url, Body, { headers })
      .then((response) => {
        let res = response.data;
        if (res.code === 200) {
          getRequirementList();
          getFunctionDict();
          setInfo("添加成功");
          setIsCreate(true);
          setSuccessToastOpen(true);
        } else {
          setInfo("添加失败，请稍后重试");
          setFailToastOpen(true);
        }
      })
      .catch((err) => {
        let res = err.response;
        if (res && res.status === 400) {
          let message = res.data.data;
          if (/^001#/.test(message) || /^007#/.test(message)) {
            showAlert("创建失败，功能需求名称不合法");
            return;
          } else if (/^009#/.test(message)) {
            showAlert("创建失败，功能需求名称与已有重复");
            return;
          }
        }
        showAlert("添加失败，请稍后重试");
      });
  };

  const convertEmpty = (content) => (content === "" ? undefined : content);

  const handleModifyDialogAcceptClose = () => {
    setModifyDialogOpen(false);
    // //! 修改功能需求的 hook
    event.preventDefault();
    let Body = {
      id: functionId, // 注意，这里是某个 orgginRequire 的 id，不是 url 里的 projectId
      name: convertEmpty(newFunctionName), // 某个功能需求的新名称
      description: convertEmpty(newFunctionDescription), // 某个功能需求的新描述
      state: newFunctionalState, // 1~4: 初始化，已分解，进行中，已交付
      systemServiceId: newSystemServiceId, // 某个功能需求的新系统服务
      iterationId: newIterationId, // 某个功能需求的新迭代
      developerId: newDeveloperId, // 某个功能需求的新开发者
    };
    setNewFunctionalName(undefined);
    setNewFunctionalDescription(undefined);
    setNewFucntionalState(undefined);
    setNewSystemServiceId(undefined);
    setNewIterationId(undefined);
    setNewDeveloperId(undefined);
    if (projectId == 0 || projectId === "" || projectId === undefined) {
      setInfo("检查项目序号是否合理");
      setFailToastOpen(true);
      return;
    }
    let checkPoint = 0;
    if (
      //Body["name"] === "请输入原始需求的新名称" ||
      Body["name"] === "" ||
      Body["name"] === undefined
    ) {
      checkPoint += 1;
    }
    if (
      //Body["description"] === "请输入原始需求的新说明" ||
      Body["description"] === "" ||
      Body["description"] === undefined
    ) {
      checkPoint += 1;
    }
    if (
      //Body["systemServiceId"] === "请输入原始需求的新交付状态" ||
      Body["systemServiceId"] == 0 ||
      Body["systemServiceId"] === undefined ||
      Body["systemServiceId"] === ""
    ) {
      checkPoint += 1;
    }
    if (
      //Body["developerId"] === "请输入原始需求的新交付状态" ||
      Body["developerId"] == 0 ||
      Body["developerId"] === undefined ||
      Body["developerId"] === ""
    ) {
      checkPoint += 1;
    }
    if (
      //Body["iterationId"] === "请输入原始需求的新交付状态" ||
      Body["iterationId"] == 0 ||
      Body["iterationId"] === undefined ||
      Body["iterationId"] === ""
    ) {
      checkPoint += 1;
    }
    if (
      //Body["state"] === "请输入原始需求的新交付状态" ||
      Body["state"] == 0 ||
      Body["state"] === undefined ||
      Body["state"] === ""
    ) {
      checkPoint += 1;
    }
    if (checkPoint === 6) {
      setInfo("您似乎没有做出任何更改，请检查后提交"); // 如果没有做出任何更改，则不提交
      setFailToastOpen(true);
      return;
    }
    const url =
      process.env.REACT_APP_BACKEND_URL +
      "api/projects/" +
      projectId.toString() +
      "/create-func-require";
    axios
      .post(url, Body, { headers })
      .then((response) => {
        let res = response.data;
        if (res.code === 200) {
          getRequirementList();
          getFunctionDict();
          forceUpdate();

          setInfo("更新成功");
          setSuccessToastOpen(true);
        } else {
          showAlert("更新失败，请稍后重试");
        } /*else if (res.code === 403) {
          setInfo("更新失败，您输入的开发工程师序号有误");
          setFailToastOpen(true);
        } else if (res.code === 400) {
          setInfo("更新失败，您输入的功能服务名称不符合规范");
          setFailToastOpen(true);
        } else if (res.code === 404) {
          setInfo("更新失败，您的可选信息填写错误，请检查后重新提交");
          setFailToastOpen(true);
        } else {
          setInfo("创建失败，可能是由于您不是系统工程师");
          setFailToastOpen(true);
        }*/
        //setLoadOriginFinished(false);
        //setLoadFunctionStarted(true);
      })
      .catch((err) => {
        let res = err.response;
        if (res && res.status === 400) {
          let message = res.data.data;
          if (/^001#/.test(message) || /^007#/.test(message)) {
            showAlert("更新失败，功能需求名称不合法");
            return;
          } else if (/^009#/.test(message)) {
            showAlert("更新失败，功能需求名称与已有重复");
            return;
          }
        }
        showAlert("更新失败，请稍后重试");
      });
    //setLoadOriginFinished(false);
    //! TODO: 这里应该更新原始需求列表
    forceUpdate();
    //setLoadFunctionStarted(true);
  };

  const handleDeleteDialogAcceptClose = () => {
    setDeleteDialogOpen(false);
    let Body = {
      id: functionId,
      iterationId: 0,
    };
    setFunctionId(undefined);
    const url =
      process.env.REACT_APP_BACKEND_URL +
      "api/projects/" +
      projectId.toString() +
      "/create-func-require";
    axios
      .post(url, Body, { headers })
      .then((response) => {
        let res = response.data;
        if (res.code === 200) {
          getRequirementList();
          getFunctionDict();
          setInfo("删除成功");
          setSuccessToastOpen(true);
        } else {
          setInfo("删除失败，请稍后重试");
          setFailToastOpen(true);
        }
        //getFunctionDict();
        forceUpdate();
      })
      .catch(() => {
        setInfo("删除失败，请稍后重试");
        setFailToastOpen(true);
      });
    //setLoadOriginFinished(false);
    //! TODO: 这里应该更新原始需求列表
    //setLoadFunctionStarted(true);
    //! TODO: 获得删除信息
  };

  const handleDeleteDialogCancelClose = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteOriginRequirementCancelClose = () => {
    setDeleIterationId(undefined);
    setDeleteRequirementOpen(false);
  };

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

    //! 修改迭代的 hook
  };

  const handleNewFunctionalRequireState = (event) => {
    setNewFucntionalState(event.target.value);
  };

  const findDeveloper = () => {
    let res = devloperList.find((ele) => ele.id === newDeveloperId);
    return res && res.username;
  };
  //! TODO: 迭代的 CURD

  const createIteration = (event) => {
    // 这个接口用于创建迭代
    event.preventDefault();
    setAddRequirementOpen(false);
    console.log(iterationDeadline);
    let date = new Date(iterationDeadline).setHours(0, 0, 0, 0);
    let oneDayMs = 1000 * 60 * 60 * 24; //一天的毫秒数
    let todayDDL = date + oneDayMs - 1;

    let iterationInfo = {
      name: iterationName,
      description: iterationDescription,
      deadline: todayDDL,
      //directorUsername: DevloperDict[newDeveloperId],
      directorUsername: findDeveloper(),
    };
    setIterationName(undefined);
    setIterationDescription(undefined);
    setNewDeveloperId(undefined);

    if (projectId == 0 || projectId === "" || projectId === undefined) {
      setInfo("检查项目序号是否合理");
      setFailToastOpen(true);
      return;
    }
    if (iterationInfo["name"] === "" || iterationInfo["name"] === undefined) {
      setInfo("请输入迭代名称");
      setFailToastOpen(true);
      return;
    }
    if (
      iterationInfo["description"] === "" ||
      iterationInfo["description"] === undefined
    ) {
      setInfo("请输入迭代说明");
      setFailToastOpen(true);
      return;
    }
    if (
      iterationInfo["directorUsername"] === "" ||
      iterationInfo["directorUsername"] === undefined
    ) {
      setInfo("请选择负责人");
      setFailToastOpen(true);
      return;
    }
    if (
      iterationInfo["deadline"] === null ||
      iterationInfo["deadline"] === undefined ||
      isNaN(iterationInfo["deadline"])
    ) {
      setInfo("请选择迭代截止时间");
      setFailToastOpen(true);
      return;
    }
    var timestamp = Date.parse(new Date());
    var oneDay = 1000 * 60 * 60 * 24; //一天的毫秒数
    timestamp -= oneDay;
    if (iterationInfo["deadline"] <= timestamp) {
      setInfo("迭代截止时间不得早于当前时间");
      setFailToastOpen(true);
      return;
    }
    const url =
      process.env.REACT_APP_BACKEND_URL +
      "api/projects/" +
      projectId.toString() +
      "/create-iter";
    Post(
      url,
      iterationInfo,
      (ret) => {
        let res = ret.code;
        if (res === 200) {
          getRequirementList();
          setInfo("创建成功");
          setIsCreate(true);
          setSuccessToastOpen(true);
        } else if (res === 400) {
          let info = ret.data;
          if (info.data === "002# Iteration's name check failed") {
            setInfo("创建失败，迭代名称不合法");
            setFailToastOpen(true);
            return;
          }
          if (info.data == "003# Earlier DDL") {
            setInfo("创建失败，截止时间早于当前时间");
            setFailToastOpen(true);
            return;
          }
          let checkPoint =
            "004# User " +
            iterationInfo["directorUsername"] +
            " does not exist";
          if (info.data == checkPoint) {
            setInfo("创建失败，该迭代的负责人不存在");
            setFailToastOpen(true);
            return;
          }
          if (/^006#/.test(info.data)) {
            setInfo("创建失败，迭代名称与其它迭代重复");
            setFailToastOpen(true);
            return;
          }
          setInfo("创建失败，请稍后重试");
          setFailToastOpen(true);
        } else {
          setInfo("创建失败，请稍后重试");
          setFailToastOpen(true);
        }
      },
      headers
    );
    //setLoadOriginFinished(false);
    //forceUpdate();
    //! TODO: 这里应该更新原始需求列表
    //setLoadFunctionStarted(true);
  };

  // Sync Deadline with id
  useEffect(() => {
    const iter = fullIterationList.find((ele) => ele.id === oldId);
    if (iter && iter.deadline) {
      setNewDeadline(iter.deadline);
    }
  }, [oldId]);

  const updateIteration = (event) => {
    // 这个接口用于更新迭代
    event.preventDefault();
    setModifyRequirementOpen(false);
    let date = new Date(newDeadline).setHours(0, 0, 0, 0);
    let oneDayMs = 1000 * 60 * 60 * 24; //一天的毫秒数
    var todayDDL = date + oneDayMs - 1;

    let newIterationInfo = {
      id: oldId, // 旧的迭代 Id，默认值为 0
      name: convertEmpty(newIterationName),
      description: convertEmpty(newIterationDescription),
      deadline: todayDDL,
      directorUsername: findDeveloper(),

      state: newIterationStatus,
    };
    setOldId(undefined);
    setNewIterationName(undefined);
    setNewIterationDescription(undefined);
    setNewDirectorUsername(undefined);
    setNewIterationStatus(undefined);
    setNewDeveloperId(undefined);
    console.log("newIterationInfo");
    console.log(newIterationInfo);
    let checkPoint = 0;
    if (projectId == 0 || projectId === "" || projectId === undefined) {
      setInfo("更新失败");
      setFailToastOpen(true);
      return;
    }
    if (newIterationInfo["id"] === "" || newIterationInfo["id"] === undefined) {
      setInfo("请输入迭代序号");
      setFailToastOpen(true);
      return;
    }
    if (
      newIterationInfo["id"] === 0 ||
      newIterationInfo["id"] === "" ||
      newIterationInfo["id"] === undefined
    ) {
      setInfo("更新失败");
      setFailToastOpen(true);
      return;
    }
    if (newIterationInfo["id"] < 1) {
      setInfo("更新失败");
      console.log("请输入符合标准的原始需求 id");
      setFailToastOpen(true);
      return;
    }
    if (newIterationInfo["id"] % 1 !== 0) {
      setInfo("更新失败");
      console.log("请输入符合标准的原始需求 id");
      setFailToastOpen(true);
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
    if (
      newIterationInfo["deadline"] === undefined ||
      isNaN(newIterationInfo["deadline"])
    ) {
      checkPoint += 1;
    }
    if (checkPoint === 4) {
      setInfo("您似乎未做出任何修改");
      setFailToastOpen(true);
      return;
    }
    var timestamp = Date.parse(new Date());
    var oneDay = 1000 * 60 * 60 * 24; //一天的毫秒数
    timestamp -= oneDay;
    if (
      newIterationInfo["deadline"] !== undefined &&
      newIterationInfo["deadline"] <= timestamp
    ) {
      setInfo("新的迭代截止时间不得早于当前时间");
      setFailToastOpen(true);
      return;
    }
    const url =
      process.env.REACT_APP_BACKEND_URL +
      "api/projects/" +
      projectId.toString() +
      "/create-iter";
    Post(
      url,
      newIterationInfo,
      (ret) => {
        let res = ret.code;
        if (res === 200) {
          let info = "更新成功";
          getRequirementList();
          setInfo(info);
          setSuccessToastOpen(true);
        } else if (res === 400) {
          let info = ret.data;
          if (info.data === "002# Iteration's name check failed") {
            setInfo("更新失败，迭代名称不合法");
            setFailToastOpen(true);
            return;
          }
          if (info.data === "003# Earlier DDL") {
            setInfo("更新失败，迭代截止时间早于当前时间");
            setFailToastOpen(true);
            return;
          }

          if (/^004#/.test(info.data)) {
            setInfo("更新失败，可能是该迭代的负责人不存在");
            setFailToastOpen(true);
          }
          if (/^006#/.test(info.data)) {
            setInfo("更新失败，迭代名称与其它迭代重复");
            setFailToastOpen(true);
            return;
          }

          setInfo("更新失败，请稍后重试");
          setFailToastOpen(true);
        } else if (res === 404) {
          setInfo("更新失败，该迭代并不存在");
          setFailToastOpen(true);
        } else {
          setInfo("更新失败，请稍后重试");
          setFailToastOpen(true);
        }
      },
      headers
    );
    //setLoadOriginFinished(false);
    forceUpdate();
    //! TODO: 这里应该更新原始需求列表
    //setLoadFunctionStarted(true);
  };

  const deleteIteration = (event) => {
    //! TODO: 删除迭代
    setDeleteRequirementOpen(false);
    event.preventDefault();
    let url =
      process.env.REACT_APP_BACKEND_URL +
      "api/projects/" +
      projectId.toString() +
      "/delete-iter";
    let Body = {
      id: deleteIterationId,
    };
    Post(
      url,
      Body,
      (res) => {
        if (res.code === 200) {
          getRequirementList();
          setInfo("删除成功");
          setSuccessToastOpen(true);
        } else {
          setInfo("删除失败，请稍后重试");
          setFailToastOpen(true);
        }
      },
      headers
    );
    //! TODO: 获得删除信息
    //setLoadOriginFinished(false);
    //! TODO: 这里应该更新原始需求列表
    //forceUpdate();
    //setLoadFunctionStarted(true);
  };

  useEffect(() => {
    if (!loadOriginFinished) {
      getRequirementList();
    }
    if (loadOriginFinished && !loadFunctionStarted) {
      setLoadFunctionStarted(true);
      getFunctionDict();
    }
  }, [loadOriginFinished, loadFunctionStarted]);

  useEffect(() => {
    if (!loadMiscStatus) {
      getIrlist();
      getMetalist();
      getSystemList();
      setLoadMiscStatus(true);
    }
  }, [loadMiscStatus]);

  const handleInfoClose = () => {
    setFunctionInfoOpen(false);
  };

  let display = {
    name: name,
    description: description,
    functionState: functionState,
    createDate: createDate,
    updateDate: updateDate,
    functionProjectId: functionProjectId,
    functionOriginalRequirementId: functionOriginalRequirementId,
    deliveryIterationId: deliveryIterationId,
    functionDeveloperId: functionDeveloperId,
    distributorId: distributorId,
  };

  if (name === "" || name === undefined) {
    display.name = "请等待信息更新";
  }
  if (description === "" || description === undefined) {
    display.description = "请等待信息更新";
  }
  if (functionState === "" || functionState === undefined) {
    display.functionState = "请等待信息更新";
  }
  if (createDate === "" || createDate === undefined) {
    display.createDate = "请等待信息更新";
  }
  if (updateDate === "" || updateDate === undefined) {
    display.updateDate = "请等待信息更新";
  }
  if (functionProjectId === "" || functionProjectId === undefined) {
    display.functionProjectId = "请等待信息更新";
  }
  if (
    functionOriginalRequirementId === "" ||
    functionOriginalRequirementId === undefined
  ) {
    display.functionOriginalRequirementId = "请等待信息更新";
  }
  if (deliveryIterationId === "" || deliveryIterationId === undefined) {
    display.deliveryIterationId = "请等待信息更新";
  }
  if (functionDeveloperId === "" || functionDeveloperId === undefined) {
    display.functionDeveloperId = "请等待信息更新";
  }
  if (distributorId === "" || distributorId === undefined) {
    display.distributorId = "请等待信息更新";
  }

  let infoDict = {
    devloperDict: devloperList,
    iterationDict: fullIterationList,
    originRequireDict: originRequireList,
    userDict: userList,
    system: systemList,
  };

  return (
    <Box>
      <Box
        sx={{
          bgcolor: "background.paper",
          width: 1,
        }}
      >
        <Container>
          <Card>
            <TableContainer component={Paper}>
              <Table sx={{ width: 1 }}>
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell>迭代名称</TableCell>
                    <TableCell>迭代说明</TableCell>
                    <TableCell>迭代负责人</TableCell>
                    <TableCell>迭代截止时间</TableCell>
                    <TableCell align="center">
                      <AddCircleOutlineIcon
                        aria-label="add"
                        onClick={handleAddOriginRequirementAcceptClose}
                      />
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fullIterationList
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((requirement) => {
                      let tmp = JSON.stringify(
                        functionalDict[requirement.id.toString()]
                      );

                      return (
                        <Row
                          key={requirement.id}
                          functionalList={tmp}
                          requirement={requirement}
                          projectId={projectId}
                          setFunctionalRequirementId={
                            setFunctionalRequirementId
                          }
                          // * 增删查改
                          setAddDialogOpen={setAddDialogOpen}
                          setModifyDialogOpen={setModifyDialogOpen}
                          setDeleteDialogOpen={setDeleteDialogOpen}
                          setDialogId={setDialogId}
                          //! dialogId 是原始需求的序号
                          setFunctionId={setFunctionId}
                          //! functionId 是功能需求的序号

                          setCreateDate={setCreateDate}
                          setDeliveryIterationId={setDeliveryIterationId}
                          setDescription={setDescription}
                          setFunctionDeveloperId={setFunctionDeveloperId}
                          setDistributorId={setDistributorId}
                          setId={setId}
                          setName={setName}
                          setFunctionOriginalRequirementId={
                            setFunctionOriginalRequirementId
                          }
                          setFunctionProjectId={setFunctionProjectId}
                          setFunctionState={setFunctionState}
                          setUpdateDate={setUpdateDate}
                          setFunctionInfoOpen={setFunctionInfoOpen}
                          //! 查看 functionalRequirementId 的功能详情

                          setOldId={setOldId}
                          setDeleIterationId={setDeleIterationId}
                          setModifyRequirementOpen={setModifyRequirementOpen}
                          setDeleteRequirementOpen={setDeleteRequirementOpen}
                          displayKey={3}
                          infoDict={infoDict}
                        />
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={fullIterationList.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
          <Stack
            sx={{ pt: 4 }}
            direction="row"
            spacing={2}
            justifyContent="center"
          ></Stack>
        </Container>
      </Box>

      <Dialog open={addRequirementOpen}>
        <DialogTitle> 添加迭代 </DialogTitle>
        <DialogContent>
          <TextField
            sx={{ m: 2, mx: "auto", width: 1, borderRadius: 0 }}
            required
            fullWidth
            label="迭代名称"
            name="iterationName"
            onChange={handleInputChange}
            autoFocuss
          />
          <TextField
            sx={{ m: 2, mx: "auto", width: 1, borderRadius: 0 }}
            fullWidth
            required
            label="迭代说明"
            name="iterationDescription"
            onChange={handleInputChange}
            autoFocuss
          />
          <Stack direction="column">
            <LocalizationProvider
              variant="standard"
              sx={{ mx: "auto", width: 1, borderRadius: 0 }}
              dateAdapter={AdapterDateFns}
            >
              <DatePicker
                label="迭代截止时间"
                variant="standard"
                sx={{ mx: "auto", width: 1, borderRadius: 0 }}
                value={iterationDeadline}
                onChange={(newValue) => {
                  setIterationDeadline(newValue);
                }}
                renderInput={(params) => (
                  <TextField required margin="normal" {...params} />
                )}
              />
            </LocalizationProvider>
          </Stack>
          <Selection
            originRequireList={devloperList.map((ele) => {
              return { name: ele.username, id: ele.id };
            })}
            required
            id={newDeveloperId}
            setId={setNewDeveloperId}
            description={"迭代负责人"}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddOriginRequirementCancelClose}>取消</Button>
          <Button onClick={createIteration}> 确定 </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={modifyRequirementOpen}>
        <DialogTitle> 修改迭代信息 </DialogTitle>
        <DialogContent>
          <Alert severity="info">如果不想修改某一项，留空即可</Alert>
          <TextField
            sx={{ m: 2, mx: "auto", width: 1, borderRadius: 0 }}
            fullWidth
            label="新迭代名称"
            name="newIterationName"
            onChange={handleInputChange}
            autoFocuss
          />
          <TextField
            sx={{ m: 2, mx: "auto", width: 1, borderRadius: 0 }}
            fullWidth
            label="新迭代说明"
            name="newIterationDescription"
            onChange={handleInputChange}
            autoFocuss
          />
          <Stack direction="column">
            <LocalizationProvider
              sx={{ mx: "auto", width: 1, borderRadius: 0 }}
              dateAdapter={AdapterDateFns}
            >
              <DatePicker
                sx={{ mx: "auto", width: 1, borderRadius: 0 }}
                label="新迭代截止时间"
                value={newDeadline}
                onChange={(newValue) => {
                  setNewDeadline(newValue);
                }}
                renderInput={(params) => (
                  <TextField margin="normal" {...params} />
                )}
              />
            </LocalizationProvider>
            {/*
            <FormControl
              sx={{ m: 2, mx: "auto", width: 1, borderRadius: 0 }}
              fullWidth
            >
              <InputLabel id="demo-simple-select-label">新交付状态</InputLabel>
              <Select
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
               */}
          </Stack>
          <Selection
            originRequireList={devloperList.map((ele) => {
              return { name: ele.username, id: ele.id };
            })}
            id={newDeveloperId}
            setId={setNewDeveloperId}
            description={"新迭代负责人"}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModifyOriginRequirementCancelClose}>
            取消
          </Button>
          <Button onClick={updateIteration}> 确定 </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteRequirementOpen}>
        <DialogTitle>删除迭代</DialogTitle>
        <DialogContent>
          <Alert severity="error">
            <AlertTitle>WARNING!!!</AlertTitle>
            警告 — <strong>删除操作不可逆，请确定是否删除</strong>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteOriginRequirementCancelClose}>
            取消
          </Button>
          <Button onClick={deleteIteration}>确定</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialogOpen}>
        <DialogTitle> 删除当前功能需求 </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            是否将该功能需求移除当前迭代？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogCancelClose}> 取消 </Button>
          <Button onClick={handleDeleteDialogAcceptClose}> 确定 </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={modifyDialogOpen}>
        <DialogTitle> 修改功能需求 </DialogTitle>
        <DialogContent Content>
          <Alert severity="info">如果不想修改某一项，留空即可</Alert>
          <TextField
            margin="normal"
            fullWidth
            id="filled-basic"
            label="新功能需求名称"
            onChange={(event) => setNewFunctionalName(event.target.value)}
          ></TextField>
          <TextField
            margin="normal"
            fullWidth
            id="filled-basic"
            label="新功能需求说明"
            onChange={(event) =>
              setNewFunctionalDescription(event.target.value)
            }
          ></TextField>
          <FormControl
            margin="normal"
            sx={{ mx: "auto", width: 1, borderRadius: 0 }}
            fullWidth
          >
            <InputLabel>新交付状态</InputLabel>
            <Select
              value={newFunctionalState}
              label="state"
              onChange={handleNewFunctionalRequireState}
            >
              <MenuItem value={1}>初始化</MenuItem>
              <MenuItem value={2}>进行中</MenuItem>
              <MenuItem value={3}>已交付</MenuItem>
            </Select>
          </FormControl>
          <Selection
            originRequireList={systemList}
            id={newSystemServiceId}
            setId={setNewSystemServiceId}
            description={"新系统服务"}
          />
          <Selection
            originRequireList={devloperList.map((ele) => {
              return { name: ele.username, id: ele.id };
            })}
            id={newDeveloperId}
            setId={setNewDeveloperId}
            description={"新开发工程师"}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModifyDialogCancelClose}> 取消 </Button>
          <Button onClick={handleModifyDialogAcceptClose}> 确定 </Button>
        </DialogActions>
      </Dialog>
      {/*
      <Dialog open={addDialogOpen}>
        <DialogTitle> 为当前迭代添加功能需求 </DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            required
            fullWidth
            id="filled-basic"
            label="功能需求名称"
            onChange={(event) => setFunctionalName(event.target.value)}
          ></TextField>
          <TextField
            margin="normal"
            required
            fullWidth
            id="filled-basic"
            label="功能需求说明"
            onChange={(event) => setFunctionalDescription(event.target.value)}
          ></TextField>
          <Selection
            originRequireList={originRequireList}
            id={originRequirementId}
            setId={setOriginRequirementId}
            required
            description={"选择原始需求"}
          />
          <Selection
            originRequireList={devloperList.map((ele) => {
              return { name: ele.username, id: ele.id };
            })}
            id={developerId}
            setId={setDeveloperId}
            description={"选择开发工程师"}
          />
          <Selection
            originRequireList={systemList}
            id={systemServiceId}
            setId={setSystemServiceId}
            description={"选择系统服务"}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddDialogCancelClose}> 取消 </Button>
          <Button onClick={handleAddDialogAcceptClose}> 确定 </Button>
        </DialogActions>
        </Dialog>
                    */}
      <BindSR
        dialogOpen={addDialogOpen}
        title="为当前迭代添加功能需求"
        handleSuccess={handleAddDialogAcceptClose}
        handleCancel={handleAddDialogCancelClose}
        data={originRequireList}
      />
      {/*
      <Dialog open={functionInfoOpen}>
        <DialogTitle>
          <Typography variant="h3" component="div">
            功能详情
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Card
            margin="normal"
            variant="outlined"
            sx={{ minWidth: 200, margin: 2 }}
          >
            <CardContent>
              <Typography variant="h6" component="div">
                功能需求名称： {display.name}
              </Typography>
              <Typography variant="h6" component="div">
                功能需求说明： {display.description}
              </Typography>
            </CardContent>
          </Card>
          <Card
            margin="normal"
            variant="outlined"
            sx={{ minWidth: 200, margin: 2 }}
          >
            <CardContent>
              <Typography variant="h6" component="div">
                功能需求状态：{display.functionState}
              </Typography>
              <Typography variant="h6" component="div">
                功能需求创建时间：{display.createDate}
              </Typography>
              <Typography variant="h6" component="div">
                功能需求更新时间：{display.updateDate}
              </Typography>
            </CardContent>
          </Card>
          <Card
            margin="normal"
            variant="outlined"
            sx={{ minWidth: 200, margin: 2 }}
          >
            <CardContent>
              <Typography variant="h6" component="div">
                项目序号： {display.functionProjectId}
              </Typography>
              <Typography variant="h6" component="div">
                原始需求： {display.functionOriginalRequirementId}
              </Typography>
              <Typography variant="h6" component="div">
                功能迭代： {display.deliveryIterationId}
              </Typography>
              <Typography variant="h6" component="div">
                功能需求开发者：{display.functionDeveloperId}
              </Typography>
              <Typography variant="h6" component="div">
                功能需求创建者：{display.distributorId}
              </Typography>
            </CardContent>
          </Card>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleInfoClose}> 确定 </Button>
        </DialogActions>
        </Dialog>
                    */}
      <SRDetail
        functionInfoOpen={functionInfoOpen}
        handleInfoClose={handleInfoClose}
        functionalId={id}
        info={infoDict}
      />

      <SuccessAlert
        successToastOpen={successToastOpen}
        handleSuccessAlertClose={handleSuccessAlertClose}
        info={info}
      />

      <FailAlert
        failToastOpen={failToastOpen}
        handleFailAlertClose={handleFailAlertClose}
        info={info}
      />
    </Box>
  );
}
