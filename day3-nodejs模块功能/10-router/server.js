const http = require("http");
const url = require("url");

const Router = require("./router");
const apiRoute = require('./api/api-route')
const staticRoute = require("./static/staitc-router");

const router = new Router();
router.use('/api', apiRoute);
router.use("/static", staticRoute);

const server = http.createServer((req, resp) => {
  let { pathname } = url.parse(req.url);

  if (pathname.indexOf("/api") === 0) {
  } else {
    pathname = "/static" + pathname;
  }

  router.handle(pathname, resp);
});

server.listen(3003);
