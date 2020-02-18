# React 高级

---

## 完整的生命周期

> 新版的 React 16.4 中完整的生命周期图

![image](/static/react-lifecycle.jpg)

其中：getDerivedStateFromProps, shouldComponentUpdate, getSnapshotBeforeUpdate 相对不常用。

- getDerivedStateFromProps
  - static getDerivedStateFromProps(props, state) 这个生命周期的功能实际上就是将传入的 props 映射到 state 上面
- shouldComponentUpdate
  - 当 props 或 state 发生变化时，shouldComponentUpdate() 会在渲染执行之前被调用。返回值默认为 true。首次渲染或使用 forceUpdate() 时不会调用该方法。
  - 返回一个布尔值。默认的返回值是 true，需要重新 render()。若如果返回值是 false 则不触发渲染
  - 如果此函数种返回了 false 就不会调用 render 方法了
  - 不要随便用 setState 可能会死循环
  - 此方法仅作为性能优化的方式而存在。不要企图依靠此方法来“阻止”渲染，因为这可能会产生 bug
- getSnapshotBeforeUpdate
  - getSnapshotBeforeUpdate() 被调用于 render 之后，可以读取但无法使用 DOM 的时候。它使您的组件可以在可能更改之前从 DOM 捕获一些信息（例如滚动位置）。此生命周期返回的任何值都将作为参数传递给 componentDidUpdate()
  - 此用法并不常见，但它可能出现在 UI 处理中，如需要以特殊方式处理滚动位置的聊天线程等。
- componentDidMount
- componentDidUpdate
- componentWillUnmount

**注意：新版的生命周期中 componentWillMount componentWillUpdate 这两个不安全被废除**

> 当组件实例被创建并插入 DOM 中时，其生命周期调用顺序如下:
> constructor() -> static getDerivedStateFromProps() -> render() -> componentDidMount()

> 当组件的 props 或 state 发生变化时会触发更新。组件更新的生命周期调用顺序如下:
> static getDerivedStateFromProps() -> shouldComponentUpdate() -> render() -> getSnapshotBeforeUpdate() -> componentDidUpdate()

## props 数据类型检查

- 要在组件的 props 上进行类型检查，你只需配置特定的 propTypes 属性
- 您可以通过配置特定的 defaultProps 属性来定义 props 的默认值：

```js
import PropTypes from "prop-types";

MyComponent.propTypes = {
  // 你可以将属性声明为 JS 原生类型，默认情况下
  // 这些属性都是可选的。
  optionalArray: PropTypes.array,
  optionalBool: PropTypes.bool,
  optionalFunc: PropTypes.func,
  optionalNumber: PropTypes.number,
  optionalObject: PropTypes.object,
  optionalString: PropTypes.string,
  optionalSymbol: PropTypes.symbol,

  // 任何可被渲染的元素（包括数字、字符串、元素或数组）
  // (或 Fragment) 也包含这些类型。
  optionalNode: PropTypes.node,

  // 一个 React 元素。
  optionalElement: PropTypes.element,

  // 你也可以声明 prop 为类的实例，这里使用
  // JS 的 instanceof 操作符。
  optionalMessage: PropTypes.instanceOf(Message),

  // 你可以让你的 prop 只能是特定的值，指定它为
  // 枚举类型。
  optionalEnum: PropTypes.oneOf(["News", "Photos"]),

  // 一个对象可以是几种类型中的任意一个类型
  optionalUnion: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Message)
  ]),

  // 可以指定一个数组由某一类型的元素组成
  optionalArrayOf: PropTypes.arrayOf(PropTypes.number),

  // 可以指定一个对象由某一类型的值组成
  optionalObjectOf: PropTypes.objectOf(PropTypes.number),

  // 可以指定一个对象由特定的类型值组成
  optionalObjectWithShape: PropTypes.shape({
    color: PropTypes.string,
    fontSize: PropTypes.number
  }),

  // 你可以在任何 PropTypes 属性后面加上 `isRequired` ，确保
  // 这个 prop 没有被提供时，会打印警告信息。
  requiredFunc: PropTypes.func.isRequired,

  // 任意类型的数据
  requiredAny: PropTypes.any.isRequired,

  // 你可以指定一个自定义验证器。它在验证失败时应返回一个 Error 对象。
  // 请不要使用 `console.warn` 或抛出异常，因为这在 `onOfType` 中不会起作用。
  customProp: function(props, propName, componentName) {
    if (!/matchme/.test(props[propName])) {
      return new Error(
        "Invalid prop `" +
          propName +
          "` supplied to" +
          " `" +
          componentName +
          "`. Validation failed."
      );
    }
  },

  // 你也可以提供一个自定义的 `arrayOf` 或 `objectOf` 验证器。
  // 它应该在验证失败时返回一个 Error 对象。
  // 验证器将验证数组或对象中的每个值。验证器的前两个参数
  // 第一个是数组或对象本身
  // 第二个是他们当前的键。
  customArrayProp: PropTypes.arrayOf(function(
    propValue,
    key,
    componentName,
    location,
    propFullName
  ) {
    if (!/matchme/.test(propValue[key])) {
      return new Error(
        "Invalid prop `" +
          propFullName +
          "` supplied to" +
          " `" +
          componentName +
          "`. Validation failed."
      );
    }
  })
};
```

---

## Immutable

> 可共享可变状态是万恶之源

```js
let objA = { name: "zfpx" };
let objB = objA;
objB.name = "9";
console.log(objA.name);
```

### 什么是 Immutable

- Immutable Data 就是一旦创建，就不能再被更改的数据。对 Immutable 对象的任何修改或添加删除操作都会返回一个新的 Immutable 对象
- Immutable 实现的原理是 Persistent Data Structure（持久化数据结构），也就是使用旧数据创建新数据时，要保证旧数据同时可用且不变 同时为了避免 deepCopy 把所有节点都复制一遍带来的性能损耗
- Immutable 使用了 Structural Sharing（结构共享），即如果对象树中一个节点发生变化，只修改这个节点和受它影响的父节点，其它节点则进行共享

### Immutable 基本使用

```js
// ==> map
let obj1 = immutable.Map({ name: "hello", age: 8, hobby: ["唱歌", "跳舞"] });
let obj2 = obj1.set("name", "hello2");
let obj3 = obj2.update("age", x => x + 1);
let obj4 = obj3.merge({ home: "北京" });
console.log(obj1, obj2, obj3, obj4, obj1.get("hobby") === obj2.get("hobby"));

let obj6 = immutable.fromJS({
  user: { name: "hello", age: 8 },
  newKey: "newValue"
});
let obj7 = obj6.setIn(["user", "name"], "hello2");
let obj8 = obj7.updateIn(["user", "age"], x => x + 1);
let obj9 = obj8.mergeIn(["user"], { home: "北京" });
console.log(obj6, obj7, obj8, obj9);
console.log(obj6.get("user"));
console.log(obj6.getIn(["user", "name"]));
console.log(...obj6.keys());
console.log(...obj6.values());
console.log(...obj6.entries());

let map1 = immutable.Map({ name: "hello", age: 8 });
let map2 = immutable.Map({ name: "hello", age: 8 });
console.log(map1 === map2); // false - 堆地址不一样
console.log(Object.is(map1, map2)); // false - 堆地址不一样
console.log(immutable.is(map1, map2)); // true - 只判断值是否相等

// ==> list
let arr1 = immutable.fromJS([1, 2, 3]);
let arr2 = arr1.push(4);
let arr3 = arr2.pop();
let arr4 = arr3.update(2, x => x + 10);
let arr5 = arr4.concat([5, 6]);
let arr6 = arr5.map(item => item * 2);
let arr7 = arr6.filter(item => item > 10);
let arrSum = arr7.reduce((pre, current) => pre + current, 0);
console.log(arr1, arr2, arr3, arr4, arr5, arr6, arr7, arrSum);
console.log(
  arr7.get(0),
  arr7.includes(10),
  arr7.last(),
  arr7.count(),
  arr7.size
);
```

### Immutable 的优势

- 降低复杂度

```js
let Immutable = require("immutable");
let obj1 = immutable.fromJS({ user: { name: "zfpx", age: 8 }, k: "v" });
let obj2 = obj1.setIn(["user", "name"], "zfpx2");
```

- 节省内存

```js
// 没有改变的值任然共用一个
let Immutable = require("immutable");
let p1 = Immutable.fromJS({
  name: "zfpx",
  home: { name: "beijing" }
});
let p2 = p1.set("name", "zfpx2");
console.log(p1.get("home") == p2.get("home"));
```

- 方便回溯
  只要把每次的状态都放在一个数组中就可以很方便的实现撤销重做功能

---

## Context

Context 提供了一个无需为每层组件手动添加 props，就能在组件树间进行数据传递的方法

- Context 设计目的是为了共享那些对于一个组件树而言是“全局”的数据，例如当前认证的用户、主题或首选语言。举个例子，在下面的代码中，我们通过一个 “theme” 属性手动调整一个按钮组件的样式：
- Context 主要应用场景在于很多不同层级的组件需要访问同样一些的数据。请谨慎使用，因为这会使得组件的复用性变差。
- 如果你只是想避免层层传递一些属性，组件组合（component composition）有时候是一个比 context 更好的解决方案。

---

## 高阶组件（HOC）

本质是函数，将组件作为接收参数，返回一个新的组件。HOC 本身不是 React API，是一种基于 React 组合的特而形成的设计模式。

- 组件是将 props 转换为 UI，而高阶组件是将组件转换为另一个组件
- 高阶组件就是一个函数，传给它一个组件，它返回一个新的组件
- 高阶组件的作用其实就是为了组件之间的代码复用

### 高阶组件的使用场景（使用 HOC 解决横切关注点问题）

- 一句话概括：功能的复用，减少代码冗余
- 进一步解释：在实际情况中，多个组件可能会做某些相同的事情，有着相同的功能，存在大量的代码冗余。我们可以将这部分功能拆分出来，每个组件尽量只保留自己独有的作用，通过 HOC 生成我们最终需要的组件。

### 高阶组件使用的注意事项

- 不要改变原始组件。使用组合。（将组件包装在容器中，而不对其进行修改。Good!）

- 不要在 render 方法中使用 HOC

  ```js
  render() {
  // 每次调用 render 函数都会创建一个新的 EnhancedComponent
  // EnhancedComponent1 !== EnhancedComponent2
  const EnhancedComponent = enhance(MyComponent);
  // 这将导致子树每次渲染都会进行卸载，和重新挂载的操作！
  return <EnhancedComponent />;
  }
  ```

- 务必复制静态方法

  - 有时在 React 组件上定义静态方法很有用，但是，当你将 HOC 应用于组件时，原始组件将使用容器组件进行包装。这意味着新组件没有原始组件的任何静态方法。

  ```js
  function enhance(WrappedComponent) {
    class Enhance extends React.Component {
      /*...*/
    }
    // 必须准确知道应该拷贝哪些方法 :(
    Enhance.staticMethod = WrappedComponent.staticMethod;
    return Enhance;
  }

  // 或者你可以使用 hoist-non-react-statics 自动拷贝所有非 React 静态方法
  import hoistNonReactStatic from "hoist-non-react-statics";
  function enhance(WrappedComponent) {
    class Enhance extends React.Component {
      /*...*/
    }
    hoistNonReactStatic(Enhance, WrappedComponent);
    return Enhance;
  }
  ```

- HOC 为组件添加特性。自身不应该大幅改变约定。

  - HOC 为组件添加特性。自身不应该大幅改变约定。HOC 返回的组件与原组件应保持类似的接口。

  ```js
  // HOC 应该透传与自身无关的 props。大多数 HOC 都应该包含一个类似于下面的 render 方法：
  render() {
  // 过滤掉非此 HOC 额外的 props，且不要进行透传
  const { extraProp, ...passThroughProps } = this.props;

  // 将 props 注入到被包装的组件中。
  // 通常为 state 的值或者实例方法。
  const injectedProp = someStateOrInstanceMethod;

  // 将 props 传递给被包装组件
  return (
    <WrappedComponent
      injectedProp={injectedProp}
      {...passThroughProps}
    />
  );
  }
  ```

- 包装显示名称以便轻松调试

  - HOC 创建的容器组件会与任何其他组件一样，会显示在 React Developer Tools 中。为了方便调试，请选择一个显示名称，以表明它是 HOC 的产物。

  ```js
  // 最常见的方式是用 HOC 包住被包装组件的显示名称。比如高阶组件名为 withSubscription，并且被包装组件的显示名称为CommentList，显示名称应该为 WithSubscription(CommentList)

  function withSubscription(WrappedComponent) {
    class WithSubscription extends React.Component {
      /* ... */
    }
    WithSubscription.displayName = `WithSubscription(${getDisplayName(
      WrappedComponent
    )})`;
    return WithSubscription;
  }

  function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || "Component";
  }
  ```

  - Refs 不会被传递

  虽然高阶组件的约定是将所有 props 传递给被包装组件，但这对于 refs 并不适用。那是因为 ref 实际上并不是一个 prop - 就像 key 一样，它是由 React 专门处理的。如果将 ref 添加到 HOC 的返回组件中，则 ref 引用指向容器组件，而不是被包装组件

---

## Render Props

术语 “render prop” 是指一种在 React 组件之间使用一个值为函数的 prop 共享代码的简单技术.

和高阶组件类似用来解决横切关注点问题

- 是一个用于告知组件要渲染什么内容的函数属性。该函数返回一个组件，是渲染出来的内容。
- 具有 render prop 的组件接受一个函数，该函数返回一个 React 元素并调用它而不是实现自己的渲染逻辑
- render prop 是一个用于告知组件需要渲染什么内容的函数 prop
- 任何的 props 影响到渲染的 props 都可以这样去实现，并不局限于 render

### render props 使用注意事项

- 将 Render Props 与 React.PureComponent 一起使用时要小心

如果你在 render 方法里创建函数，那么使用 render prop 会抵消使用 React.PureComponent 带来的优势。即 PureComponent 和 Component 一样了，每次 setState() 都会重新渲染

为什么？因为组件时通过 Props 的属性传入的，就算发生变化，浅拷贝对比是无法判断出来的。为了让 Props 传入的组件能被渲染上去，只好废了 PureComponent 的特性

---

## Portals 插槽

Portal 提供了一种将子节点渲染到存在于父组件以外的 DOM 节点的优秀的方案

### 用法

> ReactDOM.createPortal(child, container)
> 第一个参数（child）是任何可渲染的 React 子元素，例如一个元素，字符串或 fragment。第二个参数（container）是一个 DOM 元素。

```js
// 将子元素插入到 DOM 节点中的不同位置
render() {
  // React 并*没有*创建一个新的 div。它只是把子元素渲染到 `domNode` 中。
  // `domNode` 是一个可以在任何位置的有效 DOM 节点。
  return ReactDOM.createPortal(
    this.props.children,
    domNode
  );
}

```

---

## Fragments

React 中的一个常见模式是一个组件返回多个元素。Fragments 允许你将子列表分组，而无需向 DOM 添加额外节点

```js
class Columns extends React.Component {
  render() {
    return (
      <React.Fragment>
        <td>Hello</td>
        <td>World</td>
      </React.Fragment>
    );
  }
}

// 带 key 的 Fragments
// 使用显式 <React.Fragment> 语法声明的片段可能具有 key
// 一个使用场景是将一个集合映射到一个 Fragments 数组
function Glossary(props) {
  return (
    <dl>
      {props.items.map(item => (
        // 没有`key`，React 会发出一个关键警告
        <React.Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}
```


---

## 错误边界 Error Boundaries
部分 UI 的 JavaScript 错误不应该导致整个应用崩溃，为了解决这个问题，React 16 引入了一个新的概念 —— 错误边界

错误边界是一种 React 组件，这种组件可以捕获并打印发生在其子组件树任何位置的 JavaScript 错误，并且，它会渲染出备用 UI，而不是渲染那些崩溃了的子组件树。错误边界在渲染期间、生命周期方法和整个组件树的构造函数中捕获错误。

错误边界无法捕获以下场景中产生的错误
- 事件处理
- 异步代码
- 服务端渲染
- 它自身抛出来的错误

> 如果一个 class 组件中定义了 static getDerivedStateFromError() 或 componentDidCatch() 这两个生命周期方法中的任意一个（或两个）时，那么它就变成一个错误边界。当抛出错误后，请使用 static getDerivedStateFromError() 渲染备用 UI ，使用 componentDidCatch() 打印错误信息


---

## Hook
