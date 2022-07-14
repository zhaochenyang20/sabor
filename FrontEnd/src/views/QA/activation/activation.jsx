import * as React from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import cookie from "react-cookies";
import axios from "axios";
import ReactEcharts from "echarts-for-react";
import { useTheme } from "@mui/material/styles";

export default function Activation() {
  let { projectIndex } = useParams();
  let token = cookie.load("token");
  const theme = useTheme();
  const [load, setLoad] = useState(false);
  const [summation, setSummation] = useState(0);
  const [nameList, setNameList] = useState([]);
  const [mergeRequest, setMergeRequest] = useState([]);
  const [height, setHeight] = useState([]);
  function getMergeRequest() {
    const headers = { Authorization: "Bearer " + token };
    const url =
      process.env.REACT_APP_BACKEND_URL +
      "/api/projects/" +
      projectIndex +
      "/git/get-merge-request-stat";
    axios
      .get(url, { headers })
      .then((response) => {
        setMergeRequest(response.data.data);
        let tempSummation = 0;
        let tempNameList = [];
        let tempMergeRequest = [];
        let tempHeight = [];
        let tempNegtiveSummation = 0;
        for (let index in response.data.data) {
          tempSummation += response.data.data[index].mergeRequest;
          tempNameList.push(response.data.data[index].name);
          tempMergeRequest.push(response.data.data[index].mergeRequest);
          tempNegtiveSummation += -response.data.data[index].mergeRequest;
          tempHeight.push(tempNegtiveSummation);
        }
        for (let index in tempHeight) {
          tempHeight[index] += tempSummation;
        }
        setSummation(tempSummation);
        setNameList(tempNameList);
        setMergeRequest(tempMergeRequest);
        setHeight(tempHeight);
        setLoad(true);
      })
      .catch(() => {});
    setLoad(true);
  }

  useEffect(() => {
    if (!load) getMergeRequest();
  });

  var option = {
    title: {
      text: "合并请求数量",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      formatter: function (params) {
        var tar = params[1];
        return tar.name + "<br/>" + tar.seriesName + " : " + tar.value;
      },
    },
    color: [theme.palette.primary.main],
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      splitLine: { show: false },
      data: ["总计", ...nameList],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: "Placeholder",
        type: "bar",
        stack: "Total",
        itemStyle: {
          borderColor: "transparent",
          color: "transparent",
        },
        emphasis: {
          itemStyle: {
            borderColor: "transparent",
            color: "transparent",
          },
        },
        data: [0, ...height],
      },
      {
        name: "Merge Request",
        type: "bar",
        stack: "Total",
        label: {
          show: true,
          position: "inside",
        },
        data: [summation, ...mergeRequest],
      },
    ],
  };

  return (
    <Grid item xs={12} md={12}>
      <Paper
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h4">活跃度评价</Typography>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <ReactEcharts option={option}></ReactEcharts>
        </Paper>
      </Paper>
    </Grid>
  );
}
