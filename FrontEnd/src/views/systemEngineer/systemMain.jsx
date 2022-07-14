import * as React from "react";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useParams } from "react-router-dom";
import Iteration from "./iteration/iteration";
// import Selection from "./selection";
import SystemService from "./systemService/systemService";
import OriginRequire from "./originRequire/originRequire";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
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
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

export default function SystemMain() {
  const { projectIndex } = useParams();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <Paper
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Tabs
        variant="fullWidth"
        value={value}
        onChange={handleChange}
        aria-label="disabled tabs example"
      >
        <Tab label="需求管理" {...a11yProps(0)} />
        <Tab label="服务管理" {...a11yProps(1)} />
        <Tab label="迭代管理" {...a11yProps(2)} />
      </Tabs>

      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <OriginRequire projectIndex={{ projectIndex }} />
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <SystemService projectIndex={{ projectIndex }} />
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          <Iteration projectIndex={{ projectIndex }} />
        </TabPanel>
      </SwipeableViews>
    </Paper>
  );
}
