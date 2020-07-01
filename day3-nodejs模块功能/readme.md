> 古来豪杰，吾家祖父教人，以“懦弱无刚”四字为大耻，故男儿自立必须有倔强之气。 - 曾国藩

### buffer
```js
// 将16进制的buffer转化为字符串,node只支持utf8格式 默认值: 'utf8'。
console.log(buffer.toString()); // 测试
console.log(buffer.toString('base64')); // 5rWL6K+V
```


* 进制之间的相互转化
```js
// 2进制等... ==> 10进制
parseInt('111111', 2); // 将二进制111111 转化为10进制的int类型的数字

// 10进制、16进制 ===> 2进制等...
let num = 255;
let num2 = 0xff;
(num).toString(16); // 将10进制的255 转化为16进制的
字符串
(num2).toString(2); // 将16进制的255 转化为2进制的字符串
```

* base64的理解
它不是加密，仅仅是一种编码方式
一切能放置路径的地方，都可以使用base64编码，比如 img.src, background... 好处是不用发请求，如果资源过大base64编码的字符串会更大。

```js
// 看看base64的逻辑
// <Buffer e6 b5 8b>
let buffer = Buffer.from('测');

// 将buffer的16进制转化为2进制
(0xe6).toString(2); // 11100110
(0xb5).toString(2); // 10110101
(0x8b).toString(2); // 10001011

// e6 b5 8b = 11100110 10110101 10001011
// 将二进制的24位按每6个位一组来隔断
// 11100110 10110101 10001011 ==> 111001 101011 010110 001011
// 将隔断的前面补0，凑成8个一组 ===》 00111001 00101011 00010110 00001011

// 将新的二进制字节转化为10进制
parseInt("00111001", 2); // 57
parseInt("00101011", 2); // 43
parseInt("00010110", 2); // 22
parseInt("00001011", 2); // 11

let wifiCode = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"; // 一个有64个字符

// 根据获得的10进制数据选择字符
console.log("5rWL");
console.log(buffer.toString('base64'));
```

综上就是base64编码的过程，所以base64中的64指的就是4组每组6个
> 原来是3个字节，转化后变成4个字节，理论上比原来大1/3




```js
// 8-client.js
let http = require('http');

let client =http.request({
    hostname: 'localhost',
    port: 3003,
    path: '/xxx?a=3&b=4',
    method: 'post',
    headers: {
        'a': 1,
        'Content-Type': 'application/x-www-form-urlencoded'
    }
}, (response) => {
    response.on('data', function(data) {
        console.log(JSON.parse(data));
    })
});

client.end('name=123&pwd=234');

// 8-server.js
let http = require('http');
let path = require('path');
let url = require('url');
let fs = require('fs');
let querystring = require('querystring');
// mime是第三方模块需要安装第三方依赖包，它能根据你的路径（后缀名）返回不同的数据格式
// .html -> text/html   .css -> test/css   .png -> image/png
let mime = require('mime');

let server = http.createServer((req, resp) => {
    let { pathname } =  url.parse(req.url, true);
    let absPath = path.join(__dirname, pathname);

    fs.stat(absPath, (err, statObj) => {
        if (err) {
            resp.statusCode = 404;
            resp.end('Not Fount');
            return;
        }
        // 是一个文件
        if (statObj.isFile()) {
            // 根据路径的后缀名，给响应设置不同的content-type
            resp.setHeader('content-type', mime.getType(absPath)+";charset=utf-8");
            fs.createReadStream(absPath).pipe(resp);
        } else { // 是一个文件夹 就查找当前文件夹下的index.html
            let realPath = path.resolve(absPath, 'index.html');
            fs.access(realPath, (err) => {
                if (err) {
                    resp.statusCode = 404;
                    resp.end('Not Fount');
                    return;
                }
                resp.setHeader('content-type', mime.getType(absPath)+";charset=utf-8");
                fs.createReadStream(realPath).pipe(resp);
            });
        }
    });
});
```
通过上面的例子我们可以看到：
* 启动服务后，我们在页面输入url, 可以根据url中的文件路径，加载对应的静态资源 （html, css, png...）
* 我们用fs.stat 来判断是否存在路径资源以及是否为文件，通过fs.assess来判断是否是否存在该资源
* 如果是文件夹，默认访问文件夹下的index.html资源
* 通过mime来设置响应头中的content-type


下满我们简单的修改下例子，来看看一个既有静态资源又有ajax请求如何处理
```html
// index.html
 <h1>hello world</h1>
    <span id="test"></span>
    <script>
        let spanEle = document.querySelector('#test');
        let xhr = new XMLHttpRequest();
        // xhr.open('GET', 'http://localhost:3003/user/list', true);
        // xhr.onreadystatechange = function() {
        //     if (xhr.status === 200 && xhr.readyState === 4) {
        //         console.log(xhr.response);
        //         spanEle.textContent = JSON.stringify(xhr.response);
        //     }
        // }
        // xhr.send();

        // 1 跨域请求中如果我们使用了非简单的请求 put delete
        // 2 设置了自定义的请求头式
        // 满足以上两点会不定时向server发送一个option请求进行预检测
        xhr.open('PUT', 'http://localhost:3003/user/list', true);
        document.cookie = 'token=100'; // 默认跨域不支持cookie携带
        xhr.withCredentials = true;
        xhr.setRequestHeader('custom-test', 'hello');
        xhr.setRequestHeader('Content-Type', 'application/json');        
        xhr.onreadystatechange = function() {
            if (xhr.status === 200 && xhr.readyState === 4) {
                console.log(xhr.response);
                spanEle.textContent = JSON.stringify(xhr.response);
            }
        }
        xhr.send();
    </script>
```

```js
// server.js
let http = require('http');
let path = require('path');
let url = require('url');
let fs = require('fs');
let querystring = require('querystring');
let mime = require('mime');

let server = http.createServer((req, resp) => {
    let {
        pathname
    } = url.parse(req.url, true);
    let absPath = path.join(__dirname, pathname);
    let method = req.method.toLocaleLowerCase();

    resp.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    resp.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT, OPTIONS');
    resp.setHeader('Access-Control-Allow-Headers', 'Content-Type, custom-test', 'Cookie');
    resp.setHeader('Access-Control-Max-Age', 20); // 控制options方法定期发送时间
    resp.setHeader('Access-Control-Allow-Credentials', true); // 允许请求带上cookie，且要求origin头不能为 *

    console.log(req.headers['cookie'], '<----cookie');

    if (method === 'options') {
        resp.end();
    }

    switch (pathname) {
        case '/user/list':
            if (method === 'get' || method === 'put') {
                resp.end(JSON.stringify({
                    'test': 'hello world'
                }));
            } 
            break;
        default:
            break;
    }

    fs.stat(absPath, (err, statObj) => {
        if (err) {
            resp.statusCode = 404;
            resp.end('Not Fount');
            return;
        }
        // 是一个文件
        if (statObj.isFile()) {
            // 根据路径的后缀名，给响应设置不同的content-type
            resp.setHeader('content-type', mime.getType(absPath) + ";charset=utf-8");
            fs.createReadStream(absPath).pipe(resp);
        } else { // 是一个文件夹 就查找当前文件夹下的index.html
            let realPath = path.resolve(absPath, 'index.html');
            fs.access(realPath, (err) => {
                if (err) {
                    resp.statusCode = 404;
                    resp.end('Not Fount');
                    return;
                }
                resp.setHeader('content-type', mime.getType(realPath) + ";charset=utf-8");
                fs.createReadStream(realPath).pipe(resp);
            });
        }
    });
});

server.listen(3003, 'localhost');
```

当我们加载静态资源时（index.html），同时发送了ajax请求。
如何实现对这两种类型处理的server逻辑呢？
* 很简单：在上一个demo的基础上，判断静态资源路径之前调用switch 和 if方法，将异步请求的url列表和请求方法作为判断来进行简单的逻辑判断（这只是个demo，正常的开发是不会这样写的）
* 根据判断条件走不同的逻辑

如果server端口是3003，而静态资源（index.html）另起来一个端口打开(8080)，就相当于简单的模拟了前后端分离，此时index.html发送的请求就是跨域请求，面对跨域请求我们要设置若干响应头让请求正确的处理：
```js
//控制请求发送的 Origin - 相当于将此域名加入白名单。可以为*（通配符-表示运行所有域名跨域访问此server）
resp.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');

// 如果前端发送的请求不是简单请求，需要设置运行的方法白名单
resp.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT, OPTIONS');

// 如果请求中有自定义头，需要这只请求头白名单
resp.setHeader('Access-Control-Allow-Headers', 'Content-Type, custom-test', 'Cookie');

// 控制options方法定期发送时间 - 在异步请求是，某些情况下会不定期触发options方法 -  控制options方法定期发送时间
resp.setHeader('Access-Control-Max-Age', 20); 

// 允许请求带上cookie，且要求origin头不能为 *
resp.setHeader('Access-Control-Allow-Credentials', true); 
```


资源分享： [Nodejs入门](https://www.nodebeginner.org/index-zh-cn.html#javascript-and-nodejs) 
