> 永远年轻，永远热泪盈眶

### buffer
buffer(缓冲器) -  Buffer 类是作为 Node.js API 的一部分引入的，用于在 TCP 流、文件系统操作、以及其他上下文中与八位字节流进行交互。

```js
// 将字符串转化为16进制
let buffer = Buffer.from('测试');

// 将16进制的buffer转化为字符串,node只支持utf8格式 默认值: 'utf8'。
console.log(buffer.toString());
console.log(buffer.toString('base64'));
```

* 编码的问题

1个字节 = 8位 （1 byte = 8bit）  
8位 （最大值 255）  
====> 2进制最大表示 ==11111111== ====> 255  
====> 8进制最大表示 ==377== =====> 255  
====> 16进制最大表示 ==ff== =====> 255  
如果是utf8编码的，一个字符 = 3个字节   
一个汉字 = 一个字符 = 3个字节 = 24位  


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

* buffer声明方式
```js
let buffer = Buffer.from('测试');
// <Buffer ff ff ff>
let buffer2 = Buffer.from([255, 255, 255]); 
// 开辟3个字节的存储空间 <Buffer 00 00 00>
let buffer2 = Buffer.alloc(3);
```
> buffer一但声明就不能增加长度，可以减少长度


* 常用的修改buffer长度的方法 copy + concat + split
```js
let buffer = Buffer.from('测试');
let b1 = Buffer.from('测');
let b2 = Buffer.from('试');
// 减少buffer长度
buffer.slice(0, 3);

// 增加buffer长度
// 1. copy  source.copy(target, targetStart, sourceStart, sourceEnd)
let big = Buffer.alloc(6);
b1.copy(big, 0, 0, 3);
b2.copy(big, 3, 0, 3);
console.log(big);

// 2. concat 常用
let big2 = Buffer.concat([b1, b2]);
console.log(big2);
```


### fs
fs - file system - 文件操作相关

常用的方法
```js
let fs = require('fs');
let path = require('path');
// 读取文件 - 读取文件可以使用绝对路径
let absPath = path.resolve(__dirname, './static/1.txt');
fs.readFile(absPath, (err, data) => {
    console.log(data);
});
const bufferData = fs.readFileSync(absPath);

// 写文件
// 路径如果为相对路径 就是以当前运行环境为路径标准
// 此文件存在就覆盖原来的内容，若不存在就新建文件
// data 只能为 string 或者 buffer
// 以回调的err来判断是否成功
fs.writeFile(absPath, 'hello world', (err) => {
    console.log(err);
});

// 文件的读写
fs.readFile(absPath, (err, data) => {
    fs.writeFile('./day3-nodejs模块功能/static/2.txt', data, (err) => {
        if(err) throw new Error('写入失败');
        console.log('写入成功');
    });
});

// 以上虽然可以实现文件的读写，但是fs.readFile() 函数会缓冲整个文件。 为了最小化内存成本，尽可能通过 fs.createReadStream() 进行流式传输。
// 流 - 边读边写 - 可以控制读取的速率 - 流是基于事件的
```


### EventEmitter
大多数 Node.js 核心 API 构建于惯用的异步事件驱动架构，其中某些类型的对象（又称触发器，Emitter）会触发命名事件来调用函数（又称监听器，Listener）
==类似于发布 订阅==
```js
class EventEmitter {
    constructor() {
        this._events = {};
    }
    on(key, fn) {
        if(this._events[key]) {
           this. _events[key].push(fn);
        } else {
           this. _events[key] = [fn];
        }
    }

    emit(key) {
        this._events[key].forEach(fnItem => {
            fnItem()
        });
    }

    off(key, fn) {
        this._event[key] = this._events[key].filter((fnItem) => fnItem != fn);
    }
}

const myEmitter = new EventEmitter();
// 添加 listener 函数到名为 eventName 的事件的监听器数组的末尾
myEmitter.on('a', function() {
    console.log('1');
});
myEmitter.on('a', function() {
    console.log('2');
});
// 从名为 a 的事件的监听器数组中移除指定的 listener(方法)。
myEmitter.off('a', function() {
    console.log('2');
});
// 触发事件 a
myEmitter.emit('a');
```


### stream
Node.js 中有四种基本的流类型：
* Readable - 可读取数据的流（例如 fs.createReadStream()）。
* Writable - 可写入数据的流（例如 fs.createWriteStream()）。
* Duplex - 可读又可写的流（例如 net.Socket）- 双工流。
* Transform - 在读写过程中可以修改或转换数据的 Duplex 流（例如 zlib.createDeflate()）。

**Readable**
```js
// 文件中为了能实现文件的操作，也提供了流相关的api
// highWaterMark 不设置，默认一次读取64k
let fs = require('fs');
let rs = fs.createReadStream(path.resolve(__dirname, './static/1.txt'), {
    flags: 'r', // r , w
    highWaterMark: 4, // 一次最多多多少个字节
    encoding: null,
    autoClose: true, // 读取完毕后，是否自动关闭
    start:0, // 从第几个字节开始读
    end: 5 // 读到第几个文件结束
});

// 默认流失暂停流，非流动模式，内部会监听你有没有监听 data 事件，rs.emit('data', 123)
let arr = [];
rs.on('data', function(chunk) {
    arr.push(chunk);
    rs.pause(); // 暂停读取
});
rs.on('end', function() {
    console.log(Buffer.concat(arr).toString()); // 读取完毕
});
setTimeout(() => {
    rs.resume(); // 恢复 data 事件的触发
}, 1000);

```


**Writable**
```js
let fs = require('fs');
let path = require('path');

// ws没有end属性
let ws = rs.createWriteStream(path.resolve(__dirname, './static/2.txt'), {
    flags: 'w',
    encoding: 'utf8',
    highWaterMark: 5,
    autoClose: true,
    start: 0
});

// chunk 参数 ‘123’ 必须是一个 string | buffer
let flag = ws.write('123' + '', function(err) {
    console.log('写入')
});

// 如果内部的缓冲小于创建流时配置的 highWaterMark，则返回 true 。 如果返回 false ，则应该停止向流写入数据，直到 'drain' 事件被触发。
// 当流还未被排空时，调用 write() 会缓冲 chunk，并返回 false。 一旦所有当前缓冲的数据块都被排空了（被操作系统接收并传输），则触发 'drain' 事件
ws.on('drain', function() {
    console.log('抽干');
})

// 当我写入完成后再继续写入其他的 on('drain')
ws.end('写入最后结束的语句');

// 此处抛异常，文件如果已经存在，内容被清空
ws.write('234'); // write after end 在调用end方法后写入是无效的，已经结束，无法再写入了。
```

**read + write**
```js
let fs = require('fs');
let path = require('path');

let rs = fs.createReadStream(path.resolve(__dirname, './static/1.txt'), {
    highWaterMark: 3
});

let ws = fs.createWriteStream(path.resolve(__dirname, './static/2.txt'), {
    highWaterMark: 1
});

rs.on('data', function(data) {
    let flag = ws.write(data);
    if (!flag) {
        rs.pause();
    }
});

ws.on('drain', function() {
    console.log('抽干');
    rs.resume();
});
```
上面这样边读边写能有效的减轻文件过大导致的读取压力。
但是每次都要写这么多是不是很麻烦，我们可以自己封装方法，让其更简单。

```js
function pipe(rs, ws) {
    rs.on('data', function(data) {
        let flag = ws.write(data);
        if (!flag) {
            rs.pause();
        }
    });

    ws.on('drain', function() {
        console.log('抽干');
        rs.resume();
    });
}

let fs = require('fs');
let path = require('path');

let rs = fs.createReadStream(path.resolve(__dirname, './static/1.txt'), {
    highWaterMark: 3
});

let ws = fs.createWriteStream(path.resolve(__dirname, './static/2.txt'), {
    highWaterMark: 1
});

pipe(rs, ws);

// 实际上，nodejs已经考虑到了
// 直接调用node api：rs.pipe(ws); // 把给读流导入到可写流中
```


==剩下的两种流后面再说，先看看另一个模块==


### http
客户端 服务端直接通过请求和响应来通信，http模块旨在支持传统上难以使用的协议的许多特性。 特别是，大块的、可能块编码的消息。 接口永远不会缓冲整个请求或响应，用户能够流式传输数据。

```js
let http = require('http');
let queryString = require('queryString');

// 创建服务端 需要提供一个监听函数，这个函数只在请求来到时触发
// 传统请求分为三部分： （响应也一样）
//  1) 请求行 ： 方法  路径  协议
//  2) 请求头
//  3) 请求体

// request 是 可读流  response 是 可写流

let http = require('http');
let querystring = require('querystring');

let server = http.createServer(function(req, res) {
    console.log('ok');
    console.log(req.method); // method后面的方法名是大写的
    console.log(req.url); // 获取一个完整链接端口号后面的内容，但是拿不到hash
    console.log(req.httpVersion);
    console.log(req.headers); // 所有的属性名都是小写的

    let arr = [];
    req.on('data', function(data) {
        arr.push(data);
    });
    req.on('end', function() { // 不管有没有请求体都会触发end事件
        let str = Buffer.concat(arr).toString();
        let obj = {};
        // 解析字符串 - 自己手写
        // str.replace(/([^=&]*)=([^=&]*)/g, function() {
        //     obj[arguments[1]] = arguments[2];
        // });

        // 解析字符串 - 调用方法
        obj = querystring.parse(str, "&", "=");
        res.statusCode = 404;
        res.setHeader('a','b');
        // 立刻把结果响应回去，因为res是write stream, end只能接受string和buffer，所以要用stringify
        res.end(JSON.stringify(obj)); 
    });
});

server.listen(3003, 'localhost');
```

上面实现了一个简单的服务端流程，主要用到了nodejs中http模块的内容。 需要注意的几个地方：
* http.createServer 用于创建服务端的http服务
* 创建的服务中的 request是一个 http.IncomingMessage 实例，它是可读流。 response 是一个 http.ServerResponse 实例，它是可写流。
* request 有自己内置的一些事件和属性，并通过监听 “data”, 获取请求body数据。 通过“end” 执行获取完整body后的操作
* response 也有自己的事件和属性，可以设置响应头，响应状态码和响应体，通过end函数发送response给客户端


下面我们来试着写一个完整的 http client 和 http server
在这个完整的http client 和 http server中，我们试图去构建路由和概念，已经针对不同请求做出的不同响应
> * 路由就是根据不同的path 返回不同的内容
一般服务端会处理两种不同类型的请求
1. 纯静态的，页面加载 - html/css
2. 动态数据 - ajax 获取

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
        xhr.se
        nd();
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
