let http = require('http');
let path = require('path');
let url = require('url');
let fs = require('fs');
let mime = require('mime');

let server = http.createServer((req, resp) => {
    let {
        pathname
    } = url.parse(req.url, true);
    let absPath = path.join(__dirname, pathname);
    let method = req.method.toLocaleLowerCase();

    resp.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    resp.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT, OPTIONS');
    resp.setHeader('Access-Control-Allow-Headers', 'Content-Type, custom-test', 'Cookie');
    resp.setHeader('Access-Control-Max-Age', 20); // 控制options方法定期发送时间
    resp.setHeader('Access-Control-Allow-Credentials', true); // 允许请求带上cookie，且要求origin头不能为 *

    console.log(req.headers['cookie'], '<----cookie');

    if (method === 'options') {
        resp.end();
    }

    switch (pathname) {
        case '/user/list':
            if (method === 'get' || method === 'put') {
                resp.end(JSON.stringify({
                    'test': 'hello world'
                }));
            } 
            break;
        default:
            break;
    }

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