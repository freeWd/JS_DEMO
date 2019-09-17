const express = require('express');
const Vue = require('vue');
const fs = require('fs');
const path = require('path');
const VueServerRender = require('vue-server-renderer');
const createApp = require('./dist/server.bundle.js');


const app = express();

let serverBundle = fs.readFileSync('./dist/server.bundle.js', 'utf-8');
let template = fs.readFileSync('./dist/index-ssr.html', 'utf-8');
let render = VueServerRender.createBundleRenderer(serverBundle, {
  template
});
app.get('/', (req, resp) => {
  // 把渲染好的字符串传递给客户端，只是返回一个字符串，并没有vue的实际功能
  let context = {
    url: req.url
  };

  render.renderToString(context, (err, html) => {
    resp.send(html);
  });
});

// 顺序报在下面, 通过中间件设置路径，允许index-ssr.html加载client.js
app.use(express.static(path.resolve(__dirname, 'dist')));

// 如果访问的路径不存在，默认渲染index-ssr.html 并且把路由定向到当前请求的路径
app.get('*', (req, resp) => {
  let context = {
    url: req.url
  };

  render.renderToString(context, (err, html) => {
    console.log(html);
    resp.send(html);
  }); 
});

app.listen(3003);