import React from "react";
import ReactDom from "react-dom";

class ErrorBoundry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false
    };
  }

  static getDerivedStateFromError() {
    console.log("getDerivedStateFromError");
    return {
      hasError: true
    };
  }

  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo, "<----");
  }

  render() {
    console.log(this.state.hasError);
    if (this.state.hasError) {
      // 自定义错误后显示的UI并渲染
      return <h1>Something went wrong </h1>;
    }
    return this.props.children;
  }
}

class Content extends React.Component {
  render() {
    return (
      <React.Fragment>
        <span>Hello wrold </span>
        {/* {null.toString()} */}
      </React.Fragment>
    );
  }
}

class Page extends React.Component {
  render() {
    return (
      <ErrorBoundry>
        <Content />
      </ErrorBoundry>
    );
  }
}

ReactDom.render(<Page />, document.getElementById("root"));
