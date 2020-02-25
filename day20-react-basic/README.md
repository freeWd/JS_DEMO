## React 的一些基本概念

> React 是一个用于构建用户界面的 JavaScript 库 核心专注于视图,目的实现组件化开发

### 搭建 React 开发环境

- 如果是在学习 React 或创建一个新的单页应用，请使用 Create React App。

```sh
npx create-react-app my-app
cd my-app
npm start
```

- 如果是在用 Node.js 构建服务端渲染的网站，试试 Next.js

---

### JSX

- 是一种 JS 和 HTML 混合的语法,将组件的结构、数据甚至样式都聚合在一起定义组件
- JSX 其实只是一种语法糖,最终会通过 babeljs 转译成 createElement 语法,以下代码等价

```js
ReactDOM.render(<h1>Hello</h1>, document.getElementById("root"));
```

#### JSX 表达式

- 可以任意地在 JSX 当中使用 JavaScript 表达式，在 JSX 当中的表达式要包含在大括号里

#### JSX 属性

- 需要注意的是 JSX 并不是 html,在 JSX 中属性不能包含关键字，像 class 需要写成 className,for 需要写成 htmlFor,并且属性名需要采用驼峰命名法

```js
ReactDOM.render(
  <h1 className="title" style={{ color: "red" }}>
    Hello
  </h1>,
  document.getElementById("root")
);
```

#### JSX 也是对象

- 可以在 if 或者 for 语句里使用 JSX
- 将它赋值给变量，当作参数传入，作为返回值都可以

```js
import React from "react";
import ReactDOM from "react-dom";

function greeting(name) {
  if (name) {
    return <h1>Hello, {name}!</h1>;
  }
  return <h1>Hello, Stranger.</h1>;
}

for (let i = 0; i < names.length; i++) {
  elements.push(<li>{names[i]}</li>);
}
ReactDOM.render(<ul>{elements}</ul>, document.getElementById("root"));
```

#### 更新元素渲染

- React DOM 首先会比较元素内容先后的不同，而在渲染过程中只会更新改变了的部分。
- 即便我们每秒都创建了一个描述整个 UI 树的新元素，React DOM 也只会更新渲染文本节点中发生变化的内容

---

### 组件 & Props

- 可以将 UI 切分成一些独立的、可复用的部件，这样你就只需专注于构建每一个单独的部件
- 组件从概念上类似于 JavaScript 函数。它接受任意的入参（即 “props”），并返回用于描述页面展示内容的 React 元素

#### 组件渲染

- React 元素不但可以是 DOM 标签，还可以是用户自定义的组件
- 当 React 元素为用户自定义组件时，它会将 JSX 所接收的属性（attributes）转换为单个对象传递给组件，这个对象被称之为 props
- 组件名称必须以大写字母开头
- 组件必须在使用的时候定义或引用它
- 组件的返回值只能有一个根元素

#### Props 的只读性

- 无论是使用函数或是类来声明一个组件，它决不能修改它自己的 props
- **纯函数**没有改变它自己的输入值，当传入的值相同时，总是会返回相同的结果
- 所有的 React 组件必须像纯函数那样使用它们的 props

---

### 状态 Status

- 组件的数据来源有两个地方，分别是属性对象和状态对象
- 属性是父组件传递过来的(默认属性，属性校验)
- 状态是自己内部的,改变状态唯一的方式就是 setState
- 属性和状态的变化都会影响视图更新

#### 不要直接修改 State

- 构造函数是唯一可以给 this.state 赋值的地方

#### State 的更新可能是异步的

- 出于性能考虑，React 可能会把多个 setState() 调用合并成一个调用
- 因为 this.props 和 this.state 可能会异步更新，所以你不要依赖他们的值来更新下一个状态
- 可以让 setState() 接收一个函数而不是一个对象。这个函数用上一个 state 作为第一个参数

#### State 的更新会被合并

- 当你调用 setState() 的时候，React 会把你提供的对象合并到当前的 state

#### 数据是向下流动的

- 不管是父组件或是子组件都无法知道某个组件是有状态的还是无状态的，并且它们也并不关心它是函数组件还是 class 组件
- 这就是为什么称 state 为局部的或是封装的的原因,除了拥有并设置了它的组件，其他组件都无法访问
- 任何的 state 总是所属于特定的组件，而且从该 state 派生的任何数据或 UI 只能影响树中“低于”它们的组件
- 如果你把一个以组件构成的树想象成一个 props 的数据瀑布的话，那么每一个组件的 state 就像是在任意一点上给瀑布增加额外的水源，但是它只能向下流动

---

### 事件处理

- React 事件的命名采用小驼峰式（camelCase），而不是纯小写。
- 使用 JSX 语法时你需要传入一个函数作为事件处理函数，而不是一个字符串
- 你不能通过返回 false 的方式阻止默认行为。你必须显式的使用 preventDefault

#### this

你必须谨慎对待 JSX 回调函数中的 this,可以使用:

- 公共属性(箭头函数)
- 匿名函数
- bind 进行绑定

#### 向事件处理程序传递参数

- 匿名函数
- bind

```js
class LoggingButton extends React.Component {
  handleClick1 = (id, event) => {
    console.log("id:", id);
  };
  render() {
    return (
      <>
        <button onClick={event => this.handleClick("1", event)}>
          Click me
        </button>
        <button onClick={this.handleClick.bind(this, "1")}>Click me</button>
      </>
    );
  }
}
```

#### Ref

- Refs 提供了一种方式，允许我们访问 DOM 节点或在 render 方法中创建的 React 元素
- 在 React 渲染生命周期时，表单元素上的 value 将会覆盖 DOM 节点中的值，在非受控组件中，你经常希望 React 能赋予组件一个初始值，但是不去控制后续的更新。 在这种情况下, 你可以指定一个 defaultValue 属性，而不是 value

> ref 的值是一个字符串

```js
class Sum extends React.Component {
  handleAdd = event => {
    let a = this.refs.a.value;
    let b = this.refs.b.value;
    this.refs.c.value = a + b;
  };

  render() {
    return (
      <div>
        <input ref="a" />+<input ref="b" />
        <button onClick={this.handleAdd}>=</button>
        <input ref="c" />
      </div>
    );
  }
}
```

> ref 的值是一个函数

```js
class Sum extends React.Component {
  handleAdd = event => {
    let a = this.a.value;
    let b = this.b.value;
    this.result.value = a + b;
  };
  render() {
    return (
      <div>
        <input ref={ref => (this.a = ref)} />+
        <input ref={ref => (this.b = ref)} />
        <button onClick={this.handleAdd}>=</button>
        <input ref={ref => (this.result = ref)} />
      </div>
    );
  }
}
```

> 为 DOM 元素添加 ref

- 可以使用 ref 去存储 DOM 节点的引用
- 当 ref 属性用于 HTML 元素时，构造函数中使用 React.createRef() 创建的 ref 接收底层 DOM 元素作为其 current 属性

```js
class Sum extends React.Component {
  constructor(props) {
    super(props);
    this.a = React.createRef();
    this.b = React.createRef();
    this.result = React.createRef();
  }
  handleAdd = () => {
    let a = this.a.current.value;
    let b = this.b.current.value;
    this.result.current.value = a + b;
  };
  render() {
    return (
      <div>
        <input ref={this.a} />+<input ref={this.b} />
        <button onClick={this.handleAdd}>=</button>
        <input ref={this.result} />
      </div>
    );
  }
}
```

> 为 class 组件添加 Ref

- 当 ref 属性用于自定义 class 组件时，ref 对象接收组件的挂载实例作为其 current 属性

```js
class Form extends React.Component {
  constructor(props) {
    super(props);
    this.input = React.createRef();
  }
  getFocus = () => {
    this.input.current.getFocus();
  };
  render() {
    return (
      <>
        <TextInput ref={this.input} />
        <button onClick={this.getFocus}>获得焦点</button>
      </>
    );
  }
}
class TextInput extends React.Component {
  constructor(props) {
    super(props);
    this.input = React.createRef();
  }
  getFocus = () => {
    this.input.current.focus();
  };
  render() {
    return <input ref={this.input} />;
  }
}
```

> Ref 转发

- 你不能在函数组件上使用 ref 属性，因为他们没有实例
- Ref 转发是一项将 ref 自动地通过组件传递到其一子组件的技巧
- Ref 转发允许某些组件接收 ref，并将其向下传递（换句话说，“转发”它）给子组件

```js
const FancyButton = React.forwardRef((props, ref) => (
  <button ref={ref} className="FancyButton" onClick={props.clickEvent}>
    {props.children}
  </button>
));

class RefTest extends React.Component {
  constructor(props) {
    super(props);
    this.btnRef = React.createRef();
  }
  handleTest = () => {
    console.log(this.btnRef);
  };
  render() {
    // 你可以直接获取 DOM button 的 ref：
    return (
      <div>
        <FancyButton ref={this.btnRef} clickEvent={this.handleTest}>
          Click me!
        </FancyButton>
      </div>
    );
  }
}
```
```js
// 自定义一个forwardRef
function forwardRef(fn) {
  return function(props) {
    return fn(props, props.ref);
  }
}
```

---
### 条件渲染
> 条件渲染
- 可以 if 或者条件运算符去创建元素来表现当前的状态，然后让 React 根据它们来更新 UI
- 你可以使用变量来储存元素。 它可以帮助你有条件地渲染组件的一部分
- 你可以使用逻辑与 (&&) 和三目运算符 来进行条件渲染

> 列表&Key
- 一个元素的 key 最好是这个元素在列表中拥有的一个独一无二的字符串
- key 只是在兄弟节点之间必须唯一

> 表单受控组件和非受控组件
- 表单组件分为受控组件和非受控组件
    - 使 React 的 state 成为唯一数据源。渲染表单的 React 组件还控制着用户输入过程中表单发生的操作。被 React 以这种方式控制取值的表单输入元素就叫做“受控组件”
    - 表单元素（如input、 textarea 和 select）之类的表单元素通常自己维护 state，并根据用户输入进行更新，这是非受控组件







