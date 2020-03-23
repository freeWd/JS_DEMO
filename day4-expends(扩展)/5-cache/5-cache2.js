let http = require('http');
let fs = require('fs');
let url = require('url');
let path = require('path');
let crypto = require('crypto');


http.createServer((req, resp) => {
    let { pathname } = url.parse(req.url);
    let filePath = path.join(__dirname, pathname);
    console.log(filePath);
    fs.stat(filePath, (err, stats) => {
        if (err) {
            resp.statusCode = 404;
            resp.end('Not Found');
            return;
        } 
        if (stats.isFile()) {
            // Etag 实体内容 是根据文件内容，算出一个唯一的值  md5
            let md5 = crypto.createHash('md5');
            let rs = fs.createReadStream(filePath);
            let arr = [];
            rs.on('data', function(data) {
                md5.update(data);
                arr.push(data);
            });
            rs.on('end', function() {
                let etag = md5.digest('base64');
                if (req.headers['if-none-match'] === etag) {
                    resp.statusCode = 304;
                    resp.end();
                    return;
                }
                resp.setHeader('Etag', etag);
                resp.end(Buffer.concat(arr));
            });
        } else {
            resp.end('404');
        }
    });

}).listen(3003);