//Example2: 同一个端口内的ws通信, 且有多个ws（url路径不同）

const Koa = require("koa");
const path = require("path");
const fs = require("fs");

const app = new Koa();

app.use(async (ctx, next) => {
  if (ctx.path === "/") {
    const content = fs.readFileSync(
      path.join(__dirname, "./client/index2.html")
    );
    ctx.type = "text/html; charset=utf-8";
    ctx.body = content;
  } else {
    ctx.body = "404";
  }
  await next()
});

const server = require("http").createServer(app.callback());
const WebSocket = require("ws");
const url = require("url");
const ws1 = new WebSocket.Server({ noServer: true });
const ws2 = new WebSocket.Server({ noServer: true });

ws1.on("connection", function connection(socket) {
  socket.on("message", function (message) {
    console.log("received: %s", message);
    socket.send("ws1:服务端回应：我已经接受到你发的消息了，消息是：" + message);
  });
});

ws2.on("connection", function connection(socket) {
  socket.on("message", function (message) {
    console.log("received: %s", message);
    socket.send("ws2:服务端回应：我已经接受到你发的消息了，消息是：" + message);
  });
});

// 每次服务器响应升级请求时发出 
// eg: 状态码：101
server.on("upgrade", function (request, socket, head) {
  const pathname = url.parse(request.url).pathname;

  if (pathname === "/ws1") {
    ws1.handleUpgrade(request, socket, head, function done(ws) {
      ws1.emit("connection", ws, request);
    });
  } else if (pathname === "/ws2") {
    ws2.handleUpgrade(request, socket, head, function done(ws) {
      ws2.emit("connection", ws, request);
    });
  }
});

server.listen(3003, () => {
    console.log('启动成功')
});
