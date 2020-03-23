let http = require('http');
let path = require('path');
let url = require('url');
let fs = require('fs');
let querystring = require('querystring');

let server = http.createServer((req, resp) => {
    let url = req.url;
    if (url === '/index') {
        const filePath = path.resolve(__dirname, "./1-cookie.html");
        fs.stat(filePath, (error, stateObj) => {
            if (error) {
                resp.state = 404;
                resp.end('Not Found')
                return;
            } 
            if (stateObj.isFile()) {
                resp.setHeader('content-type', "text/html;charset=utf-8");
                fs.createReadStream(filePath).pipe(resp);
            }
        })
    }
    if (url === '/read') {
        let cookieObj = querystring.parse(req.headers.cookie, '; ');
        resp.end(JSON.stringify(cookieObj));
    } 
    if (url === '/read/2') {
        let cookieObj = querystring.parse(req.headers.cookie, '; ');
        resp.end(JSON.stringify(cookieObj));
    } 
    if (url === '/read2') {
        let cookieObj = querystring.parse(req.headers.cookie, '; ');
        resp.end(JSON.stringify(cookieObj));
    } 
    if (url === '/write') {
        // 如果原来已经有多个cookie，那么新设置的cookie的key如果和之前的某个相同，就替换其值，其他cookie任然不变

        // 设置单个Cookie
        // resp.setHeader('Set-Cookie', 'token=21345');

        // 设置多个Cookie
        // resp.setHeader('Set-Cookie', ['token=21345', 'token2=23412']);

        // 添加domain属性 设置domain后，只有符合当前设置的domain的url才能携带cookie request 到server
        // resp.setHeader('Set-Cookie', 'token=21345; domain=a.test.cn');
        // resp.setHeader('Set-Cookie', 'token=21345; domain=.test.cn');

        // 设置path属性后，符合当前path的url才能读取读取此cookie, 此时 /read /read/2 请求Cookie中会携带token, 其他请求只会携带token2
        // 所以 /read /read/2能读到两个值，/read2只能读到一个值
        // resp.setHeader('Set-Cookie', ['token=123; path=/read', 'token2=1234']);
        

        // expires 绝对时间 / max-age 相对时间
        // resp.setHeader('Set-Cookie', ['token=123; max-age=10', 'token2=234; expires=' + new Date(Date.now() + 10000).toUTCString()]);

        // httponly - 设置完成后， document.cookie 获取到的是空字符串
        resp.setHeader('Set-Cookie', 'toekn=123; httponly=true');
        resp.end('write success');
    }
});

server.listen(3003);


