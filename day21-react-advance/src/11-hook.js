import React, { Component, useState, useEffect } from "react";
import ReactDom from "react-dom";

// 这个例子用来显示一个计数器。当你点击按钮，计数器的值就会增加：
function Example1() {
  // 声明一个叫count的state变量
  // useState 就是一个 Hook
  // 通过在函数组件里调用它来给组件添加一些内部 state。React 会在重复渲染时保留这个 state。
  // useState 会返回一对值：【当前状态】 和 【一个让你更新它的函数】(但是它不会把新的 state 和旧的 state 进行合并)
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>-</button>
    </div>
  );
}

// ===> 声明多个 state 变量
function Example2() {
  const [age, setAge] = useState(12);
  const [fruit, setFruit] = useState("banana");
  const [todos, setTodos] = useState([{ text: "Learn Hooks" }]);

  return (
    <div>
      <p>年龄：{age}</p>
      <p>水果：{fruit}</p>
      <ul>
        {todos.map((todoItem, index) => (
          <li key={index}>{todoItem.text}</li>
        ))}
      </ul>
    </div>
  );
}

// ====> Effect Hook
// 数据获取，设置订阅以及手动更改 React 组件中的 DOM 都属于副作用
function Example3() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
}

ReactDom.render(<Example3 />, document.getElementById("root"));
