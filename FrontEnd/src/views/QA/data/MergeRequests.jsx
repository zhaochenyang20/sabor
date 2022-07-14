import * as React from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Get } from "../../../utils/communication";
import cookie from "react-cookies";
import Card from "@mui/material/Card";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import TableBody from "@mui/material/TableBody";
import TablePagination from "@mui/material/TablePagination";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";
import PsychologyIcon from "@mui/icons-material/Psychology";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import Functional from "./Functional";
import SelectSR from "./SelectSR";
import DeleteSR from "./DeleteSR";

export default function MergeRequests() {
  const [load, setLoad] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [MR_LIST, setMR_LIST] = useState([]);
  const [ALL_SR_LIST, setALL_SR_LIST] = useState([]);
  const headers = { Authorization: "Bearer " + cookie.load("token") };
  const { projectIndex } = useParams();

  function GetAllSRList() {
    const url =
      process.env.REACT_APP_BACKEND_URL +
      "api/projects/" +
      projectIndex +
      "/find-all-func-require/0";
    const body = {
      id: projectIndex,
      ori: 0,
    };
    Get(
      url,
      body,
      (response) => {
        if (response.code === 200) {
          setALL_SR_LIST(response.data);
        }
      },
      headers
    );
  }

  function GetMRList() {
    const url =
      process.env.REACT_APP_BACKEND_URL +
      "api/projects/" +
      projectIndex +
      "/git/get-merge-request";

    const body = {
      id: projectIndex,
    };

    Get(
      url,
      body,
      (response) => {
        if (response.code === 200) {
          GetAllSRList();
          setMR_LIST(response.data.content);
          setLoad(true);
        }
      },
      headers
    );
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    if (!load) GetMRList();
  });

  function Row({ content }) {
    const [openMenu, setOpenMenu] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [openAdd, setOpenAdd] = React.useState(false);
    const [openDelete, setOpenDelete] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [autoSuggest, setAutoSuggest] = useState([]);

    const getAutoSuggest = () => {
      const url =
        process.env.REACT_APP_BACKEND_URL +
        "api/projects/" +
        projectIndex +
        "/git/get-mr-suggest/" +
        content.id;
      const body = {
        id: projectIndex,
        mr: content.id,
      };
      Get(
        url,
        body,
        (response) => {
          if (response.code === 200) {
            setAutoSuggest(response.data);
            //   setSuggested(true);
          }
        },
        headers
      );
    };

    const handleMenuClick = (event) => {
      setAnchorEl(event.currentTarget);
      setOpenMenu(true);
      getAutoSuggest();
    };

    const handleMenuClose = () => {
      setOpenMenu(false);
    };
    const handleCloseAdd = () => {
      setOpenAdd(false);
      setOpenMenu(false);
    };
    const handleCloseDelete = () => {
      setOpenDelete(false);
      setOpenMenu(false);
    };

    const handleConnect = () => {
      setOpenAdd(true);
    };

    const handleDisconnect = () => {
      setOpenDelete(true);
    };

    function GetSRList(id) {
      if (MR_LIST === []) {
        return [{ id: "暂无", name: "暂无", description: "暂无" }];
      } else if (
        MR_LIST.find((MR) => MR.id === id).relatedFunctionalRequirement
          .length === 0
      ) {
        return [{ id: "暂无", name: "暂无", description: "暂无" }];
      } else {
        return MR_LIST.find((MR) => MR.id === id).relatedFunctionalRequirement;
      }
    }

    function handleFlushAdd(id, addList) {
      const oldList = MR_LIST.find(
        (MR) => MR.id === id
      ).relatedFunctionalRequirement;
      const newList = [...oldList, ...addList].sort((a, b) => {
        return a.id - b.id;
      });
      MR_LIST.find((MR) => MR.id === id).relatedFunctionalRequirement = newList;
    }

    function handleFlushDelete(id, deleteList_id) {
      const oldList = MR_LIST.find(
        (MR) => MR.id === id
      ).relatedFunctionalRequirement;
      const newList = oldList.filter((SR) => !deleteList_id.includes(SR.id));
      MR_LIST.find((MR) => MR.id === id).relatedFunctionalRequirement = newList;
    }

    return (
      <React.Fragment>
        <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
          <TableCell sx={{ width: "30px" }}>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell
            component="th"
            scope="row"
            sx={{ width: "60px", height: "30px" }}
          >
            {content.id}
          </TableCell>
          <TableCell sx={{ width: "360px", height: "30px" }}>
            {content.title}
          </TableCell>
          <TableCell sx={{ width: "360px", height: "30px" }}>
            {content.content}
          </TableCell>
          <TableCell sx={{ width: "60px" }}>
            <Box>
              <Button onClick={handleMenuClick}>操作</Button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleMenuClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem onClick={handleConnect}>关联功能需求</MenuItem>
                <MenuItem onClick={handleDisconnect}>解除当前关联</MenuItem>
              </Menu>
              <SelectSR
                content={content}
                SR_LIST={ALL_SR_LIST}
                alreadyConnected={GetSRList(content.id)}
                openDialog={openAdd}
                setOpenDialog={setOpenAdd}
                onClose={handleCloseAdd}
                autoSuggest={autoSuggest}
                setOpenMenu={setOpenMenu}
                handleFlushAdd={handleFlushAdd}
                openCollapse={open}
                setOpenCollapse={setOpen}
              />
              <DeleteSR
                content={content}
                SR_LIST={ALL_SR_LIST}
                alreadyConnected={GetSRList(content.id)}
                openDialog={openDelete}
                setOpenDialog={setOpenDelete}
                onClose={handleCloseDelete}
                setOpenMenu={setOpenMenu}
                handleFlushDelete={handleFlushDelete}
                openCollapse={open}
                setOpenCollapse={setOpen}
              />
            </Box>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box
                sx={{
                  bgcolor: "text.disable",
                  color: "primary.main",
                  boxShadow: 4,
                  borderRadius: 2,
                  p: 4,
                  m: 4,
                  minWidth: 300,
                }}
              >
                <Box sx={{ marginLeft: "8%", marginBottom: 3 }}>
                  <Typography color="light-green" variant="h5">
                    已关联的功能需求
                  </Typography>
                </Box>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ width: "10%" }} />
                      <TableCell sx={{ width: "20%" }}>
                        <Box>
                          <PsychologyIcon />
                          <Typography variant="h6">需求</Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ width: "40%" }}>
                        <Box>
                          <DescriptionOutlinedIcon />
                          <Typography variant="h6">描述</Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ width: "30%" }} />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {" "}
                    {GetSRList(content.id).map((content) => {
                      return (
                        <Functional
                          key={content.id}
                          content={content}
                          mode="large"
                        />
                      );
                    })}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }

  return (
    <Box>
      {MR_LIST.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            marginTop: 3,
          }}
        >
          暂时没有合并请求
        </Box>
      ) : (
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h4">合并请求统计</Typography>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Card>
              <TableContainer component={Paper}>
                <Table
                  sx={{
                    width: 1,
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell />
                      <TableCell sx={{ width: "60px", height: "30px" }}>
                        <Typography variant="h6">序号</Typography>
                      </TableCell>
                      <TableCell sx={{ width: "60px", height: "30px" }}>
                        <Typography variant="h6">标题</Typography>
                      </TableCell>
                      <TableCell sx={{ width: "60px", height: "30px" }}>
                        <Typography variant="h6">描述</Typography>
                      </TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {" "}
                    {MR_LIST.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    ).map((content) => {
                      return <Row key={content.id} content={content} />;
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={MR_LIST.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Card>
          </Paper>
        </Paper>
      )}
    </Box>
  );
}
