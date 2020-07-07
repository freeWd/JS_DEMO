> 俺老孙这一生，不修来世！ - 爱潜水的乌贼 《一世之尊》

<!-- @import "[TOC]" {cmd="toc" depthFrom=1 depthTo=6 orderedList=false} -->

<!-- code_chunk_output -->

- [高阶函数](#高阶函数)
- [AOP 面向切面编程](#aop-面向切面编程)
- [原生 ajax 和 fetch](#原生-ajax-和-fetch)
  - [ajax](#ajax)
  - [fetch](#fetch)
- [Web Worker](#web-worker)
- [Muatation Observer](#muatation-observer)
- [Object 修改对象的行为](#object-修改对象的行为)
- [Iframe](#iframe)

<!-- /code_chunk_output -->

## 高阶函数

- 什么是高阶函数
  如果一个函数的入参或者返回值是一个函数，那么这个函数（前面那个）就被称为高阶函数

```js
Function.prototype.before = function (fn) {
  var that = this;
  return function () {
    fn();
    that();
  };
};

var oldFn = function () {
  console.log("old funtion");
};

var newFn = oldFn.before(function () {
  console.log("new function");
});

newFn();
// new function
// old function
```

上面的 before 就是一个高阶函数，它的入参是一个函数，返回值也是一个函数。

## AOP 面向切面编程

面向切面的编程 (Aspect Oriented Programming)

- 面向切面编程，通过预编译方式和运行期动态代理实现程序功能的统一维护的一种技术
- 在 js 中就是不改变原有逻辑的情况下对于对原函数、类的部分功能的  增强。
- es6 中的装饰器，注解使用的就是 AOP 模式的编程。

```js
// 简单的AOP实现，就是在原函数执行的前后，增加运行
// before和after两个增强方法，用这个新函数替换原函数
Function.prototype.aop = function (before, after) {
  let that = this;
  return function () {
    that.before.apply(that, arguments);
    that.apply(that, arguments);
    that.after.apply(that, arguments);
  };
};

Function.prototype.before = function () {
  console.log("我在方法之前执行");
};

Function.prototype.after = function () {
  console.log("我在方法之后执行");
};

function normalFn(name) {
  console.log("hello" + name);
}

var aopFn = normalFn.aop(before, after);
aopFn("Jack");
```

## 原生 ajax 和 fetch

- ajax 是 ES5 中 XMLHttpRequest 对象的实现，用于进行 HTTP 的异步请求
- fetch 是 ES6 中新增了一种 HTTP 数据请求的方式,它和 XMLHttpRequest 有许多相似的功能，但是相比 XMLHttpRequest,fetch 被设计成更具可扩展性和高效性。 重要的一点的是它的返回值是 promise，而不是通过回调函数的方式实现数据获取的逻辑处理

### ajax

- 作为 XMLHttpRequest 实例的属性之一，所有浏览器都支持 onreadystatechange, 后来，许多浏览器实现了一些额外的事件（onload、onerror、onprogress 等
- ajax 有自己的“状态码”，readyState
  - 0 (未初始化) or (请求还未初始化)
  - 1 (正在加载) or (已建立服务器链接)
  - 2 (加载成功) or (请求已接受)
  - 3 (交互) or (正在处理请求)
  - 4 (完成) or (请求已完成并且响应已准备好)
- `xhr.timeout`： 示该请求的最大请求时间（毫秒），若超出该时间，请求会自动终止。
- `xhr.upload`： XMLHttpRequestUpload，代表上传进度
- `xhr.setRequestHeader(key, value)` 设置请求头
- `xhr.send(data)` 发送请求，data 为请求体数据
- Response
  - xhr.status：服务器返回的状态码，等于 200 表示一切正常
  - xhr.responseText 服务器返回的文本数据

```js
// 原生ajax的写法
var xhr = new XMLHttpRequest();
xhr.timeout = 3000; // 可以设置HTTP请求的时限
xhr.ontimeout = function(event){
    alert('请求超时！');
}
xhr.onreadystatehange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        console.log(xhr.responseText)
    }
}
xhr.open('GET', ${url})
xhr.send()
xhr.addEventListener('error', () => { // 当请求遇到错误时，将触发error 事件
    console.error(`${e.type}: ${e.loaded} bytes transferred\n`)
});
```

### fetch

- 当接收到一个代表错误的 HTTP 状态码时，从 fetch() 返回的 Promise 不会被标记为 reject,仅当网络故障时或请求被阻止时，才会标记为 reject
- fetch 不支持超时 timeout, jsonp, progress 处理，需要自己手动实现或者第三方库
- fetch() 不会接受跨域 cookies；你也不能使用 fetch() 建立起跨域会话
- 如果只想在请求 URL 与调用脚本位于同一起源处时发送凭据，请添加 credentials: 'same-origin' (默认值)
  - omit: 默认值，忽略 cookie 的发送
  - same-origin: 表示 cookie 只能同域发送，不能跨域发送
  - include: cookie 既可以同域发送，也可以跨域发送

```js
// fetch
fetch(`${url}`, {
  body: JSON.stringify(data), // must match 'Content-Type' header
  cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
  credentials: "same-origin", // include, same-origin, *omit
  headers: {
    "user-agent": "Mozilla/4.0 MDN Example",
    "content-type": "application/json",
  },
  method: "POST", // *GET, POST, PUT, DELETE, etc.
  mode: "cors", // no-cors, cors, *same-origin
  redirect: "follow", // manual, *follow, error
  referrer: "no-referrer", // *client, no-referrer
})
  .then((response) => {
    if (response.ok) {
      return response.json();
    }
    throw new Error("Network response was not ok.");
  })
  .then(function (myJson) {
    console.log(myJson);
  })
  .catch((error) => console.error("Error:", error));
```

## Web Worker

Web Worker 的作用，就是为 JavaScript 创造多线程环境，允许主线程创建 Worker 线程，将一些任务分配给后者运行。在主线程运行的同时，Worker 线程在后台运行，两者互不干扰。等到 Worker 线程完成计算任务，再把结果返回给主线程。这样的好处是，一些计算密集型或高延迟的任务，被 Worker 线程负担了，主线程（通常负责 UI 交互）就会很流畅，不会被阻塞或拖慢。

Worker 线程一旦新建成功，就会始终运行，不会被主线程上的活动（比如用户点击按钮、提交表单）打断。这样有利于随时响应主线程的通信。但是，这也造成了 Worker 比较耗费资源，不应该过度使用，而且一旦使用完毕，就应该关闭。

- 主线程

  - worker 特性检测 `if(window.Worker) { ... }`
  - `Worker.onerror`：指定 error 事件的监听函数。
  - `Worker.onmessage`：指定 message 事件的监听函数，发送过来的数据在 Event.data 属性中。
  - `Worker.onmessageerror`：指定 messageerror 事件的监听函数。发送的数据无法序列化成字符串时，会触发这个事件。
  - `Worker.postMessage()`：向 Worker 线程发送消息。
  - `Worker.terminate()`：立即终止 Worker 线程
  - `Worker.addEventListener()` 【'message', 'error'】

- 子线程（Worker 线程）
  - self.name： Worker 的名字。该属性只读，由构造函数指定。
  - self.onmessage：指定 message 事件的监听函数。
  - self.onmessageerror：指定 messageerror 事件的监听函数。发送的数据无法序列化成字符串时，会触发这个事件。
  - self.close()：关闭 Worker 线程。
  - self.postMessage()：向产生这个 Worker 线程发送消息。
  - self.importScripts()：加载 JS 脚本。

```js
// ==> index.js
// 主线程
const worker = new Worker("worker.js");
worker.postMessage("hello world");

worker.onmessage = function (event) {
  console.log("Received message " + event.data);
  // doSomething();
};

worker.onerror = funtion(error) {
   console.log(
    ["ERROR: Line ", e.lineno, " in ", e.filename, ": ", e.message].join("")
  );
};

worker.terminate();

// ===> worker线程
// worker子线程内部如果要加载其他脚本
importScripts('script1.js', 'script2.js');

// self代表子线程自身，即子线程的全局对象
self.addEventListener(
  "message",
  function (e) {
    self.postMessage("You said: " + e.data);
  },
  false
);
```

具体使用请看：http://www.ruanyifeng.com/blog/2018/07/web-worker.html

## Muatation Observer

MutationObserver 接口提供了监视对 DOM 树所做更改的能力

- `构造函数MutationObserver(callback)` 创建并返回一个新的 MutationObserver 它会在指定的 DOM 发生变化时被调用。
  - `callback` 每当被指定的节点或子树以及配置项有 Dom 变动时会被调用,回调函数拥有两个参数：一个是描述所有被触发改动的 MutationRecord 对象数组，另一个是调用该函数的 MutationObserver 对象
- `disconnect()` 阻止 MutationObserver 实例继续接收的通知，直到再次调用其 observe()方法
- `observe()` 配置 MutationObserver 在 DOM 更改匹配给定选项时，通过其回调函数开始接收通知
- `takeRecords()` 从 MutationObserver 的通知队列中删除所有待处理的通知，并将它们返回到 MutationRecord 对象的新 Array 中

```js
// 选择需要观察变动的节点
var targetNode = document.getElementById("some-id");

// 观察器的配置（需要观察什么变动）
// 设为 true 以观察受监视元素的属性值变更。
// 设为 true 以监视指定目标节点或子节点树中节点所包含的字符数据的变
// childList 设为 true 以监视目标节点（如果 subtree 为 true，则包含子孙节点）添加或删除新的子节点。
// 设为 true 以将监视范围扩展至目标节点整个节点树中的所有节点。
var config = { attributes: true, childList: true, subtree: true };

// 当观察到变动时执行的回调函数
var callback = function (mutations) {
  for (var mutation of mutations) {
    //  type
    // 如果是属性变化，则返回 "attributes"
    // 如果是 characterData 节点变化，则返回 "characterData"
    // 如果是子节点树 childList 变化，则返回 "childList"
    if (mutation.type == "childList") {
      console.log("A child node has been added or removed.");
    } else if (mutation.type == "attributes") {
      console.log("The " + mutation.attributeName + " attribute was modified.");
    }
  }
};

// 创建一个观察器实例并传入回调函数
var observer = new MutationObserver(callback);

// 以上述配置开始观察目标节点
observer.observe(targetNode, config);

// 之后，可停止观察
observer.disconnect();
```

## Object 修改对象的行为

- 对象属性模型的相关方法

  - Object.getOwnPropertyDescriptor(obj, prop)：获取某个属性的描述对象。
  - Object.defineProperty(obj, prop, descriptor)：通过描述对象，定义某个属性。
  - Object.defineProperties(obj, props)：通过描述对象，定义多个属性。

  ```js
  // ===> getOwnPropertyDescriptor
  const obj = {
    bar: 42,
    get foo() {
      return 47;
    },
  };
  // { value: 42, writable: true, enumerable: true, configurable: true }
  const d = Object.getOwnPropertyDescriptor(obj, "bar");
  // { get: [Function: get foo], set: undefined, enumerable: true, configurable: true }
  const d2 = Object.getOwnPropertyDescriptor(obj, "foo");

  // ===> defineProperty
  const object1 = {
    bar: {
      c: "1",
      d: "2",
    },
  };
  const temp = Object.assign({}, object1)
  Object.defineProperty(object1, "property1", {
    value: 42,
    writable: false,
  });
  Object.defineProperty(object1, 'bar', {
    get() {
      // doing something...
      return temp['bar']
    },
    set(value) {
      // doing something...
      temp['bar'] = value;
    }
  })
  object1.property1 = 77; // throws an error in strict mode
  console.log(object1.property1); // 42

  // ===> defineProperties
  var obj = {};
  Object.defineProperties(obj, {
    property1: {
      value: true,
      writable: true,
    },
    property2: {
      value: "Hello",
      writable: false,
    },
    // etc. etc.
  });
  ```

描述符：（数据描述符和存取描述符）

- configurable 当且仅当该属性的 configurable 键值为 true 时，该属性的描述符才能够被改变，同时该属性也能从对应的对象上被删除
- enumerable 当且仅当该属性的 enumerable 键值为 true 时，该属性才会出现在对象的枚举属性中
- value 该属性对应的值。可以是任何有效的 JavaScript 值（数值，对象，函数等）
- writable 当且仅当该属性的 writable 键值为 true 时，属性的值，也就是上面的 value，才能被赋值运算符改变。
- get 属性的 getter 函数，如果没有 getter，则为 undefined。当访问该属性时，会调用此函数
- set 属性的 setter 函数，如果没有 setter，则为 undefined。当属性值被修改时，会调用此函数


## Iframe
这玩意尽量少用，但有时候还挺有用的，demo看代码。

iframe 嵌入一个子页面，父子页面相对独立，但也可用postMessage实现通信。

父页面是可以操作子页面的dom元素的，子页面也可以调用父元素的方法

iframe还可以作为轮询请求的一种解决方案