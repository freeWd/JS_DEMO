import React, { Component } from "react";
import { bindActionCreators } from "redux";
import store from "../store";
import { todos as todosAction } from "../store/actions";

const newAction = bindActionCreators(todosAction, store.dispatch);

export default class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todoList: store.getState().todos,
      inputVal: ""
    };
  }

  componentWillMount() {
    this.unsubscribe = store.subscribe(() => {
      this.setState({
        todoList: store.getState().todos
      });
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  changeVul = e => {
    this.setState({
      inputVal: e.target.value
    });
  };

  addTask = () => {
    newAction.add(this.state.inputVal);
    this.setState({
      inputVal: ""
    });
  };


  render() {
    return (
      <div>
        <input
          type="text"
          value={this.state.inputVal}
          onChange={this.changeVul}
        />
        <button onClick={this.addTask}>添加任务</button>
        <ul>
          {this.state.todoList.map(todoItem => (
            <li key={todoItem.id}>
              {todoItem.text} 【{todoItem.completed ? "已完成" : "未完成"}】
              <button onClick={() => newAction.toggle(todoItem.id)}>改变状态</button>
              <button onClick={() => newAction.delete(todoItem.id)}>删除</button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
