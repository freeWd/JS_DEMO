// ====> Self Code
const http = require("http");

const MethodList = ["get", "post", "put", "delete"];

function selfExpress() {
  const app = initAppObj();
  return app;

  function initAppObj() {
    let app = {};
    app.acrossRouteList = [];
    MethodList.forEach((method) => {
      app[method] = function (path, callBackFn) {
        const pathParams = [];
        if (path.includes(":")) {
          path.replace(/:([^\/]+)/g, function () {
            pathParams.push(arguments[1]);
            return "[^/]+";
          });
        }
        path = new RegExp(path);
        this.acrossRouteList.push({
          path,
          method,
          pathParams,
          fn: callBackFn,
        });
      };
    });
    app.use = function (path, callBackFn) {
      if (typeof path === "function") {
        callBackFn = path;
        path = null;
      }
      if (path && path.includes(":")) {
        path.replace(/:([^\/]+)/g, function () {
          pathParams.push(arguments[1]);
          return "[^/]+";
        });
        path = new RegExp(path);
      }
      if (typeof callBackFn === 'function') {
        this.acrossRouteList.push({
          path,
          method: "middleware",
          fn: callBackFn,
        });
      } else if (callBackFn instanceof Object) { // 说明此时中间件插入的是路由模块
        callBackFn.acrossRouteList.forEach(item => {
          item.path = path + item.path;
        })
        app.acrossRouteList.push(...callBackFn.acrossRouteList)
      }
    };
    app.listen = function (port, callBackFn) {
      const server = http.createServer(executeHttp);
      server.listen(port, callBackFn);
    };
    return app;

    // private methods
    function executeHttp(req, resp) {
      // 扩展http传统的resp对象
      resp = expendResp(resp);

      // 按顺序执行路由列表
      const url = req.url;
      const method = req.method.toLowerCase();
      let index = 0;
      execute();

      function execute() {
        const routeItem = app.acrossRouteList[index];
        if (!routeItem.path || routeItem.path.test(url)) {
          if (routeItem.path && routeItem.pathParams.length > 0) {
            const [, ...list] = url.parse(url.match(routeItem.path))
            routeItem.pathParams.forEach((pathItem, index) => {
              req.params[pathItem] = list[index]
            })
          }

          if (routeItem.method === "middleware") {
            routeItem.fn(req, resp, next);
          } else if (routeItem.method === method) {
            routeItem.fn(req, resp);
            next();
          } else {
            resp.statusCode = 404;
            resp.end();
          }
        }
      }

      function next() {
        if (++index < app.acrossRouteList.length) {
          execute();
        } else {
          resp.end()
        }
      }
    }

    function expendResp(resp) {
      /**
       * 扩展 resp.send, resp.redirect, resp.jsonp.... 等方法
       * 这里作为demo， 仅仅扩展json函数
       */
      resp.json = function (content) {
        resp.setHeader("content-type", "application/json; charset=utf-8");
        resp.end(content);
      };
      return resp;
    }
  }
}

// ====> Test Code
const app = selfExpress();


app.use((req, resp, next) => {
  req.demo = { test: '123' }
  next()
})

app.get('/test', (req, resp) => {
  resp.json(JSON.stringify(req.demo))
})

app.listen(3000, function() {
  console.log('启动成功')
})
