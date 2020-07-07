/**
 *   对server2.js进行进一步的代码优化
 */


let http = require('http');
let path = require('path');
let url = require('url');
let fs = require('fs');
let querystring = require('querystring');
// mime是第三方模块需要安装第三方依赖包，它能根据你的路径（后缀名）返回不同的数据格式
// .html -> text/html   .css -> test/css   .png -> image/png
let mime = require('mime');


class Server {
    start(host, port) {
        this.server.listen(port, host);
    }

    constructor() {
        this.server = this.handleRequest();
    }

    handleRequest() {
        return http.createServer((req, resp) => {
            let {
                pathname
            } = url.parse(req.url);
            let absPath = path.join(__dirname, pathname);

            fs.stat(absPath, (err, statObj) => {
                if (err) {
                    this.handleNoFile(resp);
                    return;
                }
                if (statObj.isFile()) {
                    this.handleStaticRequest(resp, absPath);
                } else {
                    let realPath = path.resolve(absPath, 'index.html');
                    fs.access(realPath, (error) => {
                        if (error) {
                            this.handleNoFile(resp);
                        }
                        this.handleStaticRequest(resp, realPath);
                    });
                }
            });
        })
    }

    handleStaticRequest(resp, absPath) {
        resp.setHeader('content-type', mime.getType(absPath) + ";charset=utf-8");
        fs.createReadStream(absPath).pipe(resp);
    }

    handleNoFile(resp) {
        resp.statusCode = 404;
        resp.end('Not Fount');
    }
}


let test = new Server();
test.start('localhost', 3003);
