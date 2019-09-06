const express = require('express');
const Vue = require('vue');
const fs = require('fs');
const path = require('path');
const VueServerRender = require('vue-server-renderer');

const app = express();

let serverBundle = fs.readFileSync('./dist/server.bundle.js', 'utf-8');
let template = fs.readFileSync('./dist/index-ssr.html', 'utf-8');
let render = VueServerRender.createBundleRenderer(serverBundle, {
    template
});
app.get('/', (req, resp) => {
    // 把渲染好的字符串传递给客户端，只是返回一个字符串，并没有vue的实际功能
    render.renderToString((err, html) => {
        resp.send(html);
    });
})

// 顺序报在下面
app.use(express.static(path.resolve(__dirname, 'dist'))); 

app.listen(3003);