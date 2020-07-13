// let ejs = require('ejs'); // 第三方模板库 - 需要单独下载
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
        let filePath = path.resolve(__dirname, './04-ejs-template.html');
        let str = fs.readFileSync(filePath, 'utf8');
        console.log(str);
        resp.end(ejs.render(str, obj));
    } else if (url === '/render/self-ejs') {
        let filePath = path.resolve(__dirname, './04-ejs-template.html');
        let str = fs.readFileSync(filePath, 'utf8');
        str = str.replace(/<%=([\s\S]*?)%>/g, function () {
            return '${' + arguments[1] + '}'
        });

        /**
         * with 是 js内置功能  - 扩展一个语句的作用域链
         * 能直接执行
         * eg: with内直接用PI，cos等，因为Math被指定为默认对象了
         * with (Math) {
         *   a = PI * r * r;
         *   x = r * cos(PI);
         *   y = r * sin(PI / 2);
         *  }
         * 
         * 如果不用with，可以将变量替换成 this.name 这样，然后 .apply(obj)也可以
         */


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
