const express = require('express');

const app = express();
const jsonData = require('./data.json');

app.use(express.static(__dirname));
app.get('/api/img', (req, resp) => {
    let start = Math.round(Math.random()*(jsonData.length-20));
    resp.json(jsonData.slice(start, start + 20));
})

app.listen(3000);

// https://www.fullstackjavascript.cn/conan/49.jpeg

