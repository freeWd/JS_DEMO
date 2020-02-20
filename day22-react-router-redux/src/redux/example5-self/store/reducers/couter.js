import * as types from "../action-types";

export default function counter(state = { number: 0 }, action) {
  console.log(state, action);
  switch (action.type) {
    case types.INCREMENT:
      return { number: state.number + 1 };
    case types.PROMISE_INCREMENT:
      return { number: state.number + action.value }
    default:
      return { ...state };
  }
}
