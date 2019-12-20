const superagent = require('supertest');
const app = require('./service');

function request() {
    return superagent(app.listen());
}

describe("Node 接口测试", function() {
  it("/test 接口测试", function(done) {
    // 后台是nodejs
    request().get("/test").expect(200).expect('Content-Type', /html/).end(function(err, res) {
        if (err) {
            done(err);
        }
        console.log(res.text);
        if (res.text == 'hello world') {
            done();
        } else {
            done(new Error('接口数据异常'))
        }
    })

    // 后台用其他语言
    // fetch('localhost:3000/test').then(function(res) {
    //     if (res.text == 'hello world') {
    //         done();
    //     } else {
    //         done(new Error('接口数据异常'))
    //     }
    // }, (err) => {
    //     done(err);
    // })
  });
});
