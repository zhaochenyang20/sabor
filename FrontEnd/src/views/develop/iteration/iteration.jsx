import * as React from "react";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import Typography from "@mui/material/Typography";
import AllInclusiveIcon from "@mui/icons-material/AllInclusive";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import cookie from "react-cookies";
import Paper from "@mui/material/Paper";
import axios from "axios";
import IterationCard from "./iterationcard";

function IterationItem({ iteration }) {
  let update = new Date(parseInt(iteration.updateTime)).toLocaleString();
  let deadline = new Date(parseInt(iteration.deadline)).toLocaleString();
  return (
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot color="primary">
          <AllInclusiveIcon />
        </TimelineDot>
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent>
        <IterationCard
          name={iteration.name}
          description={iteration.description}
          updateTime={iteration.updateTime}
          deadline={iteration.deadline}
          originDeadline={iteration.deadline}
          directorUsername={iteration.directorUsername}
          functionalRequirementIds={iteration.functionalRequirementIds}
        />
      </TimelineContent>
    </TimelineItem>
  );
}

export default function Iteration() {
  let { projectIndex } = useParams();
  let token = cookie.load("token");
  const [iteration, setIteration] = useState([]);
  const [load, setLoad] = useState(false);

  function getIterationList() {
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
        setLoad(true);
      })
      .catch(() => {});
    setLoad(true);
  }

  useEffect(() => {
    if (!load) getIterationList();
  });

  return (
    <Paper
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h4">迭代管理</Typography>
      <Timeline position="alternate">
        {iteration.map((iteration) => {
          return <IterationItem key={iteration.id} iteration={iteration} />;
        })}
      </Timeline>
    </Paper>
  );
}
