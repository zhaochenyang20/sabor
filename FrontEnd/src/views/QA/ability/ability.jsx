import * as React from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import cookie from "react-cookies";
import axios from "axios";
import ReactEcharts from "echarts-for-react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

export default function Ability() {
  let { projectIndex } = useParams();
  let token = cookie.load("token");
  const [issueList, setIssueList] = useState([]);
  const [nameList, setNameList] = useState([]);
  const [openIssueList, setOpenIssueList] = useState([]);
  const [totalIssueList, setTotalIssueList] = useState([]);
  const [load, setLoad] = useState(false);
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function getIssueList() {
    const headers = { Authorization: "Bearer " + token };
    const url =
      process.env.REACT_APP_BACKEND_URL +
      "/api/projects/" +
      projectIndex +
      "/git/get-issue-stat";
    axios
      .get(url, { headers })
      .then((response) => {
        let tempNameList = [];
        let tempIssueList = [];
        let tempOpenIssueList = [];
        let tempTotalIssueList = [];
        for (let index in response.data.data) {
          let tempTime = [];
          for (let timeIndex in response.data.data[index].time) {
            tempTime.push(
              Math.trunc(
                (10 * response.data.data[index].time[timeIndex]) / (1000 * 3600)
              ) / 10
            );
          }
          tempIssueList.push(tempTime);
          tempNameList.push(response.data.data[index].name);
          tempOpenIssueList.push({
            value: response.data.data[index].openIssue,
            name: response.data.data[index].name,
          });
          tempTotalIssueList.push(response.data.data[index].time.length);
        }
        setIssueList(tempIssueList);
        setNameList(tempNameList);
        setOpenIssueList(tempOpenIssueList);
        setTotalIssueList(tempTotalIssueList);
        setLoad(true);
      })
      .catch(() => {});
    setLoad(true);
  }

  useEffect(() => {
    if (!load) getIssueList();
  });

  var boxplotOption = {
    title: [
      {
        text: "缺陷解决时间",
        left: "center",
      },
    ],
    dataset: [
      {
        // prettier-ignore
        source: [...issueList],
      },
      {
        transform: {
          type: "boxplot",
          config: {
            itemNameFormatter: function (value) {
              return nameList[value.value];
            },
          },
        },
      },
      {
        fromDatasetIndex: 1,
        fromTransformResult: 1,
      },
    ],
    tooltip: {
      trigger: "item",
      axisPointer: {
        type: "shadow",
      },
      confine: true,
    },
    grid: {
      left: "10%",
      right: "10%",
      bottom: "15%",
    },
    xAxis: {
      type: "category",
      boundaryGap: true,
      nameGap: 30,
      splitArea: {
        show: false,
      },
      splitLine: {
        show: false,
      },
    },
    yAxis: {
      type: "value",
      name: "小时",
      splitArea: {
        show: true,
      },
    },
    series: [
      {
        name: "boxplot",
        type: "boxplot",
        datasetIndex: 1,
      },
      {
        name: "outlier",
        type: "scatter",
        datasetIndex: 2,
      },
    ],
  };

  var circleOption = {
    title: [
      {
        text: "缺陷总数",
        left: "center",
      },
    ],
    xAxis: {
      type: "category",
      data: [...nameList],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: [...totalIssueList],
        type: "bar",
      },
    ],
    tooltip: {
      trigger: "item",
      axisPointer: {
        type: "shadow",
      },
    },
  };

  var barOption = {
    title: [
      {
        text: "未关闭缺陷总数",
        left: "center",
      },
    ],
    legend: {
      top: "bottom",
    },
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b} : {c} ({d}%)",
    },
    series: [
      {
        name: "未关闭缺陷总数",
        type: "pie",
        radius: [25, 100],
        center: ["50%", "50%"],
        roseType: "area",
        itemStyle: {
          borderRadius: 4,
        },
        data: [...openIssueList],
      },
    ],
  };

  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`vertical-tabpanel-${index}`}
        aria-labelledby={`vertical-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

  function a11yProps(index) {
    return {
      id: `vertical-tab-${index}`,
      "aria-controls": `vertical-tabpanel-${index}`,
    };
  }

  return (
    <Paper
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h4">能力评价</Typography>
      <Tabs
        variant="fullWidth"
        value={value}
        onChange={handleChange}
        sx={{ borderRight: 1, borderColor: "divider" }}
      >
        <Tab label="缺陷解决时间" {...a11yProps(0)} />
        <Tab label="缺陷总数" {...a11yProps(1)} />
        <Tab label="未关闭缺陷总数" {...a11yProps(2)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <ReactEcharts option={boxplotOption}></ReactEcharts>
        </Paper>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <ReactEcharts option={circleOption}></ReactEcharts>
        </Paper>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <ReactEcharts option={barOption}></ReactEcharts>
        </Paper>
      </TabPanel>
    </Paper>
  );
}
