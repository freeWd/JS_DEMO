let http = require('http');
let url = require('url');
let querystring = require('querystring'); 

// mock : post http://localhost:3003/xx  body: a=1&b=2
let server = http.createServer(function(req, res) {
    console.log('ok');
    console.log(req.method); // method后面的方法名是大写的
    console.log(req.url); // 获取一个完整链接端口号后面的内容，但是拿不到hash
    console.log(req.httpVersion);
    console.log(req.headers); // 所有的属性名都是小写的

    let arr = [];
    req.on('data', function(data) {
        arr.push(data);
    });
    req.on('end', function() { // 不管有没有请求体都会触发end事件
        let str = Buffer.concat(arr).toString();
        let obj = {};
        // 解析字符串 - 自己手写
        // str.replace(/([^=&]*)=([^=&]*)/g, function() {
        //     obj[arguments[1]] = arguments[2];
        // });

        // 解析字符串 - 调用方法
        obj = querystring.parse(str, "&", "=");
        res.statusCode = 404;
        res.setHeader('a','b');
        // 立刻把结果响应回去，因为res是write stream, end只能接受string和buffer，所以要用stringify
        res.end(JSON.stringify(obj)); 
    });
});

server.listen(3003, 'localhost');






