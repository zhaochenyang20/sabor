import Communication from "./communication";

let communication = new Communication();

class User {
  checkLogin(loginInfo) {
    communication.post_request({
      url: process.env.REACT_APP_BACKEND_URL,
      data: loginInfo,
    });
  }
}

export default User;
