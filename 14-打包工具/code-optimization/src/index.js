import name from "./base";
import React from "react";
import ReactDOM from "react-dom";

require('./index.css');

console.log(name);

ReactDOM.render(<h1>Hello, world!</h1>, document.getElementById("root"));
