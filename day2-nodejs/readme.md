
### Nodejs的事件环

![image](/static/nodeEventLoop.png)

图中显示的每个阶段都对应一个事件队列，当event loop执行到某个阶段时会将当前阶段对应的队列依次执行。当队列执行完毕或者执行数量超过上限时，才会转入下一个阶段。node中的微任务在切换队列时执行。

* 主执行栈
* 微任务 （promise.then < process.nextTick）只要队列发生切换就会执行微任务
* timers计时器：执行setTimeout、setInterval的回调函数；
* I/O callbacks：执行I/O callback被延迟到下一阶段执行
* idle, prepare：队列的移动，仅内部使用
* poll 轮询：检索新的I/O事件;执行I/O相关的回调
* check：执行setImmediate回调
* close callbacks：执行close事件的callback，例如socket.on("close",func)
* poll 阶段的下一个阶段是check，如果check队列中有东西，会先执行check

看几个例子：


```js
setImmediate(() => {
  console.log('setImmediate1');
  setTimeout(() => {
      console.log('setTimeout1')
  }, 0);
});
Promise.resolve().then(res=>{
  console.log('then');
})
setTimeout(() => {
  process.nextTick(() => {
      console.log('nextTick');
  });
  console.log('setTimeout2');
  setImmediate(() => {
      console.log('setImmediate2');
  });
}, 0);
```

> 这道题的输出顺序是：then、setTimeout2、nextTick、setImmediate1、setImmediate2、setTimeout1，为什么是这样的顺序呢？微任务nextTick的输出是因为timers队列切换到check队列，setImmediate1和setImmediate2连续输出是因只有当前队列执行完毕后才能进去下一对列。


### Node 如何实现模块化？
早期的模块化解决方案：seajs, cmd, requirejs, amd
到现在的CommonJS规范 - 通过文件读取到方式（utf8）实现了模块化
1. 文件即模块
2. 定义导出方式，module.exports, exports.
3. 定义了导入方式：require

```js
// commonjs 使用
// hello.js
var s = 'hello';
function test(name) {
    console.log( s + name);
}
module.exports = test;
```
函数test()是我们在hello模块中定义的，你可能注意到最后一行是一个奇怪的赋值语句，它的意思是，把函数test作为模块的输出暴露出去，这样其他模块就可以使用test函数了。

其他模块怎么使用hello模块的这个greet函数呢？
```js
// main.js
var fn = require('./hello');
fn('world'); // hello world

// 引入hello模块用Node提供的require函数
```
变量fn就是在hello.js中我们用module.exports = test;输出的test函数。所以，main.js就成功地引用了hello.js模块中定义的test()函数，接下来就可以直接使用它了。

如果只写模块名：
```js
var fn = require('hello');
```
则Node会依次在内置模块、全局模块和当前模块下查找hello.js，你很可能会得到一个错误。

导出模块除了可以使用 **module.exports = xxx** 之外，还可以直接使用 **exports.xx = xxx**
```js
function hello() {
    console.log('Hello, world!');
}

function greet(name) {
    console.log('Hello, ' + name + '!');
}

// 导出方法一
module.exports = {
    hello: hello,
    greet: greet
};

// 导出方法二
exports.hello = hello;
exports.greent = greet;
```
但是 **exports** 只能导出对象，且不可以直接给它赋值
```js
// 这样不会报错，但却是无效的
exports = {
    hello : hello,
    grent : grent 
}
```
原因是和Commonjs的加载机制有关系，后面会分析到。
现在先得出结论：
* 如果要输出一个键值对象{}，可以利用exports这个已存在的空对象{}，并继续在上面添加新的键值；
* 如果要输出一个函数或数组，必须直接对module.exports对象赋值。
* 所以我们可以得出结论：直接对module.exports赋值，可以应对任何情况：



### Commonjs 加载机制
Commonjs通过文件读取拿到相关的文件中的内容，这些内容拿到手（Commonjs内部）可能是一堆字符串，它是如何让字符串执行为代码的呢？
如果让我们去考虑这个问题，常见的解决方法有下面几种：
1. eval (stringCode) - 使用eval函数去执行字符串, 这样做的问题是？
```js
let a = '123';
let code = 'console.log(a)';
eval(code);
// 从上面代码中我们可以看到，eval中的代码和外部代码没有完全隔离开，存在明显的依赖关系。如果eval中的变量名和外面一样也会将外面的替换掉。 这样就没有解决模块化的问题
```

2. 使用function来实现
```js
var a = '123';
var code = 'var a = "234"; console.log(a)';
var fn = new Function('a', code);
fn(a);

// 和eval类似也会外部和内部环境也会相互影响
```
上面两种方法都不合适

Node中的Commonjs, 实现“模块”功能的奥妙就在于JavaScript是一种函数式编程语言，它支持闭包。
我们使用runInThisContext将字符串执行为代码，执行之前
如果我们把一段JavaScript代码用一个函数包装起来，这段代码的所有“全局”变量就变成了函数内部的局部变量。

Commonjs require方法的实现
* 内置实现了一个require的方法
* 通过Module._load方法加载模块
* Module._resolveFilename 根据相对路径转化为绝对路径，并增加后缀
* 判断Module._cache缓存中是否有当前内容，
* new Module 创建的模块，id 存的是需要加载文件的全局路径
* tryModuleLoad（Module） 尝试加载这个模块
    * 取出文件的后缀
    * 加载模块 （读取文件）
    * Module.wrap 包裹读取的内容 
    （"(function (exports, require, module, __filename, __dirname) { "  "});"）
    * 使用runInthisContext运行字符串
    * 让字符串执行 this改变成 exports


我们可以自己手写一个简单的require 验证下Commonjs的读取文件的一个整体的流程
```js
let path = require('path');
let fs = require('fs');
let vm = require('vm');

function Module(id) {
    this.id = id;
    this.exports = {};
}

Module.wrapper = [
    '(function(exports, module, require, __dirname, __filename) {',    
    '})'
]

Module.cache = {}

Module.extNameList = {
    '.js': function (module) {
       let content = fs.readFileSync(module.id, 'utf8');
       let fnStr = Module.wrapper[0] + content + Module.wrapper[1]; 
       let fn = vm.runInThisContext(fnStr);
       fn.call(module.exports, module.exports, module, req);
    },
    '.json': function(module) {
        let json = fs.readFileSync(module.id, 'utf8');
        module.exports = json;
    }
}

function tryModuleLoad(module) {
    let extName = path.extname(module.id);
    Module.extNameList[extName](module);
}

function req(filePath) {
    let absFilePath = path.resolve(__dirname, filePath);

    let index = 0;
    let extnameList = Object.keys(Module.extNameList);
    let extname = path.extname(absFilePath);

    if (!extname) {
        loopFileExtendName();
    }   

    function loopFileExtendName() {
        if (index >= extnameList.length) {
            throw new Error('文件不存在');
        }
        let tempFilePath = absFilePath + extnameList[index++];
        try {
            fs.accessSync(tempFilePath);
            absFilePath = tempFilePath;
        } catch(e) {
            loopFileExtendName();
        }
    }


    if (Module.cache[absFilePath]) {
        return Module.cache[absFilePath].exports;    
    } else {
        let module = new Module(absFilePath);
        Module.cache[absFilePath] = module;
        tryModuleLoad(module);
        return module.exports;
    }
    
}

let obj = req('./a.js');
console.log(obj);
```
通过上面我们自己写的简单的模拟require方法，我们知道了exports导出的内容是如何一步步转变问require接收到的内容的。
同时通过 `_extendsions` 的内部逻辑，可以看到 exports, module.exports 都指向同一个对象，这也就是为什么exports也能导出对象的原因了。但exports只能添加对象，如 `exports.test = test`, 如果直接赋值方法或者其他对象，指针发生变化，就无效了。


### npm的相关使用 & 全局模块 
npm是nodejs自带的包管理工具，通过它可以下载第三方模块。 
我们来了解下npm的使用：
* 查看npm全局配置信息
```js
npm config ls
```

* 查看npm根目录路径
```js
npm root -g

// 修改全局安装目录
npm config set prefix “D:\node.js\node_global”
```

* 用npm安装第三方库
```
// 安装全局包 (安装到本地文件夹中) - 具体路径：npm root -g
// 全局安装包安装后在在任何位置的命令行中去运行
npm install {库名}@版本号 -g

// 安装局部包 （安装到当前项目所在的node_module文件夹中）
// 在当前项目的代码中使用
npm install {库名}@版本号
```

当我们在一个文件中引入 `require({第三方包})` 的时候，它会根据module.exports进行查找(查找node_modules文件夹内部的文件)，找到后返回，找不到就继续向上级（Module.paths 数组列表） 查找。 当找到文件夹名称相同后，查找文件夹内的package.json文件，找到对应的 `main`参数的入口，如果没有package.json 或者package.json中没有key为main的值，就默认查找index.js


* 卸载第三方包
```
npm uninstall {库名} -g
npm uninstall {库名}
```
* 实现全局命令
    1) 需要在package.json中添加bin的配置
    2) 前面是命令，后面是执行的文件
        ```
        "bin": {
            "wd": "./wd-test.js"
        }
        ```
    3) #/usr/bin/env node (使用node来运行文件)
        ```
        #!/usr/bin/env node
        console.log('wd-test');
        ```
    4) 拷贝到 `npm root -g` 所在目录下，或者本地调试的时候到需要使用的第三方库文件夹下 运行 `npm link` 链接到全局安装目录去。

* 发布一个自己写的包到npm官网
    1) 将npm的源切换为官方的源（不要用taobao源或者cpm, 否则无法提交成功）- 可以使用nrm (npm源管理)来切换
        ```
        npm install nrm -g
        nrm use npm
        ```
    2) 登录账号
        ```
        npm addUser
        ```
    3) 发布代码，进入需要发布代码的文件夹，运行： 
        ```
        npm publish 
        ```
    4) 取消发布
        ```
        npm unpublish --force
        ```

* yarn 
    yarn是facebook主推的一个包管理工具，下载速度比npm更快，版本控制更好。
    ```
    npm install yarn -g
    yarn global add ${第三方库}
    yarn add ${第三方库}
    yarn remove ${第三方库}
    ```




参考：
* http://www.zhufengpeixun.cn/architecture/html/3.Node.html
* https://juejin.im/post/5b5f365e6fb9a04fa8673f97
* https://www.cnblogs.com/woodyblog/p/6061671.html


