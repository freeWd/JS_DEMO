// 此处只是demo，使用的静态资源文件也是 demo性质的 react的打包文件
// 仅仅通过此文件简单了解如何利用map文件，反编译js源码
// 这块自己跑一下就懂了，map数据来源于 website-test/client/react-app 专门用来进行sourcemap的测试

const Koa = require("koa");
const app = new Koa();
const port = 3009;
const fs = require("fs");
const path = require("path");
let sourceMap = require("source-map");

let sourcemapFilePath = path.join(__dirname, "./main.bundle.js.map");

let sourcesPathMap = {};
function fixPath(filepath) {
  return filepath.replace(/\.[\.\/]+/g, "");
}

app.use(async (ctx, next) => {
  if (ctx.path === "/sourcemap") {
    let sourceMapContent = fs.readFileSync(sourcemapFilePath, "utf-8");
    let fileObj = JSON.parse(sourceMapContent);
    let sources = fileObj.sources;

    sources.map((item) => {
      sourcesPathMap[fixPath(item)] = item;
    });


    // 这里是hardcode 的 mock数据，表示错误的代码的行和列，真实的这个错误信息可以通过 `src/errorCatch.js`来获取
    // 上面写死的 map文件也可以通过 `src/errorCatch.js`的source文件 + .map来动态获取
    let findPos = {
      line: 554,
      column: 17,
    };

    let consumer = await new sourceMap.SourceMapConsumer(sourceMapContent);
    let result = consumer.originalPositionFor(findPos);

    console.log(result, "xxx");

    // source line column name
    let originSource = sourcesPathMap[result.source];

    let sourcesContent = fileObj.sourcesContent[sources.indexOf(originSource)];
    let sourcesContentArr = sourcesContent.split("\n");
    let sourcesContentMap = {};

    sourcesContentArr.forEach((item, index) => {
      sourcesContentMap[index] = item;
    });

    result.sourcesContentMap = sourcesContentMap;

    ctx.body = result;
  }

  return next();
});

app.listen(port);
