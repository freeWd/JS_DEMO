class Router {
  constructor() {
    this.pathHandle = {};
  }

  use(path, routerFn) {
    this.pathHandle[path] = routerFn;
  }

  handle(pathname, resp) {
    let path = (pathname + '/').match(/^\/[^\/]+/)[0]
    this.pathHandle[path](pathname, resp)
  }
}


module.exports = Router



