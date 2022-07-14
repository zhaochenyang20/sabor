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
import Selection from "../../../components/selection";
import SuccessAlert from "../../../components/successalert";
import FailAlert from "../../../components/failalert";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Row from "../../../components/row";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import getDictionary from "../../../utils/dictionary";
import { useParams } from "react-router-dom";
import BindSR from "../../../components/bindsr";
import SRDetail from "../../../components/srdetail";

Iconify.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  sx: PropTypes.object,
};

function Iconify({ icon, sx, ...other }) {
  return <Box component={Icon} icon={icon} sx={{ ...sx }} {...other} />;
}

export default function SystemService() {
  const [addRequirementOpen, setAddRequirementOpen] = useState(false);
  const [systemServiceName, setSystemServiceName] = React.useState(undefined);
  const [systemServiceDescription, setSystemServiceDescription] =
    React.useState(undefined);
  // ! createSystemService 的 hook

  const [modifyRequirementOpen, setModifyRequirementOpen] = useState(false);
  const [oldName, setOldName] = React.useState(undefined);
  const [newSystemInfoName, setNewSystemInfoName] = React.useState(undefined);
  const [newSystemInfoDescription, setNewSystemInfoDescription] =
    React.useState(undefined);
  // ! uopdateStstemService 的 hook

  const [deleteRequirementOpen, setDeleteRequirementOpen] =
    React.useState(false);
  const [deleteSystemId, setDeleteSystemId] = React.useState(undefined);
  // ! deleteSystemService 的 hook

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

  const [systemServiceList, setSystemServiceList] = useState([]);
  const [functionalDict, setFunctionalDict] = useState([]);
  const [loadOriginFinished, setLoadOriginFinished] = React.useState(false);
  const [loadFunctionStarted, setLoadFunctionStarted] = useState(false);

  const [loadMiscStatus, setLoadMiscStatus] = useState("notStarted");

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

  const [functionId, setFunctionId] = useState(0);
  const [functionalName, setFunctionalName] = useState(undefined);
  const [originRequirementId, setOriginRequirementId] = useState(undefined);
  const [functionalDescription, setFunctionalDescription] = useState(undefined);
  //! 传递给子组件，用来设置功能需求

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
  let systemNameList = [];
  //! 查看功能详情的 hook

  const [originRequireList, setOriginRequireList] = useState([]);
  //! 获取下拉框的 hook

  const [successToastOpen, setSuccessToastOpen] = useState(false);
  const [failToastOpen, setFailToastOpen] = useState(false);
  const [info, setInfo] = useState(undefined);
  const [isCreate, setIsCreate] = useState(false);

  //let userList = [];
  //let devloperNameList = [];
  const [userList, setUserList] = useState([]);
  const [devloperList, setDevloperList] = useState([]);
  const [iterationList, setIterationList] = useState([]);

  // TODO: remove THIS!
  //let infoDict = getDictionary(projectId);

  function getIterationList() {
    const url =
      process.env.REACT_APP_BACKEND_URL +
      "api/projects/" +
      projectId +
      "/find-all-iter";
    return axios.get(url, { headers }).then((response) => {
      let tmpList = [];
      for (let i = 0; i < response.data.data.length; i++) {
        let tmp = {
          id: response.data.data[i].id,
          name: response.data.data[i].name,
        };
        tmpList.push(tmp);
      }
      setIterationList(tmpList);
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

  const handleSuccessAlertClose = () => {
    setSuccessToastOpen(false);
    if (isCreate) {
      //window.location.reload();
      setIsCreate(false);
    }
  };

  const handleFailAlertClose = () => {
    setFailToastOpen(false);
  };

  //! 获得原始需求列表
  function getIrlist() {
    const url =
      process.env.REACT_APP_BACKEND_URL +
      "api/projects/" +
      projectId +
      "/find-all-ori-require";
    return axios
      .get(url, { headers })
      .then((response) => {
        setOriginRequireList(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  //! 获取系统服务列表
  function getRequirementList() {
    const url =
      process.env.REACT_APP_BACKEND_URL +
      "api/projects/" +
      projectId.toString() +
      "/find-all-sys-serv";
    return axios
      .get(url, { headers })
      .then((response) => {
        setSystemServiceList(response.data.data);
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
      systemServiceList.map((requirement) => {
        systemNameList.push(requirement.name.toString());
        const functional_url =
          process.env.REACT_APP_BACKEND_URL +
          "api/projects/" +
          projectId +
          "/find-all-func-require/serv/" +
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
            response[index].value.data.data[functionIndex].systemServiceId;
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddRequirement = () => {
    setAddRequirementOpen(true);
  };

  const handleAddDialogCancelClose = () => {
    setFunctionalName(undefined);
    setFunctionalDescription(undefined);
    setDeveloperId(undefined);
    setDeliveryIterationId(undefined);
    setOriginRequirementId(undefined);
    setAddDialogOpen(false);
  };

  const handleAddOriginRequirementCancelClose = () => {
    setSystemServiceName(undefined);
    setSystemServiceDescription(undefined);
    setAddRequirementOpen(false);
  };

  const handleModifyOriginRequirementCancelClose = () => {
    setModifyRequirementOpen(false);
    setOldName(undefined);
    setNewSystemInfoName(undefined);
    setNewSystemInfoDescription(undefined);
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
      systemServiceId: dialogId,
    };
    setFunctionalName(undefined);
    setOriginRequirementId(undefined);
    setFunctionalDescription(undefined);
    setDeliveryIterationId(undefined);
    setDeveloperId(undefined);
    /*
    if (Body["name"] === "" || Body["name"] === undefined) {
      setInfo("请输入功能需求名称");
      setFailToastOpen(true);
      return;
    }
    if (Body["description"] === "" || Body["description"] === undefined) {
      setInfo("请输入功能需求说明");
      setFailToastOpen(true);
      return;
    }
    if (
      Body["originalRequirementId"] === "" ||
      Body["originalRequirementId"] === undefined
    ) {
      setInfo("请选择原始需求");
      setFailToastOpen(true);
      return;
      }
      */
    axios
      .post(url, Body, { headers })
      .then((response) => {
        let res = response.data;
        if (res.code === 200) {
          setInfo("添加成功");
          getRequirementList();
          getFunctionDict();
          setIsCreate(true);
          setSuccessToastOpen(true);
        } else {
          setInfo("添加失败，请稍后重试");
          setFailToastOpen(true);
        }
        /*
        const tmp_promise_list = [];
        tmp_promise_list.push(getFunctionDict());
        Promise.all(tmp_promise_list).then(() => {
          // window.location.reload();
          forceUpdate();
          });
          */
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
    //setLoadOriginFinished(false);
    //! TODO: 这里应该更新原始需求列表
    //setLoadFunctionStarted(true);
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
      //Body["iterationId"] === "请输入原始需求的新交付状态" ||
      Body["iterationId"] == 0 ||
      Body["iterationId"] === undefined ||
      Body["iterationId"] === ""
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

          setInfo("更新成功");
          setSuccessToastOpen(true);
        } else {
          setInfo("更新失败，请稍后重试");
          setFailToastOpen(true);
        }
        forceUpdate();
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
    //setLoadFunctionStarted(true);
  };

  const handleDeleteDialogAcceptClose = () => {
    setDeleteDialogOpen(false);
    let Body = {
      id: functionId,
      systemServiceId: 0,
    };
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
    setDeleteSystemId(undefined);
    setDeleteRequirementOpen(false);
  };

  const handleInputChange = (event) => {
    event.preventDefault();

    if (event.target.name === "systemServiceName") {
      setSystemServiceName(event.target.value);
      return;
    }
    if (event.target.name === "systemServiceDescription") {
      setSystemServiceDescription(event.target.value);
      return;
    }
    // ! createSystemService 的 hook

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

  const handleNewFunctionalRequireState = (event) => {
    setNewFucntionalState(event.target.value);
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
    if (loadMiscStatus === "notStarted") {
      setLoadMiscStatus("started");
      getMetalist();
      getIrlist();
      getIterationList();
    }
  }, [loadMiscStatus]);

  const handleInfoClose = () => {
    setFunctionInfoOpen(false);
  };

  //! systemSevice 的增删查改
  const createSystemService = (event) => {
    // 这个接口用于创建系统服务
    event.preventDefault();
    let systemInfo = {
      name: systemServiceName, // 不存在则create
      description: systemServiceDescription, // create时必选
    };
    systemServiceList.map((requirement) => {
      systemNameList.push(requirement.name.toString());
    });
    setAddRequirementOpen(false);
    setSystemServiceName(undefined);
    setSystemServiceDescription(undefined);
    setSystemServiceName(undefined);
    setSystemServiceDescription(undefined);
    if (systemNameList.indexOf(systemInfo.name) !== -1) {
      setInfo("创建失败，系统服务名称与已有名称重复");
      setFailToastOpen(true);
      return;
    }
    if (projectId == 0 || projectId === "" || projectId === undefined) {
      setInfo("创建失败，请稍后重试");
      setFailToastOpen(true);
      return;
    }
    if (
      systemInfo["name"] === "" ||
      //(systemInfo["name"] === "请输入系统服务名称") ||
      systemInfo["name"] === undefined
    ) {
      setInfo("请输入系统服务名称");
      setFailToastOpen(true);
      return;
    } else if (
      systemInfo["description"] === "" ||
      //systemInfo["description"] === "请输入系统服务说明" ||
      systemInfo["description"] === undefined
    ) {
      setInfo("请输入系统服务说明");
      setFailToastOpen(true);
      return;
    }
    const url =
      process.env.REACT_APP_BACKEND_URL +
      "api/projects/" +
      projectId.toString() +
      "/update-sys-serv";
    Post(
      url,
      systemInfo,
      (res) => {
        if (res.code === 200) {
          getRequirementList();

          setInfo("创建成功");
          setIsCreate(true);
          setSuccessToastOpen(true);
          // window.location.reload();
        } else if (res.code === 400) {
          if (res.data === "001# system service's name check failed") {
            setInfo("创建失败，系统服务名称不合法");
            setFailToastOpen(true);
          } else if (res.data === "004# New name check failed") {
            setInfo("创建失败，系统服务名称不合法");
            setFailToastOpen(true);
          } else if (res.data === "005# New name duplicates") {
            setInfo("创建失败，系统服务名称与已有重复");
            setFailToastOpen(true);
          } else {
            setInfo("创建失败，请稍后重试");
            setFailToastOpen(true);
          }
        } else {
          setInfo("创建失败，请稍后重试");
          setFailToastOpen(true);
        }
      },
      headers
    );
  };

  const updateSystemService = (event) => {
    // // ! uopdateStstemService 的 hook
    event.preventDefault();
    let newSystemInfo = {
      name: oldName, // This is in fact id !
      newName: convertEmpty(newSystemInfoName), // 可选
      description: convertEmpty(newSystemInfoDescription), //可选，但是 newName 和 description 必须存在一个
    };
    setOldName(undefined);
    setNewSystemInfoName(undefined);
    setNewSystemInfoDescription(undefined);
    setModifyRequirementOpen(false);
    systemServiceList.map((requirement) => {
      systemNameList.push(requirement.name.toString());
    });
    //console.log(newSystemInfo.name);
    let systemData = systemServiceList.find(
      (system) => system.id === newSystemInfo.name
    );

    if (!systemData) {
      setInfo("更新失败，请稍后重试");
      setFailToastOpen(true);
      return;
    }
    newSystemInfo.name = systemData.name;

    if (
      newSystemInfo.newName &&
      systemNameList.indexOf(newSystemInfo.newName.toString()) !== -1
    ) {
      setInfo("更新失败，新系统服务名称与已有重复");
      setFailToastOpen(true);
      return;
    }
    if (projectId == 0 || projectId === "" || projectId === undefined) {
      setInfo("更新失败，请稍后重试");
      setFailToastOpen(true);
      return;
    }
    if (newSystemInfo["name"] === "" || newSystemInfo["name"] === undefined) {
      setInfo("更新失败，请稍后重试");
      setFailToastOpen(true);
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
      setInfo("您似乎并未做出任何修改");
      setFailToastOpen(true);
      return;
    }
    const url =
      process.env.REACT_APP_BACKEND_URL +
      "api/projects/" +
      projectId.toString() +
      "/update-sys-serv";
    Post(
      url,
      newSystemInfo,
      (res) => {
        if (res.code === 200) {
          let id = res.data;
          //setInfo("修改第" + id.toString() + "号需求成功");
          getRequirementList();
          setInfo("更新成功");
          setSuccessToastOpen(true);
        } else if (res.code === 400) {
          let message = res.data.data;
          if (/^001#/.test(message)) {
            setInfo("更新失败，系统服务名称不合法");
            setFailToastOpen(true);
          } else if (/^003#/.test(message)) {
            setInfo("更新失败，请输入系统服务说明");
            setFailToastOpen(true);
          } else if (/^005#/.test(message)) {
            showAlert("更新失败，系统服务名称与已有重复");
          } else {
            showAlert("更新失败，请稍后重试");
          }
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

  const deleteSystemService = (event) => {
    event.preventDefault();
    let Body = {
      id: deleteSystemId,
    };
    setDeleteSystemId(undefined);
    const url =
      process.env.REACT_APP_BACKEND_URL +
      "/api/projects/" +
      projectId.toString() +
      "/delete-sys-serv";
    setDeleteRequirementOpen(false);
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
    forceUpdate();
    //setLoadFunctionStarted(true);
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
    iterationDict: iterationList,
    originRequireDict: originRequireList,
    userDict: userList,
    system: systemServiceList,
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
                    <TableCell>服务名称</TableCell>
                    <TableCell>服务说明</TableCell>
                    <TableCell>服务创建时间</TableCell>
                    <TableCell align="center">
                      <AddCircleOutlineIcon
                        aria-label="add"
                        onClick={handleAddRequirement}
                      />
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {systemServiceList
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

                          setDeleIterationId={setDeleteSystemId}
                          setModifyRequirementOpen={setModifyRequirementOpen}
                          setDeleteRequirementOpen={setDeleteRequirementOpen}
                          setOldId={setOldName}
                          //! TODO check it!

                          displayKey={2}
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
              count={systemServiceList.length}
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
        <DialogTitle> 添加系统服务 </DialogTitle>
        <DialogContent>
          <TextField
            sx={{ m: 2, mx: "auto", width: 1, borderRadius: 0 }}
            variant="standard"
            required
            fullWidth
            label="系统服务名称"
            name="systemServiceName"
            onChange={handleInputChange}
          />
          <TextField
            sx={{ m: 2, mx: "auto", width: 1, borderRadius: 0 }}
            variant="standard"
            fullWidth
            required
            label="系统服务说明"
            name="systemServiceDescription"
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddOriginRequirementCancelClose}>取消</Button>
          <Button onClick={createSystemService}> 确定 </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={modifyRequirementOpen}>
        <DialogTitle> 修改系统服务 </DialogTitle>

        <DialogContent>
          <Alert severity="info">如果不想修改某一项，留空即可</Alert>
          <TextField
            sx={{ m: 2, mx: "auto", width: 1, borderRadius: 0 }}
            fullWidth
            label="新系统服务名称"
            name="newSystemInfoName"
            onChange={handleInputChange}
          />
          <TextField
            sx={{ m: 2, mx: "auto", width: 1, borderRadius: 0 }}
            fullWidth
            label="新系统服务说明"
            name="newSystemInfoDescription"
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModifyOriginRequirementCancelClose}>
            取消
          </Button>
          <Button onClick={updateSystemService}> 确定 </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteRequirementOpen}>
        <DialogTitle>删除该系统服务</DialogTitle>
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
          <Button onClick={deleteSystemService}>确定</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialogOpen}>
        <DialogTitle> 删除当前功能需求 </DialogTitle>
        <DialogContent>
          <DialogContentText>
            是否将该功能需求移除该系统服务？
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
            originRequireList={iterationList}
            id={newIterationId}
            setId={setNewIterationId}
            description={"新迭代服务"}
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
        <DialogTitle> 为当前系统服务添加功能需求 </DialogTitle>
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
            description={"请选择原始需求"}
            required
          />
          <Selection
            originRequireList={devloperList.map((ele) => {
              return { name: ele.username, id: ele.id };
            })}
            id={developerId}
            setId={setDeveloperId}
            description={"请选择开发工程师"}
          />
          <Selection
            originRequireList={iterationList}
            id={deliveryIterationId}
            setId={setDeliveryIterationId}
            description={"请选择迭代服务"}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddDialogCancelClose}> 取消 </Button>
          <Button onClick={handleAddDialogAcceptClose}> 确定 </Button>
        </DialogActions>
        </Dialog>*/}
      <BindSR
        dialogOpen={addDialogOpen}
        title="为当前系统服务添加功能需求"
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
                功能迭代描述： {display.description}
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
        </Dialog>*/}
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
