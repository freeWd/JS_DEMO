const Koa = require("koa");
const koaStatic = require("koa-static");
const path = require("path");

const app = new Koa();
app.use(koaStatic(path.join(__dirname, "./client")));

const http = require("http").createServer(app.callback());
const io = require("socket.io")(http);

const userSockets = {};

io.on("connection", (socket) => {
  // socket.io 虽然客户端使用的是同一套后端代码，但是每次只需connection，会根据不同的客户端生成不同的实例
  // 所以两个不同的浏览器中，rooms和userName是相互独立的
  // 如果客户端监听message，而不是receiveClient，则可以直接使用socket.send(msg)
  const rooms = [];
  let userName;

  socket.on("join", (roomName) => {
    if (rooms.indexOf(roomName) === -1) {
      rooms.push(roomName);
      socket.join(roomName);
      socket.emit("message", {
        userName: "系统",
        content: "你已经进入房间:" + roomName,
        create: new Date(),
      });
    }
  });

  socket.on("leave", (roomName) => {
    const index = rooms.indexOf(roomName);
    if (index !== -1) {
      rooms.splice(index, 1);
      socket.leave(roomName);
      socket.emit("message", {
        userName: "系统",
        content: "你已经离开房间:" + roomName,
        create: new Date(),
      });
    }
  });

  socket.on("getRoomInfo", (roomName) => {
    console.log(io);
  });

  socket.on("connection", (message) => {
    if (userName) {
      console.log(rooms, '<---rooms')
      if (rooms.length > 0) {
        // 判断是私聊还是公聊，私聊需要: @用户 内容
        let result = message.match(/@([^ ]+) (.+)/);
        rooms.forEach((roomItem) => {
          if (result) {
            let toUser = result[1];
            let content = result[2];
            userSockets[toUser].emit("message", {
              userName,
              content,
              create: new Date(),
            });
          } else {
            io.in(roomItem).emit("message", {
              userName,
              content: message,
              create: new Date(),
            });
          }
        });
      } else {
        //如果此用户不在任何一个房间内的话需要全局广播
        //同样判断是私聊还是公聊
        let result = message.match(/@([^ ]+) (.+)/);
        if (result) {
          let toUser = result[1];
          let content = result[2];
          userSockets[toUser].emit("message", {
            userName,
            content,
            create: new Date(),
          });
        } else {
          io.in(roomItem).emit("message", {
            userName,
            content: message,
            create: new Date(),
          });
        }
      }
    } else {
      // //如果用户名还没有设置过，那说明这是这个用户的第一次发言
      userName = message;
      userSockets[userName] = socket;
      socket.broadcast.emit("message", {
        userName: "系统",
        content: `${userName} 加入了聊天`,
        create: new Date(),
      });
    }
  });
});

http.listen(3003, () => {
  console.log("启动成功");
});

// io.emit('message', msg)  发给所有监听message事件的人
// socket.broadcast.emit('message', msg) 发给不包括自己的所有监听message事件的人
