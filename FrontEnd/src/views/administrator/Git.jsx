import * as React from "react";
import Divider from "@mui/material/Divider";
import {
  Box,
  Stack,
  Typography,
  Button,
  TextField,
  IconButton,
  Switch,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import cookie from "react-cookies";
import isURL from "validator/lib/isURL";
import isInt from "validator/lib/isInt";
import Paper from "@mui/material/Paper";
import SuccessAlert from "../../components/successalert";

const rowWidth = 200;

function InfoContent({ title, content }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={2}
      divider={<Divider orientation="vertical" flexItem />}
    >
      <Typography variant="h6" sx={{ pl: 2, pr: 2 }} noWrap minWidth={rowWidth}>
        {title}
      </Typography>

      <Typography
        variant="body1"
        align="right"
        sx={{ pl: 2, pr: 2, color: "text.secondary" }}
        noWrap
      >
        {content}
      </Typography>
    </Stack>
  );
}

function InfoContentSecret({ title, content }) {
  const [secret, setSecret] = useState(true);
  const toggleSecret = () => {
    setSecret(!secret);
  };

  return (
    <InfoContent
      title={title}
      content={
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography
            variant="body1"
            align="right"
            sx={{ pl: 0, pr: 2, color: "text.secondary" }}
            noWrap
          >
            {secret ? "**********" : content}
          </Typography>

          <IconButton onClick={toggleSecret}>
            {secret ? <Visibility /> : <VisibilityOff />}
          </IconButton>
        </Stack>
      }
    />
  );
}

function InputContent({
  title,
  content,
  updateContent,
  validation,
  description,
}) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={2}
      divider={<Divider orientation="vertical" flexItem />}
    >
      <Typography variant="h6" sx={{ pl: 2, pr: 2 }} noWrap minWidth={rowWidth}>
        {title}
      </Typography>
      <TextField
        error={validation === undefined ? false : !validation}
        defaultValue={content}
        onChange={(event) => updateContent(event.target.value)}
        variant="standard"
        size="small"
        sx={{ pl: 2, pr: 2 }}
      />
      {description ? (
        <Typography variant="caption">{description}</Typography>
      ) : (
        <></>
      )}
    </Stack>
  );
}

function ModifyGitInfo({
  oldRepoUrl,
  oldRepoId,
  oldRepoToken,
  oldRepoTag,
  onCancel,
  onSubmit,
}) {
  const [newRepoUrl, setNewRepoUrl] = useState(oldRepoUrl);
  const [newRepoId, setNewRepoId] = useState(String(oldRepoId));
  const [newRepoToken, setNewRepoToken] = useState(oldRepoToken);
  const [newRepoTag, setNewRepoTag] = useState(oldRepoTag);
  const [hasRepo, setHasRepo] = useState(oldRepoUrl !== "");

  const validateUrl = (url) => {
    try {
      return isURL(url, {
        protocols: ["http", "https"],
        require_protocol: true,
        require_valid_protocol: true,
      });
    } catch (err) {
      return false;
    }
  };

  const validateId = (id) => {
    return isInt(id, { min: 0 });
  };

  return (
    <Box
      sx={{ p: 3 }}
      component="form"
      onSubmit={(event) => {
        event.preventDefault();

        onSubmit(
          hasRepo ? newRepoUrl : "",
          newRepoId,
          newRepoToken,
          newRepoTag
        );
      }}
    >
      <Stack direction="column" spacing={3} sx={{ p: 3, pr: 0 }}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          divider={<Divider orientation="vertical" flexItem />}
        >
          <Typography
            variant="h6"
            sx={{ pl: 2, pr: 2 }}
            noWrap
            minWidth={rowWidth}
          >
            {"Git 仓库"}
          </Typography>
          <Switch
            checked={hasRepo}
            onChange={(event) => {
              setHasRepo(event.target.checked);
            }}
          />
        </Stack>
        {hasRepo && (
          <>
            <InputContent
              title={"GitLab 地址 "}
              content={newRepoUrl}
              updateContent={setNewRepoUrl}
              validation={validateUrl(newRepoUrl)}
              description={
                "仓库所在的 GitLab 实例网址，需要指定 http/https，如 https://gitlab.com, https://gitlab.secoder.net。"
              }
            />
            <InputContent
              title={"仓库 ID "}
              content={newRepoId}
              updateContent={setNewRepoId}
              validation={validateId(newRepoId)}
              description={"仓库的编号，可以在仓库的主页查看。"}
            />
            <InputContent
              title={"仓库 Access Token"}
              content={newRepoToken}
              updateContent={setNewRepoToken}
              description={
                <span>
                  {"仓库的 "}
                  <a
                    href={
                      "https://docs.gitlab.com/ee/user/project/settings/project_access_tokens.html"
                    }
                  >
                    {"Access Token"}
                  </a>
                  {"，如果为公开仓库可留空，需要具有 API Read 权限。"}
                </span>
              }
            />
            <InputContent
              title={"仓库订阅 Issue Tag"}
              content={newRepoTag}
              updateContent={setNewRepoTag}
              description={
                "设置提供给质量保证工程师的缺陷在 issue 中对应的 tag（如 bug），留空表示订阅所有 issue"
              }
            />
          </>
        )}
      </Stack>{" "}
      <Button
        type="submit"
        disabled={
          hasRepo && !(validateUrl(newRepoUrl) && validateId(newRepoId))
        }
      >
        确定
      </Button>
      <Button
        onClick={() => {
          onCancel();
        }}
      >
        取消
      </Button>
    </Box>
  );
}

export default function Git() {
  const [hasGitRepo, setHasGitRepo] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [repoUrl, setRepoUrl] = useState("");
  const [repoId, setRepoId] = useState(0);
  const [repoTag, setRepoTag] = useState("");
  const [repoToken, setRepoToken] = useState("");
  const [modifying, setModifying] = useState(false);
  const [dialogMsg, setDialogMsg] = useState("");

  const [dialog, setDialog] = useState(false);
  let { projectIndex } = useParams();

  useEffect(() => {
    if (!loaded) getGitInfo();
  }, []);

  const showAlert = (msg = "") => {
    setDialogMsg(msg);
    setDialog(true);
  };

  function getGitInfo() {
    let token = cookie.load("token");
    const headers = { Authorization: "Bearer " + token };
    const url = new URL(
      `/api/projects/${projectIndex}/git/get-info`,
      process.env.REACT_APP_BACKEND_URL
    );
    axios
      .get(url.toString(), { headers })
      .then((response) => {
        const payload = response.data.data;
        setHasGitRepo(payload.hasGitRepo);
        if (payload.hasGitRepo) {
          setRepoUrl(payload.detail.gitlabUrl);
          setRepoId(payload.detail.gitlabProjId);
          setRepoToken(payload.detail.gitAccessToken);
          setRepoTag(payload.detail.gitIssueTag);
        } else {
          setRepoUrl("");
          setRepoId(0);
          setRepoToken("");
        }
        setLoaded(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function submitData(newRepoUrl, newRepoId, newRepoToken, newRepoTag) {
    let token = cookie.load("token");
    const headers = { Authorization: "Bearer " + token };
    const url = new URL(
      `/api/projects/${projectIndex}/git/set-info`,
      process.env.REACT_APP_BACKEND_URL
    );
    axios
      .post(
        url.toString(),
        {
          url: newRepoUrl,
          id: Number(newRepoId),
          token: newRepoToken,
          issueTag: newRepoTag,
        },
        { headers }
      )
      .then((response) => {
        if (response.data.data.code === 0) {
          showAlert("修改成功");
        } else if (response.data.data.code === 1) {
          showAlert("已有功能需求与 MR 绑定，修改失败");
          getGitInfo();
        } else if (response.data.data.code === 2) {
          showAlert("无法连接上游 Git 服务器，请检查后重试");
        } else {
          showAlert("未知错误");
        }
      })
      .catch((err) => {
        console.log(err.response.data.data);
        showAlert("网络错误，请重试");
      });
  }

  function getGitContent() {
    return modifying ? (
      <ModifyGitInfo
        oldRepoId={repoId}
        oldRepoUrl={repoUrl}
        oldRepoToken={repoToken}
        oldRepoTag={repoTag}
        onSubmit={(newRepoUrl, newRepoId, newRepoToken, newRepoTag) => {
          setRepoUrl(newRepoUrl);
          setRepoId(newRepoId);
          setRepoToken(newRepoToken);
          setRepoTag(newRepoTag);
          setHasGitRepo(newRepoUrl !== "");
          submitData(newRepoUrl, newRepoId, newRepoToken, newRepoTag);
          setModifying(false);
        }}
        onCancel={() => {
          setModifying(false);
        }}
      />
    ) : (
      <Box sx={{ p: 3 }}>
        {hasGitRepo ? (
          <Stack direction="column" spacing={3} sx={{ p: 3, pr: 0 }}>
            <InfoContent title={"GitLab 地址 "} content={repoUrl} />
            <InfoContent title={"仓库 ID "} content={repoId} />
            {repoToken ? (
              <InfoContentSecret
                title={"仓库 Access Token"}
                content={repoToken}
              />
            ) : (
              <InfoContent title={"仓库 Access Token"} content={"暂无"} />
            )}
            <InfoContent
              title={"仓库订阅 Issue Tag"}
              content={repoTag || "所有 Tag"}
            />
          </Stack>
        ) : (
          <Typography variant="h6" sx={{ pl: 2, pr: 2 }} noWrap>
            {"未配置 Git 仓库"}
          </Typography>
        )}
        <Button onClick={() => setModifying(true)}>修改</Button>
      </Box>
    );
  }
  return (
    <Paper
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box>
        <Typography variant="h4">Git 管理</Typography>
        {getGitContent()}
      </Box>
      <SuccessAlert
        successToastOpen={dialog}
        handleSuccessAlertClose={() => setDialog(false)}
        info={dialogMsg}
      />
    </Paper>
  );
}
