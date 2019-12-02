let http = require('http');
let querystring = require('querystring');

let server = http.createServer((req, resp) => {
    console.log(req.url, req.method, req.headers['content-type']);

    let reqBody = [];
    req.on('data', function(data) {
        reqBody.push(data);
    })

    req.on('end', function() {
        let reqStr = Buffer.concat(reqBody).toString();
        console.log(reqStr);
        if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
            let obj = querystring.parse(reqStr);
            resp.setHeader('content-type', 'application/json;charset=urf-8');
            resp.end(JSON.stringify(obj));
        } else {
            resp.end('hello world');
        }
    })
});


server.listen(3003, 'localhost');