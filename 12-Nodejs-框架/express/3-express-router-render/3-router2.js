const express = require('express');
const router2 = express.Router();

router2.get('/test1', (req, resp) => {
    resp.send('router2 test1 page');
});

module.exports = router2;