/**
 * 管理员权限管理 */
import Router from '@koa/router';

import dictRouter from './dict';
import logRouter from './log';
import dbRouter from './db';

const router = Router({ prefix: '/system' });

router.use(dictRouter.routes());
router.use(logRouter.routes());
router.use(dbRouter.routes());

router.get('/', (ctx) => {
  ctx.body = '系统相关接口';
});

module.exports = router;
