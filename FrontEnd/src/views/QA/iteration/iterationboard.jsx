import * as React from "react";
import IterationCard from "./iterationcard";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import cookie from "react-cookies";
import axios from "axios";

export default function IterationBoard() {
  let { projectIndex } = useParams();
  let token = cookie.load("token");
  const [iteration, setIteration] = useState([]);
  const [load, setLoad] = useState(false);

  function getIterationList() {
    setLoad(true);
    const headers = { Authorization: "Bearer " + token };
    const url =
      process.env.REACT_APP_BACKEND_URL +
      "api/projects/" +
      projectIndex +
      "/find-all-iter";
    axios
      .get(url, { headers })
      .then((response) => {
        setIteration(response.data.data);
      })
      .catch(() => {});
  }

  useEffect(() => {
    if (!load) getIterationList();
  });

  return (
    <Grid item xs={12} md={12}>
      <Paper
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h4">迭代状态</Typography>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Grid container spacing={2}>
            {iteration
              .sort((t1, t2) => {
                return t2.deadline - t1.deadline;
              })
              .map((iterationitem) => {
                return (
                  <Grid item key={iterationitem.id} xs={4}>
                    <IterationCard iteration={iterationitem} />
                  </Grid>
                );
              })}
          </Grid>
        </Paper>
      </Paper>
    </Grid>
  );
}
