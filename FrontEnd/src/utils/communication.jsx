import axios from "axios";

export async function Post(url, body, oper, headers) {
  axios({
    url: url,
    method: "post",
    data: body,
    headers: headers,
  })
    .then((response) => {
      let result = {
        code: response.data.code,
        data: response.data.data,
      };
      oper(result);
    })
    .catch((error) => {
      if (error.response) {
        let result = {
          code: error.response.status,
          data: error.response.data,
        };
        oper(result);
      } else {
        let result = {
          code: 600,
          data: {
            code: 600,
            data: "",
          },
        };
        oper(result);
      }
    });
}
// 大写的 Post 接受三个参数，url(API)，body(传输的内容)，oper(处理返回值的回调函数)
// axios 会把后端返回的 401 视为回调失败，所以需要 catch 401

export async function Get(url, body, oper, headers = {}) {
  axios({
    url: url,
    method: "get",
    data: body,
    headers: headers,
  })
    .then((response) => {
      let result = {
        code: response.data.code,
        data: response.data.data,
      };
      oper(result);
    })
    .catch((error) => {
      if (error.response) {
        let result = {
          code: error.response.status,
          data: error.response.data,
        };
        oper(result);
      } else {
        let result = {
          code: 600,
          data: {
            code: 600,
            data: "",
          },
        };
        oper(result);
      }
    });
}
