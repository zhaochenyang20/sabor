import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useParams,
} from "react-router-dom";

import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import Introduction from "./views/pages/introduction/introduction";
import RegisterSide from "./views/pages/register/sideregister";
import Register from "./views/pages/register/register.jsx";
import LoginSide from "./views/pages/login/loginside";
import DashboardLayout from "./layout/dashboard/index.jsx";
import Dashboard from "./views/dashboard/dashboard/dashboard";
import ChangePassword from "./views/dashboard/changepassword/ChangePassword";
import cookie from "react-cookies";
import axios from "axios";
import Authorization from "./views/pages/authorizatation/authorization";
import CreateProject from "./views/create/create";
import Identity from "./views/pages/authorizatation/identity";
import Authentication from "./views/pages/authorizatation/authentication";
import Loading from "./views/pages/authorizatation/loading";
import RoleIntroduction from "./views/pages/introduction/role";
import NotFound from "./views/pages/authorizatation/404";
// Administrator Pages
import Administrator from "./views/administrator/administrator";
import ProjectInfo from "./views/administrator/projectinfo";
import Human from "./views/administrator/human";
import Git from "./views/administrator/Git";
// System Pages
import System from "./views/systemEngineer/system";
import SystemMain from "./views/systemEngineer/systemMain";
import OriginRequire from "./views/systemEngineer/originRequire/originRequire";
import SystemService from "./views/systemEngineer/systemService/systemService";
import Iteration from "./views/systemEngineer/iteration/iteration";
// Develop Pages
import Develop from "./views/develop/develop";
import DevelopIteration from "./views/develop/iteration/iteration";
import Demands from "./views/develop/demands/demands";
// Quality Assurance Pages
import QA from "./views/QA/QA";
import Issues from "./views/QA/data/Issues";
import MergeRequests from "./views/QA/data/MergeRequests";
import IterationBoard from "./views/QA/iteration/iterationboard";
import Activation from "./views/QA/activation/activation";
import Ability from "./views/QA/ability/ability";
import { useState, useEffect } from "react";

function RequireAuthorization({ children }) {
  const [component, setComponent] = useState(<Authentication />);
  let token = cookie.load("token");
  const headers = { Authorization: "Bearer " + token };
  const url = process.env.REACT_APP_BACKEND_URL + "/api/users/testLogin";

  useEffect(() => {
    axios
      .get(url, { headers })
      .then((response) => {
        if (response.data.code === 200) {
          setComponent(children);
        } else {
          setComponent(<Navigate to="/authorization" replace />);
        }
      })
      .catch(() => {
        setComponent(<Navigate to="/authorization" replace />);
      });
  }, []);
  return component;
}

function RequireAdmin({ children }) {
  const [component, setComponent] = useState(<Loading />);
  let { projectIndex } = useParams();
  let token = cookie.load("token");
  const headers = { Authorization: "Bearer " + token };
  const url =
    process.env.REACT_APP_BACKEND_URL +
    "api/projects/" +
    projectIndex +
    "/find-one";

  useEffect(() => {
    axios
      .get(url, { headers })
      .then((response) => {
        let username = cookie.load("username");
        if (username === response.data.data.manager) {
          setComponent(children);
        } else {
          setComponent(
            <Navigate
              to={"/identity/project" + projectIndex + "/admin"}
              replace
            />
          );
        }
      })
      .catch((error) => {
        console.log(error.response.data.data);
        console.log(error.response.data.data.search("002#"));
        if (error.response.data.data.search("003#") !== -1) {
          setComponent(
            <Navigate
              to={"/identity/project" + projectIndex + "/admin"}
              replace
            />
          );
        } else {
          setComponent(<Navigate to={"/404"} replace />);
        }
      });
  });
  return component;
}

function RequireSystem({ children }) {
  const [component, setComponent] = useState(<Loading />);
  let { projectIndex } = useParams();
  let token = cookie.load("token");
  const headers = { Authorization: "Bearer " + token };
  const url =
    process.env.REACT_APP_BACKEND_URL +
    "api/projects/" +
    projectIndex +
    "/find-one";
  useEffect(() => {
    axios
      .get(url, { headers })
      .then((response) => {
        let username = cookie.load("username");
        let num = response.data.data.systemEngineers.indexOf(username);
        if (num != -1) setComponent(children);
        else
          setComponent(
            <Navigate
              to={"/identity/project" + projectIndex + "/system"}
              replace
            />
          );
      })
      .catch((error) => {
        if (error.response.data.data.search("003#") !== -1) {
          setComponent(
            <Navigate
              to={"/identity/project" + projectIndex + "/system"}
              replace
            />
          );
        } else {
          setComponent(<Navigate to={"/404"} replace />);
        }
      });
  });
  return component;
}

function RequireDevelop({ children }) {
  const [component, setComponent] = useState(<Loading />);
  let { projectIndex } = useParams();
  let token = cookie.load("token");
  const headers = { Authorization: "Bearer " + token };
  const url =
    process.env.REACT_APP_BACKEND_URL +
    "api/projects/" +
    projectIndex +
    "/find-one";
  useEffect(() => {
    axios
      .get(url, { headers })
      .then((response) => {
        let username = cookie.load("username");
        let num = response.data.data.developmentEngineers.indexOf(username);
        if (num != -1) setComponent(children);
        else
          setComponent(
            <Navigate
              to={"/identity/project" + projectIndex + "/develop"}
              replace
            />
          );
      })
      .catch((error) => {
        if (error.response.data.data.search("003#") !== -1) {
          setComponent(
            <Navigate
              to={"/identity/project" + projectIndex + "/develop"}
              replace
            />
          );
        } else {
          setComponent(<Navigate to={"/404"} replace />);
        }
      });
  });
  return component;
}

function RequireQA({ children }) {
  const [component, setComponent] = useState(<Loading />);
  let { projectIndex } = useParams();
  let token = cookie.load("token");
  const headers = { Authorization: "Bearer " + token };
  const url =
    process.env.REACT_APP_BACKEND_URL +
    "api/projects/" +
    projectIndex +
    "/find-one";
  useEffect(() => {
    axios
      .get(url, { headers })
      .then((response) => {
        let username = cookie.load("username");
        let num =
          response.data.data.qualityAssuranceEngineers.indexOf(username);
        if (num != -1) setComponent(children);
        else
          setComponent(
            <Navigate to={"/identity/project" + projectIndex + "/QA"} replace />
          );
      })
      .catch((error) => {
        if (error.response.data.data.search("003#") !== -1) {
          setComponent(
            <Navigate to={"/identity/project" + projectIndex + "/QA"} replace />
          );
        } else {
          setComponent(<Navigate to={"/404"} replace />);
        }
      });
  });
  return component;
}

/* A miragation from tab switches to drawer switches
 * for system Enginner pages
 * a wrapper function for title
 */
const SystemEngineerWrapper = ({ title, children }) => {
  return (
    <Paper
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h4">{title}</Typography>
      {children}
    </Paper>
  );
};

const OurRouter = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Introduction />} />
        <Route path="register" element={<RegisterSide />} />
        <Route path="login" element={<LoginSide />} />
        <Route path="loading" element={<Loading />} />
        <Route path="404" element={<NotFound />} />
        <Route path="authentication" element={<Authentication />} />
        <Route path="*" element={<NotFound />} />
        <Route
          path="dashboard"
          element={
            <RequireAuthorization>
              <DashboardLayout />
            </RequireAuthorization>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="create" element={<CreateProject />} />
          <Route path="password" element={<ChangePassword />} />
          <Route
            path="system/project:projectIndex"
            element={
              <RequireSystem>
                <System />
              </RequireSystem>
            }
          >
            {/*<Route path="main" element={<SystemMain />} />*/}
            <Route
              path=""
              element={
                <RoleIntroduction
                  path={"/static/system_intro.svg"}
                  width={500}
                />
              }
            />
            <Route
              path="require"
              element={
                <SystemEngineerWrapper title="需求管理">
                  <OriginRequire />
                </SystemEngineerWrapper>
              }
            />
            <Route
              path="service"
              element={
                <SystemEngineerWrapper title="服务管理">
                  <SystemService />
                </SystemEngineerWrapper>
              }
            />
            <Route
              path="iteration"
              element={
                <SystemEngineerWrapper title="迭代管理">
                  <Iteration />
                </SystemEngineerWrapper>
              }
            />
          </Route>
          <Route
            path="develop/project:projectIndex"
            element={
              <RequireDevelop>
                <Develop />
              </RequireDevelop>
            }
          >
            <Route
              path=""
              element={
                <RoleIntroduction
                  path={"/static/develop_intro.svg"}
                  width={650}
                />
              }
            />
            <Route path="iteration" element={<DevelopIteration />} />
            <Route path="demands" element={<Demands />} />
          </Route>
          <Route
            path="QA/project:projectIndex"
            element={
              <RequireQA>
                <QA />
              </RequireQA>
            }
          >
            <Route
              path=""
              element={
                <RoleIntroduction
                  path={"/static/quality_intro.svg"}
                  width={650}
                />
              }
            />
            <Route path="iteration" element={<IterationBoard />} />
            <Route path="merge-request" element={<MergeRequests />} />
            <Route path="issue" element={<Issues />} />
            <Route path="activation" element={<Activation />} />
            <Route path="ability" element={<Ability />} />
          </Route>
          <Route
            path="admin/project:projectIndex"
            element={
              <RequireAdmin>
                <Administrator />
              </RequireAdmin>
            }
          >
            <Route
              path=""
              element={
                <RoleIntroduction
                  path={"/static/admin_intro.svg"}
                  width={750}
                />
              }
            />
            <Route path="project" element={<ProjectInfo />} />
            <Route path="human" element={<Human />} />
            <Route path="git" element={<Git />} />
          </Route>
        </Route>
        <Route path="authorization" element={<Authorization />} />
        <Route path="register" element={<Register />} />
        <Route
          path="identity/project:projectIndex/:role"
          element={<Identity />}
        />
      </Routes>
    </Router>
  );
};

export default OurRouter;
