import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import CreateOrigin from "./createOrigin";
import UpdateOrigin from "./updateOrigin";
import CreateSystem from "./createSystem";
import UpdateSystem from "./updateSystem";
import CreateIteration from "./createIteration";
import UpdateIteration from "./updateIteration";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary expandIcon={<ArrowForwardIosSharpIcon />} {...props} />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

export default function Origin({ projectIndex }) {
  // !这个界面承接六个接口
  // createSystemService 用于创建系统服务
  // updateSystemService 用于更新系统服务
  // createOriginRequire 用于创建一个原始需求
  // updateOriginRequire 用于更新原始需求
  // createIteration 用于创建迭代
  // updateIteration 用于更新迭代

  const [expanded, setExpanded] = React.useState(null);
  // ! 下拉框的 hook
  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <Box component="form" fullwidth={true} noValidate autoComplete="off">
      <Box>
        <Accordion
          expanded={expanded === "panel1"}
          onChange={handleChange("panel1")}
        >
          <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
            <Typography variant="h4">录入原始需求</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <CreateOrigin projectIndex={projectIndex}></CreateOrigin>
          </AccordionDetails>
        </Accordion>
      </Box>

      <Box>
        <Accordion
          expanded={expanded === "panel2"}
          onChange={handleChange("panel2")}
        >
          <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
            <Typography variant="h4">修改原始需求</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <UpdateOrigin projectIndex={projectIndex}></UpdateOrigin>
          </AccordionDetails>
        </Accordion>
      </Box>

      <Box>
        <Accordion
          expanded={expanded === "panel3"}
          onChange={handleChange("panel3")}
        >
          <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
            <Typography variant="h4">新建软件系统服务</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <CreateSystem projectIndex={projectIndex}></CreateSystem>
          </AccordionDetails>
        </Accordion>
      </Box>

      <Box>
        <Accordion
          expanded={expanded === "panel4"}
          onChange={handleChange("panel4")}
        >
          <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
            <Typography variant="h4">修改软件系统服务</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <UpdateSystem projectIndex={projectIndex}></UpdateSystem>
          </AccordionDetails>
        </Accordion>
      </Box>

      <Box>
        <Accordion
          expanded={expanded === "panel5"}
          onChange={handleChange("panel5")}
        >
          <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
            <Typography variant="h4">新建迭代信息</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <CreateIteration projectIndex={projectIndex}></CreateIteration>
          </AccordionDetails>
        </Accordion>
      </Box>

      <Box>
        <Accordion
          expanded={expanded === "panel6"}
          onChange={handleChange("panel6")}
        >
          <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
            <Typography variant="h4">更新迭代信息</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <UpdateIteration projectIndex={projectIndex}></UpdateIteration>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
}
