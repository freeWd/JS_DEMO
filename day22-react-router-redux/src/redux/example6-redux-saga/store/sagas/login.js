import { take, call, put } from "redux-saga/effects";
import { push } from 'connected-react-router';

import * as types from "../action-types";
import loginApi from "../../api/login";

function* login(username, password) {
  try {
    const token = yield call(loginApi.login, username, password);
    loginApi.saveToken(token);
    yield put({ type: types.LOGIN_SUCCESS, username });
    // 跳转到登录页
    console.log(token, '<-----');
    yield put(push('/home'));
    return token;
  } catch (error) {
    yield put({ type: types.LOGIN_ERROR, err: error });
  }
}

function* logout() {
  yield call(loginApi.logout);
  loginApi.clearToken();
  yield put(push('/login'));
  yield put({
    type: types.LOGOUT_SUCCESS
  });
}

export default function* loginFlow() {
  while (true) {
    const action = yield take(types.LOGIN_REQUEST);
    const token = yield call(login, action.username, action.password);
    if (token) {
      yield take(types.LOGOUT_REQUEST);
      yield call(logout);
    }
  }
}
