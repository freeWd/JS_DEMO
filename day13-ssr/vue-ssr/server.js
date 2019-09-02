const Vue = require('vue');
const VueServerRender = require('vue-server-renderer');
const express = require('express');
const fs = require('fs');

let vm = new Vue({
    data: {
        msg: 'hello world'
    },
    template: ('<h1>{{msg}} 123</h1>')
});
let app = express();
app.listen(3000);

// --- 方法一 直接渲染
// let render = VueServerRender.createRenderer();
// app.get('/', (req, resp) => {
//     render.renderToString(vm, function(err, html) {
//         resp.send(`
//             <!DOCTYPE html>
//             <html lang="en">
//             <head>
//                 <meta charset="UTF-8">
//                 <meta name="viewport" content="width=device-width, initial-scale=1.0">
//                 <meta http-equiv="X-UA-Compatible" content="ie=edge">
//                 <title>Document</title>
//             </head>
//             <body>
//                 ${html}
//             </body>
//             </html>
//         `)
//     })
// });

// --- 方法二 模板渲染 - 需要在对应的html中要被替换内容的地方添加  <!---vue-ssr-outlet-->标记
let template = fs.readFileSync('index.html','utf8');
let render = VueServerRender.createRenderer(template);
app.get('/', (req, resp) => {
    render.renderToString(vm, function(err, html) {
        resp.send(html);
    })
});