// 加密用的核心模块 crypto
let http = require('http');
let querystring = require('querystring');
let crypto = require('crypto');

// 加密 签名 cookie
function cryptSignCookie(value) {
    let key = 'a little salt';
    return value + crypto.createHmac('sha256', key).update(value).digest('base64');
} 

http.createServer((req, resp) => {
    const url = req.url;

    req.getCookie = function(key) {
        let cookieObj = querystring.parse(req.headers.cookie, '; ');
        if (key) {
            return cookieObj[key];
        }
        return cookieObj;
    }
    
    req.getCryptCookie = function(key) {
        let cookieObj = querystring.parse(req.headers.cookie, '; ');
        let [value, cryptValue] = cookieObj[key].split('.');
        if (cryptSignCookie(value) === cryptValue) {
            return value;
        } else {
            return 'cooke值疑似被篡改';
        }
    }

    let cookieArr = [];
    resp.setCookie = function(key, value) {
        cookieArr.push(`${key}=${value}`);
        resp.setHeader('Set-Cookie', cookieArr);
    }

    if (url === '/read') {
        resp.end(req.getCookie('token'));
    }

    if (url === '/read2') {
        resp.end(req.getCryptCookie('token'));
    }

    if (url === '/write') {
        let originValue = '12345';
        let cryptValue = cryptSignCookie(originValue);
        resp.setCookie('token', originValue + '.' + cryptValue);
        resp.end('write success');
    }
}).listen(3003);


