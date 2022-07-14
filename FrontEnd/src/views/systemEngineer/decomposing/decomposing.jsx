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
import Typography from "@mui/material/Typography";
import { Card, Stack, TableContainer, TablePagination } from "@mui/material";
import Paper from "@mui/material/Paper";
import { useState } from "react";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Fade from "@mui/material/Fade";
import Menu from "@mui/material/Menu";

let IR_LIST = [...Array(8)].map((_, index) => ({
  id: index,
  name: "IR",
  description: "Initial Requirement",
  creatorname: "System Engineer",
  functionalRequirementIds: [
    {
      id: 0,
      name: "Funtional Requirement 1",
      description: "Functional Description 1",
    },
    {
      id: 1,
      name: "Funtional Requirement 2",
      description: "Functional Description 2",
    },
  ],
}));

Iconify.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  sx: PropTypes.object,
};

function Iconify({ icon, sx, ...other }) {
  return <Box component={Icon} icon={icon} sx={{ ...sx }} {...other} />;
}

function Row({ requirement, setAddDialogOpen, setDialogId }) {
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const menuopen = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  function handleAddFunctinoalRequirement() {
    handleClose();
    setAddDialogOpen(true);
    setDialogId(requirement.id);
  }

  function handleDeleteFunctinoalRequirement() {
    handleClose();
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
        <TableCell component="th" scope="row">
          {requirement.id}
        </TableCell>
        <TableCell>{requirement.name}</TableCell>
        <TableCell>{requirement.description}</TableCell>
        <TableCell>{requirement.creatorname}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Stack direction="row" spacing={2}>
                <Typography variant="h6" component="div">
                  功能需求
                </Typography>
              </Stack>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>名称</TableCell>
                    <TableCell>描述</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requirement.functionalRequirementIds.map((functional) => (
                    <TableRow key={functional.id}>
                      <TableCell component="th" scope="row">
                        {functional.id}
                      </TableCell>
                      <TableCell>{functional.name}</TableCell>
                      <TableCell>{functional.description}</TableCell>
                      <TableCell>
                        <Button
                          id="fade-button"
                          aria-controls={menuopen ? "fade-menu" : undefined}
                          aria-haspopup="true"
                          aria-expanded={menuopen ? "true" : undefined}
                          onClick={handleClick}
                        >
                          操作
                        </Button>
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
                          <MenuItem onClick={handleAddFunctinoalRequirement}>
                            新增
                          </MenuItem>
                          <MenuItem onClick={handleDeleteFunctinoalRequirement}>
                            删除
                          </MenuItem>
                        </Menu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function Decomposing() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [modifyDialogOpen, setModifyDialogOpen] = useState(false);
  const [dialogId, setDialogId] = useState(0);
  const [functionId, setFunctionId] = useState(0);
  const [functionalName, setFunctionalName] = useState("");
  const [functionalDescription, setFunctionalDescription] = useState("");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddDialogCancelClose = () => {
    setAddDialogOpen(false);
  };

  const handleAddDialogAcceptClose = () => {
    setAddDialogOpen(false);
    let functionalRequirement = {
      name: functionalName,
      description: functionalDescription,
      originalRequirementId: dialogId,
    };
    IR_LIST[
      functionalRequirement.originalRequirementId
    ].functionalRequirementIds.push({
      id: IR_LIST[functionalRequirement.originalRequirementId]
        .functionalRequirementIds.length,
      name: functionalRequirement.name,
      description: functionalRequirement.description,
    });
  };

  const handleModifyDialogCancelClose = () => {
    setModifyDialogOpen(false);
  };

  const handleModifyDialogAcceptClose = () => {
    setModifyDialogOpen(false);
    IR_LIST[dialogId].functionalRequirementIds[functionId].name =
      functionalName;
    IR_LIST[dialogId].functionalRequirementIds[functionId].description =
      functionalDescription;
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
                    <TableCell>ID</TableCell>
                    <TableCell>原始需求</TableCell>
                    <TableCell>描述</TableCell>
                    <TableCell>管理员</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {IR_LIST.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  ).map((requirement) => {
                    return (
                      <Row
                        key={requirement.id}
                        requirement={requirement}
                        setAddDialogOpen={setAddDialogOpen}
                        setModifyDialogOpen={setModifyDialogOpen}
                        setDialogId={setDialogId}
                        setFunctionId={setFunctionId}
                      />
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={IR_LIST.length}
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
          >
            <Button variant="contained">保存</Button>
            <Button variant="outlined">重置</Button>
          </Stack>
        </Container>
      </Box>

      <Dialog open={addDialogOpen}>
        <DialogTitle> 添加原始需求 </DialogTitle>
        <DialogContent>
          <DialogContentText>当前原始需求{dialogId}</DialogContentText>
          <TextField
            margin="normal"
            required
            fullWidth
            id="filled-basic"
            label="name"
            variant="filled"
            onChange={(event) => setFunctionalName(event.target.value)}
          ></TextField>
          <TextField
            margin="normal"
            required
            fullWidth
            id="filled-basic"
            label="description"
            variant="filled"
            onChange={(event) => setFunctionalDescription(event.target.value)}
          ></TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddDialogCancelClose}> 取消 </Button>
          <Button onClick={handleAddDialogAcceptClose}> 确定 </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={modifyDialogOpen}>
        <DialogTitle> 修改原始需求 </DialogTitle>
        <DialogContent>
          <DialogContentText>当前原始需求{dialogId}</DialogContentText>
          <TextField
            margin="normal"
            required
            fullWidth
            id="filled-basic"
            label="name"
            variant="filled"
            onChange={(event) => setFunctionalName(event.target.value)}
          ></TextField>
          <TextField
            margin="normal"
            required
            fullWidth
            id="filled-basic"
            label="description"
            variant="filled"
            onChange={(event) => setFunctionalDescription(event.target.value)}
          ></TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModifyDialogCancelClose}> 取消 </Button>
          <Button onClick={handleModifyDialogAcceptClose}> 确定 </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
