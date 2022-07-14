import * as React from "react";
import Button from "@mui/material/Button";
import { Card } from "@mui/material";
import { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import cookie from "react-cookies";
import axios from "axios";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import showTime from "../utils/time";
import { useParams } from "react-router-dom";

export default function SRDetail({
  functionInfoOpen,
  handleInfoClose,
  functionalId,
  info,
}) {
  const [showingFunctionalId, setShowingFunctionalId] = useState(0);
  const [data, setData] = useState({});
  const [status, setStatus] = useState("loaded");
  const { projectIndex } = useParams();
  const projectId = projectIndex;
  const headers = { Authorization: "Bearer " + cookie.load("token") };

  const getInfo = () => {
    setStatus("loading");
    const url = new URL(
      `/api/projects/${projectId}/find-one-func-require/${functionalId}`,
      process.env.REACT_APP_BACKEND_URL
    ).toString();
    axios
      .get(url, { headers })
      .then((response) => {
        setShowingFunctionalId(functionalId);
        setData(response.data.data);
        setStatus("loaded");
      })
      .catch((error) => {
        console.log(error);
        setStatus("error");
      });
  };

  useEffect(() => {
    if (status !== "loading" && functionInfoOpen) {
      getInfo();
    }
  }, [functionInfoOpen]);

  const getState = (num) => {
    if (num === 1) {
      return "初始化";
    } else if (num === 2) {
      return "进行中";
    } else if (num === 3) {
      return "已交付";
    }
  };

  const findById = (list, id, attr = "name") => {
    if (!id || !list) return "暂无";
    const res = list.find((ele) => ele.id === id);
    if (!res) return "暂无";
    return res[attr];
  };

  const display = data
    ? {
        name: data.name,
        description: data.description,
        functionState: getState(data.state),
        createDate: showTime(data.createDate),
        updateDate: showTime(data.updateDate),
        functionDeveloperId: findById(
          info.userDict,
          data.developerId,
          "username"
        ),
        distributorId: findById(info.userDict, data.distributorId, "username"),
        functionOriginalRequirementId: findById(
          info.originRequireDict,
          data.originalRequirementId
        ),
        system: findById(info.system, data.systemServiceId),
        deliveryIterationId: findById(
          info.iterationDict,
          data.deliveryIterationId
        ),
      }
    : {};

  return (
    <Dialog open={functionInfoOpen}>
      <DialogTitle>
        <Typography variant="h3" component="div">
          功能详情
        </Typography>
      </DialogTitle>
      <DialogContent>
        {status === "loaded" && display ? (
          <>
            <Card
              margin="normal"
              variant="outlined"
              sx={{ minWidth: 200, margin: 2 }}
            >
              <CardContent>
                <Typography variant="h6" component="div">
                  功能需求名称： {display.name}
                </Typography>
                <Typography variant="h6" component="div">
                  功能需求描述： {display.description}
                </Typography>
              </CardContent>
            </Card>
            <Card
              margin="normal"
              variant="outlined"
              sx={{ minWidth: 200, margin: 2 }}
            >
              <CardContent>
                <Typography variant="h6" component="div">
                  功能需求状态：{display.functionState}
                </Typography>
                <Typography variant="h6" component="div">
                  功能需求创建时间：{display.createDate}
                </Typography>
                <Typography variant="h6" component="div">
                  功能需求更新时间：{display.updateDate}
                </Typography>
                <Typography variant="h6" component="div">
                  功能需求开发者：{display.functionDeveloperId}
                </Typography>
                <Typography variant="h6" component="div">
                  功能需求创建者：{display.distributorId}
                </Typography>
              </CardContent>
            </Card>
            <Card
              margin="normal"
              variant="outlined"
              sx={{ minWidth: 200, margin: 2 }}
            >
              <CardContent>
                <Typography variant="h6" component="div">
                  原始需求： {display.functionOriginalRequirementId}
                </Typography>
                <Typography variant="h6" component="div">
                  系统服务： {display.system}
                </Typography>
                <Typography variant="h6" component="div">
                  所属迭代： {display.deliveryIterationId}
                </Typography>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card
            margin="normal"
            variant="outlined"
            sx={{ minWidth: 200, margin: 2 }}
          >
            <CardContent>
              <Typography variant="h6" component="div">
                {status === "loading" ? "加载中……" : "加载失败，请重试"}
              </Typography>
            </CardContent>
          </Card>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleInfoClose}> 确定 </Button>
      </DialogActions>
    </Dialog>
  );
}
