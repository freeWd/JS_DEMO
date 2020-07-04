const superagent = require("superagent");
const cheerio = require("cheerio");
const debug = require("debug");
const CronJob = require("cron").CronJob;
const iconv = require("iconv-lite");
const nodemailer = require('nodemailer')

superagent.get("http://www.baidu.com").end((err, res) => {
  console.log(res.status);
});

superagent
  .get("http://top.baidu.com/buzz?b=26&c=1&fr=topcategory_c1")
  .responseType('blob')
  .then(res => {
    let body = iconv.decode(res.body, "gb2312");
    const $ = cheerio.load(body);
    const arr = [];
    $(".keyword .list-title").each((index, item) => {
      arr.push(item.children[0].data);
    });
    let value = arr[0]
    console.log(value, "<----");
  });

const str = '<h2 class="title">Hello world</h2>';
const $ = cheerio.load(str);
$("h2.title").text("hello world2");
$("h2").addClass("welcome");
console.log($.html());

// debug会先判断当前运行环境，查看环境变量中DEBUG的值，看是否和自己的名字匹配，如果匹配输出，反之不输出
// mac:
// ==> export DEBUG=app:*
// ==> node index.js
const log1 = debug("app:log1");
const log2 = debug("app:log2");

const obj = { a: 1, b: 2 };
for (let index = 0; index < 10; index++) {
  log1("hello %O world", obj);
  log2("hello2 %o world", obj);
}

var job = new CronJob("* * * * * *", function () {
  console.log("每秒执行一次");
});

job.start();

setTimeout(() => {
  job.stop();
}, 3000);


const transporter = nodemailer.createTransport({
    service: 'QQ',
    port: 456,
    secureConnection: true,
    auth: {
        user: '1348624126@qq.com',
        pass: 'hldvzhflmgjmgfej'
    }
})

const mailOption = {
    from: '"Fred Foo 👻" <1348624126@qq.com>',
    to: '1348624126@qq.com',
    subject: 'hello',
    html: '<h1>Hello world</h1>'
    // text: 'world'
}

transporter.sendMail(mailOption, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
});