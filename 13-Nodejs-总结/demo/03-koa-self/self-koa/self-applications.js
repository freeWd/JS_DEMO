const http = require("http");

class SelfApp {
  constructor() {
    this.middlewares = [];
    this.context = {};
  }

  use(fn) {
    this.middlewares.push(fn);
    return this;
  }

  createContext(req, resp) {
    this.context.request = req;
    this.context.response = resp;
  }

  callBackFn() {
    return (req, resp) => {
      this.createContext(req, resp);

      // 递归写法
      // this.handleMiddleEvent()

      // 非递归的写法
      let respond = () => this.repondseBody(this.context);
      let onerror = (err) => this.onerror(err, this.context);
      return compose().then(respond).catch(onerror);
    };
  }

  handleMiddleEvent() {
    let index = 0;
    const executeEvent = () => {
      if (index < this.middlewares.length) {
        let next = () => {
          index++;
          return executeEvent(index);
        };
        return this.middlewares[index](this.context, next);
      }
    };
    executeEvent().then(() => {
      repondseBody(this.context);
    });
  }

  compose() {
    return async () => {
      function createNext(middlewareEvent, oldNext) {
        return async () => {
          await middlewareEvent(this.context, oldNext);
        };
      }
      let next = async () => {
        return Promise.resolve();
      };
      for (let index = 0; index < this.middlewares.length; index++) {
        const middleItem = this.middlewares[index];
        next = createNext(middleItem, next);
      }
      await next();
    };
  }

  repondseBody(ctx) {
    let content = ctx.body;
    if (typeof content === "string") {
      ctx.response.end(content);
    } else if (typeof content === "object") {
      ctx.response.end(JSON.stringify(content));
    }
  }

  onerror(err, ctx) {
    if (err.code === "ENOENT") {
      ctx.response.status = 404;
    } else {
      ctx.response.status = 500;
    }
    let msg = err.message || "服务器错误❎";
    ctx.response.end(msg);
    // this.emit("error", err);
  }

  listen(...args) {
    const server = http.createServer(this.callBackFn());
    server.listen(...args);
  }
}

module.exports = SelfApp;
