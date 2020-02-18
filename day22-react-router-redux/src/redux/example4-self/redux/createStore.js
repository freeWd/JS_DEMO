/**
 * store: {
 *     getState() {
 *          return object
 *     },
 *     dispatch(actions) {
 *
 *     }
 *     subscribe(callBackFn) {
 *
 *     }
 * }
 *
 */

export default function createStore(reducerFn) {
  let state;
  let callBackFnArr = [];

  function getState() {
    return state;
  }

  function dispatch(action) {
    state = reducerFn(state, action);
    callBackFnArr.forEach(callBackItem => callBackItem());
  }

  function subscribe(callBackFn) {
    callBackFnArr.push(callBackFn);
    return function() {
      callBackFnArr = callBackFnArr.filter(item => item !== callBackFn);
    };
  }

  dispatch({ type: null });
  return {
    getState,
    dispatch,
    subscribe
  };
}
