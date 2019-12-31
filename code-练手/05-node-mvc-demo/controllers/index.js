const Router = require("koa-router");
const bookRouter = require('./bookController');

const router = new Router();

router.redirect('/', '/home');
router.use(bookRouter.routes()).use(bookRouter.allowedMethods());

module.exports = router;
