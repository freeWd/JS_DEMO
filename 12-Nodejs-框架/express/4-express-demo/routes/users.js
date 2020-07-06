var express = require('express');
var router = express.Router();
var userData = require('../sql/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/search', function(req, res, next) {
  userData.queryById(req, res, next);
});

router.post('/add', function(req, res, next) {
  userData.insertUser(req, res, next);
});

module.exports = router;
