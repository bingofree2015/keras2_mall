/**
 * 品牌接口 */
const { omit } = require('lodash');
const Router = require('@koa/router');

const couponRepo = require('../../../repository/promotion/coupon_repos');

const couponRouter = Router({ prefix: '/coupon' });

couponRouter.get('/', (ctx) => {
  ctx.body = '优惠券接口';
});

/**
 * 保存 */
couponRouter.post('/save', async (ctx) => {
  let _coupon = ctx.request.body;

  let _result = {};
  if (_coupon.id) {
    const _id = _coupon.id;
    _coupon = omit(_coupon, 'id');
    _result = await couponRepo.update(_id, _coupon);
  } else {
    _result = await couponRepo.create(_coupon);
  }
  ctx.body = _result;
});

/**
 * 删除功能 */
couponRouter.post('/delete', async (ctx) => {
  const { ids } = ctx.request.body;

  const _result = await couponRepo.delete(ids);
  ctx.body = _result;
});

/**
 * 功能信息 */
couponRouter.post('/get', async (ctx) => {
  const { id } = ctx.request.body;

  const _result = await couponRepo.get(id);
  ctx.body = _result;
});

/**
 * 功能列表 */
couponRouter.post('/list', async (ctx) => {
  const { searchKey, offset, limit } = ctx.request.body;

  const _result = await couponRepo.list(searchKey, offset, limit);
  ctx.body = _result;
});

couponRouter.post('/build', async (ctx) => {
  const { id: promotionId, num } = ctx.request.body;

  const _result = await couponRepo.build(promotionId, num);
  ctx.body = _result;
});

module.exports = couponRouter;
