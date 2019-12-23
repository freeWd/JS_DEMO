var pool = require("../config/mysql");

const userData = {
  queryById: function(req, res, next) {
    const userId = req.query.userId;
    pool.query("SELECT username FROM  user WHERE id = ?", userId, function(
      err,
      result
    ) {
      if (err) throw error;
      console.log("The solution is: ", result);
      res.json(result);
    });
  },
  insertUser: function(req, res, next) {
    const userName = req.body.userName;
    if (userName) {
        pool.query("INSERT INTO user (username) VALUES (?)", userName, function(
            err,
            result,
            fields
          ) {
            if (err) throw error;
            console.log("The solution is: ", result, '----', fields);
            res.json(fields);
          });
    } else {
        res.json({ msg: 'username不能为空' });
    }
  }
};

module.exports = userData;
