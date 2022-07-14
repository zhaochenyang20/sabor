import * as React from "react";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import HumanCard from "./humancard";
import cookie from "react-cookies";
import { useParams } from "react-router-dom";
import { useState, useEffect, useReducer } from "react";
import axios from "axios";
import Typography from "@mui/material/Typography";

export default function Human() {
  const [system, setSystem] = useState([]);
  const [develop, setDevelop] = useState([]);
  const [quality, setQuality] = useState([]);
  const [load, setLoad] = useState(false);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const { projectIndex } = useParams();

  function getProjectInfo() {
    setLoad(true);
    let token = cookie.load("token");
    const headers = { Authorization: "Bearer " + token };
    const url =
      process.env.REACT_APP_BACKEND_URL +
      "api/projects/" +
      projectIndex +
      "/find-one";
    axios
      .get(url, { headers })
      .then((response) => {
        setSystem(response.data.data.systemEngineers);
        setDevelop(response.data.data.developmentEngineers);
        setQuality(response.data.data.qualityAssuranceEngineers);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleUpdate() {
    getProjectInfo();
    forceUpdate();
  }

  useEffect(() => {
    if (!load) getProjectInfo();
  }, []);

  return (
    <Paper
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h4">人员管理</Typography>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <HumanCard type="system" data={system} handleUpdate={handleUpdate} />
        </Grid>
        <Grid item xs={4}>
          <HumanCard
            type="develop"
            data={develop}
            handleUpdate={handleUpdate}
          />
        </Grid>
        <Grid item xs={4}>
          <HumanCard
            type="quality"
            data={quality}
            handleUpdate={handleUpdate}
          />
        </Grid>
      </Grid>
    </Paper>
  );
}
