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
  // ! createOriginRequireState ??? hook

  const [originRequireId, setOriginRequireId] = React.useState(undefined);
  const [newOriginRequireName, setNewOriginRequireName] =
    React.useState(undefined);
  const [newOriginRequireDescription, setNewOriginRequireDescription] =
    React.useState(undefined);
  const [newState, setNewState] = React.useState(undefined);
  // ! updateOriginRequire ??? hook

  const [deleteRequirementOpen, setDeleteRequirementOpen] =
    React.useState(false);
  const [deleteOriginRequirementId, setDeleteOriginRequirementId] =
    useState(undefined);
  // ! deleteOriginRequire ??? hook

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
  //! ????????????????????? hook

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
  //! ?????? dialogId ?????????????????????????????? IR ??????

  const [modifyRequirementOpen, setModifyRequirementOpen] = useState(false);
  const [functionId, setFunctionId] = useState(0);
  const [functionalName, setFunctionalName] = useState(undefined);
  const [functionalDescription, setFunctionalDescription] = useState(undefined);
  //! ?????????????????????????????????????????????

  const [systemServiceId, setSystemServiceId] = useState(undefined);
  const [iterationId, setIterationId] = useState(undefined);
  const [developerId, setDeveloperId] = useState(undefined);

  const [successToastOpen, setSuccessToastOpen] = useState(false);
  const [failToastOpen, setFailToastOpen] = useState(false);
  const [info, setInfo] = useState(undefined);
  const [isCreate, setIsCreate] = useState(false);

  //! ?????????????????????????????????????????????????????????????????? id ??? name

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

  //! ????????????????????????
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
  //! ????????????????????????
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
          //! response[index].value.data.data[functionIndex] ?????????????????? SR
          //! ????????? projectId ??? originRequirementId
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
      //Body["name"] === "?????????????????????????????????" ||
      Body["name"] === "" ||
      Body["name"] === undefined
    ) {
      setInfo("???????????????????????????");
      setFailToastOpen(true);
      return;
    }
    if (
      //Body["description"] === "?????????????????????????????????" ||
      Body["description"] === "" ||
      Body["description"] === undefined
    ) {
      setInfo("???????????????????????????");
      setFailToastOpen(true);
      return;
    }
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
        } /*else if (res.code === 400) {
          setInfo("?????????????????????????????????????????????????????????");
          setFailToastOpen(true);
        } else {
          setInfo("?????????????????????????????????????????????");
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
            showAlert("??????????????????????????????????????????");
            return;
          } else if (/^009#/.test(message)) {
            showAlert("????????????????????????????????????????????????");
            return;
          }
        }
        showAlert("??????????????????????????????");
      });
    // setLoadOriginFinished(false);
    // //! TODO: ????????????????????????????????????
    // setLoadFunctionStarted(true);
  };

  const convertEmpty = (content) => (content === "" ? undefined : content);

  const handleModifyDialogAcceptClose = () => {
    setModifyDialogOpen(false);
    // //! ????????????????????? hook
    //event.preventDefault();
    let Body = {
      id: functionId, // ???????????????????????? orgginRequire ??? id????????? url ?????? projectId
      name: convertEmpty(newFunctionName), // ??????????????????????????????
      description: convertEmpty(newFunctionDescription), // ??????????????????????????????
      state: newFunctionalState, // 1~4: ?????????????????????????????????????????????
      systemServiceId: systemServiceId, // ????????????????????????????????????
      iterationId: newIterationId, // ??????????????????????????????
      developerId: newDeveloperId, // ?????????????????????????????????
    };
    setNewFunctionalName(undefined);
    setNewFunctionalDescription(undefined);
    setNewFucntionalState(undefined);
    setSystemServiceId(undefined);
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
      //Body["developerId"] === "???????????????????????????????????????" ||
      Body["developerId"] == 0 ||
      Body["developerId"] === undefined ||
      Body["developerId"] === ""
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
      //Body["state"] === "???????????????????????????????????????" ||
      Body["state"] == 0 ||
      Body["state"] === undefined ||
      Body["state"] === ""
    ) {
      checkPoint += 1;
    }
    if (checkPoint === 6) {
      setInfo("?????????????????????????????????"); // ?????????????????????????????????????????????
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

          setInfo("????????????");
          setSuccessToastOpen(true);
        } else {
          showAlert("??????????????????????????????");
        } /*else if (res.code === 403) {
          setInfo("??????????????????????????????????????????????????????");
          setFailToastOpen(true);
        } else if (res.code === 400) {
          setInfo("????????????????????????????????????????????????????????????");
          setFailToastOpen(true);
        } else if (res.code === 404) {
          setInfo("????????????????????????????????????????????????????????????????????????");
          setFailToastOpen(true);
        } else {
          setInfo("??????????????????????????????????????????????????????");
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
          setInfo("????????????");
          setSuccessToastOpen(true);
        } else {
          setInfo("??????????????????????????????");
          setFailToastOpen(true);
        }
        //getFunctionDict();
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
    // ! createOriginRequireState ??? hook
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
    // ????????????????????????????????????
    event.preventDefault();
    setAddRequirementOpen(false);
    let originRequire = {
      name: originRequireName,
      description: originRequireDescription,
      state: originRequireState, // 1~4: ?????????????????????????????????????????????
    };
    setOriginRequireDescription(undefined);
    setOriginRequireName(undefined);
    setOriginRequireState(undefined);
    if (projectId == 0 || projectId === "" || projectId === undefined) {
      setInfo("??????????????????????????????");
      setFailToastOpen(true);
      return;
    }
    if (originRequire["name"] === "" || originRequire["name"] === undefined) {
      setInfo("???????????????????????????");
      setFailToastOpen(true);
      return;
    } else if (
      originRequire["description"] === "" ||
      originRequire["description"] === undefined
    ) {
      setInfo("???????????????????????????");
      setFailToastOpen(true);
      return;
    } /*else if (
      originRequire["state"] == 0 ||
      originRequire["state"] === undefined
    ) {
      setInfo("???????????????????????????");
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
          setInfo("????????????");
          setIsCreate(true);
          setSuccessToastOpen(true);
        } else if (res.code == 400) {
          //setInfo("??????????????????????????????????????????????????????????????????????????????");
          let message = res.data.data;
          if (/^001#/.test(message)) {
            showAlert("??????????????????????????????????????????");
          } else if (/^002#/.test(message)) {
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

  const updateOriginRequire = (event) => {
    // ????????????????????????????????????
    event.preventDefault();
    setModifyRequirementOpen(false);
    let updateOriginRequire = {
      id: originRequireId, // ???????????????????????? orgginRequire ??? id????????? url ?????? projectId
      name: convertEmpty(newOriginRequireName), // ??????????????????????????????
      description: convertEmpty(newOriginRequireDescription), // ??????????????????????????????
      state: newState, // 1~4: ?????????????????????????????????????????????
    };
    setNewOriginRequireName(undefined);
    setNewOriginRequireDescription(undefined);
    setNewState(undefined);
    if (projectId == 0 || projectId === "" || projectId === undefined) {
      setInfo("??????????????????????????????");
      setFailToastOpen(true);
      return;
    }
    if (
      updateOriginRequire["id"] == 0 ||
      updateOriginRequire["id" === ""] ||
      updateOriginRequire["id"] === undefined
    ) {
      setInfo("??????????????????????????????");
      setFailToastOpen(true);
      return;
    }
    if (updateOriginRequire["id"] < 1) {
      setInfo("??????????????????????????????");
      setFailToastOpen(true);
      return;
    }
    if (updateOriginRequire["id"] % 1 !== 0) {
      setInfo("??????????????????????????????");
      setFailToastOpen(true);
      return;
    }
    let checkPoint = 0;
    if (
      //updateOriginRequire["name"] === "?????????????????????????????????" ||
      updateOriginRequire["name"] === "" ||
      updateOriginRequire["name"] === undefined
    ) {
      checkPoint += 1;
    }
    if (
      //updateOriginRequire["description"] === "?????????????????????????????????" ||
      updateOriginRequire["description"] === "" ||
      updateOriginRequire["description"] === undefined
    ) {
      checkPoint += 1;
    }
    if (
      //updateOriginRequire["state"] === "???????????????????????????????????????" ||
      updateOriginRequire["state"] == 0 ||
      updateOriginRequire["state"] === undefined ||
      updateOriginRequire["state"] === ""
    ) {
      checkPoint += 1;
    }
    if (checkPoint === 3) {
      setInfo("?????????????????????????????????"); // ?????????????????????????????????????????????
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
          setInfo("????????????");

          setSuccessToastOpen(true);
        } else if (res.code === 400) {
          let message = res.data.data;
          if (/^001#/.test(message)) {
            showAlert("??????????????????????????????????????????");
          } else if (/^003#/.test(message)) {
            showAlert("??????????????????????????????????????????");
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

  const deleteOriginRequirement = () => {
    //! ???????????????????????????????????????
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
    display.name = "?????????";
  }
  if (description === "" || description === undefined) {
    display.description = "?????????";
  }
  if (functionState === "" || functionState === undefined) {
    display.functionState = "?????????";
  }
  if (createDate === "" || createDate === undefined) {
    display.createDate = "?????????";
  }
  if (updateDate === "" || updateDate === undefined) {
    display.updateDate = "?????????";
  }
  if (functionProjectId === "" || functionProjectId === undefined) {
    display.functionProjectId = "?????????";
  }
  if (
    functionOriginalRequirementId === "" ||
    functionOriginalRequirementId === undefined
  ) {
    display.functionOriginalRequirementId = "?????????";
  }
  if (deliveryIterationId === "" || deliveryIterationId === undefined) {
    display.deliveryIterationId = "?????????";
  }
  if (functionDeveloperId === "" || functionDeveloperId === undefined) {
    display.functionDeveloperId = "?????????";
  }
  if (distributorId === "" || distributorId === undefined) {
    display.distributorId = "?????????";
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
                    <TableCell>??????????????????</TableCell>
                    <TableCell>??????????????????</TableCell>
                    <TableCell>?????????????????????</TableCell>
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
        <DialogTitle> ?????????????????? </DialogTitle>
        <DialogContent>
          <TextField
            sx={{ m: 2, mx: "auto", width: 1, borderRadius: 0 }}
            margin="normal"
            required
            fullWidth
            label="??????????????????"
            name="originRequireName"
            onChange={handleInputChange}
            autoFocuss
          />
          <TextField
            sx={{ m: 2, mx: "auto", width: 1, borderRadius: 0 }}
            label="??????????????????"
            required
            name="originRequireDescription"
            onChange={handleInputChange}
          />
          {/*
          <FormControl
            sx={{ m: 2, mx: "auto", width: 1, borderRadius: 0 }}
            fullWidth
          >

            <InputLabel>????????????</InputLabel>
            <Select
              value={originRequireState}
              label="state"
              onChange={handleOriginRequireState}
            >
              <MenuItem value={1}>?????????</MenuItem>
              <MenuItem value={2}>?????????</MenuItem>
              <MenuItem value={3}>?????????</MenuItem>
              <MenuItem value={4}>?????????</MenuItem>
            </Select>
            --->

            </FormControl>
             */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddOriginRequirementCancelClose}>??????</Button>
          <Button onClick={createOriginRequire}> ?????? </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={modifyRequirementOpen}>
        <DialogTitle>??????????????????</DialogTitle>
        <DialogContent>
          <Alert severity="info">??????????????????????????????????????????</Alert>
          <TextField
            sx={{ m: 2, mx: "auto", width: 1, borderRadius: 0 }}
            fullWidth
            label="?????????????????????"
            name="newOriginRequireName"
            onChange={handleInputChange}
          />
          <TextField
            sx={{ m: 2, mx: "auto", width: 1, borderRadius: 0 }}
            label="?????????????????????"
            name="newOriginRequireDescription"
            onChange={handleInputChange}
          />
          {/*
          <FormControl
            sx={{ m: 2, mx: "auto", width: 1, borderRadius: 0 }}
            fullWidth
          >

            <InputLabel id="demo-simple-select-label">??????????????????</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={newState}
              label="newState"
              onChange={handleNewOriginRequireState}
            >
              <MenuItem value={1}>?????????</MenuItem>
              <MenuItem value={2}>?????????</MenuItem>
              <MenuItem value={3}>?????????</MenuItem>
              <MenuItem value={4}>?????????</MenuItem>
            </Select>
            </FormControl>
             */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModifyOriginRequirementCancelClose}>
            ??????
          </Button>
          <Button onClick={updateOriginRequire}> ?????? </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteRequirementOpen}>
        <DialogTitle>??????????????????</DialogTitle>
        <DialogContent>
          <Alert severity="error">
            <AlertTitle>WARN!!!</AlertTitle>
            ?????? ??? <strong>?????????????????????????????????????????????</strong>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteOriginRequirementCancelClose}>
            ??????
          </Button>
          <Button onClick={deleteOriginRequirement}>??????</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialogOpen}>
        <DialogTitle> ???????????????????????? </DialogTitle>
        <Alert severity="error">
          <AlertTitle>WARN!!!</AlertTitle>
          ?????? ??? <strong>?????????????????????????????????????????????</strong>
        </Alert>
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
              {/* <MenuItem value={2}>?????????</MenuItem> */}
              <MenuItem value={2}>?????????</MenuItem>
              <MenuItem value={3}>?????????</MenuItem>
            </Select>
          </FormControl>
          <Selection
            originRequireList={iterationList}
            id={newIterationId}
            setId={setNewIterationId}
            description={"?????????"}
          />
          <Selection
            originRequireList={systemList}
            id={systemServiceId}
            setId={setSystemServiceId}
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
            originRequireList={systemList}
            id={systemServiceId}
            setId={setSystemServiceId}
            description={"?????????????????????"}
          />
          <Selection
            originRequireList={iterationList}
            id={iterationId}
            setId={setIterationId}
            description={"???????????????"}
          />
          <Selection
            originRequireList={devloperList.map((ele) => {
              return { name: ele.username, id: ele.id };
            })}
            id={developerId}
            setId={setDeveloperId}
            description={"????????????????????????"}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleAddDialogCancelClose()}> ?????? </Button>
          <Button onClick={() => handleAddDialogAcceptClose()}> ?????? </Button>
        </DialogActions>
      </Dialog>
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
