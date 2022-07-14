import * as React from "react";
import Dialog from "@mui/material/Dialog";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import Box from "@mui/material/Box";
import cookie from "react-cookies";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import SentimentDissatisfiedOutlinedIcon from "@mui/icons-material/SentimentDissatisfiedOutlined";
import SentimentSatisfiedAltOutlinedIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import SentimentNeutralOutlinedIcon from "@mui/icons-material/SentimentNeutralOutlined";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import Avatar from "@mui/material/Avatar";
import { green, orange, yellow, red } from "@mui/material/colors";
import Empty from "../../../components/empty";
import Instruction from "./instruction";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ExpandMore = styled((props) => {
  const { ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

function FunctionalRequirementStatus({ functionalRequirement }) {
  const [issueList, setIssueList] = useState([]);
  const [mergeRequestList, setMergeRequestList] = useState([]);
  const [totalTimeList, setTotalTimeList] = useState([]);
  const [developer, setDeveloper] = useState("");
  const [load, setLoad] = useState(false);
  const [mergeLoad, setMergeLoad] = useState(false);
  const [developerLoad, setDeveloperLoad] = useState(false);
  const [instructionOpen, setInstructionOpen] = useState(false);
  let { projectIndex } = useParams();
  let token = cookie.load("token");
  const headers = { Authorization: "Bearer " + token };

  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  function getStatusButton(status) {
    if (status === 1)
      return (
        <Button size="small" variant="outlined" color="info">
          初始化
        </Button>
      );
    else if (status === 2)
      return (
        <Button size="small" variant="outlined" color="error">
          开发中
        </Button>
      );
    else
      return (
        <Button size="small" variant="outlined" color="success">
          已交付
        </Button>
      );
  }

  function getAvatar(status) {
    if (status === 1) return <SentimentDissatisfiedOutlinedIcon color="info" />;
    else if (status === 2)
      return <SentimentNeutralOutlinedIcon color="error" />;
    else return <SentimentSatisfiedAltOutlinedIcon color="success" />;
  }

  function getGrade(state, timeList) {
    let status = 0;
    for (let index in timeList) {
      status += timeList[index];
    }
    if (state === 1 || state === 2) return <Avatar>*</Avatar>;
    if (status === 0) return <Avatar sx={{ bgcolor: green[800] }}>A+</Avatar>;
    else if (status <= 1)
      return <Avatar sx={{ bgcolor: green[500] }}>A+</Avatar>;
    else if (status <= 5)
      return <Avatar sx={{ bgcolor: green[200] }}>A-</Avatar>;
    else if (status > 5 && status <= 10)
      return <Avatar sx={{ bgcolor: yellow[800] }}>B+</Avatar>;
    else if (status > 10 && status <= 15)
      return <Avatar sx={{ bgcolor: yellow[500] }}>B</Avatar>;
    else if (status > 15 && status <= 20)
      return <Avatar sx={{ bgcolor: yellow[200] }}>B-</Avatar>;
    else if (status > 20 && status <= 30)
      return <Avatar sx={{ bgcolor: orange[800] }}>C+</Avatar>;
    else if (status > 30 && status <= 50)
      return <Avatar sx={{ bgcolor: orange[500] }}>C</Avatar>;
    else if (status > 50 && status <= 100)
      return <Avatar sx={{ bgcolor: orange[200] }}>C-</Avatar>;
    else if (status > 100 && status <= 200)
      return <Avatar sx={{ bgcolor: red[800] }}>D+</Avatar>;
    else if (status > 200 && status <= 500)
      return <Avatar sx={{ bgcolor: red[500] }}>D</Avatar>;
    else return <Avatar sx={{ bgcolor: red[200] }}>D-</Avatar>;
  }

  function getRelatedIssue() {
    setLoad(true);
    const url =
      process.env.REACT_APP_BACKEND_URL +
      "api/projects/" +
      projectIndex +
      "/git/get-issue-caused-by-sr/" +
      functionalRequirement.id;
    axios
      .get(url, { headers })
      .then((response) => {
        setIssueList(response.data.data);
        setTotalTimeList(
          response.data.data.map((issue) => {
            return (
              ((issue.closeTime ? issue.closeTime : new Date()) -
                issue.createTime) /
              3600000
            );
          })
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function getRelatedMergeRequest() {
    setMergeLoad(true);
    const url =
      process.env.REACT_APP_BACKEND_URL +
      "api/projects/" +
      projectIndex +
      "/git/get-merge-req-of-func-req/" +
      functionalRequirement.id;
    axios
      .get(url, { headers })
      .then((response) => {
        setMergeRequestList(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function getDeveloper() {
    setDeveloperLoad(true);
    const url = process.env.REACT_APP_BACKEND_URL + "api/users/find";
    const body = { id: functionalRequirement.developerId };
    axios
      .post(url, body, { headers })
      .then((response) => {
        setDeveloper(response.data.data.username);
      })
      .catch(() => {
        setDeveloper("暂无");
      });
  }

  function getIssueComponent() {
    if (issueList.length <= 0)
      return (
        <Typography variant="h6" sx={{ p: 1 }}>
          没有关联的缺陷
        </Typography>
      );
    else
      return (
        <Box>
          <Typography variant="h6" sx={{ p: 1 }}>
            关联的缺陷
          </Typography>
          {issueList.map((issue) => {
            return (
              <Typography key={issue.id} sx={{ p: 0.5 }}>
                {issue.title}
              </Typography>
            );
          })}
        </Box>
      );
  }

  function getMergeRequestComponent() {
    if (mergeRequestList.length <= 0)
      return (
        <Typography variant="h6" sx={{ p: 1 }}>
          没有关联的合并请求
        </Typography>
      );
    else
      return (
        <Box>
          <Typography variant="h6" sx={{ p: 1 }}>
            关联的合并请求
          </Typography>
          {mergeRequestList.map((mergeRequest) => {
            return (
              <Typography key={mergeRequest.id} sx={{ p: 0.5 }}>
                {mergeRequest.title}
              </Typography>
            );
          })}
        </Box>
      );
  }

  useEffect(() => {
    if (!load) getRelatedIssue();
    if (!mergeLoad) getRelatedMergeRequest();
    if (!developerLoad) getDeveloper();
  });
  return (
    <Box sx={{ p: 2, backgroundColor: "#F9FAFB" }}>
      <Card>
        <CardHeader
          title={functionalRequirement.name}
          subheader={
            "更新时间：" +
            new Date(
              parseInt(functionalRequirement.updateDate)
            ).toLocaleString()
          }
          avatar={getAvatar(functionalRequirement.state)}
        />
        <CardContent>
          <Stack direction="column" spacing={2}>
            <Stack
              direction="row"
              spacing={2}
              divider={<Divider orientation="vertical" flexItem />}
            >
              <Typography sx={{ p: 0.5, width: 150 }}>交付状态</Typography>
              <Typography>
                {getStatusButton(functionalRequirement.state)}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              spacing={2}
              divider={<Divider orientation="vertical" flexItem />}
            >
              <Typography sx={{ p: 0.5, width: 150 }}>负责人</Typography>
              <Typography sx={{ p: 0.5 }} color="text.secondary">
                {developer}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              spacing={2}
              divider={<Divider orientation="vertical" flexItem />}
            >
              <Typography sx={{ p: 0.5, width: 150 }}>关联缺陷数量</Typography>
              <Typography sx={{ p: 0.5 }} color="text.secondary">
                {issueList.length}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              spacing={2}
              divider={<Divider orientation="vertical" flexItem />}
            >
              <Typography sx={{ p: 0.5, width: 150 }}>
                关联合并请求数量
              </Typography>
              <Typography sx={{ p: 0.5 }} color="text.secondary">
                {mergeRequestList.length}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              spacing={2}
              divider={<Divider orientation="vertical" flexItem />}
            >
              <Stack direction="row" sx={{ width: 150 }}>
                <Typography sx={{ pt: 1.5, pb: 1.5, pl: 0.5, pr: 0.5 }}>
                  交付质量分析
                </Typography>
                <QuestionMarkIcon
                  sx={{ pt: 1, mt: 0, mb: 1, color: "#DFE3E8" }}
                  onClick={() => {
                    setInstructionOpen(true);
                  }}
                />
              </Stack>
              <Typography color="text.secondary">
                {getGrade(functionalRequirement.state, totalTimeList)}
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
        <CardActions disableSpacing>
          <Typography paragraph sx={{ pl: 2, pr: 2 }} color="text.secondary">
            展开查看全部缺陷和合并请求信息
          </Typography>
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            {getIssueComponent()}
            {getMergeRequestComponent()}
          </CardContent>
        </Collapse>
      </Card>
      <Instruction open={instructionOpen} setOpen={setInstructionOpen} />
    </Box>
  );
}

export default function RequirementDialog({
  open,
  setOpen,
  iteration,
  functionalRequirements,
}) {
  const handleClose = () => {
    setOpen(false);
  };

  function getRequirementsList() {
    if (functionalRequirements.length > 0) {
      return functionalRequirements.map((functionalRequirement) => {
        return (
          <Grid item key={functionalRequirement.id} xs={12}>
            <FunctionalRequirementStatus
              functionalRequirement={functionalRequirement}
            />
          </Grid>
        );
      });
    } else
      return (
        <Box sx={{ p: 4 }}>
          <Empty width={400} />
        </Box>
      );
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
      }}
    >
      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              迭代关联需求查看：{iteration.name}
            </Typography>
          </Toolbar>
        </AppBar>
        <Box>
          <Grid container spacing={2} sx={{ backgroundColor: "#F9FAFB" }}>
            {getRequirementsList()}
          </Grid>
        </Box>
      </Dialog>
    </Box>
  );
}
