import * as React from "react";
import { useState, useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";

import axios from "axios";
import cookie from "react-cookies";

import Card from "@mui/material/Card";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableHead from "@mui/material/TableHead";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import Switch from "@mui/material/Switch";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import Label from "./label";
import SuccessAlert from "../../../components/successalert";
import FailAlert from "../../../components/failalert";

function FunctionalRow({ functional, handleModification }) {
  let { projectIndex } = useParams();
  let token = cookie.load("token");
  const headers = { Authorization: "Bearer " + token };
  const url = process.env.REACT_APP_BACKEND_URL + "api/users/find";
  const [username, setUsername] = useState("");
  const [load, setLoad] = useState(false);

  function getUsername() {
    setLoad(true);
    axios
      .post(
        url,
        {
          id: functional.developerId,
        },
        { headers }
      )
      .then((response) => {
        setUsername(response.data.data.username);
      })
      .catch((error) => {
        if (error.response.data.code) setUsername("??????");
      });
  }
  useEffect(() => {
    if (!load) getUsername();
  });

  return (
    <TableRow hover tabIndex={-1} role="checkbox">
      <TableCell component="th" align="center" scope="row" padding="none">
        {functional.name}
      </TableCell>
      <TableCell align="center">{functional.description}</TableCell>
      <TableCell align="center">{username}</TableCell>
      <TableCell align="center">
        <Label
          variant="ghost"
          color={
            (functional.state === 1 && "info") ||
            (functional.state === 2 && "error") ||
            "success"
          }
        >
          {functional.state === 1
            ? "?????????"
            : functional.state === 2
            ? "?????????"
            : "?????????"}
        </Label>
      </TableCell>
      <TableCell align="center">
        <Button
          onClick={(event) =>
            handleModification(
              event,
              functional.id,
              functional.name,
              functional.state
            )
          }
          variant="outlined"
        >
          ??????
        </Button>
      </TableCell>
    </TableRow>
  );
}

export default function DemandsList() {
  let { projectIndex } = useParams();
  let token = cookie.load("token");
  const [page, setPage] = useState(0);
  const [developerId, setDeveloperId] = useState(0);
  const [developerIdLoad, setDeveloperIdLoad] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogId, setDialogId] = useState(0);
  const [dialogStatus, setDialogStatus] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [requirementList, setRequirementList] = useState([]);
  const [functionalList, setFunctionalList] = useState([]);
  const [loadOriginFinished, setLoadOriginFinished] = useState(false);
  const [loadFunctionStarted, setLoadFunctionStarted] = useState(false);
  const [successToastOpen, setSuccessToastOpen] = useState(false);
  const [failToastOpen, setFailToastOpen] = useState(false);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const open = Boolean(anchorEl);
  const [newFunctionalLoad, setNewFunctionalLoad] = useState(false);
  const [self, setSelf] = useState(false);
  const [selfFunctionalList, setSelfFunctionalList] = useState([]);
  const [fullFunctionalList, setFullFunctionalList] = useState([]);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (event, values) => {
    if (values !== "") {
      setDialogStatus(values);
    }
    setAnchorEl(null);
  };

  const handleSuccessAlertClose = () => {
    setSuccessToastOpen(false);
  };

  const handleFailAlertClose = () => {
    setFailToastOpen(false);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleAcceptClose = () => {
    setDialogOpen(false);
    postStateModification(dialogId, dialogStatus);
  };

  const handleCancelClose = () => {
    setDialogOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleModification = (event, index, functional, state) => {
    event.preventDefault();
    setDialogTitle(functional);
    setDialogId(index);
    if (state === 1) setDialogStatus("?????????");
    else if (state === 2) setDialogStatus("?????????");
    else setDialogStatus("?????????");
    setDialogOpen(true);
  };

  function getRequirementList() {
    setLoadOriginFinished(true);
    const headers = { Authorization: "Bearer " + token };
    const url =
      process.env.REACT_APP_BACKEND_URL +
      "api/projects/" +
      projectIndex +
      "/find-all-ori-require";
    axios
      .get(url, { headers })
      .then((response) => {
        setRequirementList(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function getFunctionList() {
    setLoadFunctionStarted(true);
    Promise.allSettled(
      requirementList.map((requirement) => {
        const functional_url =
          process.env.REACT_APP_BACKEND_URL +
          "api/projects/" +
          projectIndex +
          "/find-all-func-require/" +
          requirement.id;
        const headers = { Authorization: "Bearer " + token };
        return axios.get(functional_url, { headers });
      })
    ).then((response) => {
      let tempFunctionalList = [];
      for (let index in response) {
        for (let functionIndex in response[index].value.data.data) {
          tempFunctionalList.push(
            response[index].value.data.data[functionIndex]
          );
        }
      }
      tempFunctionalList.sort(function (a, b) {
        return b.updateDate - a.updateDate;
      });
      let tempFunctionalDict = new Array();
      for (let index in response) {
        for (let functionIndex in response[index].value.data.data) {
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
      setFunctionalList(tempFunctionalList);
    });
  }

  function getNewFunctionalList() {
    const headers = { Authorization: "Bearer " + token };
    const url =
      process.env.REACT_APP_BACKEND_URL +
      "api/projects/" +
      projectIndex +
      "/find-all-func-require/0";
    setNewFunctionalLoad(true);
    axios
      .get(url, { headers })
      .then((response) => {
        if (!self) setFunctionalList(response.data.data);
        else
          setFunctionalList(
            response.data.data.filter((requirement) => {
              return requirement.developerId === developerId;
            })
          );
        setSelfFunctionalList(
          response.data.data.filter((requirement) => {
            return requirement.developerId === developerId;
          })
        );
        setFullFunctionalList(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function postStateModification(index, state) {
    const headers = { Authorization: "Bearer " + token };
    const url =
      process.env.REACT_APP_BACKEND_URL +
      "api/projects/" +
      projectIndex +
      "/change-func-require-state";
    let realState = state === "?????????" ? 1 : state === "?????????" ? 2 : 3;
    axios
      .post(url, { id: index, state: realState }, { headers })
      .then((response) => {
        if (response.data.code === 200) {
          setSuccessToastOpen(true);
        } else {
          setFailToastOpen(true);
        }
        getNewFunctionalList();
        forceUpdate();
      })
      .catch(() => {
        setFailToastOpen(true);
      });
  }

  function getDeveloperId() {
    let token = cookie.load("token");
    let username = cookie.load("username");
    const headers = { Authorization: "Bearer " + token };
    const url_find = process.env.REACT_APP_BACKEND_URL + "/api/users/find";
    axios
      .post(url_find, { username: username }, { headers })
      .then((response) => {
        setDeveloperId(response.data.data.id);
        setDeveloperIdLoad(true);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    /*if (!loadOriginFinished) {
      getRequirementList();
    }
    if (loadOriginFinished && !loadFunctionStarted) {
      setLoadFunctionStarted(true);
      getFunctionList();
    }*/
    if (!developerIdLoad) {
      getDeveloperId();
    }
    if (!newFunctionalLoad && developerIdLoad) {
      getNewFunctionalList();
    }
  });

  return (
    <React.Fragment>
      <Grid container>
        <Grid xs={6} item>
          <Typography variant="h4">????????????</Typography>
        </Grid>
        <Grid xs={6} item align="right">
          <Typography variant="body">???????????????????????????</Typography>
          <Switch
            checked={self}
            onChange={() => {
              setSelf(!self);
              setFunctionalList(self ? fullFunctionalList : selfFunctionalList);
            }}
          />
        </Grid>
      </Grid>
      <Card>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: "20%" }} align="center">
                  ????????????
                </TableCell>
                <TableCell sx={{ width: "40%" }} align="center">
                  ????????????
                </TableCell>
                <TableCell sx={{ width: "20%" }} align="center">
                  ?????????
                </TableCell>
                <TableCell sx={{ width: "10%" }} align="center">
                  ????????????
                </TableCell>
                <TableCell sx={{ width: "10%" }} align="center">
                  ??????
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {functionalList
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((functional) => {
                  return (
                    <FunctionalRow
                      key={functional.id}
                      functional={functional}
                      handleModification={handleModification}
                    />
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={functionalList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
      <Dialog open={dialogOpen} onClose={handleClose}>
        <DialogTitle align="center"> ???????????????????????? </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography color="text.secondary" sx={{ p: 1 }}>
              ?????????????????????{dialogTitle}
            </Typography>
          </DialogContentText>
          <Grid container sx={{ p: 1 }}>
            <Grid item xs={12} align="center">
              <Stack direction="row">
                <Typography color="text.secondary" sx={{ pt: 1, pb: 1 }}>
                  ?????????????????????
                </Typography>
                <Button
                  id="basic-button"
                  aria-controls={open ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleMenuClick}
                >
                  {dialogStatus}
                </Button>
              </Stack>
            </Grid>
          </Grid>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={(event) => handleMenuClose(event, "")}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem
              onClick={(event) => handleMenuClose(event, "?????????")}
              value="?????????"
            >
              ?????????
            </MenuItem>
            <MenuItem
              onClick={(event) => handleMenuClose(event, "?????????")}
              value="?????????"
            >
              ?????????
            </MenuItem>
            <MenuItem
              onClick={(event) => handleMenuClose(event, "?????????")}
              value="?????????"
            >
              ?????????
            </MenuItem>
          </Menu>
        </DialogContent>
        <DialogActions>
          <Button align="left" onClick={handleCancelClose}>
            ??????
          </Button>
          <Button align="right" onClick={handleAcceptClose}>
            ??????
          </Button>
        </DialogActions>
      </Dialog>
      <SuccessAlert
        successToastOpen={successToastOpen}
        handleSuccessAlertClose={handleSuccessAlertClose}
      />
      <FailAlert
        failToastOpen={failToastOpen}
        handleFailAlertClose={handleFailAlertClose}
      />
    </React.Fragment>
  );
}
