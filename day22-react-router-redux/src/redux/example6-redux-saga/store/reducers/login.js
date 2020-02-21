import * as types from "../action-types";

export default function(state = { username: null, error: null }, action) {
  switch (action.type) {
    case types.LOGIN_ERROR:
      return { username:null, error: action.err };
    case types.LOGIN_SUCCESS:
      return { username: action.username, error: null };
    default:
      return { ...state };
  }
}
