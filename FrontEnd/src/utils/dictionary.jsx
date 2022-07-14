import cookie from "react-cookies";
import axios from "axios";

export default function getDictionary(projectId) {
  let userList = [];
  let devloperNameList = [];
  let iterationDict = new Array();
  let devloperDict = new Array();
  let systemDict = new Array();
  let originRequireDict = new Array();
  let userDict = new Array();
  let returnBody = {};
  const headers = { Authorization: "Bearer " + cookie.load("token") };

  function getIrlist() {
    const url =
      process.env.REACT_APP_BACKEND_URL +
      "api/projects/" +
      projectId +
      "/find-all-ori-require";
    return axios
      .get(url, { headers })
      .then((response) => {
        let originRequireList = response.data.data;
        for (let index = 0; index < originRequireList.length; index++) {
          originRequireDict[originRequireList[index].id.toString()] =
            originRequireList[index].name;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function getIterationList() {
    const url =
      process.env.REACT_APP_BACKEND_URL +
      "api/projects/" +
      projectId +
      "/find-all-iter";
    return axios.get(url, { headers }).then((response) => {
      for (let i = 0; i < response.data.data.length; i++) {
        iterationDict[response.data.data[i].id.toString()] =
          response.data.data[i].name;
      }
    });
  }
  function getUserList() {
    const url = process.env.REACT_APP_BACKEND_URL + "api/users/find";
    return axios
      .get(url, { headers })
      .then((response) => {
        userList = response.data.data;
        for (let index = 0; index < userList.length; index++) {
          userDict[userList[index].id.toString()] = userList[index].username;
        }
        getDeveloperList();
      })
      .catch((error) => {
        console.log("error is : " + error);
      });
  }

  function getMetalist() {
    const url =
      process.env.REACT_APP_BACKEND_URL +
      "api/projects/" +
      projectId +
      "/find-one";
    return axios
      .get(url, { headers })
      .then((response) => {
        devloperNameList = response.data.data.developmentEngineers;
        getUserList();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function getDeveloperList() {
    for (let i = 0; i < userList.length; i++) {
      if (devloperNameList.indexOf(userList[i].username) !== -1) {
        devloperDict[userList[i].id.toString()] = userList[i].username;
      }
    }
  }

  function getSystemList() {
    const url =
      process.env.REACT_APP_BACKEND_URL +
      "api/projects/" +
      projectId +
      "/find-all-sys-serv";
    return axios.get(url, { headers }).then((response) => {
      for (let i = 0; i < response.data.data.length; i++) {
        systemDict[response.data.data[i].id.toString()] =
          response.data.data[i].name;
      }
    });
  }

  getIrlist();
  getMetalist();
  getSystemList();
  getIterationList();
  getUserList();

  returnBody.iterationDict = iterationDict;
  returnBody.devloperDict = devloperDict;
  returnBody.systemDict = systemDict;
  returnBody.userDict = userDict;
  returnBody.originRequireDict = originRequireDict;

  return returnBody;
}
