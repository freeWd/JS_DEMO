const superagent = require("supertest");
const app = require("../../app");

function request() {
  return superagent(app.listen(3003));
}

describe("Node 接口测试", function() {
  it("/home接口测试", function(done) {
    request()
      .get("/home")
      .expect(200)
      .expect("Content-Type", /html/)
      .end(function(err, res) {
        if (err) {
          done(err);
        }
        done();
      });
  });
});
