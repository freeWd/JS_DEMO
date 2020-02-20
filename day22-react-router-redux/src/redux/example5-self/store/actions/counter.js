import * as types from "../action-types";

export default {
  increment() {
    return { type: types.INCREMENT };
  },
  incrementPromise() {
    return new Promise((resolve, reject) => {
      let result = Math.random();
      if (result > 0.5) {
        resolve({
          type: types.PROMISE_INCREMENT,
          value: 100
        });
      } else {
        reject({
          type: types.PROMISE_INCREMENT,
          value: -100
        });
      }
    });
  }
};
