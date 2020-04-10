const path = require("path");
const fs = require("fs");
const mime = require('mime');

function handleRoute(pathname, resp) {
  const absPath = path.join(__dirname, '../', pathname)
  fs.stat(absPath, (err, status) => {
    if (err) {
      handleNoFile(resp);
      return;
    }
    if (status.isFile()) {
      parseFile(absPath, resp);
    } else {
      const filePath = path.join(absPath, "/index.html");
      parseFile(filePath, resp);
    }
  });
}

function handleNoFile(resp) {
  resp.statusCode = 404;
  resp.end("Not Fount");
}

function parseFile(absPath, resp) {
  fs.readFile(absPath, (err, data) => {
    if (err) {
      handleNoFile(resp);
    }
    resp.setHeader("content-type", mime.getType(absPath) + ";charset=utf-8");
    resp.write(data);
    resp.end();
  });
}


module.exports = handleRoute
