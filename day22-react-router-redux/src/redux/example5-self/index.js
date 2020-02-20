import React, { Component } from "react";
import ReactDom from "react-dom";
import { Provider } from "react-redux";

import store from "./store/index";
import Counter from "./components/Counter";

ReactDom.render(
  <Provider store={store}>
    <Counter />
  </Provider>,
  document.getElementById("root")
);
