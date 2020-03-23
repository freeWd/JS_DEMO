// 对设置cookie这块进行进一步的封装，使用起来更方便

let http = require("http");
let url = require("url");
let querystring = require("querystring");

let server = http.createServer((req, resp) => {
  let arr = [];
  resp.setCookie = function(key, value, options = {}) {
    let optionsArr = [];
    if (options.maxAge) {
      optionsArr.push(`Max-Age=${options.maxAge}`);
    }
    if (options.path) {
      optionsArr.push(`path=${options.path}`);
    }
    arr.push(`${key}=${value}; ` + optionsArr.join("; "));
    resp.setHeader("Set-Cookie", arr);
  };

  req.getCookie = function(key) {
    let cookies = querystring.parse(req.headers.cookie, "; ") || {};
    if (key) {
      return cookies[key];
    }
    return cookies;
  };

  let url = req.url;
  if (url === "/read") {
    let cookieObj = req.getCookie();
    resp.end(JSON.stringify(cookieObj));
  }
  if (url === "/read/2") {
    let tokenValue = req.getCookie("token");
    resp.end(tokenValue);
  }
  if (url === "/read2") {
    resp.end(resp.getCookie("token1"));
  }
  if (url === "/write") {
    resp.setCookie("token", "123", { maxAge: 1000 });
    resp.setCookie("token1", "1234", { path: "/read" });
    resp.end("write success");
  }
});

server.listen(3003);
