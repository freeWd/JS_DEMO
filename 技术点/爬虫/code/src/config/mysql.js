var mysql = require("mysql");
var Promise = require('bluebird');

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "crawl-demo",
  charset: 'utf8mb4'
});

connection.connect((err) => {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('连接成功')
});


module.exports = {
  query: Promise.promisify(connection.query).bind(connection),
  beginTransaction: connection.beginTransaction,
  end: connection.end,
  destory: connection.destroy
}