const express = require('./self-express');

const route = express.Router();

route.get('/test', (req, resp) => {
    console.log('route test');
    resp.end('router test');
});

module.exports = route;