const express = require("express");
const tagMapple = require("../sql/tag");
const articleMapple = require("../sql/article");

const { spawn } = require("child_process");
const CronJob = require("cron").CronJob;
const path = require("path");

const app = express();

app.use(express.static(__dirname + "/views"));

app.get("/", (req, res) => {
  res.redirect("/index/index.html");
});

const apiRouter = express.Router();
apiRouter
  .get("/getTagList", async (req, res) => {
    const tagList = await tagMapple.getTagList();
    res.json(tagList);
  })
  .get("/getArticleList", async (req, res) => {
    const { pageIndex, pageSize } = req.query;
    const { data, total } = await articleMapple.getArticleList(
      pageIndex,
      pageSize
    );
    data.forEach((ele) => {
      ele.tags = ele.tags.split(",");
    });
    res.json({
      total,
      data,
    });
  })
  .get("/getArticleContent", async (req, res) => {
    const { id } = req.query;
    const content = await articleMapple.getArticleContentById(id);
    res.json({
      data: content,
    });
  });
app.use("/api", apiRouter);

app.listen(3000);

// 定时爬虫任务
const crawlJob = new CronJob("*/5 * * * *", function () {
  const crawlProcess = spawn(process.execPath, [
    path.resolve(__dirname, "../crawl/index.js"),
  ]);
  crawlProcess.on("close", function (code) {
    console.log("更新任务，代码=%d", code);
  });
});

crawlJob.start()

process.on("uncaughtException", function (err) {
  console.error("uncaughtException: %s", err.stack);
});
