/**
 * 管理员权限管理 */
import Router from '@koa/router';

import articleTypeRouter from './article_type';
import articleRouter from './article';
import advertPositionRouter from './advert_position';
import advertisementRouter from './advertisement';
import noticeRouter from './notice';

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
