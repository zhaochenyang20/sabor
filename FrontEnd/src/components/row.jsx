import * as React from "react";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Menu from "@mui/material/Menu";
import Fade from "@mui/material/Fade";
import MenuItem from "@mui/material/MenuItem";
import Collapse from "@mui/material/Collapse";
import Box from "@mui/material/Box";
import { TableContainer, TablePagination } from "@mui/material";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import SettingsIcon from "@mui/icons-material/Settings";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import showTime from "../utils/time";
import Paper from "@mui/material/Paper";
import { useState } from "react";

export default function Row({
  requirement,

  //* 传给子组件用来设置功能需求的id
  setFunctionalRequirementId,

  //! 这个 dialog 在此处是具体的迭代
  setAddDialogOpen,
  setModifyDialogOpen,
  setDeleteDialogOpen,
  setDialogId,

  //* 项目 id
  projectId,

  //! 所有的功能需求的 id 列表
  functionalList,

  //! 传给子组件，设置功能需求的 id
  setFunctionId,

  //! 传给子组件，为当前 IR 增加功能需求

  setCreateDate,
  setDeliveryIterationId,
  setDescription,
  setFunctionDeveloperId,
  setDistributorId,
  setId,
  setName,
  setFunctionOriginalRequirementId,
  setFunctionProjectId,
  setFunctionState,
  setUpdateDate,
  setFunctionInfoOpen,

  //! 传给子组件，显示功能详情

  setModifyRequirementOpen,
  setDeleteRequirementOpen,
  setOldId,
  setDeleIterationId,

  displayKey,
  //! displayKey 为 1，对应需求管理，显示创始人
  //! displayKey 为 2，对应服务管理，显示创建时间
  //! displayKey 为 3，对应迭代管理，显示负责人

  infoDict,
}) {
  //* 下拉按钮的控制器件，在 Row 上
  const [open, setOpen] = React.useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (functionalList === undefined) {
    functionalList = "[]";
  }
  functionalList = JSON.parse(functionalList);

  function handleAddFunctinoalRequirement() {
    //! 注意这里的添加之后还是异步问题，会导致白屏
    setDialogId(requirement.id);
    setAddDialogOpen(true);
  }
  //! modify 和 delete 应该是 Row 的子组件

  const [anchor, setAnchor] = React.useState(undefined);
  const menuOpen = Boolean(anchor);
  const handleClickMenu = (event) => {
    setAnchor(event.currentTarget);
  };
  //! 设置弹出菜单的开关

  const handleCloseMenu = () => {
    setAnchor(undefined);
  };

  const handleModifyRequirement = () => {
    handleCloseMenu();
    setOldId(requirement.id);
    setModifyRequirementOpen(true);
  };

  const handleDeleteRequirement = () => {
    handleCloseMenu();
    setDeleIterationId(requirement.id);
    setDeleteRequirementOpen(true);
  };

  let display = undefined;
  if (displayKey === 3) {
    display = [
      requirement.directorUsername,
      showTime(new Date(requirement.deadline).toDateString(), false),
    ];
  } else if (displayKey === 2) {
    display = [
      showTime(new Date(requirement.createDate).toDateString(), false),
    ];
  } else if (displayKey === 1) {
    display = [requirement.creatorName];
  }

  let displayName = requirement.name;
  if (requirement.name.length >= 25) {
    displayName = requirement.name.substring(0, 25) + "...";
  } else {
    displayName = requirement.name;
  }

  let displayDescription = requirement.description;
  if (requirement.description.length >= 25) {
    displayDescription = requirement.description.substring(0, 25) + "...";
  } else {
    displayDescription = requirement.description;
  }

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{displayName}</TableCell>
        <TableCell>{displayDescription}</TableCell>
        {display.map((ele, id) => {
          return <TableCell key={id}> {ele} </TableCell>;
        })}
        <TableCell align="center">
          <SettingsIcon
            id="fade-button"
            aria-controls={menuOpen ? "fade-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={menuOpen ? "true" : undefined}
            onClick={handleClickMenu}
          />
          <Menu
            id="fade-menu"
            MenuListProps={{
              "aria-labelledby": "fade-button",
            }}
            anchorEl={anchor}
            open={menuOpen}
            onClose={handleCloseMenu}
            TransitionComponent={Fade}
          >
            <MenuItem onClick={handleModifyRequirement}>修改</MenuItem>
            <MenuItem onClick={handleDeleteRequirement}>删除</MenuItem>
          </Menu>
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
              <Stack direction="row" spacing={2}>
                <Typography variant="h6">功能需求</Typography>
                <AddCircleOutlineIcon
                  sx={{ m: 2 }}
                  size="small"
                  align="right"
                  onClick={handleAddFunctinoalRequirement}
                />
              </Stack>
              <TableContainer component={Paper}>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>功能需求名称</TableCell>
                      <TableCell>功能需求说明</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {requirement.functionalRequirements
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((functional) => {
                        return (
                          <Functional
                            key={functional.id}
                            setAddDialogOpen={setAddDialogOpen}
                            setDialogId={setDialogId}
                            functionalId={functional.id}
                            projectId={projectId}
                            functionalRequirement={functional}
                            setFunctionalRequirementId={
                              setFunctionalRequirementId
                            }
                            setModifyDialogOpen={setModifyDialogOpen}
                            setDeleteDialogOpen={setDeleteDialogOpen}
                            dialogId={functional.originalRequirementId}
                            setFunctionId={setFunctionId}
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
                count={requirement.functionalRequirements.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

function Functional({
  functionalId,
  functionalRequirement,
  setModifyDialogOpen,
  setDeleteDialogOpen,
  setDialogId,
  setFunctionalRequirementId,
  setFunctionId,
  setCreateDate,
  setDeliveryIterationId,
  setDescription,
  setFunctionDeveloperId,
  setDistributorId,
  setId,
  setName,
  setFunctionOriginalRequirementId,
  setFunctionProjectId,
  setFunctionState,
  setUpdateDate,
  setFunctionInfoOpen,
  infoDict,
}) {
  setFunctionalRequirementId(functionalId);
  const [anchorEl, setAnchorEl] = React.useState(undefined);
  const menuopen = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  //! 设置弹出菜单的开关
  const handleClose = () => {
    setAnchorEl(undefined);
  };
  function handleModifyFunctinoalRequirement() {
    handleClose();
    setModifyDialogOpen(true);
    setDialogId(functionalRequirement.originalRequirementId);
    setFunctionId(functionalRequirement.id);
  }
  function handleDeleteFunctinoalRequirement() {
    handleClose();
    setDeleteDialogOpen(true);
    setFunctionId(functionalId);
    setDialogId(functionalRequirement.originalRequirementId);
  }
  let devloperDict = infoDict.devloperDict;
  let iterationDict = infoDict.iterationDict;
  let originRequireDict = infoDict.originRequireDict;
  let userDict = infoDict.userDict;

  function handleInfoFunctinoalRequirement() {
    handleClose();
    setFunctionInfoOpen(true);

    setDeliveryIterationId(
      ((id) => {
        if (!id) return "暂无";
        let res = iterationDict.find((ele) => ele.id === id);
        return res && res.name;
      })(functionalRequirement.deliveryIterationId)
    );

    setDescription(functionalRequirement.description);

    setFunctionDeveloperId(
      ((id) => {
        if (!id) return "暂无";
        let res = devloperDict.find((ele) => ele.id === id);
        return res && res.username;
      })(functionalRequirement.developerId)
    );

    setDistributorId(
      ((id) => {
        if (!id) return "暂无";
        let res = userDict.find((ele) => ele.id === id);
        return res && res.username;
      })(functionalRequirement.distributorId)
    );

    setId(functionalRequirement.id);
    setName(functionalRequirement.name);

    setFunctionOriginalRequirementId(
      ((id) => {
        if (!id) return "暂无";
        let res = originRequireDict.find((ele) => ele.id === id);
        return res && res.name;
      })(functionalRequirement.originalRequirementId)
    );

    setFunctionProjectId(functionalRequirement.projectId);
    setFunctionState(functionalRequirement.state);
    setCreateDate(
      showTime(new Date(functionalRequirement.createDate), false).toString()
    );
    setUpdateDate(
      showTime(new Date(functionalRequirement.updateDate), false).toString()
    );
    if (functionalRequirement.projectId == 0) {
      setFunctionProjectId("暂无");
    }
    if (functionalRequirement.state == 0) {
      setFunctionState("暂无");
    }
    if (functionalRequirement.state == 1) {
      setFunctionState("初始化");
    }
    if (functionalRequirement.state == 2) {
      setFunctionState("进行中");
    }
    if (functionalRequirement.state == 3) {
      setFunctionState("已交付");
    }
    if (functionalRequirement.state == 4) {
      setFunctionState("已完成");
    }
  }

  let displayName = functionalRequirement.name;
  if (functionalRequirement.name.length >= 25) {
    displayName = functionalRequirement.name.substring(0, 25) + "...";
  } else {
    displayName = functionalRequirement.name;
  }

  let displayDescription = functionalRequirement.description;
  if (functionalRequirement.description.length >= 25) {
    displayDescription =
      functionalRequirement.description.substring(0, 25) + "...";
  } else {
    displayDescription = functionalRequirement.description;
  }

  return (
    <TableRow key={functionalId}>
      <TableCell>{displayName}</TableCell>
      <TableCell>{displayDescription}</TableCell>
      <TableCell align="right">
        <AutoGraphIcon
          id="fade-button"
          aria-controls={menuopen ? "fade-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={menuopen ? "true" : undefined}
          onClick={handleClick}
        />
        <Menu
          id="fade-menu"
          MenuListProps={{
            "aria-labelledby": "fade-button",
          }}
          anchorEl={anchorEl}
          open={menuopen}
          onClose={handleClose}
          TransitionComponent={Fade}
        >
          <MenuItem onClick={handleInfoFunctinoalRequirement}>详情</MenuItem>
          <MenuItem onClick={handleModifyFunctinoalRequirement}>修改</MenuItem>
          <MenuItem onClick={handleDeleteFunctinoalRequirement}>删除</MenuItem>
        </Menu>
      </TableCell>
    </TableRow>
  );
}
