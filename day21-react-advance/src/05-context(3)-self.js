// 自定义 函数组件的实现
import React from "react";

function createContext(val) {
  let value = val;
  class Provider extends React.Component {
    constructor(props) {
      super(props);
      value = props.value;
      this.state = {};
    }

    static getDerivedStateFromProps(nextProp, preState) {
      value = nextProp.value;
      return null;
    }

    render() {
      return this.props.children;
    }
  }

  class Customer extends React.Component {
    render() {
      // 从书写的结果来推实现，结果是标签包着一个function, 它的返回值是html标签，那么就执行这个function就能达到 this.prop.children直接包裹html标签的效果
      return this.props.children(value);
    }
  }

  return {
    Provider,
    Customer
  };
}
