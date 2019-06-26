const http = require('http');
const fs = require('fs');
const mime = require('mime');
const _path = require('path');
const url = require('url');
const methods = require('methods');


function express() {
  function reqAndResp(req, resp) {
    resp.send = send;
    let {
      pathname
    } = url.parse(req.url);
    let requestMethod = req.method.toLowerCase();

    let index = 0;

    function next() {
      if (index === app.routes.length) {
          // ...
      };

      let {
        path,
        method,
        handler
      } = app.routes[index++];

      if (method === 'middleware') {
        handler(req, resp, next);
      } else {
        if (path.pathParams) {
          let matches = pathname.match(path);
          if (matches) {
            let [, ...lists] = matches;
            req.params = path.pathParams.reduce(function (pre, next, i) {
              pre[next] = lists[i];
              return pre;
            }, {});
            return handler(req, resp, next);
          }
        }

        try {
          let absPath = _path.join(__dirname, pathname);
          let statObj = fs.statSync(absPath);
          if (statObj.isFile()) {
            handleStaticRequest(resp, absPath);
          } else {
            let realPath = path.resolve(absPath, 'index.html');
            fs.access(realPath, (error) => {
              if (error) {
                handleNoFile(resp);
              }
              handleStaticRequest(resp, realPath);
            });
          }
        } catch (error) {
          if ((path === pathname || path === '*') && (method === requestMethod || method === 'all')) {
            return handler(req, resp, next);
          }
          next();
        }
      }
    }
    next();
  }

  function send() {
    if (typeof arguments[0] === 'number') {
      this.statusCode = arguments[0];
      this.end(arguments[1] || 'Not Found');
    } else {
      // 简写 - 真实的是根据 send的内容的类型来动态设置类型
      this.setHeader('content-type', 'application/json;charset=utf-8');
      if (typeof arguments[0] === 'object') {
        this.end(JSON.stringify(arguments[0]));
      }
      this.end(arguments[0]);
    }
  }

  const app = {
    routes: [],

    listen: function (port) {
      const httpServer = http.createServer(reqAndResp);
      httpServer.listen(...arguments);
    },

    use: function (path, handler) {
      if (typeof handler === 'object' && typeof handler !== null) {
        handler.routes.forEach((item) => {
          item.path = path + item.path;
        });
        app.routes.push(...handler.routes);
        return;
      }
      if (handler == null) {
        handler = path;
        path = '/';
      }
      layer = {
        path,
        handler,
        method: 'middleware'
      };
      app.routes.push(layer);
    }
  };

  [...methods, 'all'].forEach((method) => {
    app[method] = function (path, handler) {
      let pathParams = [];
      if (path.includes(':')) {
        path = path.replace(/:([^\/]*)/g, function () {
          pathParams.push(arguments[1]);
          return '([^\/]*)';
        });
        path = new RegExp(path + '(|\/)$');
        path.pathParams = pathParams;
      }
      app.routes.push({
        path,
        method,
        handler
      });
    }
  });

  return app;
}

express.Router = function () {
  const subApp = express();
  return subApp;
}

function handleNoFile(res) {
  res.statusCode = 404;
  return res.end();
}

function handleStaticRequest(resp, absPath) {
  resp.setHeader('content-type', mime.getType(absPath) + ";charset=utf-8");
  fs.createReadStream(absPath).pipe(resp);
}



module.exports = express;