const express = require('express');
const app = express();

const Vue = require('vue');
const fs = require('fs');
const path = require('path');
const VueServerRender = require('vue-server-renderer');


// let serverBundle = fs.readFileSync('./dist/server.bundle.js', 'utf-8');

// 采用json的方式
let serverBundle = require('./dist/vue-ssr-server-bundle.json');
let clientManifest = require('./dist/vue-ssr-client-manifest.json');

let template = fs.readFileSync('./dist/index-ssr.html', 'utf-8');
let render = VueServerRender.createBundleRenderer(serverBundle, {
  template,
  clientManifest
});


app.get('/', (req, resp) => {
  // 把渲染好的字符串传递给客户端，只是返回一个字符串，并没有vue的实际功能
  let context = {
    url: req.url
  };

  render.renderToString(context, (err, html) => {
    console.log('1----->', html);
    resp.send(html);
  });
});

// 顺序报在下面, 通过中间件设置路径，允许index-ssr.html加载client.js
app.use(express.static(path.resolve(__dirname, 'dist')));
app.use('/favicon.ico', (req, resp) => {
  resp.end();
});

// 如果访问的路径不存在，默认渲染index-ssr.html 并且把路由定向到当前请求的路径
app.get('*', (req, res) => {
  const context = {
    url: req.url
  }
  render.renderToString(context, (err, html) => {
    console.log('2----->', html);
    res.send(html);
  })
});

app.listen(3003);