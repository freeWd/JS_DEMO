// this.props.children被替换的组件被挂载到距离其最近的DOM节点
// 而Portals 插槽的DOM节点可以自己定义

import React from "react";
import ReactDom from "react-dom";
import './index.css'

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.modalDom = document.getElementById("modal-root");
  }

  render() {
    return ReactDom.createPortal(this.props.children, this.modalDom);
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nums: 0,
      showModal: false
    };
  }

  handleClick = () => {
    this.setState(preState => ({
      showModal: !preState.showModal
    }));
  };

  addNums = () => {
    this.setState({
      nums: ++this.state.nums
    });
  };

  render() {
    return (
      <div>
        <button onClick={this.handleClick}>显示模态框</button>
        <p>Show Click Nums: {this.state.nums}</p>
        {this.state.showModal && (
          <Modal>
            <Content close={this.handleClick} add={this.addNums} />
          </Modal>
        )}
      </div>
    );
  }
}

function Content(props) {
  return (
    <div id="modal" className="modal">
      <div className="modal-content" id="modal-content">
        内容
        <button onClick={props.add}>+1</button>
        <button onClick={props.close}>关闭</button>
      </div>
    </div>
  );
}

ReactDom.render(<App/>, document.getElementById('root'));
