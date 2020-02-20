import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import store from "../store";
import counterAction from "../store/actions/counter";

const newAction = bindActionCreators(counterAction, store.dispatch);
function mapStateToProps() {
  return {
    value: store.getState().number
  };
}
function mapDispatchToProps() {
  return newAction;
}

class Counter extends Component {
  constructor(props) {
    super(props);
  }

  async2Click = () => {
    this.props.incrementAsync2().then((msg) => {
      console.log(msg, '<----msg');
    }, (err) => {
      console.log(err, '<----err');
    });
  }

  render() {
    return (
      <div>
        <h1>{this.props.value}</h1>
        <button onClick={this.props.increment}>add</button>
        <button onClick={this.props.incrementAsync}>async add</button>
        <button onClick={this.async2Click}>async add2</button>
        <button onClick={this.props.incrementPromise}>promise add</button>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Counter);


