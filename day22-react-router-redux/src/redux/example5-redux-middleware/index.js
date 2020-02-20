import React from "react";
import ReactDom from "react-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import Counter from "./components/Counter";
import store from "./store/index";
import { persistor } from "./store/index";

ReactDom.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Counter />
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);
