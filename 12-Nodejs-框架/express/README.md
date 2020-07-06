### Express
基于 Node.js 平台，快速、开放、极简的 Web 开发框架,  它提供一系列强大的功能，比如：
* 模板解析
* 静态文件服务
* 中间件
* 路由控制

我们先来了解下express基本的使用，然后自己试着写代码，用原生的nodejs来试着模拟实现它,

```js
// express 基本路由，参数的获取。
const express = require('express');
const bodyparser = require('body-parser');

let app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.get('/about', (req, resp) => {
    resp.setHeader('Content-Type', 'text/html; charset=utf-8');
    resp.write('欢迎来到关于我们123');
    resp.end();
});

app.get('/params/:id/:name', (req, resp) => {
    console.log(req.params.id);
    resp.send(req.params);
});

app.get('/params', (req, resp) => {
    console.log(req.query);
    resp.send(req.query);
});

app.post('/post', (req, resp) => {
    console.log(req.body, '<----123');
    resp.send(req.body);
});

app.all('*', (req, resp) => {
    resp.end('404');
});

app.listen(3003);
```

上面是express最基本的应用，简单的路由功能，真的不同url和类型的请求做出不同的响应
* get请求可以直接获取到path参数和查询参数
* resp.write(),resp.end() 是nodejs原生的方法，只能放置 string 或者 buffer，（如果是其他数据类型就会报错）。write()用作响应结束。
* resp.send() 是express封装的方法，它比end更加“智能”，此方法为简单的非流式响应执行许多有用的任务：例如，它自动分配Content-Length HTTP响应头字段（除非先前已定义）并提供自动HEAD和HTTP缓存新鲜度支持。 参数可以是Buffer对象，String，对象或Array。
    * 当参数是Buffer对象时，该方法将Content-Type响应头字段设置为“application / octet-stream”，除非先前定义好响应头
    * 当参数是String时，该方法将Content-Type设置为“text / html”：
    * 如果参数是一个数组或对象，Express响应JSON表示
    * 当参数为一个Number时，并且没有上面提到的任何一条在响应体里，Express会帮你设置一个响应体，比如：200会返回字符"OK"
    ```
    res.send(200); // OK
    res.send(404); // Not Found
    res.send(500); // Internal Server Error
    ```
* express的all方法, 监听所有的请求方法，可以匹配所有的HTTP动词。根据请求路径来处理客户端发出的所有请求
第一个参数path为请求的路径
第二个参数为处理请求的回调函数


res.download(); // 提示要下载的文件。
res.end(); // 结束响应过程。
res.json(); // 发送JSON响应。!!
res.jsonp(); // 用JSONP支持发送JSON响应。
res.redirect(); // 重定向请求。!!
res.render(); // 呈现视图模板。!!
res.send(); // 发送各种类型的响应。!!
res.sendFile(); // 以八位字节流的形式发送文件。
res.sendStatus(); // 设置响应状态代码并将其字符串表示形式作为响应主体发送。



```js
// express 中间件。
const express = require('express');
let path = require('path');

const app = express();

app.use(express.static(__dirname));
app.use(express.static(__dirname + '/static'));
app.use('/page/static', express.static(__dirname));

app.use(function(req,res,next){
    console.log('中间件');
    next();
});
app.use('/static', function(req,res,next){
    console.log('带路径过滤的中间件');
    next();
});
app.use('/static2', function(req,res,next){
    console.log('带路径过滤的中间件2');
    next('stone is too big'); // next里面带参数就会抛异常
});

app.get('/redirect', (req, res) => {
    res.redirect('https://www.baidu.com');
});

app.get('/page/static', (req, res) => {
    let filePath = path.join(__dirname, '2-express.html')
    console.log(filePath);
    res.sendFile(filePath, function (err) {
        if (err) {
            next(err);
        } else {
            console.log('Sent:', '2-express.html');
        }
    });
});

app.listen(3003);
```
中间件就是处理HTTP请求的函数，用来完成各种特定的任务 比如检查用户是否登录、检测用户是否有权限访问等，它的特点是
* 一个中间件处理完请求和响应可以把相应数据再传递给下一个中间件
* 回调函数的next参数,表示接受其他中间件的调用，函数体中的next(),表示将请求数据传递给下一个中间件
* 还可以根据路径来区分进行返回执行不同的中间件
从上面的代码中，我们可以看到使用 ==app.use== 添加中间件，参数包括 “path”, "subApp (router)", "callBack方法"，
callBack方法中 （req, res, next）=> {} 包含next参数，可以通过调用next()在执行完当前中间件逻辑后将请求传给下一个中间件或路由


如果要在网页中加载静态文件（css、js、img），就需要另外指定一个存放静态文件的目录，当浏览器发出非HTML文件请求时，服务器端就会到这个目录下去寻找相关文件。
* express.static是 Express 内置的唯一一个中间件。是基于 serve-static 开发的，负责托管 Express 应用内的静态资源, 可以定义多个。表示定义静态资源的目录。
    ```js
    // 将根目录下的图片、CSS 文件、JavaScript 文件对外开放访问
    app.use(express.static(__dirname));
    // 将/static目录下的图片、CSS 文件、JavaScript 文件对外开放访问
    app.use(express.static(__dirname + '/static'));
    // 通过/page/static 前缀地址来访问根目录中的文件了。
    app.use('/page/static', express.static(__dirname));
    ```
* 除了Express内置的静态资源中间件，还有一些常用的第三方开发的中间件或者express团队维护（需要npm另安装）
    *  body-parser中间件。 body-parser是非常常用的一个express中间件，作用是对post请求的请求体进行解析。使用非常简单，以下两行代码已经覆盖了大部分的使用场景
    ```js
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    ```
    * cookie-parser中间件。
    解析Cookie标头并将值解析为一个对象（key是cookie的name）填充入req.cookies属性。
    或者，您可以通过传递一个秘密字符串来启用签名的cookie支持，该字符串分配req.secret，以便其他中间件可以使用它。
    ```js
    var express = require('express')
    var cookieParser = require('cookie-parser')

    var app = express()
    app.use(cookieParser())

    app.get('/', function (req, res) {
    // Cookies that have not been signed
    console.log('Cookies: ', req.cookies)

    // Cookies that have been signed
    console.log('Signed Cookies: ', req.signedCookies)
    })

    app.listen(8080)
    ```
    * express-session中间件
    * 更多中间件参考：http://www.expressjs.com.cn/resources/middleware.html
    ...



express的基本功能中除了上面的这些外还有路由和模板渲染功能
```js
// ---- express.js
//  路由  | 模板 
const express = require('express');
const path = require('path');
const router1 = require('./3-router1');
const router2 = require('./3-router2');


const app = express();
app.set('view engine','ejs');
app.set('views',__dirname);

app.use('/router1', router1);
app.use('/router2', router2);

app.get('/index', function (req,res) {
    // res.render('index.ejs',{title:'hello'});
    res.render('3-index',{title:'hello'},function(err,data){
        console.log(data);
        res.send(data);
    });
});

app.listen(3003);

// ---- router1.js
const express = require('express');
const router1 = express.Router();

router1.get('/test1', (req, resp) => {
    resp.send('router1 test1 page');
});
router1.route('/test2')
    .get((req, resp) => {
        resp.send('get router1 test2 page');
    })
    .post((req, resp) => {
        resp.send('post router1 test2 page');
    })
module.exports = router1;

// ---- router2.js
const express = require('express');
const router2 = express.Router();
router2.get('/test1', (req, resp) => {
    resp.send('router2 test1 page');
});
module.exports = router2;
```

在之前的使用中如果要匹配浏览器访问的链接是使用app.all / app.get / app.post / app.use等方法，这些方法的调用都是基于 app(express()返回值)，如果我们开发一个实际的应用，虽然这样写也能实现功能。但随着项目规模越来越大，维护起来也比较麻烦。这时候解耦和模块拆分是必然的。express已经给我们提供了Router()方法来支持模块的拆分。

* app.Router()  
使用express.Router类可以创建模块化，可安装的路由处理程序。 Router实例是一个完整的中间件和路由系统; 因此，它通常被称为“迷你app”。
上面的代码示例将路由器创建为模块，定义一些路由，并将路由器模块安装在主应用程序中的路径上。
在app目录中创建名为router1.js, router2.js的路由器文件，其中包含以下内容

* 如果我们使用restfulAPI风格的代码，或其他一些原因。导致 不同的api的url相同但请求方法不同，这是可以通过 
app[router].route(path).get((req, resp) => {}).post((req, resp) => {}) ... 来简化代码

* express支持使用模板 - 模板引擎使您可以在应用程序中使用静态模板文件。
在运行时，模板引擎用实际值替换模板文件中的变量，并将模板转换为发送到客户端的HTML文件。
这种方法可以更轻松地设计HTML页面。
    * 使用模板的关键代码：app.set('view engine','ejs'); app.set('views',__dirname);
      __dirname 此处是你静态文件的实际目录，ejs是你使用的模板引擎，常用的是（ejs, Pug, Mustache),也可以是html
    * 如何渲染？
    
    ```js
    // 调用render渲染模板，文件后缀名可以省略，回调可以不写
    // 如果指定了回调，则必须显式发送呈现的HTML字符串
    res.render('3-index',{title:'hello'},function(err,html){
        console.log(html);
        res.send(html);
    });
    ```


