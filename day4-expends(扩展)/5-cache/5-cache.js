let http = require('http');
let fs = require('fs');
let url = require('url');
let path = require('path');


http.createServer((req, resp) => {
    let { pathname } = url.parse(req.url);
    let filePath = path.join(__dirname, pathname);
    // 强制缓存10s,可能导致内容是旧的内容
    // resp.setHeader('Cache-Control', 'max-age=10');
    // 兼容低版本，要把下面的写上
    // resp.setHeader('Expires', new Date(Date.now() + 10000).toUTCString());
    fs.stat(filePath, (err, stats) => {
        if (err) {
            resp.statusCode = 404;
            resp.end('Not Found');
            return;
        } 
        if (stats.isFile()) {
            // 访问文件时，将所读到的文件被修改的时间记录下来，并设置到响应头中去
            let createTime = stats.ctime.toUTCString();
            resp.setHeader('Last-Modified', createTime);
            // if-modified-since 是浏览器自己携带的，只要我们设置过 Last-Modified，就会有这个字段
            // 当下一次请求头中的 if-modified-since 时间 与 访问文件的时间相等时，代表文件没有被更改，让浏览器去访问缓存
            if (req.headers['if-modified-since'] === createTime) {
                resp.statusCode = 304;
                resp.end();
                return;
            }
            fs.createReadStream(filePath).pipe(resp);
        }
    });

}).listen(3003);