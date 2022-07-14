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
import DialogTitle from "@mui/material/DialogTitle";
import cookie from "react-cookies";
import Button from "@mui/material/Button";
import { Post } from "../../../utils/communication";
import { useParams } from "react-router-dom";
import { useState } from "react";
import Typography from "@mui/material/Typography";

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

export default function DeleteSR({
  content,
  alreadyConnected,
  openDialog,
  setOpenDialog,
  onClose,
  setOpenMenu,
  handleFlushDelete,
  openCollapse,
  setOpenCollapse,
}) {
  const headers = { Authorization: "Bearer " + cookie.load("token") };
  const { projectIndex } = useParams();
  const [selected, setSelected] = React.useState([]);
  const [successToastOpen, setSuccessToastOpen] = useState(false);
  const [failToastOpen, setFailToastOpen] = useState(false);
  const [info, setInfo] = useState(undefined);

  const handleSuccessAlertClose = () => {
    setSuccessToastOpen(false);
  };

  const handleFailAlertClose = () => {
    setFailToastOpen(false);
  };

  const submitDisconnect = () => {
    const url =
      process.env.REACT_APP_BACKEND_URL +
      "api/projects/" +
      projectIndex +
      "/git/attach-merge-req-with-func-req/";
    var body = {
      delItem: [],
    };
    for (let i = 0; i < selected.length; i++) {
      body.delItem.push({
        functionalRequestId: selected[i],
        mergeRequestId: content.id,
      });
    }

    Post(
      url,
      body,
      (res) => {
        if (res.code === 200) {
          console.log(selected);
          handleFlushDelete(content.id, selected);
          let opened = openCollapse;
          setOpenCollapse(false);
          setOpenCollapse(opened);

          setInfo(selected.length ? "操作成功" : "您未选择任何需求");
          setSuccessToastOpen(true);
          setSelected([]);
        } else {
          setInfo("操作失败");
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

  return (
    <React.Fragment>
      <Dialog open={openDialog} onClose={onClose}>
        <DialogTitle>解除关联功能需求</DialogTitle>
        <DialogContent>
          <Typography variant="h6">{"MR #" + content.id}</Typography>
          <Typography>
            {" "}
            {"标题: " +
              (content.title.length > 40
                ? content.title.substring(0, 40) + "..."
                : content.title)}
          </Typography>
          <Typography>
            {" "}
            {"描述: " +
              (content.content.length > 40
                ? content.content.substring(0, 40) + "..."
                : content.content)}
          </Typography>
          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="demo-multiple-checkbox-label">
              请选择希望解除关联的功能需求
            </InputLabel>
            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              value={selected}
              onChange={handleChange}
              input={<OutlinedInput label="解除关联功能需求" />}
              renderValue={(selected) => {
                //return selected.join(", ");
                return selected.length
                  ? `（已选择 ${selected.length} 项）`
                  : "";
              }}
              MenuProps={MenuProps}
            >
              {alreadyConnected
                .filter((item) => item.id !== "暂无")
                .map((content) => (
                  <MenuItem key={content.id} value={content.id}>
                    <Checkbox checked={selected.indexOf(content.id) > -1} />
                    <ListItemText
                      primary={`${
                        content.name
                      }: ${content.description.substring(0, 40)}`}
                    />
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={submitDisconnect}>确认</Button>
        </DialogActions>
      </Dialog>

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
