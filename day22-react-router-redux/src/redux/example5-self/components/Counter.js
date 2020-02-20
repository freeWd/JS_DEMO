import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import store from "../store/index";
import counterAction from "../store/actions/counter";


const newAction = bindActionCreators(counterAction, store.dispatch);

function mapStateToProps() {
  return {
    value: store.getState().number
  };
}

function mapDispatchToProps() {
  return {
    increaseEvent: newAction.increment,
    incrementPromise: newAction.incrementPromise
  };
}

class Counter extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h1>{this.props.value}</h1>
        <button onClick={this.props.increaseEvent}>+</button>
        <button onClick={this.props.incrementPromise}> + promise</button>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Counter);
