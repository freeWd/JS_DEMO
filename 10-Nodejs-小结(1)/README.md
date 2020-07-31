> 遇诡诈人变幻百端，不可测度，吾一以至诚待之，彼术自穷。 - 曾国藩

## 什么是 nodejs

我们都知道完整的 JS 由三部分组成：

- DOM (Document Object Model)
- BOM (Browser Object Model)
- ECMAScript (js 基本语法)

nodejs 只有上面的 ECMAScript 部分

- Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行环境,让 JavaScript 的执行效率与低端的 C 语言的相近的执行效率。它  运行在服务端,所以仅仅包含 js 的 ECMAScript 部分。
- Node.js 使用了一个事件驱动、非阻塞式 I/O 的模型，使其轻量又高效。
- Node.js 的包管理器 npm，是全球最大的开源库生态系统。

进一步说明解释：
我们常常说到性能，主要有 cup 密集型（大量的计算，加密，解密...） 和 i/o 密集型（文件读取，并发请求）

因为 js 是单线程，只支持单核 CPU，不能充分利用 CPU。所以 nodejs 不适合做大量的运算, 但是适合高并发和 I/O 密集型应用(异步)。

### 什么场合下应该考虑使用 Node 框架

当应用程序需要处理大量并发的输入输出，而在向客户端响应之前，应用程序并不需要进行非常复杂的运算处理

- 聊天服务器
- 电子商务网站

### 概念

**异步/同步**：被调用方可以决定此方法是同步还是异步

同步和异步关注的是消息通知机制

- 同步：调用者主动等待这个调用的结果
- 异步：异步相反，当一个异步过程调用发出后，调用者不会立刻得到结果，而是调用发出后，被调用者通过状态、通知或回调函数处理这个调用

**阻塞/非阻塞**：调用方的状态就是阻塞、非阻塞。

- 阻塞调用是指调用结果返回之前，当前线程会被挂起。调用线程只有在得到结果之后才会返回。
- 非阻塞调用指在不能立刻得到结果之前，该调用不会阻塞当前线程

## REPL

> 在 Node.js 中为了使开发者方便测试 JavaScript 代码，提供了一个名为 REPL(Read Eval Print Loop)的可交互式运行环境。开发者可以在该运行环境中输入任何 JavaScript 表达式，当用户按下回车键后，REPL 运行环境将显示该表达式的运行结果。

在命令行容器中输入`node命令并按下回车键`，即可进入 REPL 运行环境。

REPL 的操作：

- 变量的操作，声明普通对象  和变量
- eval
- 函数的书写
- 下划线访问最近使用的表达式
- 多行书写
- REPL 运行环境中的上下文对象

REPL 运行环境的基础命令：

- .break 退出当前命令
- .clear 清除 REPL 运行环境上下文对象中保存的所有变量与函数
- .exit 退出 REPL 运行环境
- .save 把输入的所有表达式保存到一个文件中
- .load 把所有的表达式加载到 REPL 运行环境中
- .help 查看帮助命令

---

## Node 的三大部分：Global, Module, ECMAScript

### 全局作用域 (Global)

> （全局作用域(global)可以定义一些不需要通过任何模块的加载即可使用的变量、函数或类）- 类似于浏览器中的 windows(在浏览器中 window 代理了 global)

- 定义全局变量时变量会成为 global 的属性
- 永远不要不使用 var 关键字定义变量，以免污染全局作用域

```js
// 打印global可以看到它的内容
console.log(global);
```

常用的主要内容：

- process 进程 - 当前运行环境
- Buffer 读取的内容，都是二进制文件, 专门存放二进制数据的缓存区。 通过使用显式的字符编码，就可以在 Buffer 实例与普通的 JavaScript 字符串之间进行相互转换。
- 定时器：
  - setImmediate，clearimmediate
  - setTimeout, clearTimeout
  - setInterval, clearInterval
- console: 向 Node 内置的 console 模块，提供命令行环境中的标准输入，标准输出功能。点击查看 console 相关信息
- module 相关的内容（`__dirname, __filename, require, module`, 这些虽然看似是全局的，但实际上不是）

#### process

```js
process.cwd(); // 当前工作目录. 在哪里执行，就显示出位置
process.env; // 显示当前进程的整个运行环境
process.argv; //  属性返回一个数组，其中包含当启动 Node.js 进程时传入的命令行参数。 第一个元素是 process.execPath。 如果需要访问 argv[0] 的原始值，参阅 process.argv0。 第二个元素将是正在执行的 JavaScript 文件的路径。
process.nextTick(callback[, ...args]); // 方法将 callback 添加到下一个时间点的队列。 一旦当轮的事件循环全部完成，则调用下一个时间点的队列中的所有回调。 它将callBack方法推入的是微任务队列，执行优先级比setTimeout更高
```

```js
process.env.NODE_ENV = "production";
if (process.env.NODE_ENV === "production") {
  console.log("生产环境");
} else {
  console.log("开发环境");
}
```

```js
//  node 1.js --port 3000
let args = process.argv.slice(2); // ['--port', 3000]
let obj = {};
args.reduce((beforeArg, afterArg) => {
  if (beforeArg.includes("--")) {
    obj[beforeArg.slice(2)] = afterArg;
  }
  return afterArg;
});
console.log(obj);
```

####  全局函数

- setTimeout() - 用于在指定毫秒之后运行回调函数，指定毫秒数须在 1-2,147,483,647 毫秒（约 24.8 天）之间，该方法返回一个整数，代表这个新建定时器的编号。
- setInterval() - 每隔一定毫秒调用回调，指定毫秒数须在 1-2,147,483,647 毫秒（约 24.8 天）之间，超出则自动改为 1 毫秒，该方法返回一个整数，代表这个新建定时器的编号。
- setImmediate- 安排在 I/O 事件的回调之后立即执行的 callback
- Buffer() - 用于操作二进制数据。Buffer 类的实例类似于整数数组

> process.nextTick 和 setImmediate 的一个重要区别：多个 process.nextTick 语句总是在当前"执行栈"一次执行完，多个 setImmediate 可能则需要多次 loop 才能执行完

#### 全局变量

- \_\_dirname：指向当前运行脚本所在的目录
- \_\_filename：指向当前运行脚本的文件名，当前模块的文件名称---解析后的绝对路径。

---

### Node 模块 (module)

- JS 没有模块系统，不支持封闭的作用域和依赖管理
- 没有标准库，没有文件系统和 IO 流 API
- 也没有包管理系统

模块化解决的问题：命名冲突，代码方便维护，人员协作，依赖关系

Node 中模块分类：

- 原生基本模块

  http path fs util events 编译成二进制,加载速度最快，原生模块直接通过名称来加载

- 文件模块

  在硬盘的某个位置，加载速度非常慢，文件模块通过名称或路径来加载 文件模块的后缀有三种

  - 后缀名为.js 的 JavaScript 脚本文件,需要先读入内存再运行
  - 后缀名为.json 的 JSON 文件,fs 读入内存 转化成 JSON 对象 \*
  - 后缀名为.node 的经过编译后的二进制 C/C++扩展模块文件,可以直接使用

- 第三方模块
  - 如果 require 函数只指定名称则视为从 node_modules 下面加载文件，这样的话你可以移动模块而不需要修改引用的模块路径
  - 第三方模块的查询路径包括 module.paths 和全局目录

## ECMAScript 就无需再介绍了

---

## Node 如何实现模块化？

早期的模块化解决方案：`seajs, cmd, requirejs, amd`

到现在的 CommonJS 规范 - 通过文件读取到方式（utf8）实现了模块化

1. 文件即模块
2. 定义导出方式，module.exports, exports.
3. 定义了导入方式：require

```js
// commonjs 使用
// hello.js
var s = "hello";
function test(name) {
  console.log(s + name);
}
module.exports = test;
```

函数 test()是我们在 hello 模块中定义的，你可能注意到最后一行是一个奇怪的赋值语句，它的意思是，把函数 test 作为模块的输出暴露出去，这样其他模块就可以使用 test 函数了。

其他模块怎么使用 hello 模块的这个 greet 函数呢？

```js
// main.js
var fn = require("./hello");
fn("world"); // hello world

// 引入hello模块用Node提供的require函数
```

变量 fn 就是在 hello.js 中我们用 module.exports = test;输出的 test 函数。所以，main.js 就成功地引用了 hello.js 模块中定义的 test()函数，接下来就可以直接使用它了。

如果只写模块名：

```js
var fn = require("hello");
```

则 Node 会依次在内置模块、全局模块和当前模块下查找 hello.js，你很可能会得到一个错误。

导出  模块除了可以使用 **module.exports = xxx** 之外，还可以直接使用 **exports.xx = xxx**

```js
function hello() {
  console.log("Hello, world!");
}

function greet(name) {
  console.log("Hello, " + name + "!");
}

// 导出方法一
module.exports = {
  hello: hello,
  greet: greet,
};

// 导出方法二
exports.hello = hello;
exports.greent = greet;
```

但是 **exports** 只能导出对象，且不可以直接给它赋值

```js
// 这样不会报错，但却是无效的
exports = {
  hello: hello,
  grent: grent,
};
```

原因是和 Commonjs 的加载机制有关系，后面会分析到。
现在先得出结论：

- 如果要输出一个键值对象{}，可以利用 exports 这个已存在的空对象{}，并继续在上面添加新的键值；
- 如果要输出一个函数或数组，必须直接对 module.exports 对象赋值。
- 所以我们可以得出结论：直接对 module.exports 赋值，可以应对任何情况

## npm 的相关使用 & 全局模块

npm 是 nodejs 自带的包管理工具，通过它可以下载第三方模块。
我们来了解下 npm 的使用：

- 查看 npm 全局配置信息

```js
npm config ls
```

- 查看 npm 根目录路径

```js
npm root -g

// 修改全局安装目录
npm config set prefix “D:\node.js\node_global”
```

- 用 npm 安装第三方库

```
// 安装全局包 (安装到本地文件夹中) - 具体路径：npm root -g
// 全局安装包安装后在在任何位置的命令行中去运行
npm install {库名}@版本号 -g

// 安装局部包 （安装到当前项目所在的node_module文件夹中）
// 在当前项目的代码中使用
npm install {库名}@版本号
```

当我们在一个文件中引入 `require({第三方包})` 的时候，它会根据 module.exports 进行查找(查找 node_modules 文件夹内部的文件)，找到后返回，找不到就继续向上级（Module.paths 数组列表） 查找。 当找到文件夹名称相同后，查找文件夹内的 package.json 文件，找到对应的 `main`参数的入口，如果没有 package.json 或者 package.json 中没有 key 为 main 的值，就默认查找 index.js

- 卸载第三方包

```
npm uninstall {库名} -g
npm uninstall {库名}
```

- 实现全局命令

  1. 需要在 package.json 中添加 bin 的配置
  2. 前面是命令，后面是执行的文件
     ```
     "bin": {
         "wd": "./wd-test.js"
     }
     ```
  3. #/usr/bin/env node (表示 使用 node 来运行文件)
     ```
     #!/usr/bin/env node
     console.log('wd-test');
     ```
  4. 拷贝到 `npm root -g` 所在目录下，或者本地调试的时候到需要使用的第三方库文件夹下 运行 `npm link` 链接到  全局安装目录去。

- 发布一个自己写的包到 npm 官网

  1. 将 npm 的源切换为官方的源（不要用 taobao 源或者 cpm, 否则无法提交成功）- 可以使用 nrm (npm 源管理)来切换
     ```
     npm install nrm -g
     nrm use npm
     ```
  2. 登录账号
     ```
     npm addUser
     ```
  3. 发布代码，进入需要发布代码的文件夹，运行：
     ```
     npm publish
     ```
  4. 取消发布
     ```
     npm unpublish --force
     ```

- yarn
  yarn 是 facebook 主推的一个包管理工具，下载速度比 npm 更快，版本  控制更好。

  ```
  npm install yarn -g
  yarn global add ${第三方库}
  yarn add ${第三方库}
  yarn remove ${第三方库}
  ```

  | npm                        | yarn               |
  | -------------------------- | ------------------ |
  | npm install                | yarn               |
  | npm install lib --save     | yarn add lib       |
  | npm uninstall lib --save   | yarn remove lib    |
  | npm install lib --save-dev | yarn add lib --dev |
  | npm update --save          | yarn upgrade       |

参考：

- http://www.zhufengpeixun.cn/architecture/html/3.Node.html
- https://juejin.im/post/5b5f365e6fb9a04fa8673f97
- https://www.cnblogs.com/woodyblog/p/6061671.html

资源分享： [Nodejs 入门](https://www.nodebeginner.org/index-zh-cn.html#javascript-and-nodejs)
