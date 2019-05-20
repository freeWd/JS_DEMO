> 在聊Nodejs之前，我们先看看js中的一些概念，了解了这些概念后面理解Nodejs会更方便一些

js是一门**主线程**为单线程的语言，同时它要也是一门解释型语言。

* 编译型语言是代码在运行前编译器将人类可以理解的语言（编程语言）转换成机器可以理解的语言。
* 解释型语言也是人类可以理解的语言（编程语言），也需要转换成机器可以理解的语言才能执行，但是是在运行时转换的。所以执行前需要解释器安装在环境中；但是编译型语言编写的应用在编译后能直接运行。

所以虽然传统我们说js是从上到下，边编译边执行。但实际上更准确的说它是及时编译的，即js也是有预编译和执行两个过程的。
* 预编译阶段是前置阶段，这个时候由编译器将 JavaScript 代码编译成可执行的代码。 注意，这里的预编译和传统的编译并不一样，传统的编译非常复杂，涉及分词、解析、代码生成等过程 。这里的预编译是 JavaScript 中独特的概念，虽然 JavaScript 是解释型语言，编译一行，执行一行。但是在代码执行前，JavaScript 引擎确实会做一些“预先准备工作”。
    * 预编译阶段进行变量声明；
    * 预编译阶段变量声明进行提升，但是值为 undefined；
    * 预编译阶段所有非表达式的函数声明进行提升。

* 执行阶段主要任务是执行代码，执行上下文在这个阶段全部创建完成。

**什么是线程和进程？**
进程（process）和线程（thread）是操作系统的基本概念

* 进程：是执行中一段程序，即一旦程序被载入到内存中并准备执行，它就是一个进程。进程是表示资源分配的的基本概念，又是调度运行的基本单位，是系统中的并发执行的单位。
* 线程：单个进程中执行中每个任务就是一个线程。线程是进程中执行运算的最小单位。

对于操作系统来说，一个任务就是一个进程（Process），比如打开一个浏览器就是启动一个浏览器进程，打开一个记事本就启动了一个记事本进程，打开两个记事本就启动了两个记事本进程，打开一个Word就启动了一个Word进程。

有些进程还不止同时干一件事，比如Word，它可以同时进行打字、拼写检查、打印等事情。在一个进程内部，要同时干多件事，就需要同时运行多个“子任务”，我们把进程内的这些“子任务”称为线程（Thread）。

我们常常说的多线程的任务处理和多进程的原理是一样的，它们都是调用CPU去“同时”做很多的事情，所谓的“同时”是相对的，如果你的CUP是单核的，需要“同时”处理4件事情，它会轮流让各个任务交替执行，任务1执行0.01秒，切换到任务2，任务2执行0.01秒，再切换到任务3，执行0.01秒……这样反复执行下去。表面上看，每个任务都是交替执行的，但是，由于CPU的执行速度实在是太快了，我们感觉就像所有任务都在同时执行一样。

如果是4核CPU执行4件事情就是“真正”的执行了多任务，但是，由于任务数量远远多于CPU的核心数量，所以，操作系统也会自动把很多任务轮流调度到每个核心上执行。



**为什么说主线程是单线程？**
* 这是由 Javascript 这门脚本语言的用途决定的。
* Web Worker并没有改变 JavaScript 单线程的本质。
* js本身不可能是异步的，但js的宿主环境（比如浏览器，Node）是多线程的，宿主环境通过某种方式（事件驱动，下文会讲）使得js具备了异步的属性。

我们可以先看一个浏览器的模型图

![image](../static/browser.jpg)
* 用户界面-包括地址栏、前进/后退按钮、书签菜单等
* 浏览器引擎-在用户界面和呈现引擎之间传送指令
* 呈现引擎-又称渲染引擎，也被称为浏览器内核，在线程方面又称为UI线程
* 网络-用于网络调用，比如 HTTP 请求
* 用户界面后端-用于绘制基本的窗口小部件,UI线程和JS共用一个线程
* JavaScript解释器-用于解析和执行 JavaScript 代码
* 数据存储-这是持久层。浏览器需要在硬盘上保存各种数据，例如 Cookie

除JS线程和UI线程之外的其它线程
* 浏览器事件触发线程
* 定时触发器线程
* 异步HTTP请求线程


1. 所有同步任务都在主线程上执行，形成一个执行栈
2. 主线程之外，还存在一个任务队列。只要异步任务有了运行结果，就在任务队列之中放置一个事件。
3. 一旦执行栈中的所有同步任务执行完毕，系统就会读取任务队列，看看里面有哪些事件。那些对应的异步任务，于是结束等待状态，进入执行栈，开始执行。
4. 主线程不断重复上面的第三步。

**什么是 宏任务和微任务？**

异步任务可以分为两类：分别就是宏任务和微任务
* 常见的宏任务macrotask有：setTimeout、setInterval、 setImmediate(ie浏览器才支持,node中自己也实现了)、MessageChannel
* 常见的微任务microtask有：promise.then()、process.nextTick(node的)

**是什么是浏览器事件环?**
浏览器中，事件环的运行机制是，先会执行栈中的内容，栈中的内容执行后执行微任务，微任务清空后再执行宏任务，先取出一个宏任务，再去执行微任务，然后在取宏任务清微任务这样不停的循环。
![image](../static/eventloop.png)
> 从图中可以看出，同步任务会进入执行栈，而异步任务会进入任务队列（callback queue）等待执行。一旦执行栈中的内容执行完毕，就会读取任务队列中等待的任务放入执行栈开始执行。

```js
setTimeout(() => {
    console.log('setTimeout1');
    Promise.resolve().then(data => {
        console.log('then3');
    });
},1000);
Promise.resolve().then(data => {
    console.log('then1');
});
Promise.resolve().then(data => {
    console.log('then2');
    setTimeout(() => {
        console.log('setTimeout2');
    },1000);
});
console.log(2);

// 输出结果：2 then1 then2 setTimeout1  then3  setTimeout2
```

> 1. 先执行栈中的内容，也就是同步代码，所以2被输出出来；
> 2. 然后清空微任务，所以依次输出的是 then1 then2；
> 3. 因代码是从上到下执行的，所以1s后 setTimeout1 被执行输出；
> 4. 接着再次清空微任务，then3被输出；
> 5. 最后执行输出setTimeout2

再来看一个例子：
```js
async function async1() {
    console.log('async start');
    await async2();
}

async function async2() {
    console.log('async2');
}

console.log('script start');

setTimeout(() => {
    console.log('setTimeout');
})

async1();

new Promise((resolve, reject) => {
    console.log('promise 1');
    resolve();
}).then(() => {
    console.log('promise1 then')
});

console.log('script end');

// 执行顺序如下：
// script start - async start - async2 - promise 1 -  script end - promise1 then - setTimeout
```


****

## nodejs
下面我们来正式的聊一聊nodejs
我们都知道完整的JS由三部分组成：
* DOM (Document Object Model)
* BOM (Browser Object Model)
* ECMAScript (js基本语法)

nodejs只有上面的ECMAScript部分

**什么是nodejs**
* Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行环境,让JavaScript的执行效率与低端的C语言的相近的执行效率。它运行在服务端，所以仅仅包含js的ECMAScript部分。
* Node.js 使用了一个事件驱动、非阻塞式 I/O 的模型，使其轻量又高效。
* Node.js 的包管理器 npm，是全球最大的开源库生态系统。

解释：
我们常常说到性能，主要有 cup密集型（大量的计算，加密，解密...） 和 i/o密集型（文件读取，并发请求）

因为js是单线程，只支持单核CPU，不能充分利用CPU。所以nodejs不适合做大量的运算, 但是适合高并发和I/O密集型应用。

可靠性不够高，一旦代码某个环节崩溃，整个系统都崩溃

异步/同步：被调用方，可以决定此方法是同步还是异步
阻塞/非阻塞：调用方的状态就是阻塞、非阻塞。 同步对应阻塞，异步对应非阻塞。 **同步阻塞，异步非阻塞**

**REPL**
> 在Node.js中为了使开发者方便测试JavaScript代码，提供了一个名为REPL的可交互式运行环境。开发者可以在该运行环境中输入任何JavaScript表达式，当用户按下回车键后，REPL运行环境将显示该表达式的运行结果。

在命令行容器中输入node命令并按下回车键，即可进入REPL运行环境。

REPL的操作：
* 变量的操作，声明普通对象和变量
* eval
* 函数的书写
* 下划线访问最近使用的表达式
* 多行书写
* REPL运行环境中的上下文对象

REPL运行环境的基础命令： 
* .break退出当前命令
* .clear 清除REPL运行环境上下文对象中保存的所有变量与函数
* .exit 退出REPL运行环境
* .save 把输入的所有表达式保存到一个文件中
* .load 把所有的表达式加载到REPL运行环境中
* .help 查看帮助命令

**REPL**




http://www.zhufengpeixun.cn/architecture/html/3.Node.html
https://juejin.im/post/5b5f365e6fb9a04fa8673f97
https://www.cnblogs.com/woodyblog/p/6061671.html


