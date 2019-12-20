const express = require('express');

const app = express();

app.get('/test', (req, resp) => {
    resp.send('hello world');
});

const server = app.listen(3000, () => {
    console.log('server start 🍊');
})

module.exports = app;