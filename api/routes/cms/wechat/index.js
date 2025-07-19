/**
 * 会员等级 */
const Router = require('@koa/router');

const weixinMessageRouter = require('./weixin_message');
const weixinMediaMessageRouter = require('./weixin_media_message');

const router = Router({ prefix: '/wechat' });

router.use(weixinMessageRouter.routes());
router.use(weixinMediaMessageRouter.routes());

router.get('/', (ctx) => {
  ctx.body = '微信相关接口';
});

module.exports = router;
