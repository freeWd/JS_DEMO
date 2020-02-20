import React, {Component} from 'react';
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import store from '../store';
import counterAction from "../store/actions";

const newAction = bindActionCreators(counterAction, store.dispatch);

class Counter extends Component {
    render() {
        const { value, onIncreaseClick } = this.props;
        return (
            <div>
                <h3>{value}</h3>
                <button onClick={onIncreaseClick}>+</button>
            </div>
        )
    }
}

Counter.propTypes = {
    value: PropTypes.number.isRequired,
    onIncreaseClick: PropTypes.func.isRequired
}


// 把仓库中的状态映射为当前组件的属性对象
// 负责输入，就是把仓库中的状态输入到组件
function mapStateToProps(state) {
  return {
    value: state.count
  };
}

// 把store的dispatch方法转化为一个当前组件的属性对象
// 输出：把用户在组件中的操作发射出去
// 第一种写法
function mapDispatchToProps(dispatch) {
//   return {
//     onIncreaseClick: () => dispatch(counterAction.onIncreaseClick())
//   };
    return newAction;
}

// 第二种写法
// let mapDispatchToProps = counterAction;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Counter);
