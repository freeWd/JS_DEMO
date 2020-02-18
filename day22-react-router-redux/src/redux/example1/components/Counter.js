import React, { Component } from "react";
import store from '../store';

export default class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: store.getState()
    };
  }

  componentWillMount() {
      this.unsubscribe = store.subscribe(() => {
          this.setState({
              value: store.getState()
          })
      })
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  incrementIfOdd = () => {
    if (this.state.value % 2 !== 0) {
      store.dispatch({ type: "INCREMENT" });
    }
  }

  incrementAsync = () => {
    setTimeout(() => {
      store.dispatch({ type: "INCREMENT" });
    }, 1000);
  }

  render() {
    return (
      <div>
        <h1>{this.state.value}</h1>
        <button onClick={() => store.dispatch({ type: "INCREMENT" })}>+</button>
        <button onClick={() => store.dispatch({ type: "DECREMENT" })}>-</button>
        <button onClick={this.incrementIfOdd}>Increment if odd</button>{" "}
        <button onClick={this.incrementAsync}>Increment async</button>
      </div>
    );
  }
}
