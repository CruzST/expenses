import axios from "axios";
import {
  LOGIN,
  LOGOUT,
  ACCESS_TOKEN,
  LOGIN_ERROR,
  REMOVE_ERROR
} from "../../Components/Constants/index";
import authenticate from "../../Utils/authenicate";

import { removeState } from "../../Utils/localstorage";

// Local function only
const clearStates = () => {
  authenticate.removeToken();
  removeState();
};

export const login = (payload, config) => dispatch => {
  axios
    .post(`/api/auth/signin`, payload, config)
    .then(res => {
      clearStates();
      let accessToken = res.data.accessToken;
      authenticate.saveToken(ACCESS_TOKEN, accessToken);
    })
    .then(res => {
      let user = authenticate.getUser();
      dispatch({
        type: LOGIN,
        payload: {
          id: user.userId,
          name: user.userName,
          isAdmin: user.userAdmin,
          loginError: false
        }
      });
    })
    .catch(err => {
      console.log("ERROR POSTING TO LOGIN");
      console.log(err);
      dispatch({
        type: LOGIN_ERROR,
        payload: {
          loginError: true
        }
      });
    });
};

export const logout = () => dispatch => {
  console.log("logout action called");
  clearStates();
  dispatch({
    type: LOGOUT
  });
};

export const removeError = () => dispatch => {
  dispatch({
    type: REMOVE_ERROR
  });
};
