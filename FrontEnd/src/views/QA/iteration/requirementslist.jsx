import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import cookie from "react-cookies";
import axios from "axios";
import { useEffect, useState } from "react";

let token = cookie.load("token");
const headers = { Authorization: "Bearer " + token };

function FunctionalRow({ functional }) {
  const url = process.env.REACT_APP_BACKEND_URL + "api/users/find";
  const [username, setUsername] = useState("");
  const [load, setLoad] = useState(false);

  function getUsername() {
    setLoad(true);
    axios
      .post(
        url,
        {
          id: functional.developerId,
        },
        { headers }
      )
      .then((response) => {
        setUsername(response.data.data.username);
      })
      .catch((error) => {
        if (error.response.data.code) setUsername("暂无");
      });
  }
  useEffect(() => {
    if (!load) getUsername();
  });
  return (
    <TableRow key={functional.id}>
      <TableCell component="th" scope="row">
        {functional.name}
      </TableCell>
      <TableCell align="center">
        {functional.state == 1
          ? "初始化"
          : functional.state == 2
          ? "开发中"
          : "已交付"}
      </TableCell>
      <TableCell align="right">{username}</TableCell>
    </TableRow>
  );
}

export default function RequirementsList({ functionalRequirements }) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>功能需求</TableCell>
            <TableCell align="center">交付状态</TableCell>
            <TableCell align="right">开发工程师</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {functionalRequirements.map((functional) => (
            <FunctionalRow key={functional.id} functional={functional} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
