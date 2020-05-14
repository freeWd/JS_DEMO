const Mock_Api = {
  "/api/user": {
    name: "张三",
    age: 18,
  },
  "/api/list": [
    { id: "1", name: "香蕉" },
    { id: "2", name: "桔子" },
    { id: "3", name: "苹果" },
    { id: "4", name: "橘子" },
    { id: "5", name: "菠萝" },
    { id: "6", name: "橙子" },
    { id: "7", name: "西瓜" },
    { id: "8", name: "桃子" },
    { id: "9", name: "辣椒" },
  ],
};

function randomSleep() {
  const randomTime = Math.random() * 5 * 1000;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, randomTime);
  });
}

module.exports = async (ctx, next) => {
  const path = ctx.path;
  for (const apiKey in Mock_Api) {
    if (path === apiKey) {
      await randomSleep();
      console.log(Mock_Api[apiKey]);
      ctx.status = 200;
      ctx.body = Mock_Api[apiKey];
      return;
    }
  }
  ctx.throw(404, "Not-Found");
};
