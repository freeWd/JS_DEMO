// 组件的数据来源有两个地方，分别是属性对象和状态对象
// 属性是父组件传递过来的(默认属性，属性校验)
// 状态是自己内部的,改变状态唯一的方式就是setState
// 属性和状态的变化都会影响视图更新

// 构造函数是唯一可以给 this.state 赋值的地方, 不要直接修改 State

import React from "react";
import ReactDom from "react-dom";

class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "Hello world",
      date: new Date()
    };
  }

  // 组件挂载后
  componentDidMount() {
    this.timeId = setInterval(() => {
      this.updDate();
    }, 1000);
  }

  // 组件卸载前
  componentWillUnmount() {
    clearInterval(this.timeId);
  }

  // State 的更新可能是异步的
  // 出于性能考虑，React 可能会把多个 setState() 调用合并成一个调用
  // 因为 this.props 和 this.state 可能会异步更新，所以你不要依赖他们的值来更新下一个状态
  // 可以让 setState() 接收一个函数而不是一个对象。这个函数用上一个 state 作为第一个参数 props作为第二个参数， 这样多个setState就不会只执行最后一次的
  // setState内的函数相当于一次一次的嵌套回调

  // this.setState((state, props) => ({count: state.count + Math.random()}));
  // this.setState((state, props) => ({count: state.count + props.increment}));
  // ===> 相当于
  // this.setState((state, props) => ({count: state.count + Math.random()}), () => {
  //   this.setState((state, props) => ({count: state.count + props.increment}));
  // });


  updDate() {
    this.setState({
      date: new Date()
    });
  }

  render() {
    return (
      <div>
        <p>{this.state.title}</p>
        <h1>当前时间 {this.state.date.toLocaleString()}</h1>
      </div>
    );
  }
}

ReactDom.render(<Clock />, document.getElementById("root"));
