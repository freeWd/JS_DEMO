import React from "react";
import ReactDom from "react-dom";

// =============== 高阶组件（简单） ===============
class App extends React.Component {
  render() {
    return <div>App</div>;
  }
}

const logger = WrappedComponent => {
  class LoggerComponent extends React.Component {
    componentWillMount() {
      this.start = Date.now();
    }

    componentDidMount() {
      console.log(Date.now() - this.start + "ms");
    }

    render() {
      return <WrappedComponent />;
    }
  }
  return LoggerComponent;
};

let AppComponent = logger(App);

// ReactDom.render(<AppComponent />, document.getElementById("root"));

// =============== 多层高阶组件 ===============
// 根据插入的name值获取localStorage中的value, 再以value为条件发送异步请求获取json值，渲染到input中

const fromLocal = (WrappedComponent, name) => {
  class NewComponent extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        id: null
      };
    }

    componentDidMount() {
      const value = localStorage.getItem(name) || "demo";
      this.setState({
        id: value
      });
    }

    render() {
      return <WrappedComponent id={this.state.id} />;
    }
  }

  return NewComponent;
};

const fromAjax = WrappedComponent => {
  class NewComponent extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        value: null
      };
    }

    componentDidMount() {
      fetch(`/${this.props.id}.json`)
        .then(res => res.json())
        .then(
          val => {
            this.setState({
              value: val
            });
          },
          () => {
            this.setState({
              value: "hello world"
            });
          }
        );
    }

    render() {
      return <WrappedComponent value={this.state.value} />;
    }
  }

  return NewComponent;
};

function UserName(props) {
  return <input defaultValue={props.value} />;
}

const UserNameAjaxComp = fromAjax(UserName);
const UserNameLocalComp = fromLocal(UserNameAjaxComp, 'demoKey');

// ReactDom.render(<UserNameLocalComp />, document.getElementById("root"));

