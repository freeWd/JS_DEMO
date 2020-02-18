export default function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === "function") {
    return function() {
      dispatch(actionCreators.apply(this, arguments));
    };
  }

  let newAction = {};
  for (const key in actionCreators) {
    if (actionCreators.hasOwnProperty(key)) {
      const actionCreator = actionCreators[key];
      if (typeof actionCreator === "function") {
        newAction[key] = function() {
          dispatch(actionCreator.apply(this, arguments));
        };
      }
    }
  }
  return newAction;
}
