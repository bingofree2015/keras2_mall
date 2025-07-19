/**
 * 会员等级 */
import Router from '@koa/router';

import weixinMessageRouter from './weixin_message';
import weixinMediaMessageRouter from './weixin_media_message';

const router = Router({ prefix: '/wechat' });

router.use(weixinMessageRouter.routes());
router.use(weixinMediaMessageRouter.routes());

router.get('/', (ctx) => {
  ctx.body = '微信相关接口';
});

module.exports = router;
