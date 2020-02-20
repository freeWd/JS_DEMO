import * as types from "../action-types";

let nextToDoId = 0;

export default {
  add(text) {
    return { type: types.ADD_TODO, id: nextToDoId++, text };
  },
  delete(id) {
    return { type: types.DEL_TODO, id };
  },
  toggle(id) {
    return { type: types.TOGGLE_TODO, id };
  }
};
