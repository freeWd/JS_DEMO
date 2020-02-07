// 表单受控组件和非受控组件
// 表单组件分为受控组件和非受控组件
// 使 React 的 state 成为唯一数据源。渲染表单的 React 组件还控制着用户输入过程中表单发生的操作。被 React 以这种方式控制取值的表单输入元素就叫做“受控组件”
// 表单元素（如input、 textarea 和 select）之类的表单元素通常自己维护 state，并根据用户输入进行更新，这是非受控组件

import React from "react";
import ReactDom from "react-dom";

// ----> 受控组件
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: "", content: "", hobby: "", gender: "male", adult: true };
  }

  handleChange = event => {
    const target = event.target;

    const type = target.type;
    const name = target.name;
    const value = type === 'checkbox' ? target.checked : target.value;
    this.setState({
      [name]: value
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    console.log(this.state);
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div>
          <label>
            名字：
            <input
              name="name"
              type="text"
              value={this.state.inputValue}
              onChange={this.handleChange}
            ></input>
          </label>
        </div>
        <div>
          <label>
            内容:
            <textarea
              name="content"
              value={this.state.textareaValue}
              onChange={this.handleChange}
            ></textarea>
          </label>
        </div>
        <div>
          <label>
            爱好:
            <select
              name="hobby"
              value={this.state.hobby}
              onChange={this.handleChange}
            >
              <option>游泳</option>
              <option>唱歌</option>
              <option>阅读</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            性别:
            <label>
              <input
                name="gender"
                type="radio"
                value="male"
                checked={this.state.gender === 'male'}
                onChange={this.handleChange}
              />
              男
            </label>
            <label>
              <input
                name="gender"
                type="radio"
                value="female"
                checked={this.state.gender === 'female'}
                onChange={this.handleChange}
              />
              女
            </label>
          </label>
        </div>
        <div>
          <label>
            <input
              name="adult"
              type="checkbox"
              checked={this.state.adult}
              onChange={this.handleChange}
            />
            是否成年
          </label>
        </div>
        <input type="submit" value="提交" />
      </form>
    );
  }
}

// ReactDom.render(<NameForm />, document.getElementById("root"));


// 非受控组件
class FileInput extends React.Component {
  constructor(props) {
    super(props);
    this.fileInput = React.createRef();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    console.log(this.fileInput.current.files[0]);
    if (this.fileInput.current.files[0]) {
      alert(`选择的文件 - ${this.fileInput.current.files[0].name}`);
    }
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>更新文件</label>
        <input type="file" ref={this.fileInput} />
        <br />
        <button type="submit">提交</button>
      </form>
    )
  }
}

ReactDom.render(<FileInput />, document.getElementById("root"));
