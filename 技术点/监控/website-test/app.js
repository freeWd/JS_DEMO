const path = require('path');
const koa = require('koa');
const static_ = require('koa-static');
const app = new koa();

const api = require('./middleware/api');

app.use(static_(path.resolve(__dirname, './client')));
app.use(api);

app.listen(3000);
