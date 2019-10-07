import { combineReducers } from "redux";
import authorizeReducer from "./authorizeReducer";

// this will export the combine as rootReducer
export default combineReducers({
  auth: authorizeReducer
});
