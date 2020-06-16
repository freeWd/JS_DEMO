# WebSocket 教程

Http 请求只能有客服端发起，做不到服务端主动推送消息到客户端。

如果服务器有连续的状态变化，就需要双向通信

基于 Http 的双向通信的常用方法有三种

- 轮询（每隔一段时间就定时发送请求）

```js
// server.js
const Koa = require('koa');
const app = new Koa();
app.use(async function (ctx, next) {
    ctx.set('Access-Control-Allow-Origin', 'http://localhost:8000');
    ctx.body = new Date().toLocaleTimeString();
});
app.listen(8080);

// client.js
<script>
setTimeout(function () {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:8080', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            document.querySelector('#clock').innerHTML = xhr.responseText;
        }
    }
    xhr.send();
}, 1000);
</script>
```

- 长轮询 （长轮询是对轮询的改进版，客户端发送 HTTP 给服务器之后，看有没有新消息，如果没有新消息，就一直等待）

```js
<script>
    (function poll() {
            let xhr = new XMLHttpRequest();
            xhr.open('GET', 'http://localhost:8080', true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    document.querySelector('#clock').innerHTML = xhr.responseText;
                    poll();
                }
            }
            xhr.send();
    })();
</script>
```

- iframe 流 (通过在 HTML 页面里嵌入一个隐藏的 iframe,然后将这个 iframe 的 src 属性设为对一个长连接的请求,服务器端就能源源不断地往客户推送数据)

```js
// server.js
const express = require('express');
const app = express();
app.use(express.static(__dirname));
app.get('/clock', function (req, res) {
    setInterval(function () {
        res.write(`
            <script type="text/javascript">
                parent.document.getElementById('clock').innerHTML = "${new Date().toLocaleTimeString()}";
            </script>
        `);
    }, 1000);
});
app.listen(8080);

// client.js
<div id="clock"></div>
<iframe src="/clock" style=" display:none" />
```

Websocket 为双向交互而生，有以下特点：

- 数据格式比较轻量，性能开销小，通信高效
- 可以发送文本，也可以发送二进制数据
- 没有同源限制，客户端可以与任意服务器通信
- 协议标识符是 ws（如果加密，则为 wss），服务器网址就是 URL

### Websocket 客户端 API

- WebSocket 对象作为一个构造函数，用于新建 WebSocket 实例

  ```js
  var ws = new WebSocket("ws://localhost:8080");
  // 执行上面语句之后，客户端就会与服务器进行连接
  ```

- webSocket.readyState

  `readyState`属性返回实例对象的当前状态，共有四种。

  - CONNECTING：值为 0，表示正在连接。
  - OPEN：值为 1，表示连接成功，可以通信了。
  - CLOSING：值为 2，表示连接正在关闭。
  - CLOSED：值为 3，表示连接已经关闭，或者打开连接失败。

- webSocket.onopen

  实例对象的 onopen 属性，用于指定连接成功后的回调函数。

  ```js
  ws.onopen = function () {
    ws.send("Hello Server!");
  };

  // 如果要指定多个回调函数，可以使用addEventListener方法。
  ws.addEventListener("open", function (event) {
    ws.send("Hello Server!");
  });
  ```

- webSocket.onclose

  实例对象的 onclose 属性，用于指定连接关闭后的回调函数

  ```js
  ws.onclose = function (event) {
    var code = event.code;
    var reason = event.reason;
    var wasClean = event.wasClean;
    // handle close event
  };

  ws.addEventListener("close", function (event) {
    var code = event.code;
    var reason = event.reason;
    var wasClean = event.wasClean;
    // handle close event
  });
  ```

- webSocket.onmessage

  实例对象的 onmessage 属性，用于指定收到服务器数据后的回调函数

  ```js
  ws.onmessage = function (event) {
    var data = event.data;
    // 处理数据
  };

  ws.addEventListener("message", function (event) {
    var data = event.data;
    // 处理数据
  });
  ```

-  webSocket.send()

    实例对象的send()方法用于向服务器发送数据。

    ```js
    // 发送文本的例子
    ws.send('your message');

    // 发送 Blob 对象的例子
    var file = document
    .querySelector('input[type="file"]')
    .files[0];
    ws.send(file);

    // 发送 ArrayBuffer 对象的例子
    // Sending canvas ImageData as ArrayBuffer
    var img = canvas_context.getImageData(0, 0, 400, 320);
    var binary = new Uint8Array(img.data.length);
    for (var i = 0; i < img.data.length; i++) {
      binary[i] = img.data[i];
    }
    ws.send(binary.buffer);
    ```

- webSocket.bufferedAmount

  实例对象的bufferedAmount属性，表示还有多少字节的二进制数据没有发送出去。它可以用来判断发送是否结束
  ```js
  var data = new ArrayBuffer(10000000);
  socket.send(data);

  if (socket.bufferedAmount === 0) {
    // 发送完毕
  } else {
    // 发送还没结束
  }
  ```

- webSocket.onerror

  实例对象的onerror属性，用于指定报错时的回调函数
  ```js
  socket.onerror = function(event) {
    // handle error event
  };

  socket.addEventListener("error", function(event) {
    // handle error event
  });
  ```

#### 一个简单的网页脚本的例子：
```js
var ws = new WebSocket("wss://echo.websocket.org");

ws.onopen = function(evt) { 
  console.log("Connection open ..."); 
  ws.send("Hello WebSockets!");
};

ws.onmessage = function(evt) {
  console.log( "Received Message: " + evt.data);
  ws.close();
};

ws.onclose = function(evt) {
  console.log("Connection closed.");
};   
```


### Websocket 服务端
不同的后端语言具体的实现方式不同，就Node而言常用的有下面三种
- ws [https://www.npmjs.com/package/ws#api-docs]
- Socket.IO [http://socket.io/]
- WebSocket-Node [https://github.com/theturtle32/WebSocket-Node]

ws号称是最快，最轻量级的websocket实现库, Socket.IO跨端，大而全，非常的完整


### Webscoket请求信息分析
WebSocket复用了HTTP的握手通道。具体指的是，客户端通过HTTP请求与WebSocket服务端协商升级协议。协议升级完成后，后续的数据交换则遵照WebSocket的协议。

- 客户端：申请协议升级

  首先，客户端发起协议升级请求。可以看到，采用的是标准的HTTP报文格式，且只支持GET方法
  - Connection: Upgrade：表示要升级协议
  - Upgrade: websocket：表示要升级到websocket协议
  - Sec-WebSocket-Version: 13：表示websocket的版本
  - Sec-WebSocket-Key：与后面服务端响应首部的Sec-WebSocket-Accept是配套的，提供基本的防护，比如恶意的连接，或者无意的连接

```js
GET ws://localhost:8888/ HTTP/1.1
Host: localhost:8888
Connection: Upgrade
Upgrade: websocket
Sec-WebSocket-Version: 13
Sec-WebSocket-Key: IHfMdf8a0aQXbwQO1pkGdA==
```

- 服务端：响应协议升级

  服务端返回内容如下，状态代码101表示协议切换。到此完成协议升级，后续的数据交互都按照新的协议来。
  - Sec-WebSocket-Accept根据客户端请求首部的Sec-WebSocket-Key计算出来
  - Sec-WebSocket-Key主要目的并不是确保数据的安全性，因为Sec-WebSocket-Key、Sec-WebSocket-Accept的转换计算公式是公开的，而且非常简单，最主要的作用是预防一些常见的意外情况

```js
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: aWAY+V/uyz5ILZEoWuWdxjnlb7E=
```


socket.io写的聊天室（demo2-chat）一些代码记录：

- 服务端事件

事件名称 | 含义
-- | --
connection | 客户端成功连接到服务器
message | 接收到客户端发送的消息
disconnect | 客户端断开连接
error | 监听错误

- 客户端事件

事件名称 | 含义
-- | --
connect | 成功连接到服务器
message | 接收到服务器发送的消息
disconnect | 客户端断开连接
error | 监听错误

```js
// 划分命名空间，默认是 ‘/’, 不同空间内不能通信
io.on('connection', socket => {});
io.of('/news').on('connection', socket => {});

// 客户端连接命名空间
let socket = io('http://localhost/');
let socket = io('http://localhost/news');
```

- 可以把一个命名空间分成多个房间，一个客户端可以同时进入多个房间。
- 如果大大厅里广播 ，那么所有在大厅里的客户端和任何房间内的客户端都能收到消息
- 所有在房间里的广播和通信都不会影响到房间以外的客户端
```js
// 进入房间
socket.join('chat');//进入chat房间

// 离开房间
socket.leave('chat');//离开chat房间

// 全局广播
// ==> 向大厅和所有人房间内的人广播
io.emit('message','全局广播');

// ==> 向除了自己外的所有人广播 
socket.broadcast.emit('message', msg);
socket.broadcast.emit('message', msg);

// 房间内广播 
// 从服务器的角度来提交事件,提交者会包含在内
// ===> 向myRoom广播一个事件，在此房间内除了自己外的所有客户端都会收到消息
io.in('myRoom').emit('message', msg);
io.of('/news').in('myRoom').emit('message',msg);

// 从客户端的角度来提交事件,提交者会排除在外
// ===> 向myRoom广播一个事件，在此房间内除了自己外的所有客户端都会收到消息
socket.broadcast.to('myroom').emit('message', msg);
socket.broadcast.to('myroom').emit('message', msg);
```








