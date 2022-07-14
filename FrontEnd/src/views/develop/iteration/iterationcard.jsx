import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";
import cookie from "react-cookies";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function FunctionalRequirement({ index }) {
  let { projectIndex } = useParams();
  let token = cookie.load("token");
  let [name, setName] = useState("");
  let [state, setState] = useState("");
  const headers = { Authorization: "Bearer " + token };
  const url =
    process.env.REACT_APP_BACKEND_URL +
    "api/projects/" +
    projectIndex +
    "/find-one-func-require/" +
    index;
  axios
    .get(url, { headers })
    .then((response) => {
      setName(response.data.data.name);
      setState(response.data.data.state);
    })
    .catch((error) => {
      console.log(error);
    });
  let realState = "";
  if (state === 1) realState = "初始化";
  if (state === 2) realState = "开发中";
  if (state === 3) realState = "已完成";
  if (state === 4) realState = "已交付";
  return (
    <Typography variant="body2" color="text.secondary">
      {name} （{realState}）
    </Typography>
  );
}

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function IterationCard({
  name,
  description,
  updateTime,
  deadline,
  directorUsername,
  functionalRequirementIds,
}) {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  function getColor() {
    if (new Date() - deadline > 0) return "error.dark";
    else return "text.secondary";
  }
  return (
    <Card margin="normal" variant="outlined" sx={{ minWidth: 200, margin: 2 }}>
      <CardHeader
        title={name}
        subheader={
          "更新时间：" + new Date(parseInt(updateTime)).toLocaleString()
        }
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          迭代说明：{description}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          负责人：{directorUsername}
        </Typography>
        <Typography variant="body2" color={getColor()}>
          截止时间：{new Date(parseInt(deadline)).toLocaleString()}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <Typography
          variant="body2"
          sx={{ pl: 2, pr: 2 }}
          color="text.secondary"
        >
          展开查看全部功能需求交付状态
        </Typography>
        <Card>
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </Card>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <card
          margin="normal"
          variant="outlined"
          sx={{ minWidth: 200, margin: 2 }}
        >
          {" "}
          <CardContent>
            {functionalRequirementIds.map((functinoalID) => {
              return (
                <FunctionalRequirement
                  key={functinoalID}
                  index={functinoalID}
                />
              );
            })}
          </CardContent>
        </card>
      </Collapse>
    </Card>
  );
}
