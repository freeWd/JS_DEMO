//Example1: 配合 server-ws.js 不同端口直接的ws通信

const Koa = require('koa')
const path = require('path')
const fs = require('fs')

const app = new Koa();

app.use(async (ctx, next) => {
    if (ctx.path === '/') {
        const content = fs.readFileSync(path.join(__dirname, './client/index.html'))
        ctx.type = 'text/html; charset=utf-8'
        ctx.body = content
    } else {
        ctx.body = '404'
    }
})


app.listen(3003, () => {
    console.log('启动成功')
})