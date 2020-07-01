const express = require('express');

const router1 = express.Router();

router1.get('/test1', (req, resp) => {
    resp.send('router1 test1 page');
});

router1.route('/test2')
    .get((req, resp) => {
        resp.send('get router1 test2 page');
    })
    .post((req, resp) => {
        resp.send('post router1 test2 page');
    })

module.exports = router1;