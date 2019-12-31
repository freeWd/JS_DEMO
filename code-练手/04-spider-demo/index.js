const Koa = require("koa");
const cheerio = require("cheerio");
const request = require("request");

const app = new Koa();

app.use(async (ctx, next) => {
  if (ctx.request.path === "/hello") {
   const arr = await new Promise(resolve => {
      request("https://www.jikexueyuan.com/", function(error, response, body) {
        if (!error && response.statusCode === 200) {
          const $ = cheerio.load(body);
          const arr = [];
          $('.aside-cList > li > div > a').each(function() {
              console.log($(this).text());
              arr.push($(this).text());
          })
          resolve(arr);
        }
      });
    });
    
    ctx.response.body = arr;
  }
  await next();
});

app.listen(3000);
