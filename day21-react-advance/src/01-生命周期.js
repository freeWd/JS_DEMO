import React from "react";
import ReactDom from "react-dom";

class LifeCycle extends React.Component {
  static defaultProps = {
    name: "Hello World"
  };

  constructor(props) {
    super(props);
    this.state = {
      nums: 0
    };
  }

  handleAdd = () => {
    this.setState(proState => {
      return {
        nums: ++proState.nums
      };
    });
  };

  render() {
    return (
      <div>
        <p>{this.state.nums}</p>
        <Child value={this.state.nums} />
        <button onClick={this.handleAdd}>+</button>
      </div>
    );
  }
}

class Child extends React.Component {
  constructor(props) {
    console.log("1.constructor构造函数");
    super(props);
    this.state = {
      title: "I am a child component"
    };
    this.domRef = React.createRef();
  }

  static getDerivedStateFromProps(nextProps, preState) {
    console.log("2.将传入的props映射到state上面");
    const { value } = nextProps;
    // 当传入的value发生变化的时候，返回的值会assign到state中去
    if (!isNaN(value) && value !== null && value !== "") {
      if (value % 2 === 0) {
        return { value: value * 2 };
      } else {
        return { value: value * 3 };
      }
    }

    // 否则，返回null表示对于state不进行任何操作
    return null;
  }

  componentDidMount() {
    console.log("5.组件挂载完成 componentDidMount");
  }

  shouldComponentUpdate(nextProps, nextState) { // 代表的是下一次的属性 和 下一次的状态
    // 如果此函数种返回了false 就不会调用render方法了
    //不要随便用setState 可能会死循环
    console.log("3.组件是否更新 shouldComponentUpdate");
    return true;
  }

  getSnapshotBeforeUpdate() {
    // 被调用于render之后，可以读取但无法使用DOM的时候
    // 很关键的，我们获取当前rootNode的scrollHeight，传到componentDidUpdate 的参数perScrollHeight
    console.log("6 在render之后调用，获取dom信息，getSnapshotBeforeUpdate");
    return this.domRef.current.scrollHeight;
  }

  componentDidUpdate(perProps, perState, prevScrollHeight) {
    console.log("7.组件完成更新 componentDidUpdate");
    const curScrollTop = this.domRef.current.scrollTop; //当前向上卷去的高度
    //当前向上卷去的高度加上增加的内容高度
    this.domRef.current.scrollTop =
      curScrollTop + (this.domRef.current.scrollHeight - prevScrollHeight);
  }

  componentWillUnmount() {
    console.log('组件将要卸载componentWillUnmount');
  }

  destory = () => {
      ReactDom.unmountComponentAtNode(document.getElementById('root'));
  }

  render() {
    console.log("4.render");
    return (
      <div ref={this.domRef}>
        <hr />
        <h4>Title: {this.state.title}</h4>
        <span>{this.state.value}</span>
        <button onClick={this.destory}>销毁组件</button>
      </div>
    );
  }
}

ReactDom.render(<LifeCycle />, document.getElementById("root"));
