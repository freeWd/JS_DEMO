import increaseAction from "../actions";

function mapStateToProps(state) {
  console.log(state);
  return {
    value: state.count
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onIncreaseClick: () => dispatch(increaseAction)
  };
}

export default {
    mapStateToProps,
    mapDispatchToProps
}
