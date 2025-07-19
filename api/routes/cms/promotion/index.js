/**
 * 管理员权限管理 */
const _ = require('lodash');
const Router = require('@koa/router');

const promotion = require('../../../repository/promotion/promotion_repos');
const promotionConditionRouter = require('./sp_target');
const promotionResultRouter = require('./sp_rule');
const couponRouter = require('./coupon');

const router = Router({ prefix: '/promotion' });

router.use(promotionConditionRouter.routes());
router.use(promotionResultRouter.routes());
router.use(couponRouter.routes());

router.get('/', (ctx) => {
  ctx.body = '促销管理接口';
});

/**
 * 保存 */
router.post('/save', async (ctx) => {
  let _promotion = ctx.request.body;

  let _result = {};
  if (_promotion.id) {
    const _id = _promotion.id;
    _promotion = _.omit(_promotion, 'id');
    _result = await promotion.update(_id, _promotion);
  } else {
    _result = await promotion.create(_promotion);
  }
  ctx.body = _result;
});

/**
 * 删除功能 */
router.post('/delete', async (ctx) => {
  const { ids } = ctx.request.body;

  const _result = await promotion.delete(ids);
  ctx.body = _result;
});

/**
 * 功能信息 */
router.post('/get', async (ctx) => {
  const { id } = ctx.request.body;

  const _result = await promotion.get(id);
  ctx.body = _result;
});

/**
 * 功能列表 */
router.post('/list', async (ctx) => {
  const { searchKey, offset, limit } = ctx.request.body;

  const _result = await promotion.list(searchKey, offset, limit);
  ctx.body = _result;
});

module.exports = router;
