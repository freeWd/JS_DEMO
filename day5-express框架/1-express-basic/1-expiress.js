// yarn add express 安装express

const express = require('express');
const bodyparser = require('body-parser');

let app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.get('/', (req, resp) => {
    resp.end('Home Page' + '---HOST:--' + req.host + '---PATH:---' + req.path);
});

app.get('/about', (req, resp) => {
    resp.setHeader('Content-Type', 'text/html; charset=utf-8');
    resp.write('欢迎来到关于我们');
    resp.write('下次再来');
    resp.end(new Buffer('hello world'));
});

app.get('/params/:id/:name', (req, resp) => {
    console.log(req.params.id);
    resp.send(req.params);
});

app.get('/params', (req, resp, next) => {
    console.log(req.query);
    // resp.send(req.query);
    next();
});

app.post('/post', (req, resp) => {
    console.log(req.body, '<----123');
    resp.send(req.body);
});

app.all('/params', (req, res) => {
    console.log('hell world');
    res.end('hello world');
});

// app.all('*', (req, resp) => {
//     resp.end('404');
// });

app.listen(3003);