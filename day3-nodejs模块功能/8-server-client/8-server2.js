let http = require('http');
let path = require('path');
let url = require('url');
let fs = require('fs');
let querystring = require('querystring');
// mime是第三方模块需要安装第三方依赖包，它能根据你的路径（后缀名）返回不同的数据格式
// .html -> text/html   .css -> test/css   .png -> image/png
let mime = require('mime');

let server = http.createServer((req, resp) => {
    /**
     *> url.parse("http://localhost/test/1.html?a=2&c=3");
        Url {
        protocol: 'http:',
        slashes: true,
        auth: null,
        host: 'localhost',
        port: null,
        hostname: 'localhost',
        hash: null,
        search: '?a=2&c=3',
        query: 'a=2&c=3',
        pathname: '/test/1.html',
        path: '/test/1.html?a=2&c=3',
        href: 'http://localhost/test/1.html?a=2&c=3' } 
     */
    let {
        pathname
    } = url.parse(req.url, true);
    let absPath = path.join(__dirname, pathname);


    fs.stat(absPath, (err, statObj) => {
        if (err) {
            resp.statusCode = 404;
            resp.end('Not Fount');
            return;
        }
        // 是一个文件
        if (statObj.isFile()) {
            // 根据路径的后缀名，给响应设置不同的content-type
            resp.setHeader('content-type', mime.getType(absPath) + ";charset=utf-8");
            fs.createReadStream(absPath).pipe(resp);
        } else { // 是一个文件夹 就查找当前文件夹下的index.html
            let realPath = path.resolve(absPath, 'index.html');
            fs.access(realPath, (err) => {
                if (err) {
                    resp.statusCode = 404;
                    resp.end('Not Fount');
                    return;
                }
                resp.setHeader('content-type', mime.getType(realPath) + ";charset=utf-8");
                fs.createReadStream(realPath).pipe(resp);
            });
        }
    });
});




server.listen(3003, 'localhost');







