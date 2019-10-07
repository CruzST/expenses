import {
  LOGIN,
  LOGOUT,
  LOGIN_ERROR,
  REMOVE_ERROR
} from "../../Components/Constants/index";

const initialState = {
  isAdmin: false,
  id: 0,
  isLoggedIn: false,
  name: ""
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        isAdmin: action.payload.isAdmin,
        id: action.payload.id,
        isLoggedIn: true,
        name: action.payload.name,
        loginError: action.payload.loginError
      };

    case LOGIN_ERROR:
      return {
        loginError: action.payload.loginError
      };

    case REMOVE_ERROR:
      return {
        ...state,
        loginError: false
      };

    case LOGOUT:
      console.log("LOGOUT REDUCER");
      return {};

    default:
      return state;
  }
}
