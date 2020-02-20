import React, { Component } from "react";
import { bindActionCreators } from "redux";
import store from "../store";
import { counter as counterAction } from "../store/actions";

const newAction = bindActionCreators(counterAction, store.dispatch);

export default class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      number: store.getState().counter.number
    };
  }

  componentWillMount() {
    this.unsubscribe = store.subscribe(() => {
      this.setState({
        number: store.getState().counter.number
      });
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  addOdd = () => {
    if (this.state.number % 2 !== 0) {
      newAction.increment();
    }
  };

  asyncAdd = () => {
    setTimeout(() => {
      newAction.increment();
    }, 1000);
  };

  render() {
    return (
      <div>
        <h3>Current Value: {this.state.number}</h3>
        <button onClick={newAction.increment}>+</button>
        <button onClick={newAction.decrement}>-</button>
        <button onClick={this.addOdd}>add odd</button>
        <button onClick={this.asyncAdd}>async add</button>
      </div>
    );
  }
}
