import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { useState, useEffect } from "react";
//import Invite from "../systemEngineer/invite/invite";
import HumanInfo from "./humandialog";
import InviteDialog from "./invitedialog";
import { Typography } from "@mui/material";
import SuccessAlert from "../../components/successalert";
import DevelopDialog from "./developdialog";

export default function HumanCard({ type, data, handleUpdate }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [humanDialogName, setHumanDialogName] = useState("");
  const [humanDialogOpen, setHumanDialogOpen] = useState(false);
  const [developDialogOpen, setDevelopDialogOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [developFunctionIds, setDevelopFunctionIds] = useState([]);
  const [developIterationIds, setDevelopIterationIds] = useState([]);

  const showAlert = (message) => {
    setAlertMessage(message);
    setAlertOpen(true);
  };

  function getTitle(type) {
    if (type === "system") return "系统工程师";
    if (type === "develop") return "开发工程师";
    if (type === "quality") return "质量保证工程师";
  }

  function handleAddEngineer() {
    setDialogOpen(true);
  }

  function handleDialogClose(message) {
    setDialogOpen(false);
    if (message) {
      showAlert(message);
    }
  }

  function handleDialogCloseDevelop(functionIds, iterationIds) {
    console.log("CARD CLOSE");
    setDevelopDialogOpen(true);
    setDevelopFunctionIds(functionIds);
    setDevelopIterationIds(iterationIds);
  }

  function handleHumanDialogOpen(engineer) {
    setHumanDialogName(engineer);
    setHumanDialogOpen(true);
  }

  function handleHumanDialogClose(message) {
    setHumanDialogOpen(false);
    if (message) {
      showAlert(message);
    }
  }

  useEffect(() => {});

  return (
    <Box>
      <Card>
        <CardHeader
          sx={{ m: 2 }}
          action={
            <IconButton aria-label="settings">
              <AddCircleOutlineIcon
                color="primary"
                onClick={() => {
                  handleAddEngineer();
                }}
              />
            </IconButton>
          }
          title={getTitle(type)}
          subheader={"共有" + data.length + "位" + getTitle(type)}
        />
        <CardContent>
          <TableContainer>
            <Table>
              <TableBody>
                {data.map((engineer) => {
                  return (
                    <TableRow key={engineer} sx={{ m: 0, p: 0 }}>
                      <TableCell>
                        <Typography variant="body1">{engineer}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={() => {
                            handleHumanDialogOpen(engineer);
                          }}
                        >
                          <RemoveCircleOutlineIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
      <Dialog open={dialogOpen}>
        <InviteDialog
          type={type}
          handleDialogClose={handleDialogClose}
          handleUpdate={handleUpdate}
        />
      </Dialog>
      <Dialog open={humanDialogOpen}>
        <HumanInfo
          type={type}
          humanName={humanDialogName}
          handleDialogClose={handleHumanDialogClose}
          handleDialogCloseDevelop={handleDialogCloseDevelop}
          handleUpdate={handleUpdate}
        />
      </Dialog>
      <SuccessAlert
        successToastOpen={alertOpen}
        info={alertMessage}
        handleSuccessAlertClose={() => setAlertOpen(false)}
      />
      <DevelopDialog
        developDialogOpen={developDialogOpen}
        setDevelopDialogOpen={setDevelopDialogOpen}
        functionIds={developFunctionIds}
        iterationIds={developIterationIds}
      />
    </Box>
  );
}
