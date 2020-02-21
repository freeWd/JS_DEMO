# Redux

## 设计思想

- Web 应用是一个状态机，视图与状态是一一对应的。
- 所有的状态，保存在一个对象里面。

## 基本概念和 API

- Store (Store 就是保存数据的地方，你可以把它看成一个容器。整个应用只能有一个 Store。)

```js
// Redux 提供createStore这个函数，用来生成 Store。
// createStore函数接受另一个函数作为参数，返回新生成的 Store 对象
import { createStore } from "redux";
const store = createStore(fn);
```

- State (对象包含所有数据。如果想得到某个时点的数据，就要对 Store 生成快照。这种时点的数据集合，就叫做 State。当前时刻的 State，可以通过 store.getState()拿到)

```js
// Redux 规定， 一个 State 对应一个 View。只要 State 相同，View 就相同。你知道 State，就知道 View 是什么样，反之亦然。
import { createStore } from "redux";
const store = createStore(fn);
const state = store.getState();
```

- Action (State 的变化，会导致 View 的变化。但是，用户接触不到 State，只能接触到 View。所以，State 的变化必须是 View 导致的。Action 就是 View 发出的通知，表示 State 应该要发生变化了。)

```js
// Action 是一个对象。其中的type属性是必须的，表示 Action 的名称。其他属性可以自由设置.
// 下面代码中，Action 的名称是ADD_TODO，它携带的信息是字符串Learn Redux
const action = {
  type: "ADD_TODO",
  payload: "Learn Redux"
};
```

- Action Creator （View 要发送多少种消息，就会有多少种 Action。如果都次重复调用相同的 Action，都手写的话，会很麻烦。可以定义一个函数来生成 Action，这个函数就叫 Action Creator。）

```js
// 代码中，addTodo函数就是一个 Action Creator
const ADD_TODO = "添加 TODO";

function addTodo(text) {
  return {
    type: ADD_TODO,
    text
  };
}

const action = addTodo("Learn Redux");
```

- store.dispatch() (是 View 发出 Action 的唯一方法)

```js
// 代码中，store.dispatch接受一个 Action 对象作为参数，将它发送出去
import { createStore } from "redux";
const store = createStore(fn);

store.dispatch({
  type: "ADD_TODO",
  payload: "Learn Redux"
});

// 如果结合 Action Creator， 这段代码可以改写如下
store.dispatch(addTodo("Learn Redux"));
```

- Reducer
  Store 收到 Action 以后，必须给出一个新的 State，这样 View 才会发生变化。这种 State 的计算过程就叫做 Reducer。
  Reducer 是一个函数，它接受 Action 和当前 State 作为参数，返回一个新的 State。

```js
const reducer = function(state, action) {
  // ...
  return new_state;
};
```

整个应用的初始状态，可以作为 State 的默认值。下面是一个实际的例子。

```js
const defaultState = 0;
const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case "ADD":
      return state + action.payload;
    default:
      return state;
  }
};

const state = reducer(1, {
  type: "ADD",
  payload: 2
});
// 代码中，reducer函数收到名为ADD的 Action 以后，就返回一个新的 State，作为加法的计算结果。其他运算的逻辑（比如减法），也可以根据 Action 的不同来实现。
```

实际应用中，Reducer 函数不用像上面这样手动调用，store.dispatch 方法会触发 Reducer 的自动执行。为此，Store 需要知道 Reducer 函数，做法就是在生成 Store 的时候，将 Reducer 传入 createStore 方法。

```js
import { createStore } from "redux";
const store = createStore(reducer);
// 代码中，createStore接受 Reducer 作为参数，生成一个新的 Store。以后每当store.dispatch发送过来一个新的 Action，就会自动调用 Reducer，得到新的 State
```

由于 Reducer 是纯函数，就可以保证同样的 State，必定得到同样的 View。但也正因为这一点，Reducer 函数里面不能改变 State，必须返回一个全新的对象，请参考下面的写法。

```js
// State 是一个对象
function reducer(state, action) {
  return Object.assign({}, state, { thingToChange });
  // 或者
  return { ...state, ...newState };
}

// State 是一个数组
function reducer(state, action) {
  return [...state, newItem];
}
```

最好把 State 对象设成只读。你没法改变它，要得到新的 State，唯一办法就是生成一个新对象。这样的好处是，任何时候，与某个 View 对应的 State 总是一个不变的对象。

- store.subscribe()
  Store 允许使用 store.subscribe 方法设置监听函数，一旦 State 发生变化，就自动执行这个函数。

```js
import { createStore } from "redux";
const store = createStore(reducer);

store.subscribe(listener);
```

显然，只要把 View 的更新函数（对于 React 项目，就是组件的 render 方法或 setState 方法）放入 listen，就会实现 View 的自动渲染。

```js
// store.subscribe方法返回一个函数，调用这个函数就可以解除监听。
let unsubscribe = store.subscribe(() => console.log(store.getState()));
unsubscribe();
```

## 工作流程

![img](/static/redux.jpg)

- 首先，用户发出 Action。

```js
store.dispatch(action);
```

- 然后，Store 自动调用 Reducer，并且传入两个参数：当前 State 和收到的 Action。 Reducer 会返回新的 State。

```js
let nextState = todoApp(previousState, action);
```

- State 一旦有变化，Store 就会调用监听函数。

```js
// 设置监听函数
store.subscribe(listener);
```

- listener 可以通过 store.getState()得到当前状态。如果使用的是 React，这时可以触发重新渲染 View。

```js
function listerner() {
  let newState = store.getState();
  component.setState(newState);
}
```

# React-Redux

> Redux 的作者封装了一个 React 专用的库 React-Redux
> 这个库是可以选用的。实际项目中，你应该权衡一下，是直接使用 Redux，还是使用 React-Redux。后者虽然提供了便利，但是需要掌握额外的 API，并且要遵守它的组件拆分规范。

React-Redux 将所有组件分成两大类：UI 组件（presentational component）和容器组件（container component）。

## UI 组件

UI 组件有以下几个特征。

- 只负责 UI 的呈现，不带有任何业务逻辑
- 没有状态（即不使用 this.state 这个变量）
- 所有数据都由参数（this.props）提供
- 不使用任何 Redux 的 API

```js
// 下面就是一个 UI 组件的例子。 因为不含有状态，UI 组件又称为"纯组件"，即它纯函数一样，纯粹由参数决定它的值
const Title = value => <h1>{value}</h1>;
```

## 容器组件

容器组件的特征恰恰相反

- 负责管理数据和业务逻辑，不负责 UI 的呈现
- 带有内部状态
- 使用 Redux 的 API

总之，只要记住一句话就可以了：UI 组件负责 UI 的呈现，容器组件负责管理数据和逻辑。

你可能会问，如果一个组件既有 UI 又有业务逻辑，那怎么办？回答是，将它拆分成下面的结构：外面是一个容器组件，里面包了一个 UI 组件。前者负责与外部的通信，将数据传给后者，由后者渲染出视图。

React-Redux 规定，所有的 UI 组件都由用户提供，容器组件则是由 React-Redux 自动生成。也就是说，用户负责视觉层，状态管理则是全部交给它。

## connect()

React-Redux 提供 connect 方法，用于从 UI 组件生成容器组件。connect 的意思，就是将这两种组件连起来。

```js
// 代码中，TodoList是 UI 组件，VisibleTodoList就是由 React-Redux 通过connect方法自动生成的容器组件。
import { connect } from "react-redux";
const VisibleTodoList = connect()(TodoList);
```

但是，因为没有定义业务逻辑，上面这个容器组件毫无意义，只是 UI 组件的一个单纯的包装层。为了定义业务逻辑，需要给出下面两方面的信息。

1. 输入逻辑：外部的数据（即 state 对象）如何转换为 UI 组件的参数
2. 输出逻辑：用户发出的动作如何变为 Action 对象，从 UI 组件传出去。

因此，connect 方法的完整 API 如下。

```js
import { connect } from "react-redux";

const VisibleTodoList = connect(mapStateToProps, mapDispatchToProps)(TodoList);
```

代码中，`connect`方法接受两个参数：`mapStateToProps`和`mapDispatchToProps`。它们定义了 UI 组件的业务逻辑。前者负责输入逻辑，即将`state`映射到 UI 组件的参数（`props`），后者负责输出逻辑，即将用户对 UI 组件的操作映射成 Action。

## mapStateToProps()

`mapStateToProps`是一个函数。它的作用就是像它的名字那样，建立一个从（外部的）state 对象到（UI 组件的）props 对象的映射关系.

`mapStateToProps`会订阅 Store，每当`state`更新的时候，就会自动执行，重新计算 UI 组件的参数，从而触发 UI 组件的重新渲染。

`mapStateToProps`的第一个参数总是`state`对象，还可以使用第二个参数，代表容器组件的 props 对象

使用`ownProps`作为参数后，如果容器组件的参数发生变化，也会引发 UI 组件重新渲染

```js
// 代码中，mapStateToProps是一个函数，它接受state作为参数，返回一个对象。这个对象有一个todos属性，代表 UI 组件的同名参数，后面的getVisibleTodos也是一个函数，可以从state算出 todos 的值
const mapStateToProps = state => {
  return {
    todos: getVisibleTodos(state.todos, state.visibilityFilter)
  };
};

const mapStateToProps = (state, ownProps) => {
  return {
    active: ownProps.filter === state.visibilityFilter
  };
};
```

## mapDispatchToProps()

`mapDispatchToProps`是 connect 函数的第二个参数，用来建立 UI 组件的参数到`store.dispatch`方法的映射。也就是说，它定义了哪些用户的操作应该当作 Action，传给 Store。它可以是一个函数，也可以是一个对象。

```js
// 如果mapDispatchToProps是一个函数，会得到dispatch和ownProps（容器组件的props对象）两个参数。
const mapDispatchToProps = (
  dispatch,
  ownProps
) => {
  return {
    onClick: () => {
      dispatch({
        type: 'SET_VISIBILITY_FILTER',
        filter: ownProps.filter
      });
    }
  };
}

// 如果mapDispatchToProps是一个对象，它的每个键名也是对应 UI 组件的同名参数，键值应该是一个函数，会被当作 Action creator ，返回的 Action 会由 Redux 自动发出
const mapDispatchToProps = {
  onClick: (filter) => {
    type: 'SET_VISIBILITY_FILTER',
    filter: filter
  };
}
```

## <Provider> 组件

`connect`方法生成容器组件以后，需要让容器组件拿到 state 对象，才能生成 UI 组件的参数。

一种解决方法是将 state 对象作为参数，传入容器组件。但是，这样做比较麻烦，尤其是容器组件可能在很深的层级，一级级将 state 传下去就很麻烦。

React-Redux 提供 Provider 组件，可以让容器组件拿到 state。

```js
// Provider在根组件外面包了一层，这样一来，App的所有子组件就默认都可以拿到state了。
// 它的原理是React组件的context属性
import { Provider } from "react-redux";
import { createStore } from "redux";
import todoApp from "./reducers";
import App from "./components/App";

let store = createStore(todoApp);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
```


# Redux 中间件

> Redux 的基本做法：用户发出 Action，Reducer 函数算出新的 State，View 重新渲染

![img](/static/reduxmiddleware.jpg)

但有个问题：异步操作怎么办？Action 发出以后，Reducer 立即算出 State，这叫做同步；Action 发出以后，过一段时间再执行 Reducer，这就是异步。

怎么才能 Reducer 在异步操作结束后自动执行呢？这就要用到新的工具：中间件（middleware）

## 中间件的概念

中间件就是一个函数，对 store.dispatch 方法进行了改造，在发出 Action 和执行 Reducer 这两步之间，添加了其他功能。

举例来说，要添加日志功能，把 Action 和 State 打印出来，可以对 store.dispatch 进行如下改造。

```js
// 代码中，对store.dispatch进行了重定义，在发送 Action 前后添加了打印功能。这就是中间件的雏形
let next = store.dispatch;
store.dispatch = function dispatchAndLog(action) {
  console.log("dispatching", action);
  next(action);
  console.log("next state", store.getState());
};
```

## 中间件的用法
```js
// 代码中，redux-logger提供一个生成器createLogger，可以生成日志中间件logger。然后，将它放在applyMiddleware方法之中，传入createStore方法，就完成了store.dispatch()的功能增强
import { applyMiddleware, createStore } from 'redux';
import createLogger from 'redux-logger';
const logger = createLogger();

const store = createStore(
  reducer,
  applyMiddleware(logger)
);
```

这里有两点需要注意：
- `createStore`方法可以接受整个应用的初始状态作为参数，那样的话，`applyMiddleware`就是第三个参数了。
```js
const store = createStore(
  reducer,
  initial_state,
  applyMiddleware(logger)
);
```

- 中间件的次序有讲究。
```js
const store = createStore(
  reducer,
  applyMiddleware(thunk, promise, logger)
);
```
代码中，`applyMiddleware`方法的三个参数，就是三个中间件。有的中间件有次序要求，使用前要查一下文档。比如，logger就一定要放在最后，否则输出结果会不正确。


## applyMiddlewares() ?
`applyMiddlewares`这个方法到底是干什么的
它是 Redux 的原生方法，作用是将所有中间件组成一个数组，依次执行。

## 异步操作的基本思路
同步操作只要发出一种 Action 即可，异步操作的差别是它要发出三种 Action。
- 操作发起时的 Action
- 操作成功时的 Action
- 操作失败时的 Action

以向服务器取出数据为例，三种 Action 可以有两种不同的写法。
```js
// 写法一：名称相同，参数不同
{ type: 'FETCH_POSTS' }
{ type: 'FETCH_POSTS', status: 'error', error: 'Oops' }
{ type: 'FETCH_POSTS', status: 'success', response: { ... } }

// 写法二：名称不同
{ type: 'FETCH_POSTS_REQUEST' }
{ type: 'FETCH_POSTS_FAILURE', error: 'Oops' }
{ type: 'FETCH_POSTS_SUCCESS', response: { ... } }
```

除了 Action 种类不同，异步操作的 State 也要进行改造，反映不同的操作状态。下面是 State 的一个例子

```js
// 代码中，State 的属性isFetching表示是否在抓取数据。didInvalidate表示数据是否过时，lastUpdated表示上一次更新时间
let state = {
  // ... 
  isFetching: true,
  didInvalidate: true,
  lastUpdated: 'xxxxxxx'
};
```

现在，整个异步操作的思路就很清楚了。
- 操作开始时，送出一个 Action，触发 State 更新为"正在操作"状态，View 重新渲染
- 操作结束后，再送出一个 Action，触发 State 更新为"操作结束"状态，View 再一次重新渲染

- 最后了解两个库的使用：`redux-promise` 和 `redux-thunk`


## redux-saga
redux-saga 也是一个 redux 的中间件，而中间件的作用是为 redux 提供额外的功能。

这个中间件比较重要也相对复杂点，所以抽出来单独写。

- 在 reducers 中的所有操作都是同步的并且是纯粹的，即 reducer 都是纯函数，纯函数是指一个函数的返回结果只依赖于它的参数，并且在执行过程中不会对外部产生副作用，即给它传什么，就吐出什么。

- 但是在实际的应用开发中，我们希望做一些异步的（如Ajax请求）且不纯粹的操作（如改变外部的状态），这些在函数式编程范式中被称为“副作用”。

> redux-saga 就是用来处理上述副作用（异步任务）的一个中间件。它是一个接收事件，并可能触发新事件的过程管理者，为你的应用管理复杂的流程。

### redux-saga工作原理
- sages 采用 Generator 函数来 yield Effects（包含指令的文本对象）
- Generator 函数的作用是可以暂停执行，再次执行的时候从上次暂停的地方继续执行
- Effect 是一个简单的对象，该对象包含了一些给 middleware 解释执行的信息。
- 你可以通过使用 effects API 如 fork，call，take，put，cancel 等来创建 Effect。

### redux-saga分类
- worker saga 做实际的工作，如调用API，进行异步请求，获取异步封装结果
- watcher saga 监听被dispatch的actions,当接受到action或者知道其被触发时，调用worker执行任务
- root saga 立即启动saga的唯一入口
