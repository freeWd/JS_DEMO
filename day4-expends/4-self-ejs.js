let ejs = require('ejs'); // 第三方模板库 - 需要单独下载
let fs = require('fs');
let path = require('path');
let http = require('http');


let obj = {
    name: '张三',
    age: 18,
    arr: [1, 2, 3, 4]
};

http.createServer((req, resp) => {
    let url = req.url;
    if (url === '/render/ejs') {
        let filePath = path.resolve(__dirname, './4-ejs-template.html');
        let str = fs.readFileSync(filePath, 'utf8');
        console.log(str);
        resp.end(ejs.render(str, obj));
    } else if (url === '/render/self-ejs') {
        let filePath = path.resolve(__dirname, './4-ejs-template.html');
        let str = fs.readFileSync(filePath, 'utf8');
        str = str.replace(/<%=([\s\S]*?)%>/g, function () {
            return '${' + arguments[1] + '}'
        });

        let head = 'let str;\r\nwith(obj) {\r\n'
        let tail = '`\r\n}\r\nreturn str;'
        head += 'str=`';
        let content = str.replace(/<%([\s\S]*?)%>/g, function() {
            console.log(arguments[1]);
            return '`\r\n' + arguments[1] + '\r\nstr +=`';
        });
        console.log('render --->', head + content + tail);
        let fn = new Function('obj', head + content + tail);
        resp.end(fn(obj));
    }
    resp.end('hello world');

}).listen(3003);
