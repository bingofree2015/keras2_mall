/**
 * Created by bingofree.
 */
const _ = require('lodash');
const Router = require('@koa/router');
const advertPositionRepos = require('../../repository/advert/advert_position_repos');
const advertisementRepos = require('../../repository/advert/advertisement_repos');

const router = Router({ prefix: '/payments' });

router.get('/', async (ctx) => {
  ctx.body = '支付单模块相关接口';
});
/**
 * 获取店铺所有可用的支付接口
 */
router.post('/getList', async (ctx) => {
  let {} = ctx.request.body;
  const _result = null;

  ctx.body = _result;
});
/**
 * 取支付单信息
 */
router.get('/getInfo', async (ctx) => {
  let {} = ctx.request.body;
  const _result = null;

  ctx.body = _result;
});
/**
 * 取支付单信息
 */
router.get('/getInfo', async (ctx) => {
  let {} = ctx.request.body;
  const _result = null;

  ctx.body = _result;
});

module.exports = router;
