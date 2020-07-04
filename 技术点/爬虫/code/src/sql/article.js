const dbConnect = require("../config/mysql");

const articleMapple = {
  async saveArticle(articleInfo) {
    const tags = articleInfo.tags.toString();
    const insertArticle = {
      id: articleInfo.id,
      title: articleInfo.title,
      href: articleInfo.link,
      author: articleInfo.author,
      type: tags,
      content: articleInfo.content,
    };

    const results = await dbConnect.query(
      "SELECT id FROM articles WHERE id = ?",
      [insertArticle.id]
    );
 
    if (Array.isArray(results) && results.length > 0) {
      await dbConnect.query(
        "UPDATE articles SET ? WHERE id = ?", [insertArticle, insertArticle.id],        
      );
    } else {
      await dbConnect.query("INSERT INTO articles SET ?", [insertArticle]);
    }
    await dbConnect.query("DELETE FROM article_tag WHERE article_id = ?", [insertArticle.id]);
    
    try {
      const tagResults = await dbConnect.query("SELECT id FROM tags WHERE name IN (?)", [tags]);
      tagResults.forEach(async item => {
        const insertArticleTag = {
          article_id: insertArticle.id,
          tag_id: item.id,
        };
        await dbConnect.query("INSERT INTO article_tag SET ?", [insertArticleTag])
      })
    } catch (error) {
      console.log('---->error', error)
    }
  },

  async getArticleList(pageIndex = 1, pageSize = 10) {
    const startIndex = Number((pageIndex-1)*pageSize)
    pageSize = Number(pageSize)
    const data = await dbConnect.query('SELECT id, title, href, author, type AS tags FROM articles LIMIT ?, ?', [startIndex, pageSize]);
    const total = await dbConnect.query('SELECT count(id) as total FROM articles');
    return {
      total: total[0].total,
      data
    }
  },

  async getArticleContentById(id) {
    const data = await dbConnect.query('SELECT content FROM articles WHERE id = ?', [id])
    if (data.length > 0) {
      return data[0].content
    } else {
      return null
    }
  }
};

module.exports = articleMapple;
