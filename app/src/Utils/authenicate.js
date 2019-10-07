import { ACCESS_TOKEN, SECRET } from "../Components/Constants/index.js";
var jwt = require("jsonwebtoken");

class Authenticate {
  // constructor

  // methods
  saveToken(tokenName, token) {
    try {
      localStorage.setItem(tokenName, token);
    } catch (err) {
      console.log(err);
    }
  }

  isLoggedIn() {
    try {
      let token = localStorage.getItem(ACCESS_TOKEN);
      if (token === null) {
        return false;
      }
      return true;
    } catch (err) {
      return false;
    }
  }

  /* Function will access the local storage for the access token and return the sub # which is relevant to the user ID */
  getUser() {
    let token = localStorage.getItem(ACCESS_TOKEN);
    let decode = jwt.verify(token, SECRET);
    //console.log(decode);
    let user = {
      userId: decode.sub,
      userName: decode.name,
      userAdmin: decode.admin
    };
    return user;
  }

  removeToken() {
    localStorage.removeItem(ACCESS_TOKEN);
  }
}
export default new Authenticate();
