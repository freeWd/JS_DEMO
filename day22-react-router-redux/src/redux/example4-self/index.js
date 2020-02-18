import React from "react";
import ReactDom from "react-dom";
import { Provider, connect } from "./react-redux";

import Counter from "./components/Counter";
import counterReactRedux from "./store/react-redux";
import store from "./store/index";

const App = connect(
  counterReactRedux.mapStateToProps,
  counterReactRedux.mapDispatchToProps
)(Counter);

ReactDom.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
