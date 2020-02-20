import * as types from "../action-types";
import { createAction, createActions } from "redux-actions";

// redux-actions 工具写法
export default {
  increment: createAction(types.INCREMENT, () => {
    return;
  }),
  incrementPromise: createAction(types.PROMISE_INCREMENT, async () => {
    const result = await new Promise((resolve, reject) => {
      setTimeout(() => {
        let result = Math.random();
        if (result > 0.5) {
          resolve(100);
        } else {
          reject(-100);
        }
      }, 1000);
    })
    return result;
  })
};

// ----> 普通actions写法
// export default {
//   increment() {
//     return { type: types.INCREMENT };
//   },
//   incrementAsync() {
//     return function(dispatch) {
//       setTimeout(() => {
//         dispatch({ type: types.ASYNC_INCREMENT, value: 1 });
//       }, 1000);
//     };
//   },
//   incrementAsync2() {
//     return function(dispatch) {
//       return new Promise((resolve, reject) => {
//         let result = Math.random();
//         if (result > 0.5) {
//           resolve(result);
//         } else {
//           reject(result);
//         }
//       }).then(
//         value => {
//           dispatch({ type: types.ASYNC_INCREMENT, value: 1 });
//           return value;
//         },
//         error => {
//           dispatch({ type: types.ASYNC_INCREMENT, value: -1 });
//           throw error;
//         }
//       );
//     };
//   },
//   incrementPromise() {
//     return {
//       type: types.PROMISE_INCREMENT,
//       payload: new Promise((resolve, reject) => {
//         setTimeout(() => {
//           let result = Math.random();
//           if (result > 0.5) {
//             resolve(100);
//           } else {
//             reject(-100);
//           }
//         }, 1000);
//       })
//     };
//   }
// };