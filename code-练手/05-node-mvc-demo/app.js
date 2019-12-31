const Koa = require("koa");
const co = require("co");
const koaBody = require('koa-body');
const render = require("koa-swig");
const serve = require('koa-static');
const log4js = require('log4js');
const errorHandle = require("./middleware/errorHandle");
const router = require("./controllers");
const config = require("./config");

const app = new Koa();
app.use(koaBody());

// Log & error Handle 
log4js.configure({
  appenders: { cheese: { type: 'file', filename: config.logDir } },
  categories: { default: { appenders: ['cheese'], level: 'error' } }
});
const logger = log4js.getLogger('cheese');
errorHandle.error(app, logger);

// Html Template Config
app.use(serve(config.staticDir));
app.use(serve(config.mockDir));
app.context.render = co.wrap(
  render({
    root: config.viewDir,
    autoescape: true,
    cache: process.env.NODE_ENV === 'dev' ? false : 'memory',
    ext: "html",
    writeBody: false,
    // 避免和vue的{{}}表达式起冲突
    varControls: ["[[", "]]"]
  })
);

app.use(router.routes()).use(router.allowedMethods());

app.listen(config.port, () => {
  console.log("启动成功");
});
