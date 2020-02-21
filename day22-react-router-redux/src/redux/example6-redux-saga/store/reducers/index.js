import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

import homeReducer from "./home";
import loginReducer from "./login";

const createRootReducer = history =>
  combineReducers({
    router: connectRouter(history),
    home: homeReducer,
    login: loginReducer
  });

export default createRootReducer;
