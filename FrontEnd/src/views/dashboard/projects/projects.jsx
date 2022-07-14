import * as React from "react";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { useState, useEffect } from "react";
import cookie from "react-cookies";
import ProjectCard from "./projectcard";
import { Grid } from "@mui/material";
import { Fragment } from "react";

function createData(index, name, description, manager, role) {
  return { index, name, description, manager, role };
}

export default function Projects() {
  const [rows, setRows] = useState([createData(0, " ", " ")]);
  const [load, setLoad] = useState(false);

  function getProjects() {
    let getRow = [];
    const token = cookie.load("token");
    const username = cookie.load("username");
    const url = process.env.REACT_APP_BACKEND_URL + "/api/projects/find-all";
    const headers = { Authorization: "Bearer " + token };
    axios.get(url, { headers }).then((response) => {
      for (let index in response.data.data) {
        let role = [];
        if (response.data.data[index].manager === username)
          role.push("manager");
        if (
          response.data.data[index].developmentEngineers.indexOf(username) !==
          -1
        )
          role.push("developmentEngineers");
        if (response.data.data[index].systemEngineers.indexOf(username) !== -1)
          role.push("systemEngineers");
        if (
          response.data.data[index].qualityAssuranceEngineers.indexOf(
            username
          ) !== -1
        )
          role.push("qualityAssuranceEngineers");
        getRow.push(
          createData(
            response.data.data[index].id,
            response.data.data[index].name,
            response.data.data[index].description,
            response.data.data[index].manager,
            role
          )
        );
      }
      setRows(getRow);
      setLoad(true);
      return getRow;
    });
  }

  useEffect(() => {
    if (!load) getProjects();
  });

  return (
    <Fragment>
      <Typography
        component="h2"
        variant="h6"
        color="primary"
        onClick={getProjects}
        gutterBottom
      >
        项目信息
      </Typography>
      <Grid container spacing={3}>
        {rows.map((project) => (
          <Grid key={project.index} item xs={12} sm={6} md={4}>
            <ProjectCard project={project} />
          </Grid>
        ))}
      </Grid>
    </Fragment>
  );
}
