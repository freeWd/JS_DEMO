// React 事件的命名采用小驼峰式（camelCase），而不是纯小写。
// 使用 JSX 语法时你需要传入一个函数作为事件处理函数，而不是一个字符串
// 你不能通过返回 false 的方式阻止默认行为。你必须显式的使用preventDefault

import React from "react";
import ReactDom from "react-dom";

// ===> 阻止默认行为
function ActiveLink() {
  function handleClick(e) {
    e.preventDefault();
    console.log("阻止了a标签的默认点击行为");
  }

  return (
    <a href="#" onClick={handleClick}>
      阻止默认行为
    </a>
  );
}

// ====> Toogle 开关
class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isToggle: false
    };
  }

  toggleEvent = () => {
    this.setState(state => ({ isToggle: !state.isToggle }));
  };

  render() {
    return (
      <div>
        <p>当前开关状态： {this.state.isToggle ? "开" : "关"}</p>
        <button onClick={this.toggleEvent}>
          {this.state.isToggle ? "关闭" : "打开"}
        </button>
      </div>
    );
  }
}

// 向事件处理程序传递参数
class EventParams extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 123
    };
  }

  delInfo(id) {
    console.log("当前传递的id是：", id);
  }

  render() {
    return (
      <button onClick={this.delInfo.bind(this, this.state.id)}>
        删除信息 - 事件带参数
      </button>
    );
  }
}

ReactDom.render(<EventParams />, document.getElementById("root"));
