const koa = require('./self-koa/self-applications')
// const koa = require('koa');


const app = new koa();
app.use(async (ctx, next) => {
    console.log('123')
    await next();
})

app.use(async (ctx, next) => {
    console.log('456')
    await next();
})

app.use(async (ctx, next) => {
    ctx.response.status = 200
    ctx.response.body = 'hi, koa'
})

app.listen(3003)
