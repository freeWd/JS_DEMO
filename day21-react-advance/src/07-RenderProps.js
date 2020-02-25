import React from "react";
import ReactDom from "react-dom";

// 实现一个功能，显示鼠标的坐标

// ============== 使用基本的React组件来实现
// 这样实现有一个问题： 我们如何在另一个组件中复用这个行为？换个说法，若另一个组件需要知道鼠标位置，我们能否封装这一行为，以便轻松地与其他组件共享它？
class MouseTracker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      x: null,
      y: null
    };
  }

  mouseMove = e => {
    this.setState({
      x: e.clientX,
      y: e.clientY
    });
  };

  render() {
    return (
      <div
        style={{ height: "97vh", border: "1px solid red" }}
        onMouseMove={this.mouseMove}
      >
        <h1>移动鼠标！(MouseTracker)</h1>
        <p>
          当前鼠标的位置 x: {this.state.x} y: {this.state.y}
        </p>
      </div>
    );
  }
}

// ReactDom.render(<MouseTracker />, document.getElementById("root"));

// ============== 使用Render Props实现
// 下面特意写了mouse和mouse2两个组件，来描述 render props的优势，相同的逻辑（获取坐标）写一次就行了
class MouseTracker2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      x: null,
      y: null
    };
  }

  mouseMove = e => {
    this.setState({
      x: e.clientX,
      y: e.clientY
    });
  };

  render() {
    return (
      <div
        style={{ height: "97vh", border: "1px solid red" }}
        onMouseMove={this.mouseMove}
      >
        {this.props.render(this.state)}
      </div>
    );
  }
}

class Mouse extends React.Component {
  render() {
    return (
      <React.Fragment>
        <h1>移动鼠标！(Mouse)</h1>
        <p>
          当前鼠标的位置 x: {this.props.x} y: {this.props.y}
        </p>
      </React.Fragment>
    );
  }
}

class Mouse2 extends React.Component {
  render() {
    const x = this.props.x;
    const y = this.props.y;
    return (
      <React.Fragment>
        <h1>移动鼠标！(Mouse)</h1>
        <div style={{ position: "absolute", left: x, top: y }}>
          hello mouse2
        </div>
      </React.Fragment>
    );
  }
}

// ReactDom.render(
//   <MouseTracker2 render={position => <Mouse2 {...position} />} />,
//   document.getElementById("root")
// );

// ============== 使用HOC （高阶组件）实现
const hocMouse = MouseComponent => {
  class HocMouse extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        x: null,
        y: null
      };
    }
    mouseMove = e => {
      this.setState({
        x: e.clientX,
        y: e.clientY
      });
    };

    render() {
      return (
        <div
          style={{ height: "97vh", border: "1px solid red" }}
          onMouseMove={this.mouseMove}
        >
          <MouseComponent {...this.state} />
        </div>
      );
    }
  }
  return HocMouse;
};

const Demo = hocMouse(Mouse);
const Demo2 = hocMouse(Mouse2);

ReactDom.render(
  <Demo2/>,
  document.getElementById("root")
);