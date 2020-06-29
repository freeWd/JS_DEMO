> 永远年轻，永远热泪盈眶 - 《达摩流浪者》

# 回调函数

早期解决异步问题的思路，现在还是很广泛的在用

回调函数就是将函数 A（函数的指针）作为入参传递给某个函数(函数 B)，函数 A 内部的运行逻辑可以在外部自定义，但函数 A 的执行时间由函数 B 来控制

回调函数不是由该函数的实现方直接调用，而是在特定的事件或条件发生时由另外的一方调用的，用于对该事件或条件进行响应

回调函数会导致回调地狱的产生

```js
// 地狱：比如下一次回调函数的参数依赖上一次回调执行的结果时会发生什么
ajax("url1", (asyncValue) => {
  ajax(`url2?value=${asyncValue}`, (asyncValue2) => {
    ajax(`url3?value=${asyncValue3}`, (asyncValue3) => {
      console.log(asyncValue3);
    });
  });
});
```

# 异步编程

发展流程：回调 -> promise -> generator -> async + await\*\* （异步发展流程）

## 常用定时器函数

异步编程少不了定时器函数。

常见的定时器有：`setTimeout, setInterval, requestAnimationFrame`

`setTimeout和setInterval` 使用上都存在一定问题：不能保证在预期的时间执行任务

因为 JS 是单线程执行的，前面的代码较大程度影响了性能就会导致 setTimeout 和 setInterval 不会按期执行

```js
// setTimeout 伪代码
var timer = setTimeout(() => {
  console.log("hello world");
  clearTimeout(timer); // 可以清除定时器
}, 1000);
sleep(2000); // 上述异步代码不会准确的在1000ms后执行

// setInterval 伪代码
var timer = setInterval(() => {
  console.log("hello world");
  // clearInterval(timer) // 清除定时器
}, 1000);
sleep(2000); // 上述会在2s后立刻打印两次 hello world
```

`requestAnimationFrame`是一个比较重要的函数， 该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行

现在 PC 一般 1s 内是 60 帧，1 帧就是(1000ms / 60) = 16.6ms, 这个函数自带节流功能，在不掉帧的情况下不会出现时间上的偏差，在后面性能优化处还会用到它

TIPS: `若你想在浏览器下次重绘之前继续更新下一帧动画，那么回调函数自身必须再次调用window.requestAnimationFrame()`

```js
var timer;
function test() {
  timer = window.requestAnimationFrame(test); //这样可以保证每一帧都会执行一次test函数
  console.log("hello world");
  // cancelAnimationFrame(timer) 用来取消执行
}

timer = window.requestAnimationFrame(test);

// 可以用它来实现精确的setTimeout, setInterval
// ==> 精确的setTimeout
function setTimeout2(fn, intervalTime) {
  const start = Date.now();
  const loop = () => {
    const now = Date.now();
    if (now - start < intervalTime) {
      window.requestAnimationFrame(loop);
    } else {
      fn();
    }
  };
  timer = window.requestAnimationFrame(loop);
}
```

## Promise

从语法上说，Promise 是一个对象，从它可以获取异步操作的消息

Promise 有三种状态

- 等待中（pending）
- 完成了 （resolved）
- 拒绝了（rejected）

Promise 一旦从等待状态变成为其他状态就永远不能更改状态了

在构造 Promise 的时候，构造函数内部的代码是立即执行的

`Promise` 实现了链式调用, 就代表每次`then`调用的返回值也是一个`Promise`, 而是是一个全新的。如果在 then 中 return 一个值，值会被 `Promise.resolve()` 包装

如果是 return Promise 会根据返回的 Promise 是成功还是失败 决定下一个 then 是成功还是失败

捕获错误机制

- `.then`中的第二个回调函数处理错误， 还可以`.catch` 接收 err 并处理, catch 住的可以继续走下面的 then
- 默认会找离自己最近的 then 的失败

缺点：无法取消 Promise，错误需要通过回调函数捕获。 缺少主动推送功能

Promise.resolve() Promise.reject()

Promise.race() Promise.all()

```js
// Promise 解决异步回调地狱的问题
// demo1: 直接用上面回调中的ajax函数
new Promise((resolve, reject) => {
  ajax("url1", (asyncValue) => {
    resolve(asyncValue);
  });
})
  .then((value) => {
    new Promise((resolve, reject) => {
      ajax("url2?value=" + value, (asyncValue) => {
        resolve(asyncValue);
      });
    });
  })
  .then((value) => {
    console.log(value);
  });

// demo2 改造ajax
function ajax(url) {
  return new Promise((resolve, reject) => {
    // ...
    resolve(result);
  });
}

ajax("/url1")
  .then((val) => {
    return ajax("url2?value=" + value);
  })
  .then((val) => {
    console.log(val);
  });
```

能手写一个 Promise，符合 Promise A+规范

## Generator

- Generator 函数是 ES6 提供的一种异步编程解决方案
- 生成器函数，它输出的结果就是 ES6 中的 Iterator 迭代器，通过 next 能手动的向下取值
- 形式上，Generator 函数是一个普通函数，但是有两个特征。
  - function 关键字与函数名之间有一个\*号；
  - 函数体内部使用 yield 表达式，定义不同的内部状态（yield 在英语里的意思就是“产出”）

Generator 初识不好理解它的运行逻辑，看下下面代码的执行过程

```js
function* foo(x) {
  let y = 2 * (yield x + 1);
  let z = yield y / 3;
  return x + y + z;
}
let it = foo(5);
console.log(it.next()); // => {value: 6, done: false}
console.log(it.next(12)); // => {value: 8, done: false}
console.log(it.next(13)); // => {value: 42, done: true}
```

注意的点：

- generator 函数返回的是一个迭代器
- 当执行第一次 next 时，传参(写不写参数都不影响)会被忽略，并且函数暂停在 `yield (x + 1)` 处，所以返回 `5 + 1 = 6`
- 当执行第二次 next 时，传入的参数赋值给上一个 yield 的返回值(可以理解为：`temp = yield(x+1) = 12`)，如果你不传参，yield 永远返回 undefined。此时 let y = 2 _ 12，所以第二个 yield 等于 2 _ 12 / 3 = 8
- 当执行第三次 next 时，传入的参数会传递给 z，所以 z = 13, x = 5, y = 24，相加等于 42

可以理解为内部有一个状态及，能保持住当前的状态，第一次执行 next 会运行第一个 yield()内的逻辑，但是运行完就会停在这里不动了，等到第二次 next(value)执行, 就接收 vlaue 作为上一次 yield 的返回值，接着执行运算赋值等逻辑，直到运行到第二个 yield()内逻辑为止，以此类推

```js
// Generator 解决回调地狱的问题
function ajax(url) {
  return new Promise((resolve, reject) => {
    // ...
    resolve(result);
  });
}

function* test() {
  const data1 = yield ajax("/url1");
  const data2 = yield ajax("/url2?value=" + data1);
  return data2 + "123";
}

let it = test();
it.next()
  .value.then((result) => it.next(result).value)
  .then((result) => {
    const { value, done } = it.next(result);
    console.log(value, done); // ${data2}+'123', true
  });
```

## async, await

- 异步的终极解决方案, 相当于是 generator + promise 的语法糖
- async 和 await，比起星号和 yield，语义更清楚了。async 表示函数里有异步操作，await 表示紧跟在后面的表达式需要等待结果
- async 函数的返回值是 Promise 对象，这比 Generator 函数的返回值是 Iterator 对象方便多了。你可以用 then 方法指定下一步的操作，进一步说，async 函数完全可以看作多个异步操作，包装成的一个 Promise 对象，而 await 命令就是内部 then 命令的语法糖。
- async 函数内如果是 reutrn 1 调用的时候相当于是返回了 Promise.resolve(1)
- async 函数的 await 命令后面，可以是 Promise 对象和原始类型的值（数值、字符串和布尔值，但这时等同于同步操作）。正常情况下，await 命令后面是一个 Promise 对象。如果不是，会被转成一个立即 resolve 的 Promise 对象。 await 相当于执行了 promise.then
- 如果多个异步代码没有依赖性却使用了 await 会导致性能上的降低

### async 函数的实现原理

async 函数的实现原理，就是将 Generator 函数和自动执行器，包装在一个函数里

```js
async function fn(args) {
  // ...
}

// 等同于

function fn(args) {
  return spawn(function* () {
    // ...
  });
}

function spawn(genF) {
  return new Promise((resolve, reject) => {
    const gen = genF();
    function step(nextF) {
      let next;
      try {
        next = nextF();
      } catch (e) {
        return reject(e);
      }
      if (next.done) {
        return resolve(next.value);
      }
      Promise.resolve(next.value).then(
        value => {
          step(function () {
            return gen.next(v);
          });
        },
        error => {
          step(function () {
            return gen.throw(e);
          });
        }
      );
      // <===
    }
    step(function () {
      return gen.next(undefined);
    });
  });
}

// 简化版写法：
function spawn(genF) {
  const iterator = genF();
  return new Promise((resolve, reject) => {
    function step(val) {
      const { value, done } = iterator.next(val);
      if (done) {
        resolve(value);
      } else {
        step(value);
      }
    }

    step();
  });
}
```

```js
async function test() {
  // 以下代码没有依赖性的话，完全可以使用 Promise.all 的方式
  // 如果有依赖性的话，其实就是解决回调地狱的例子了
  await fetch(url);
  await fetch(url1);
  await fetch(url2);
}
```

```js
// await 内部实现了 generator ，generator 会保留堆栈中东西，所以这时候 a = 0 被保存了下来
let a = 0;
let b = async () => {
  a = a + (await 10);
  console.log("2", a); // -> '2' 10
};
b();
a++;
console.log("1", a); // -> '1' 1
```
