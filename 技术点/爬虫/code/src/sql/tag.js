const dbConnect = require("../config/mysql");

const tagMapple = {
  async saveTag(tagInfo) {
    const insertData = {
      name: tagInfo.title,
      image: tagInfo.imgUrl,
      url: tagInfo.link,
      subscribe: tagInfo.subscribeNums,
      article: tagInfo.articleNums,
    };
    const results = await dbConnect.query("SELECT id, name FROM tags WHERE name = ?", [
      tagInfo.title,
    ]);
    if (Array.isArray(results) && results.length > 0) {
      const id = results[0].id;
      await dbConnect.query("UPDATE tags SET ? WHERE id= ?", [insertData, id]);
    } else {
      await dbConnect.query("INSERT INTO tags SET ?", [insertData]);
    }
  },

  async getTagIdByName(tagName) {
    return await dbConnect.query("SELECT id FROM tags WHERE name = ?", [tagName]);
  },

  async getTagList() {
    return await dbConnect.query('SELECT id, name, image, url, subscribe, article FROM tags')
  },
};

module.exports = tagMapple;
