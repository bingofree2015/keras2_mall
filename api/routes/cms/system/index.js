/**
 * 管理员权限管理 */
const Router = require('@koa/router');

const dictRouter = require('./dict');
const logRouter = require('./log');
const dbRouter = require('./db');

const router = Router({ prefix: '/system' });

router.use(dictRouter.routes());
router.use(logRouter.routes());
router.use(dbRouter.routes());

router.get('/', (ctx) => {
  ctx.body = '系统相关接口';
});

module.exports = router;
