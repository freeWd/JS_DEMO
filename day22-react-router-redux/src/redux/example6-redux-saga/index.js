import React from "react";
import ReactDom from "react-dom";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";

import configureStore, { history } from "./store/index";
import Home from "./components/Home";
import Login from "./components/Login";
import FrontendAuth from "./router-auth/FrontendAuth";

const store = configureStore();

ReactDom.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Switch>
        <Redirect exact from="/" to="/home"></Redirect>
        <Route path="/login" component={Login}></Route>
        <FrontendAuth>
          <Route path="/home" component={Home}></Route>
        </FrontendAuth>
      </Switch>
    </ConnectedRouter>
  </Provider>,
  document.getElementById("root")
);
