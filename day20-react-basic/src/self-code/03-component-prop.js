// 组件，从概念上类似于 JavaScript 函数。它接受任意的入参（即 “props”），并返回用于描述页面展示内容的 React 元素。

// 无论是使用函数或是类来声明一个组件，它决不能修改它自己的props
// 纯函数没有改变它自己的输入值，当传入的值相同时，总是会返回相同的结果
// 所有的React组件必须像纯函数那样使用它们的props
import React from "react";
import ReactDom from "react-dom";

// 函数定义组件
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

// 类定义组件
class Welcome2 extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}

const element = (
  <div>
    <Welcome name="name-welcome1" />
    <Welcome2 name="name-welcome2" />
  </div>
);

// 复合组件&提取组件
class Body extends React.Component {
  render() {
    return <div className="panel-body">{this.props.body}</div>;
  }
}

class Header extends React.Component {
  render() {
    return <div className="panel-header">{this.props.header}</div>;
  }
}

class Panel extends React.Component {
  render() {
    let { header, body } = this.props;
    return (
      <div className="panel">
        <Header header={header} />
        <Body body={body} />
      </div>
    );
  }
}

const data = {
    header: 'panel header',
    body: 'panel body'
}

ReactDom.render(<Panel {...data} />, document.getElementById("root"));
