import * as React from "react";
import ReactEcharts from "echarts-for-react";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";

export default function StateCard({ functionalRequirements }) {
  const theme = useTheme();
  let option = {
    tooltip: {
      trigger: "item",
    },
    legend: {
      bottom: "0%",
      show: true,
    },
    color: [
      theme.palette.primary.light,
      theme.palette.primary.main,
      theme.palette.primary.dark,
    ],
    series: [
      {
        name: "需求交付情况",
        type: "pie",
        height: "95%",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: "40",
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: getChartData(),
      },
    ],
  };

  function getChartData() {
    let initialized = 0;
    let developing = 0;
    let fulfilled = 0;
    for (let index in functionalRequirements) {
      if (functionalRequirements[index].state == 1) {
        initialized++;
      } else if (functionalRequirements[index].state == 2) {
        developing++;
      } else fulfilled++;
    }
    return [
      { value: initialized, name: "初始化" },
      { value: developing, name: "开发中" },
      { value: fulfilled, name: "已交付" },
    ];
  }

  return (
    <Box>
      <ReactEcharts option={option}></ReactEcharts>
    </Box>
  );
}
