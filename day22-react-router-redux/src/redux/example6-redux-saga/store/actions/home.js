import * as types from "../action-types";

export default {
  increment() {
    return { type: types.INCREMENT };
  },
  incrementAsync() {
    return { type: types.INCREMENT_ASYNC };
  }
};
