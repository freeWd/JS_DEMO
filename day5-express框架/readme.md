### Express
基于 Node.js 平台，快速、开放、极简的 Web 开发框架,  它提供一系列强大的功能，比如：
* 模板解析
* 静态文件服务
* 中间件
* 路由控制

我们先来了解下express基本的使用，然后自己试着写代码，用原生的nodejs来试着模拟实现它,

```js
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




