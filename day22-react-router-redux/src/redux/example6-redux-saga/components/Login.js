import React, { Component } from "react";
import { connect } from "react-redux";
import loginAction from '../store/actions/login';

class Login extends Component {
  constructor(props) {
    super(props);
    this.username = React.createRef();
    this.password = React.createRef();
  }

  login = e => {
    e.preventDefault();
    let userName = this.username.current.value;
    let password = this.password.current.value;
    this.props.login(userName, password);
  };

  render() {
    return (
      <div>
        { this.props.error }
        <form onSubmit={this.login}>
          <input type="text" ref={this.username} />
          <input type="passwoord" ref={this.password} />
          <button type="submit">登录</button>
        </form>
      </div>
    );
  }
}


function mapStateToProps(state) {
  return state.login;
}

export default connect(mapStateToProps, loginAction)(Login);
