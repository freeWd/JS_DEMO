// 爬取某博客站点的简单信息 - demo

/**
 * readTag 获取博文的标签（分类信息）
 * readArticleList 获取某个标签内的博文列表
 * readArticleContent 获取某个具体的博文内容
 */

const superagent = require("superagent");
const cheerio = require("cheerio");
const debug = require("debug")("crawl:read");
const { host } = require("../config/crawl.config");

function cherrioLoad(options = {}) {
  return function (resp) {
    if (resp.status === 200) {
      return cheerio.load(resp.text, options);
    }
    return cherrioLoad.load();
  };
}

function resolveArticleTag(eles) {
  return eles.toArray().map((ele) => {
    return ele.children && ele.children[0].data;
  });
}

async function readTag(url) {
  return superagent
    .get(url)
    .then(cherrioLoad())
    .then(($) => {
      const tagArr = [];
      $(".item").each((index, item) => {
        const tag = $(item);
        const imgUrl = tag.find("div.thumb").attr("data-src");
        const title = tag.find("div.title").text();
        const link = tag.find("a").attr("href");
        const subscribeNums = parseInt(tag.find(".meta.subscribe").text());
        const articleNums = parseInt(tag.find(".meta.article").text());
        tagArr.push({ imgUrl, title, link, subscribeNums, articleNums });
      });
      return tagArr;
    })
    .catch((e) => {
      throw e;
    });
}

async function readArticleList(url) {
  const articleList = [];
  return superagent
    .get(url)
    .then(cherrioLoad())
    .then(async ($) => {
      let items = $(".item .content-box .info-box");
      for (let i = 0; i < items.length; i++) {
        const article = $(items[i]);
        const articleLink = article.find(".title");

        const author = article.find(".item.username").text();
        const tags = resolveArticleTag(article.find(".item.tag a"));
        const title = articleLink.text();
        const link = articleLink.attr("href");
        const id = link.match(/[^\/post\/]\w+/)[0];
        const content = await readArticleContent(`${host}${link}`)

        articleList.push({
          id,
          title,
          link,
          tags,
          author,
          content
        });
      }

      return articleList;
    })
    .catch((e) => {
      console.log(e, "<----xx");
      return articleList;
    });
}

async function readArticleContent(url) {
  let content = null;
  return superagent
    .get(url)
    .timeout({ response: 5000 })
    .then(cherrioLoad({ decodeEntities: false }))
    .then(($) => {
      let article = $(".main-container");
      content = article.find(".article-content").html();
      return content;
    })
    .catch((e) => {
      console.log(url, "<----xx1");
      return "error " + url;
    });
}

module.exports = {
  readTag,
  readArticleList,
  readArticleContent,
};
