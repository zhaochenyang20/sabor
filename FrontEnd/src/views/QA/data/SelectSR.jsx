import * as React from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import DialogTitle from "@mui/material/DialogTitle";
import cookie from "react-cookies";
import Button from "@mui/material/Button";
import { Post } from "../../../utils/communication";
import { useParams } from "react-router-dom";
import { useState } from "react";
import Typography from "@mui/material/Typography";
import Functional from "./Functional";
import Collapse from "@mui/material/Collapse";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import SuccessAlert from "../../../components/successalert";
import FailAlert from "../../../components/failalert";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function SelectSR({
  content, //该对话框关联的Merge Request本体信息
  SR_LIST, //所有的SR列表
  alreadyConnected, //已经关联的SR列表
  openDialog, //该对话框自身的打开状态
  setOpenDialog, //该对话框自身的打开状态的设置函数hook
  onClose, //该对话框自身的如何关闭
  autoSuggest, //自动建议的绑定SR信息
  setOpenMenu, //该对话框父对象(Row)的组件Menu的打开状态的设置函数hook
  handleFlushAdd, //改变父对象的部分信息
  openCollapse, //该对话框父对象(Row)的组件Collapse的打开状态
  setOpenCollapse, //该对话框父对象(Row)的组件Collapse的打开状态的设置函数hook
}) {
  const headers = { Authorization: "Bearer " + cookie.load("token") };
  const { projectIndex } = useParams();
  const [selected, setSelected] = useState([]);
  const [openSuggestion, setOpenSuggestion] = useState(false);
  const [successToastOpen, setSuccessToastOpen] = useState(false);
  const [failToastOpen, setFailToastOpen] = useState(false);
  const [info, setInfo] = useState(undefined);

  const handleSuccessAlertClose = () => {
    setSuccessToastOpen(false);
  };

  const handleFailAlertClose = () => {
    setFailToastOpen(false);
  };

  function haveNotConnected() {
    var lst = [];
    for (let i = 0; i < SR_LIST.length; i++) {
      var push = true;
      for (let j = 0; j < alreadyConnected.length; j++) {
        if (SR_LIST[i].id === alreadyConnected[j].id) {
          push = false;
          break;
        }
      }
      if (push) {
        lst.push(SR_LIST[i]);
      }
    }
    return lst;
  }

  const submitConnect = () => {
    const url =
      process.env.REACT_APP_BACKEND_URL +
      "api/projects/" +
      projectIndex +
      "/git/attach-merge-req-with-func-req/";
    var body = {
      addItem: [],
    };
    for (let i = 0; i < selected.length; i++) {
      body.addItem.push({
        functionalRequestId: selected[i],
        mergeRequestId: content.id,
      });
    }
    Post(
      url,
      body,
      (response) => {
        if (response.code === 200) {
          var selectedDetails = [];
          for (let i = 0; i < selected.length; i++) {
            selectedDetails.push(
              SR_LIST.find((item) => item.id === selected[i])
            );
          }
          handleFlushAdd(content.id, selectedDetails);
          let opened = openCollapse;
          setOpenCollapse(false);
          setOpenCollapse(opened);
          setInfo(selected.length ? "关联成功" : "您未选择任何需求");
          setSuccessToastOpen(true);
          setSelected([]);
        } else {
          setInfo("关联失败");
          setFailToastOpen(true);
        }
      },
      headers
    );
    setOpenDialog(false);
    setOpenMenu(false);
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelected(value);
  };

  const handleShowSuggestions = () => {
    console.log(autoSuggest);
    setOpenSuggestion(!openSuggestion);
  };

  const handleAddToSelect = () => {
    console.log(content.id);
  };

  return (
    <React.Fragment>
      <Box>
        <Dialog open={openDialog} onClose={onClose}>
          <DialogTitle>关联功能需求</DialogTitle>
          <DialogContent>
            <Typography variant="h6">{"MR #" + content.id}</Typography>
            <Typography>
              {" "}
              {"标题: " +
                (content.title.length > 60
                  ? content.title.substring(0, 60) + "..."
                  : content.title)}
            </Typography>
            <Typography>
              {" "}
              {"描述: " +
                (content.content.length > 60
                  ? content.content.substring(0, 60) + "..."
                  : content.content)}
            </Typography>
            <Box sx={{ marginTop: 2 }}>
              <Grid
                container
                spacing={9}
                alignItems="center"
                sx={{ display: "flex" }}
              >
                <Grid item xs={7.5}>
                  <FormControl sx={{ width: 380 }}>
                    <InputLabel id="demo-multiple-checkbox-label">
                      请选择希望关联的功能需求
                    </InputLabel>
                    <Select
                      labelId="demo-multiple-checkbox-label"
                      id="demo-multiple-checkbox"
                      multiple
                      value={selected}
                      onChange={handleChange}
                      input={<OutlinedInput label="请选择希望绑定的功能需求" />}
                      renderValue={(selected) => {
                        //return selected.join(", ");
                        return selected.length
                          ? `（已选择 ${selected.length} 项）`
                          : "";
                      }}
                      MenuProps={MenuProps}
                    >
                      {haveNotConnected().map((content) => (
                        <MenuItem key={content.id} value={content.id}>
                          <Checkbox
                            checked={selected.indexOf(content.id) > -1}
                          />
                          <ListItemText
                            primary={`${
                              content.name
                            }: ${content.description.substring(0, 40)}`}
                          />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={4.5}>
                  <Button onClick={handleShowSuggestions}>
                    {!openSuggestion
                      ? "显示相似的功能需求"
                      : "隐藏相似的功能需求"}
                  </Button>
                </Grid>
              </Grid>
            </Box>
            <Collapse in={openSuggestion} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ width: "45%" }}>需求</TableCell>
                      <TableCell sx={{ width: "55%" }}>描述</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {" "}
                    {autoSuggest.map((content) => {
                      return (
                        <Functional
                          key={content.id}
                          content={content}
                          mode="small"
                          onClick={handleAddToSelect}
                        />
                      );
                    })}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </DialogContent>

          <DialogActions>
            <Button onClick={submitConnect}>确认</Button>
          </DialogActions>
        </Dialog>
      </Box>
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
    </React.Fragment>
  );
}
