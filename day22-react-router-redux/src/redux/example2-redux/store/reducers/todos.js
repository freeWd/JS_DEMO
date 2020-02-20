import * as types from "../action-types";

export default function(state = [], action) {
  switch (action.type) {
    case types.ADD_TODO:
      return [...state, { id: action.id, text: action.text, completed: false }];
    case types.DEL_TODO:
      return state.filter(item => item.id !== action.id);
    case types.TOGGLE_TODO:
      return state.map(item => {
        if (item.id === action.id) {
          item.completed = !item.completed;
        }
        return item;
      });
    default:
      return [...state];
  }
}
