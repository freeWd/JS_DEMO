import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import homeAction from "../store/actions/home";
import loginAction from "../store/actions/login";

class Home extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h1>{this.props.number}</h1>
        <button onClick={this.props.increment}>add</button>
        <button onClick={this.props.incrementAsync}>async add</button>
        <hr />
        <h3>当前登录用户：{this.props.username}</h3>
        <button onClick={this.props.logout}>退出登录</button>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    number: state.home.number,
    username: state.login.username
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(homeAction, dispatch),
    logout: () => dispatch(loginAction.logout())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
