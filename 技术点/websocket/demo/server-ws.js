const WebSocket = require("ws");

const ws = new WebSocket.Server({ port: 3004 });

ws.on("connection", function (socket) {
  socket.on("message", function (message) {
    console.log("received: %s", message);
    socket.send('服务端回应：我已经接受到你发的消息了，消息是：' + message)
  });
});
