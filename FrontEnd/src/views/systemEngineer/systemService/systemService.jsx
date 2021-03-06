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
  // ! createSystemService ??? hook

  const [modifyRequirementOpen, setModifyRequirementOpen] = useState(false);
  const [oldName, setOldName] = React.useState(undefined);
  const [newSystemInfoName, setNewSystemInfoName] = React.useState(undefined);
  const [newSystemInfoDescription, setNewSystemInfoDescription] =
    React.useState(undefined);
  // ! uopdateStstemService ??? hook

  const [deleteRequirementOpen, setDeleteRequirementOpen] =
    React.useState(false);
  const [deleteSystemId, setDeleteSystemId] = React.useState(undefined);
  // ! deleteSystemService ??? hook

  const [functionalRequirementId, setFunctionalRequirementId] =
    React.useState(undefined);
  const [newFunctionName, setNewFunctionalName] = React.useState(undefined);
  const [newFunctionDescription, setNewFunctionalDescription] =
    React.useState(undefined);
  const [newFunctionalState, setNewFucntionalState] = React.useState(undefined);
  const [newSystemServiceId, setNewSystemServiceId] = React.useState(undefined);
  const [newIterationId, setNewIterationId] = React.useState(undefined);
  const [newDeveloperId, setNewDeveloperId] = React.useState(undefined);
  //! ????????????????????? hook

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
  //! ?????? dialogId ?????????????????????????????? IR ??????

  const [functionId, setFunctionId] = useState(0);
  const [functionalName, setFunctionalName] = useState(undefined);
  const [originRequirementId, setOriginRequirementId] = useState(undefined);
  const [functionalDescription, setFunctionalDescription] = useState(undefined);
  //! ?????????????????????????????????????????????

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
  //! ????????????????????? hook

  const [originRequireList, setOriginRequireList] = useState([]);
  //! ?????????????????? hook

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

  //! ????????????????????????
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

  //! ????????????????????????
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

  //! ????????????????????????
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
          //! response[index].value.data.data[functionIndex] ?????????????????? SR
          //! ????????? projectId ??? originRequirementId
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
      setInfo("???????????????????????????");
      setFailToastOpen(true);
      return;
    }
    if (Body["description"] === "" || Body["description"] === undefined) {
      setInfo("???????????????????????????");
      setFailToastOpen(true);
      return;
    }
    if (
      Body["originalRequirementId"] === "" ||
      Body["originalRequirementId"] === undefined
    ) {
      setInfo("?????????????????????");
      setFailToastOpen(true);
      return;
      }
      */
    axios
      .post(url, Body, { headers })
      .then((response) => {
        let res = response.data;
        if (res.code === 200) {
          setInfo("????????????");
          getRequirementList();
          getFunctionDict();
          setIsCreate(true);
          setSuccessToastOpen(true);
        } else {
          setInfo("??????????????????????????????");
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
            showAlert("??????????????????????????????????????????");
            return;
          } else if (/^009#/.test(message)) {
            showAlert("????????????????????????????????????????????????");
            return;
          }
        }
        showAlert("??????????????????????????????");
      });
    //setLoadOriginFinished(false);
    //! TODO: ????????????????????????????????????
    //setLoadFunctionStarted(true);
  };

  const convertEmpty = (content) => (content === "" ? undefined : content);

  const handleModifyDialogAcceptClose = () => {
    setModifyDialogOpen(false);
    // //! ????????????????????? hook
    event.preventDefault();
    let Body = {
      id: functionId, // ???????????????????????? orgginRequire ??? id????????? url ?????? projectId
      name: convertEmpty(newFunctionName), // ??????????????????????????????
      description: convertEmpty(newFunctionDescription), // ??????????????????????????????
      state: newFunctionalState, // 1~4: ?????????????????????????????????????????????
      systemServiceId: newSystemServiceId, // ????????????????????????????????????
      iterationId: newIterationId, // ??????????????????????????????
      developerId: newDeveloperId, // ?????????????????????????????????
    };
    setNewFunctionalName(undefined);
    setNewFunctionalDescription(undefined);
    setNewFucntionalState(undefined);
    setNewSystemServiceId(undefined);
    setNewIterationId(undefined);
    setNewDeveloperId(undefined);
    if (projectId == 0 || projectId === "" || projectId === undefined) {
      setInfo("??????????????????????????????");
      setFailToastOpen(true);
      return;
    }
    let checkPoint = 0;
    if (
      //Body["name"] === "?????????????????????????????????" ||
      Body["name"] === "" ||
      Body["name"] === undefined
    ) {
      checkPoint += 1;
    }
    if (
      //Body["description"] === "?????????????????????????????????" ||
      Body["description"] === "" ||
      Body["description"] === undefined
    ) {
      checkPoint += 1;
    }
    if (
      //Body["systemServiceId"] === "???????????????????????????????????????" ||
      Body["systemServiceId"] == 0 ||
      Body["systemServiceId"] === undefined ||
      Body["systemServiceId"] === ""
    ) {
      checkPoint += 1;
    }
    if (
      //Body["iterationId"] === "???????????????????????????????????????" ||
      Body["iterationId"] == 0 ||
      Body["iterationId"] === undefined ||
      Body["iterationId"] === ""
    ) {
      checkPoint += 1;
    }
    if (
      //Body["developerId"] === "???????????????????????????????????????" ||
      Body["developerId"] == 0 ||
      Body["developerId"] === undefined ||
      Body["developerId"] === ""
    ) {
      checkPoint += 1;
    }
    if (
      //Body["state"] === "???????????????????????????????????????" ||
      Body["state"] == 0 ||
      Body["state"] === undefined ||
      Body["state"] === ""
    ) {
      checkPoint += 1;
    }
    if (checkPoint === 6) {
      setInfo("??????????????????????????????????????????????????????"); // ?????????????????????????????????????????????
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

          setInfo("????????????");
          setSuccessToastOpen(true);
        } else {
          setInfo("??????????????????????????????");
          setFailToastOpen(true);
        }
        forceUpdate();
      })
      .catch((err) => {
        let res = err.response;
        if (res && res.status === 400) {
          let message = res.data.data;
          if (/^001#/.test(message) || /^007#/.test(message)) {
            showAlert("??????????????????????????????????????????");
            return;
          } else if (/^009#/.test(message)) {
            showAlert("????????????????????????????????????????????????");
            return;
          }
        }
        showAlert("??????????????????????????????");
      });
    //setLoadOriginFinished(false);
    //! TODO: ????????????????????????????????????
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

          setInfo("????????????");
          setSuccessToastOpen(true);
        } else {
          setInfo("??????????????????????????????");
          setFailToastOpen(true);
        }
        forceUpdate();
      })
      .catch(() => {
        setInfo("??????????????????????????????");
        setFailToastOpen(true);
      });
    //setLoadOriginFinished(false);
    //! TODO: ????????????????????????????????????
    //setLoadFunctionStarted(true);
    //! TODO: ??????????????????
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
    // ! createSystemService ??? hook

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
    // ! uopdateSystemService ??? hook
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

  //! systemSevice ???????????????
  const createSystemService = (event) => {
    // ????????????????????????????????????
    event.preventDefault();
    let systemInfo = {
      name: systemServiceName, // ????????????create
      description: systemServiceDescription, // create?????????
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
      setInfo("??????????????????????????????????????????????????????");
      setFailToastOpen(true);
      return;
    }
    if (projectId == 0 || projectId === "" || projectId === undefined) {
      setInfo("??????????????????????????????");
      setFailToastOpen(true);
      return;
    }
    if (
      systemInfo["name"] === "" ||
      //(systemInfo["name"] === "???????????????????????????") ||
      systemInfo["name"] === undefined
    ) {
      setInfo("???????????????????????????");
      setFailToastOpen(true);
      return;
    } else if (
      systemInfo["description"] === "" ||
      //systemInfo["description"] === "???????????????????????????" ||
      systemInfo["description"] === undefined
    ) {
      setInfo("???????????????????????????");
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

          setInfo("????????????");
          setIsCreate(true);
          setSuccessToastOpen(true);
          // window.location.reload();
        } else if (res.code === 400) {
          if (res.data === "001# system service's name check failed") {
            setInfo("??????????????????????????????????????????");
            setFailToastOpen(true);
          } else if (res.data === "004# New name check failed") {
            setInfo("??????????????????????????????????????????");
            setFailToastOpen(true);
          } else if (res.data === "005# New name duplicates") {
            setInfo("????????????????????????????????????????????????");
            setFailToastOpen(true);
          } else {
            setInfo("??????????????????????????????");
            setFailToastOpen(true);
          }
        } else {
          setInfo("??????????????????????????????");
          setFailToastOpen(true);
        }
      },
      headers
    );
  };

  const updateSystemService = (event) => {
    // // ! uopdateStstemService ??? hook
    event.preventDefault();
    let newSystemInfo = {
      name: oldName, // This is in fact id !
      newName: convertEmpty(newSystemInfoName), // ??????
      description: convertEmpty(newSystemInfoDescription), //??????????????? newName ??? description ??????????????????
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
      setInfo("??????????????????????????????");
      setFailToastOpen(true);
      return;
    }
    newSystemInfo.name = systemData.name;

    if (
      newSystemInfo.newName &&
      systemNameList.indexOf(newSystemInfo.newName.toString()) !== -1
    ) {
      setInfo("???????????????????????????????????????????????????");
      setFailToastOpen(true);
      return;
    }
    if (projectId == 0 || projectId === "" || projectId === undefined) {
      setInfo("??????????????????????????????");
      setFailToastOpen(true);
      return;
    }
    if (newSystemInfo["name"] === "" || newSystemInfo["name"] === undefined) {
      setInfo("??????????????????????????????");
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
      setInfo("?????????????????????????????????");
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
          //setInfo("?????????" + id.toString() + "???????????????");
          getRequirementList();
          setInfo("????????????");
          setSuccessToastOpen(true);
        } else if (res.code === 400) {
          let message = res.data.data;
          if (/^001#/.test(message)) {
            setInfo("??????????????????????????????????????????");
            setFailToastOpen(true);
          } else if (/^003#/.test(message)) {
            setInfo("??????????????????????????????????????????");
            setFailToastOpen(true);
          } else if (/^005#/.test(message)) {
            showAlert("????????????????????????????????????????????????");
          } else {
            showAlert("??????????????????????????????");
          }
        } else {
          setInfo("??????????????????????????????");
          setFailToastOpen(true);
        }
      },
      headers
    );
    //setLoadOriginFinished(false);
    forceUpdate();
    //! TODO: ????????????????????????????????????
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
          setInfo("????????????");
          setSuccessToastOpen(true);
        } else {
          setInfo("??????????????????????????????");
          setFailToastOpen(true);
        }
      },
      headers
    );
    //! TODO: ??????????????????
    //setLoadOriginFinished(false);
    //! TODO: ????????????????????????????????????
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
    display.name = "?????????????????????";
  }
  if (description === "" || description === undefined) {
    display.description = "?????????????????????";
  }
  if (functionState === "" || functionState === undefined) {
    display.functionState = "?????????????????????";
  }
  if (createDate === "" || createDate === undefined) {
    display.createDate = "?????????????????????";
  }
  if (updateDate === "" || updateDate === undefined) {
    display.updateDate = "?????????????????????";
  }
  if (functionProjectId === "" || functionProjectId === undefined) {
    display.functionProjectId = "?????????????????????";
  }
  if (
    functionOriginalRequirementId === "" ||
    functionOriginalRequirementId === undefined
  ) {
    display.functionOriginalRequirementId = "?????????????????????";
  }
  if (deliveryIterationId === "" || deliveryIterationId === undefined) {
    display.deliveryIterationId = "?????????????????????";
  }
  if (functionDeveloperId === "" || functionDeveloperId === undefined) {
    display.functionDeveloperId = "?????????????????????";
  }
  if (distributorId === "" || distributorId === undefined) {
    display.distributorId = "?????????????????????";
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
                    <TableCell>????????????</TableCell>
                    <TableCell>????????????</TableCell>
                    <TableCell>??????????????????</TableCell>
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
                          // * ????????????
                          setAddDialogOpen={setAddDialogOpen}
                          setModifyDialogOpen={setModifyDialogOpen}
                          setDeleteDialogOpen={setDeleteDialogOpen}
                          setDialogId={setDialogId}
                          //! dialogId ????????????????????????
                          setFunctionId={setFunctionId}
                          //! functionId ????????????????????????

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
                          //! ?????? functionalRequirementId ???????????????

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
        <DialogTitle> ?????????????????? </DialogTitle>
        <DialogContent>
          <TextField
            sx={{ m: 2, mx: "auto", width: 1, borderRadius: 0 }}
            variant="standard"
            required
            fullWidth
            label="??????????????????"
            name="systemServiceName"
            onChange={handleInputChange}
          />
          <TextField
            sx={{ m: 2, mx: "auto", width: 1, borderRadius: 0 }}
            variant="standard"
            fullWidth
            required
            label="??????????????????"
            name="systemServiceDescription"
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddOriginRequirementCancelClose}>??????</Button>
          <Button onClick={createSystemService}> ?????? </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={modifyRequirementOpen}>
        <DialogTitle> ?????????????????? </DialogTitle>

        <DialogContent>
          <Alert severity="info">??????????????????????????????????????????</Alert>
          <TextField
            sx={{ m: 2, mx: "auto", width: 1, borderRadius: 0 }}
            fullWidth
            label="?????????????????????"
            name="newSystemInfoName"
            onChange={handleInputChange}
          />
          <TextField
            sx={{ m: 2, mx: "auto", width: 1, borderRadius: 0 }}
            fullWidth
            label="?????????????????????"
            name="newSystemInfoDescription"
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModifyOriginRequirementCancelClose}>
            ??????
          </Button>
          <Button onClick={updateSystemService}> ?????? </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteRequirementOpen}>
        <DialogTitle>?????????????????????</DialogTitle>
        <DialogContent>
          <Alert severity="error">
            <AlertTitle>WARNING!!!</AlertTitle>
            ?????? ??? <strong>?????????????????????????????????????????????</strong>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteOriginRequirementCancelClose}>
            ??????
          </Button>
          <Button onClick={deleteSystemService}>??????</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialogOpen}>
        <DialogTitle> ???????????????????????? </DialogTitle>
        <DialogContent>
          <DialogContentText>
            ????????????????????????????????????????????????
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogCancelClose}> ?????? </Button>
          <Button onClick={handleDeleteDialogAcceptClose}> ?????? </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={modifyDialogOpen}>
        <DialogTitle> ?????????????????? </DialogTitle>
        <DialogContent Content>
          <Alert severity="info">??????????????????????????????????????????</Alert>
          <TextField
            margin="normal"
            fullWidth
            id="filled-basic"
            label="?????????????????????"
            onChange={(event) => setNewFunctionalName(event.target.value)}
          ></TextField>
          <TextField
            margin="normal"
            fullWidth
            id="filled-basic"
            label="?????????????????????"
            onChange={(event) =>
              setNewFunctionalDescription(event.target.value)
            }
          ></TextField>
          <FormControl
            margin="normal"
            sx={{ mx: "auto", width: 1, borderRadius: 0 }}
            fullWidth
          >
            <InputLabel>???????????????</InputLabel>
            <Select
              value={newFunctionalState}
              label="state"
              onChange={handleNewFunctionalRequireState}
            >
              <MenuItem value={1}>?????????</MenuItem>
              <MenuItem value={2}>?????????</MenuItem>
              <MenuItem value={3}>?????????</MenuItem>
            </Select>
          </FormControl>
          <Selection
            originRequireList={iterationList}
            id={newIterationId}
            setId={setNewIterationId}
            description={"???????????????"}
          />
          <Selection
            originRequireList={devloperList.map((ele) => {
              return { name: ele.username, id: ele.id };
            })}
            id={newDeveloperId}
            setId={setNewDeveloperId}
            description={"??????????????????"}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModifyDialogCancelClose}> ?????? </Button>
          <Button onClick={handleModifyDialogAcceptClose}> ?????? </Button>
        </DialogActions>
      </Dialog>
      {/*
      <Dialog open={addDialogOpen}>
        <DialogTitle> ??????????????????????????????????????? </DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            required
            fullWidth
            id="filled-basic"
            label="??????????????????"
            onChange={(event) => setFunctionalName(event.target.value)}
          ></TextField>
          <TextField
            margin="normal"
            required
            fullWidth
            id="filled-basic"
            label="??????????????????"
            onChange={(event) => setFunctionalDescription(event.target.value)}
          ></TextField>
          <Selection
            originRequireList={originRequireList}
            id={originRequirementId}
            setId={setOriginRequirementId}
            description={"?????????????????????"}
            required
          />
          <Selection
            originRequireList={devloperList.map((ele) => {
              return { name: ele.username, id: ele.id };
            })}
            id={developerId}
            setId={setDeveloperId}
            description={"????????????????????????"}
          />
          <Selection
            originRequireList={iterationList}
            id={deliveryIterationId}
            setId={setDeliveryIterationId}
            description={"?????????????????????"}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddDialogCancelClose}> ?????? </Button>
          <Button onClick={handleAddDialogAcceptClose}> ?????? </Button>
        </DialogActions>
        </Dialog>*/}
      <BindSR
        dialogOpen={addDialogOpen}
        title="???????????????????????????????????????"
        handleSuccess={handleAddDialogAcceptClose}
        handleCancel={handleAddDialogCancelClose}
        data={originRequireList}
      />
      {/*
      <Dialog open={functionInfoOpen}>
        <DialogTitle>
          <Typography variant="h3" component="div">
            ????????????
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
                ????????????????????? {display.name}
              </Typography>
              <Typography variant="h6" component="div">
                ????????????????????? {display.description}
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
                ?????????????????????{display.functionState}
              </Typography>
              <Typography variant="h6" component="div">
                ???????????????????????????{display.createDate}
              </Typography>
              <Typography variant="h6" component="div">
                ???????????????????????????{display.updateDate}
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
                ??????????????? {display.functionProjectId}
              </Typography>
              <Typography variant="h6" component="div">
                ??????????????? {display.functionOriginalRequirementId}
              </Typography>
              <Typography variant="h6" component="div">
                ??????????????? {display.deliveryIterationId}
              </Typography>
              <Typography variant="h6" component="div">
                ????????????????????????{display.functionDeveloperId}
              </Typography>
              <Typography variant="h6" component="div">
                ????????????????????????{display.distributorId}
              </Typography>
            </CardContent>
          </Card>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleInfoClose}> ?????? </Button>
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
