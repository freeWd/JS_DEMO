import React, { Component } from "react";
import { Redirect } from "react-router-dom";

import LoginApi from "../api/login";

export default class FrontendAuth extends Component {
  render() {
    const { location } = this.props;
    const { pathname } = location;
    const isLogin = LoginApi.getToken();
    if (isLogin) {
      // 如果是登陆状态，想要跳转到登陆，重定向到主页
      if (pathname === "/login") {
        return <Redirect to="/home" />;
      } else {
        return this.props.children;
      }
    } else {
      return <Redirect to="/login" />;
    }
  }
}
