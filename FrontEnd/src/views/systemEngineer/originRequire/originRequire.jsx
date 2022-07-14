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
import { Card, TableContainer, TablePagination } from "@mui/material";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { useState, useEffect, useReducer } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { Post } from "../../../utils/communication";
import cookie from "react-cookies";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import axios from "axios";
import SuccessAlert from "../../../components/successalert";
import FailAlert from "../../../components/failalert";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Selection from "../../../components/selection";
import Row from "../../../components/row";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import getDictionary from "../../../utils/dictionary";
import { useParams } from "react-router-dom";
import SRDetail from "../../../components/srdetail";

Iconify.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  sx: PropTypes.object,
};

function Iconify({ icon, sx, ...other }) {
  return <Box component={Icon} icon={icon} sx={{ ...sx }} {...other} />;
}

export default function OriginRequire() {
  const [addRequirementOpen, setAddRequirementOpen] = useState(false);
  const [originRequireName, setOriginRequireName] = React.useState(undefined);
  const [originRequireDescription, setOriginRequireDescription] =
    React.useState(undefined);
  const [originRequireState, setOriginRequireState] = React.useState(undefined);
  // ! createOriginRequireState 的 hook

  const [originRequireId, setOriginRequireId] = React.useState(undefined);
  const [newOriginRequireName, setNewOriginRequireName] =
    React.useState(undefined);
  const [newOriginRequireDescription, setNewOriginRequireDescription] =
    React.useState(undefined);
  const [newState, setNewState] = React.useState(undefined);
  // ! updateOriginRequire 的 hook

  const [deleteRequirementOpen, setDeleteRequirementOpen] =
    React.useState(false);
  const [deleteOriginRequirementId, setDeleteOriginRequirementId] =
    useState(undefined);
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

  const [requirementList, setRequirementList] = useState([]);
  const [functionalDict, setFunctionalDict] = useState([]);
  const [loadOriginFinished, setLoadOriginFinished] = React.useState(false);
  const [loadFunctionStarted, setLoadFunctionStarted] = useState(false);

  // use this hook to track misc info (system, iter, people)
  // that can be fetched only once
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

  const [modifyRequirementOpen, setModifyRequirementOpen] = useState(false);
  const [functionId, setFunctionId] = useState(0);
  const [functionalName, setFunctionalName] = useState(undefined);
  const [functionalDescription, setFunctionalDescription] = useState(undefined);
  //! 传递给子组件，用来设置功能需求

  const [systemServiceId, setSystemServiceId] = useState(undefined);
  const [iterationId, setIterationId] = useState(undefined);
  const [developerId, setDeveloperId] = useState(undefined);

  const [successToastOpen, setSuccessToastOpen] = useState(false);
  const [failToastOpen, setFailToastOpen] = useState(false);
  const [info, setInfo] = useState(undefined);
  const [isCreate, setIsCreate] = useState(false);

  //! 注意，对这几个而言，每一项都是对象，每个都有 id 和 name

  //let userList = [];
  //let devloperNameList = [];
  const [userList, setUserList] = useState([]);
  const [devloperList, setDevloperList] = useState([]);
  const [iterationList, setIterationList] = useState([]);
  const [systemList, setSystemList] = useState([]);

  // TODO: remove this fxxking cost of query
  //let infoDict = getDictionary(projectId);
  //const [infoDict, ] = useState(getDictionary(projectId));
  //let infoDict = {};

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

  function getIterationList() {
    const url =
      process.env.REACT_APP_BACKEND_URL +
      "api/projects/" +
      projectId +
      "/find-all-iter";
    return axios.get(url, { headers }).then((response) => {
      setIterationList(response.data.data);
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
          setDevloperList();
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
        //console.log(tmpDevList);
        setDevloperList(
          tmpUserList.filter((x) => tmpDevList.includes(x.username))
        );
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
      projectId +
      "/find-all-ori-require";
    return axios
      .get(url, { headers })
      .then((response) => {
        setRequirementList(response.data.data);
        setLoadOriginFinished(true);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // TODO: try to not use
  //! 获得功能需求字典
  function getFunctionDict() {
    return;
    /*
    return Promise.allSettled(
      requirementList.map((requirement) => {
        const functional_url =
          process.env.REACT_APP_BACKEND_URL +
          "api/projects/" +
          projectId +

              "/find-all-func-require/" +
          requirement.id;
        return axios.get(functional_url, { headers });
      })
    ).then((response) => {
      setLoadFunctionStarted(true);
      let tempFunctionalDict = new Array();
      for (let index in response) {
        for (let functionIndex in response[index].value.data.data) {
          //! response[index].value.data.data[functionIndex] 是每个单独的 SR
          //! 记录着 projectId 和 originRequirementId
          let originRequirementId =
            response[index].value.data.data[functionIndex]
              .originalRequirementId;
          if (tempFunctionalDict[originRequirementId] === undefined) {
            tempFunctionalDict[originRequirementId] = new Array();
            tempFunctionalDict[originRequirementId.toString()].push(
              response[index].value.data.data[functionIndex]
            );
          } else {
            tempFunctionalDict[originRequirementId.toString()].push(
              response[index].value.data.data[functionIndex]
            );
          }
        }
      }
      setFunctionalDict(tempFunctionalDict);
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
    setSystemServiceId(undefined);
    setIterationId(undefined);
    setDeveloperId(undefined);
    setAddDialogOpen(false);
  };

  const handleAddOriginRequirementCancelClose = () => {
    setOriginRequireState(undefined);
    setOriginRequireName(undefined);
    setOriginRequireDescription(undefined);
    setAddRequirementOpen(false);
  };

  const handleModifyOriginRequirementCancelClose = () => {
    setOriginRequireId(undefined);
    setNewOriginRequireName(undefined);
    setNewOriginRequireDescription(undefined);
    setNewOriginRequireDescription(undefined);
    setNewState(undefined);
    setModifyRequirementOpen(false);
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

  const handleAddDialogAcceptClose = () => {
    setAddDialogOpen(false);
    event.preventDefault();
    const url =
      process.env.REACT_APP_BACKEND_URL +
      "api/projects/" +
      projectId.toString() +
      "/create-func-require";
    let Body = {
      name: functionalName,
      description: functionalDescription,
      originalRequirementId: dialogId,
      systemServiceId: systemServiceId,
      iterationId: iterationId,
      developerId: developerId,
    };
    setFunctionalName(undefined);
    setFunctionalDescription(undefined);
    setSystemServiceId(undefined);
    setIterationId(undefined);
    setDeveloperId(undefined);
    if (
      //Body["name"] === "请输入原始需求的新名称" ||
      Body["name"] === "" ||
      Body["name"] === undefined
    ) {
      setInfo("请输入功能需求名称");
      setFailToastOpen(true);
      return;
    }
    if (
      //Body["description"] === "请输入原始需求的新说明" ||
      Body["description"] === "" ||
      Body["description"] === undefined
    ) {
      setInfo("请输入功能需求说明");
      setFailToastOpen(true);
      return;
    }
    axios
      .post(url, Body, { headers })
      .then((response) => {
        let res = response.data;
        if (res.code === 200) {
          setInfo("创建成功");
          getRequirementList();
          getFunctionDict();
          setIsCreate(true);
          setSuccessToastOpen(true);
        } /*else if (res.code === 400) {
          setInfo("创建失败，输入的功能需求名称不符合规范");
          setFailToastOpen(true);
        } else {
          setInfo("创建失败，您输入的可选信息有无");
          setFailToastOpen(true);
        }*/
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
        showAlert("创建失败，请稍后重试");
      });
    // setLoadOriginFinished(false);
    // //! TODO: 这里应该更新原始需求列表
    // setLoadFunctionStarted(true);
  };

  const convertEmpty = (content) => (content === "" ? undefined : content);

  const handleModifyDialogAcceptClose = () => {
    setModifyDialogOpen(false);
    // //! 修改功能需求的 hook
    //event.preventDefault();
    let Body = {
      id: functionId, // 注意，这里是某个 orgginRequire 的 id，不是 url 里的 projectId
      name: convertEmpty(newFunctionName), // 某个功能需求的新名称
      description: convertEmpty(newFunctionDescription), // 某个功能需求的新描述
      state: newFunctionalState, // 1~4: 初始化，已分解，进行中，已交付
      systemServiceId: systemServiceId, // 某个功能需求的新系统服务
      iterationId: newIterationId, // 某个功能需求的新迭代
      developerId: newDeveloperId, // 某个功能需求的新开发者
    };
    setNewFunctionalName(undefined);
    setNewFunctionalDescription(undefined);
    setNewFucntionalState(undefined);
    setSystemServiceId(undefined);
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
      setInfo("您似乎没有做出任何更改"); // 如果没有做出任何更改，则不提交
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
    };
    const url =
      process.env.REACT_APP_BACKEND_URL +
      "api/projects/" +
      projectId.toString() +
      "/delete-func-require";
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
    setDeleteRequirementOpen(false);
    setDeleteOriginRequirementId(undefined);
    setDeleteOriginRequirementId(undefined);
  };

  const handleInputChange = (event) => {
    event.preventDefault();
    if (event.target.name === "originRequireName") {
      setOriginRequireName(event.target.value);
      return;
    }
    if (event.target.name === "originRequireDescription") {
      setOriginRequireDescription(event.target.value);
      return;
    }
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
    // ! createOriginRequireState 的 hook
  };

  const handleOriginRequireState = (event) => {
    setOriginRequireState(event.target.value);
  };

  const handleNewOriginRequireState = (event) => {
    setNewState(event.target.value);
  };

  const handleNewFunctionalRequireState = (event) => {
    setNewFucntionalState(event.target.value);
  };

  const createOriginRequire = (event) => {
    // 这个接口用于创造原始需求
    event.preventDefault();
    setAddRequirementOpen(false);
    let originRequire = {
      name: originRequireName,
      description: originRequireDescription,
      state: originRequireState, // 1~4: 初始化，已分解，进行中，已交付
    };
    setOriginRequireDescription(undefined);
    setOriginRequireName(undefined);
    setOriginRequireState(undefined);
    if (projectId == 0 || projectId === "" || projectId === undefined) {
      setInfo("添加失败，请稍后重试");
      setFailToastOpen(true);
      return;
    }
    if (originRequire["name"] === "" || originRequire["name"] === undefined) {
      setInfo("请输入原始需求名称");
      setFailToastOpen(true);
      return;
    } else if (
      originRequire["description"] === "" ||
      originRequire["description"] === undefined
    ) {
      setInfo("请输入原始需求说明");
      setFailToastOpen(true);
      return;
    } /*else if (
      originRequire["state"] == 0 ||
      originRequire["state"] === undefined
    ) {
      setInfo("请选择原始需求状态");
      setFailToastOpen(true);
      return;
    }*/

    const url =
      process.env.REACT_APP_BACKEND_URL +
      "api/projects/" +
      projectId.toString() +
      "/create-ori-require";
    Post(
      url,
      originRequire,
      (res) => {
        if (res.code == 200) {
          getRequirementList();
          setInfo("创建成功");
          setIsCreate(true);
          setSuccessToastOpen(true);
        } else if (res.code == 400) {
          //setInfo("创建失败，您可能使用了与之前的某个原始需求重复的编号");
          let message = res.data.data;
          if (/^001#/.test(message)) {
            showAlert("创建失败，原始需求名称不合法");
          } else if (/^002#/.test(message)) {
            showAlert("创建失败，原始需求名称与已有重复");
          } else {
            showAlert("创建失败，请稍后重试");
          }
        } else {
          setInfo("创建失败，请稍候重试");
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

  const updateOriginRequire = (event) => {
    // 这个接口用于更新原始需求
    event.preventDefault();
    setModifyRequirementOpen(false);
    let updateOriginRequire = {
      id: originRequireId, // 注意，这里是某个 orgginRequire 的 id，不是 url 里的 projectId
      name: convertEmpty(newOriginRequireName), // 某个原始需求的新名称
      description: convertEmpty(newOriginRequireDescription), // 某个原始需求的新描述
      state: newState, // 1~4: 初始化，已分解，进行中，已交付
    };
    setNewOriginRequireName(undefined);
    setNewOriginRequireDescription(undefined);
    setNewState(undefined);
    if (projectId == 0 || projectId === "" || projectId === undefined) {
      setInfo("更新失败，请稍后重试");
      setFailToastOpen(true);
      return;
    }
    if (
      updateOriginRequire["id"] == 0 ||
      updateOriginRequire["id" === ""] ||
      updateOriginRequire["id"] === undefined
    ) {
      setInfo("更新失败，请稍后重试");
      setFailToastOpen(true);
      return;
    }
    if (updateOriginRequire["id"] < 1) {
      setInfo("更新失败，请稍后重试");
      setFailToastOpen(true);
      return;
    }
    if (updateOriginRequire["id"] % 1 !== 0) {
      setInfo("更新失败，请稍后重试");
      setFailToastOpen(true);
      return;
    }
    let checkPoint = 0;
    if (
      //updateOriginRequire["name"] === "请输入原始需求的新名称" ||
      updateOriginRequire["name"] === "" ||
      updateOriginRequire["name"] === undefined
    ) {
      checkPoint += 1;
    }
    if (
      //updateOriginRequire["description"] === "请输入原始需求的新说明" ||
      updateOriginRequire["description"] === "" ||
      updateOriginRequire["description"] === undefined
    ) {
      checkPoint += 1;
    }
    if (
      //updateOriginRequire["state"] === "请输入原始需求的新交付状态" ||
      updateOriginRequire["state"] == 0 ||
      updateOriginRequire["state"] === undefined ||
      updateOriginRequire["state"] === ""
    ) {
      checkPoint += 1;
    }
    if (checkPoint === 3) {
      setInfo("您似乎没有做出任何更改"); // 如果没有做出任何更改，则不提交
      setFailToastOpen(true);
      return;
    }
    const url =
      process.env.REACT_APP_BACKEND_URL +
      "api/projects/" +
      projectId.toString() +
      "/update-ori-require";
    Post(
      url,
      updateOriginRequire,
      (res) => {
        if (res.code === 200) {
          getRequirementList();
          setInfo("更新成功");

          setSuccessToastOpen(true);
        } else if (res.code === 400) {
          let message = res.data.data;
          if (/^001#/.test(message)) {
            showAlert("更新失败，原始需求名称不合法");
          } else if (/^003#/.test(message)) {
            showAlert("更新失败，与其它原始需求重名");
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

  const deleteOriginRequirement = () => {
    //! 需要传入参数，记得抹去参数
    setDeleteRequirementOpen(false);
    let Body = {
      id: deleteOriginRequirementId,
    };
    const url =
      process.env.REACT_APP_BACKEND_URL +
      "api/projects/" +
      projectId.toString() +
      "/delete-ori-require";
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
      setLoadMiscStatus("Started");
      getMetalist();
      getIterationList();
      getSystemList();
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
    display.name = "加载中";
  }
  if (description === "" || description === undefined) {
    display.description = "加载中";
  }
  if (functionState === "" || functionState === undefined) {
    display.functionState = "加载中";
  }
  if (createDate === "" || createDate === undefined) {
    display.createDate = "加载中";
  }
  if (updateDate === "" || updateDate === undefined) {
    display.updateDate = "加载中";
  }
  if (functionProjectId === "" || functionProjectId === undefined) {
    display.functionProjectId = "加载中";
  }
  if (
    functionOriginalRequirementId === "" ||
    functionOriginalRequirementId === undefined
  ) {
    display.functionOriginalRequirementId = "加载中";
  }
  if (deliveryIterationId === "" || deliveryIterationId === undefined) {
    display.deliveryIterationId = "加载中";
  }
  if (functionDeveloperId === "" || functionDeveloperId === undefined) {
    display.functionDeveloperId = "加载中";
  }
  if (distributorId === "" || distributorId === undefined) {
    display.distributorId = "加载中";
  }

  const infoDict = {
    devloperDict: devloperList,
    iterationDict: iterationList,
    originRequireDict: requirementList,
    userDict: userList,
    system: systemList,
  };

  return (
    <Box>
      <Box
        sx={{
          bgcolor: "background.paper",
        }}
      >
        <Container>
          <Card>
            <TableContainer component={Paper}>
              <Table sx={{ width: 1 }}>
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell>原始需求名称</TableCell>
                    <TableCell>原始需求说明</TableCell>
                    <TableCell>原始需求创建者</TableCell>
                    <TableCell align="center">
                      <AddCircleOutlineIcon
                        aria-label="add"
                        size="large"
                        onClick={handleAddRequirement}
                      />
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requirementList
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

                          setModifyRequirementOpen={setModifyRequirementOpen}
                          setDeleteRequirementOpen={setDeleteRequirementOpen}
                          setOldId={setOriginRequireId}
                          setDeleIterationId={setDeleteOriginRequirementId}
                          displayKey={1}
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
              count={requirementList.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        </Container>
      </Box>

      <Dialog open={addRequirementOpen}>
        <DialogTitle> 添加原始需求 </DialogTitle>
        <DialogContent>
          <TextField
            sx={{ m: 2, mx: "auto", width: 1, borderRadius: 0 }}
            margin="normal"
            required
            fullWidth
            label="原始需求名称"
            name="originRequireName"
            onChange={handleInputChange}
            autoFocuss
          />
          <TextField
            sx={{ m: 2, mx: "auto", width: 1, borderRadius: 0 }}
            label="原始需求说明"
            required
            name="originRequireDescription"
            onChange={handleInputChange}
          />
          {/*
          <FormControl
            sx={{ m: 2, mx: "auto", width: 1, borderRadius: 0 }}
            fullWidth
          >

            <InputLabel>交付状态</InputLabel>
            <Select
              value={originRequireState}
              label="state"
              onChange={handleOriginRequireState}
            >
              <MenuItem value={1}>初始化</MenuItem>
              <MenuItem value={2}>已分解</MenuItem>
              <MenuItem value={3}>进行中</MenuItem>
              <MenuItem value={4}>已交付</MenuItem>
            </Select>
            --->

            </FormControl>
             */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddOriginRequirementCancelClose}>取消</Button>
          <Button onClick={createOriginRequire}> 确定 </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={modifyRequirementOpen}>
        <DialogTitle>修改原始需求</DialogTitle>
        <DialogContent>
          <Alert severity="info">如果不想修改某一项，留空即可</Alert>
          <TextField
            sx={{ m: 2, mx: "auto", width: 1, borderRadius: 0 }}
            fullWidth
            label="新原始需求名称"
            name="newOriginRequireName"
            onChange={handleInputChange}
          />
          <TextField
            sx={{ m: 2, mx: "auto", width: 1, borderRadius: 0 }}
            label="新原始需求说明"
            name="newOriginRequireDescription"
            onChange={handleInputChange}
          />
          {/*
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
             */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModifyOriginRequirementCancelClose}>
            取消
          </Button>
          <Button onClick={updateOriginRequire}> 确定 </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteRequirementOpen}>
        <DialogTitle>删除原始需求</DialogTitle>
        <DialogContent>
          <Alert severity="error">
            <AlertTitle>WARN!!!</AlertTitle>
            警告 — <strong>删除操作不可逆，请确定是否删除</strong>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteOriginRequirementCancelClose}>
            取消
          </Button>
          <Button onClick={deleteOriginRequirement}>确定</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialogOpen}>
        <DialogTitle> 删除当前功能需求 </DialogTitle>
        <Alert severity="error">
          <AlertTitle>WARN!!!</AlertTitle>
          警告 — <strong>删除操作不可逆，请确定是否删除</strong>
        </Alert>
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
              {/* <MenuItem value={2}>已分解</MenuItem> */}
              <MenuItem value={2}>进行中</MenuItem>
              <MenuItem value={3}>已交付</MenuItem>
            </Select>
          </FormControl>
          <Selection
            originRequireList={iterationList}
            id={newIterationId}
            setId={setNewIterationId}
            description={"新迭代"}
          />
          <Selection
            originRequireList={systemList}
            id={systemServiceId}
            setId={setSystemServiceId}
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

      <Dialog open={addDialogOpen}>
        <DialogTitle> 添加功能需求到当前原始需求 </DialogTitle>
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
            originRequireList={systemList}
            id={systemServiceId}
            setId={setSystemServiceId}
            description={"请选择系统服务"}
          />
          <Selection
            originRequireList={iterationList}
            id={iterationId}
            setId={setIterationId}
            description={"请选择迭代"}
          />
          <Selection
            originRequireList={devloperList.map((ele) => {
              return { name: ele.username, id: ele.id };
            })}
            id={developerId}
            setId={setDeveloperId}
            description={"请选择开发工程师"}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleAddDialogCancelClose()}> 取消 </Button>
          <Button onClick={() => handleAddDialogAcceptClose()}> 确定 </Button>
        </DialogActions>
      </Dialog>
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
                功能需求描述： {display.description}
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
