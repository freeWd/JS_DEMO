// ====> self code
const http = require("http");

class SelfKoa {
  constructor() {
    this.asyncFn = [];
  }

  use(handle) {
    this.asyncFn.push(handle);
    return this;
  }

  listen(port, callBackFn) {
    const app = http.createServer(execute.bind(this));
    app.listen(port, callBackFn);

    function execute(req, resp) {
      let index = 0;
      let that = this;
      const context = initCtx(req, resp);

      executeMiddle(context).then(() => {
        context.response.end(JSON.stringify(context.response.body));
      });

      async function executeMiddle(context) {
        async function next() {
          if (++index < that.asyncFn.length) {
            await that.asyncFn[index](context, next);
          }
        }

        await that.asyncFn[index](context, next);
      }

      function initCtx(req, resp) {
        // 初始化上下文属性和方法，这里因为是demo，所以是超级简写，实际上复杂的多
        const ctx = {};
        ctx.request = req;
        ctx.response = resp;
        return ctx;
      }
    }
  }
}

// === use demo

const app = new SelfKoa();

app.use(async (ctx, next) => {
  ctx.request.demo = { test: "123" };
  console.log("async ===> 1");
  await next();
  console.log("async ===> 1.1");
});

app.use(async (ctx, next) => {
  console.log("async ===> 2");
  ctx.response.body = ctx.request.demo;
  console.log("async ===> 2.2");
});

app.listen(3000, () => {
  console.log("启动成功, '<----'");
});
