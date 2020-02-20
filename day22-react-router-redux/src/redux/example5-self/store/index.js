import { createStore, Middleware, MiddlewareAPI } from "redux"; // applyMiddleware
import counterReducer from "./reducers/couter";

// 中间件的自定义 - 我们改写了dispatch方法,实现了在更改状态时打印前后的状态
// 自定义日志中间件 - 但是这种方案并不好。所以我们可以采用中间的方式
// ========================================================>
// let dispatch = store.dispatch;
// store.dispatch = function(action) {
//     console.log('修改前的store值：', store.getState());
//     dispatch(action);
//     console.log('修改后的store值：', store.getState());
//     return action;
// }
//
// const store = createStore(counterReducer);
// ========================================================

// 日志中间件 - 更好的方案
// ========================================================
let logger = function({ dispatch, getState }) {
  // 这个dispatch不是原生的store.dispatch
  return function(next) {
    // next 相当于上面的原生的store.dispatch
    return function(action) {
      // 相当于上面的对store.dispatch的重写
      console.log("老版本", getState());
      next(action); //派发动作
      console.log("新状态", getState());
      return action;
    };
  };
};

let promiseMiddleware = function({ dispatch, getState }) {
  return function(next) {
    return function(action) {
      // 表示ction返回的是一个promise对象
      if (action && action.then) {
        action
          .then(result => {
            dispatch(result);
          })
          .catch(errValue => {
            dispatch(Object.assign({}, errValue, { error: true }));
          });
      } else {
        next(action);
      }
    };
  };
};

// 下面是优化后的写法，最初的写法是这样的：【applyMiddleware(logger)(createStore)(counterReducer);】
// const store = createStore(counterReducer, applyMiddleware(logger));
// <========================================================

// ========================================================
// 为什么要像上面那样去写中间件了（高阶函数，多次返回值都是函数，且传参确定为{dispatch, getState}, next, action）
// 因为redux的 applyMiddleWare写好了，需要传入的参数就得符合 applyMiddleWare能接受的参数的格式来书写

// 下面看看如果自己模仿写applyMiddleware是什么样子的：
// 覆盖redux中的applyMiddleware
function applyMiddleware(...middlewares) {
  // middlewares是应用的中间件
  return function(createStore) {
    return function(reducers) {
      let store = createStore(reducers);
      let newDispatch;
      let middleWareApi = {
        getState: store.getState,
        // 小技巧，最初传入中间件的dispatch不是原生的store.dispatch
        dispatch: action => newDispatch(action)
      };
      let realMiddleLogicFnArr = middlewares.map(middlewareItem =>
        middlewareItem(middleWareApi)
      );
      // 给最初传参进来的dispatch赋值
      newDispatch = compose(...realMiddleLogicFnArr)(store.dispatch);
      return {
        ...store,
        dispatch: newDispatch // 返回的store中带上了新的dispatch逻辑代码
      };
    };
  };
}
function compose(...fnArr) {
  return function() {
    if (fnArr.length === 1) {
      return fnArr[0].call(this, ...arguments);
    }
    return fnArr.reduce((preFn, nextFn) => {
      return preFn(nextFn.call(this, ...arguments));
    });
  };
}
const store = applyMiddleware(promiseMiddleware, logger)(createStore)(
  counterReducer
);
// ========================================================

export default store;
