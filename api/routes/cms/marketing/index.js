/**
 * 管理员权限管理 */
const Router = require('@koa/router');

const articleTypeRouter = require('./article_type');
const articleRouter = require('./article');
const advertPositionRouter = require('./advert_position');
const advertisementRouter = require('./advertisement');
const noticeRouter = require('./notice');

const router = Router({ prefix: '/marketing' });

router.use(articleTypeRouter.routes());
router.use(articleRouter.routes());
router.use(advertPositionRouter.routes());
router.use(advertisementRouter.routes());
router.use(noticeRouter.routes());

router.get('/', (ctx) => {
    ctx.body = '市场运营接口';
});

module.exports = router;
