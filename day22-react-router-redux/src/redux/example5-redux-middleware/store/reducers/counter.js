import { handleAction, handleActions } from "redux-actions";
import * as types from "../action-types";
import actions from "../actions/counter";


// ----> redux-action写法
export default handleActions(
  {
    [types.INCREMENT]: (state, action) => {
      return { number: state.number + 1 };
    },
    [types.ASYNC_INCREMENT]: (state, action) => {
      console.log(state, action);
      return { number: state.number + action.value };
    },
    [types.PROMISE_INCREMENT]: (state, action) => {
      console.log(action);
      if (!action.error) {
        return { number: state.number + action.payload };
      }
    }
  },
  { number: 0 }
);

// ----> 正常reducer写法
// export default function counter(state = { number: 0 }, action) {
//   switch (action.type) {
//     case types.INCREMENT:
//       return { number: state.number+1 };
//     case types.ASYNC_INCREMENT:
//       console.log(action);
//       return { number: state.number+action.value }
//     case types.PROMISE_INCREMENT:
//       console.log(action); //  { type: "PROMISE_INCREMENT", payload: -100, error: true }
//       if (!action.error) {
//         return { number: state.number + action.payload }
//       }
//     default:
//       return { ...state };
//   }
// }
