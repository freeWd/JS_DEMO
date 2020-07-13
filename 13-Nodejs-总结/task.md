
<!-- @import "[TOC]" {cmd="toc" depthFrom=1 depthTo=6 orderedList=false} -->

<!-- code_chunk_output -->

- [commonjs 加载机制 & 手写](#commonjs-加载机制-手写)
- [express 机制 & 手写](#express-机制-手写)
- [koa 机制 & 手写](#koa-机制-手写)
- [ejs（html 模板）手写](#ejshtml-模板手写)

<!-- /code_chunk_output -->


## commonjs 加载机制 & 手写

Commonjs 通过文件读取拿到相关的文件中的内容，这些内容拿到手（Commonjs 内部）可能是一堆字符串，它是如何让字符串执行为代码的呢？
如果让我们去考虑这个问题，常见的解决方法有下面几种：

1. eval (stringCode) - 使用 eval 函数去执行字符串, 这样做的问题是？

```js
let a = "123";
let code = "console.log(a)";
eval(code);
// 从上面代码中我们可以看到，eval中的代码和外部代码没有完全隔离开，存在明显的依赖关系。如果eval中的变量名和外面一样也会将外面的替换掉。 这样就没有解决模块化的问题
```

2. 使用 function 来实现

```js
var a = "123";
var code = 'var a = "234"; console.log(a)';
var fn = new Function("a", code);
fn(a);

// 和eval类似也会外部和内部环境也会相互影响
```

上面两种方法都不合适

Node 中的 Commonjs, 实现“模块”功能的奥妙就在于 JavaScript 是一种函数式编程语言，它支持闭包。
我们使用 runInThisContext 将字符串执行为代码，执行之前
如果我们把一段 JavaScript 代码用一个函数包装起来，这段代码的所有“全局”变量就变成了函数内部的局部变量。

Commonjs require 方法的实现

- 内置实现了一个 require 的方法
- 通过 Module.\_load 方法加载模块
- Module.\_resolveFilename 根据相对路径转化为绝对路径，并增加后缀
- 判断 Module.\_cache 缓存中是否有当前内容，
- new Module 创建的模块，id 存的是需要加载文件的全局路径
- tryModuleLoad（Module） 尝试加载这个模块
  - 取出文件的后缀
  - 加载模块 （读取文件）
  - Module.wrap 包裹读取的内容
    （"(function (exports, require, module, **filename, **dirname) { " "});"）
  - 使用 runInthisContext 运行字符串
  - 让字符串执行 this 改变成 exports

我们可以自己手写一个简单的 require 验证下 Commonjs 的读取文件的一个整体的流程

```js
let path = require("path");
let fs = require("fs");
let vm = require("vm");

function Module(id) {
  this.id = id;
  this.exports = {};
}

Module.wrapper = [
  "(function(exports, module, require, __dirname, __filename) {",
  "})",
];

Module.cache = {};

Module.extNameList = {
  ".js": function (module) {
    let content = fs.readFileSync(module.id, "utf8");
    let fnStr = Module.wrapper[0] + content + Module.wrapper[1];
    let fn = vm.runInThisContext(fnStr);
    fn.call(module.exports, module.exports, module, req);
  },
  ".json": function (module) {
    let json = fs.readFileSync(module.id, "utf8");
    module.exports = json;
  },
};

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
      throw new Error("文件不存在");
    }
    let tempFilePath = absFilePath + extnameList[index++];
    try {
      fs.accessSync(tempFilePath);
      absFilePath = tempFilePath;
    } catch (e) {
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

let obj = req("./a.js");
console.log(obj);
```

通过上面我们自己写的简单的模拟 require 方法，我们知道了 exports 导出的内容是如何一步步转变问 require 接收到的内容的。
同时通过 `_extendsions` 的内部逻辑，可以看到 exports, module.exports 都指向同一个对象，这也就是为什么 exports 也能导出对象的原因了。但 exports 只能添加对象，如 `exports.test = test`, 如果直接赋值方法或者其他对象，指针发生变化，就无效了。



---
## express 机制 & 手写

了解 express 的基本用法后，结合前面学习的 nodejs 的知识，模仿 express 手写个最基本的山寨版 express.
这里没什么新东西要记在 readme.md 里面，都是前面知识点的整合和使用。

但是对于一些“巧妙”和灵光一闪的地方会记录下来，大概描述为什么这么想，如何想到这么想的。
后面大概率会忘记，记下来就能回头再看看。

在手动写之前，先回忆下 express 最基本的是使用是如何的：

- 执行 express() 用变量 app 接收返回值
- app 的方法中的回调函数涉及到请求和响应的都会比 nodejs 的 createStream 的回调函数多一个参数 next -> 用于将请求响应传递到下一个方法中去。
- app.get / post / put / delete 执行方法 参数第一个传递路由路径，第二个传递回调函数。

通过上面的简单描述，我们可以构思下如果要自己去写一个 express 需要怎么写：
要求如下：

- express 是一个函数，返回值是一个对象
- app.listen 用于开启监听端口的 server，实际上就是在 listen 函数内部调用了 http.createServe((req, resp) => { ... }).listen(port);
- 回调函数多一个 next 参数，就是在原生（req, resp） => { ... }外面包一层函数，或者改写原函数

```js
function express() {
  const server = http.createServer((req, resp) => {
    // ... ...
  });

  const app = {
    listen: function (port) {
      server.listen(port);
      if (typeof arguments[1] === "function") {
        arguments[1]();
      }
    },
  };
  return app;
}
```

像上面这样写完貌似要求中的 1 和 2 是可以了，但是继续写 get 等方法和实现和要求 3 时，会发现写不动了。 不知道从何下手。
问题在于 get、post 等方法都有（req, resp） => {} 回调函数，并且回调函数中的具体逻辑是客户那边定义的。
原生的 nodejs 的执行是在 http.createServer 的回调函数中执行的。- （触发条件客户端发送请求）

get 等方法中无法直接执行回调函数的逻辑，我们可以用一个变量，将数据都缓存起来，每次客户端请求过来的时候，在 nodejs 原生的回调中根据配置的路径和请求方法，从缓存的数据中找到要执行的函数去执行，这样就解决了上面遇到的问题。

```js
const server = http.createServer((req, resp) => {
    const { pathname } = url.parse(req.url, true);
    const reqMethod = req.method.toLowerCase();

    app.routes.forEach((routeItem) => {
        if (routeItem.path === pathname && routeItem.method = reqMethod) {
            routeItem.handle(req, resp);
        }
    });
});

const app = {
    routes = [];
    // ...
    get: function(path, callBackFn) {
        let obj = {
            path,
            method: 'get',
            handler: callBackFn
        }
        app.routes.push(obj);
    }
    // ...
}
```

后面的路会越来越难走~

另一个问题马上出来了，调用 handle 函数的时候，传的是 req 和 resp。 但是实际上 express 里面还带有 next, 一但在函数内调用 next(),就会携带 req, resp 信息进入下一个匹配的路由的逻辑中。
比如现在声明了

```js
app.get("/test", (req, resp, next) => {
  // ....
  next();
});

app.all("*", (req, resp, next) => {
  resp.end("end end");
});
```

这时候该怎么办呢？
想一想， 我们既然可以传两个参数（req, resp） 那么也可以传三个参数。 这个问题不好解决的点在于

- 如何判断用户调用了 next
- 如果确认了，那么在执行 next 之后，怎么确认下一个要执行的函数
  是的，我们如何知到使用者在使用过程中，什么时候调用了 next 函数。 我也想不出来，那就看看源码，或者在网上找找看吧。
  最后知道了一种很巧妙的方法，如果我们代码内部的逻辑执行的函数就叫 next, 如果使用者没有调用自己的 next 函数，就正常执行逻辑。否则就相当于又一次调用了内部的 next 函数。

```js
const server = http.createServer((req, resp) => {
  const { pathname } = url.parse(req.url, true);
  const reqMethod = req.method.toLowerCase();

  let index = 0;
  function next() {
    const routeItem = app.routes[i++];
    if ((routeItem.path === pathname && routeItem.method = reqMethod)) {
      // 匹配到正确的路径就执行回调函数，return的目的是在此结束，不继续执行后面的。
      // 如果回调函数内部执行了next, 就等于是递归执行了当前的next函数
      return routeItem.haneld(req, resp, next);
    }
    // 如果上面没有匹配到就继续递归执行next() 此时index已经 +1，能获取到下一个路径的配置信息
    next();
  }

  next();
});
```

主要的矛盾冲突解决了，后面就看 express 基本使用上有什么功能，动态向里面添加逻辑就行了。
但是在解决了主要矛盾后，还有一些次要矛盾来处理。

- 如何处理 url 中带有动态的字符串呢？
  在使用路由时我们处了可以写死 url 之外，还能使用带动态字符串的路由：比如：/test/:id， /test/:name/:seriesnum 等。
  如果是这种动态路由 我们在实际的浏览器上输入了 test/123 如何能匹配上 /test/:id 这个路由的回调方法呢。
  让我们仔细想想，在写逻辑实现时，当我们要实现“根据某种规则来匹配一些内容”时，除了自己根据这些规则来进行 if else 的一些判断之外，我们还可以使用什么处理这类问题呢？ - 答案就是正则表达式，它简单也更方便。
  所以我们先想办法让 routes 中的 path 是能有正则效果的字符串，这样在匹配浏览器中的 url 时不用 routeItem.path === pathname 这样的逻辑，而是 pathname.match(routeItem.path), 这样不管是动态还是非动态的路由都可以适用这种匹配。
  要想实现这样的效果关键的步骤如下：

```js
get: function(path, callBackFn) {
    let pathParams = [];
      if (path.includes(':')) {
        // [^ ]  - 否定的字符种类. 匹配除了方括号里的任意字符
        // 用正则表达式将匹配到的 : + 非/的任意长度的字符 将匹配到的转化为 非任意长度的字符
        path = path.replace(/:([^\/]*)/g, function () {
          pathParams.push(arguments[1]);
          return '([^\/]*)';
        });
        path = new RegExp(path + '(|\/)$');
        path.pathParams = pathParams;
      }
      app.routes.push({
        path,
        method,
        handler
      });
}
```

另外如果有一个中间件来被 use, 需要调用 app.use 方法，里面可以传两个参数 path 和 handle 的回调
注意 use 不仅仅可以用来添加中间件，还可以添加子路由，所以面对 use 的用法，我们编写简单的 use 逻辑如下：

```js
  use: function (path, handler) {
      // 如果有子路由， 处理子路由
      if (typeof handler === 'object' && typeof handler !== null) {
        handler.routes.forEach((item) => {
          item.path = path + item.path;
        });
        app.routes.push(...handler.routes);
        return;
      }
      // handle == null说明没写path, 只写了 handle作为唯一的入参
      if (handler == null) {
        handler = path;
        path = '/';
      }
      layer = {
        path,
        handler,
        method: 'middleware'
      };
      app.routes.push(layer);
    }
  };
```

## koa 机制 & 手写
洋葱模型 & 一起看看Koa源码吧

koa核心源码包含4个文件
- application.js
- context.js
- request.js
- response.js

可以先看看这个：如何从头实现一个node.js的koa框架 [https://www.jb51.net/article/163208.htm]

## ejs（html 模板）手写

