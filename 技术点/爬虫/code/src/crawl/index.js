const readUtil = require('./read')
const { tagUrl, host } = require('../config/crawl.config.js')

const tagMapple = require('../sql/tag')
const articleMapple = require('../sql/article')


async function main() {
  const tagList = await readUtil.readTag(`${host}${tagUrl}`)
  let allArticles = [];

  for (const tagItem of tagList) {
    // save
    tagMapple.saveTag(tagItem)

    let articleList = await readUtil.readArticleList(`${host}${tagItem.link}`)

    allArticles.push(...articleList)
  }

  for (const articleItem of allArticles) {
    // save
    try {
      console.log(articleItem.title)
      await articleMapple.saveArticle(articleItem)
    } catch (error) {
      console.log(error, '<---')
    }
  }
  
  process.exit()
}

main()