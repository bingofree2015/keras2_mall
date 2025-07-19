/**
 * 品牌接口 */
const { omit } = require('lodash');
const Router = require('@koa/router');

const goodsParamRepo = require('../../../repository/goods/goods_param_repos');

const goodsParamRouter = Router({ prefix: '/goods_param' });

goodsParamRouter.get('/', (ctx) => {
  ctx.body = '商品参数接口';
});

/**
 * 保存 */
goodsParamRouter.post('/save', async (ctx) => {
  let _goodsParam = ctx.request.body;

  let _result = {};
  if (_goodsParam.id) {
    const _id = _goodsParam.id;
    _goodsParam = omit(_goodsParam, 'id');
    _result = await goodsParamRepo.update(_id, _goodsParam);
  } else {
    _result = await goodsParamRepo.create(_goodsParam);
  }
  ctx.body = _result;
});

/**
 * 删除功能 */
goodsParamRouter.post('/delete', async (ctx) => {
  const { ids } = ctx.request.body;

  const _result = await goodsParamRepo.delete(ids);
  ctx.body = _result;
});

/**
 * 功能信息 */
goodsParamRouter.post('/get', async (ctx) => {
  const { id } = ctx.request.body;

  const _result = await goodsParamRepo.get(id);
  ctx.body = _result;
});

/**
 * 功能列表 */
goodsParamRouter.post('/list', async (ctx) => {
  const { searchKey, offset, limit } = ctx.request.body;

  const _result = await goodsParamRepo.list(searchKey, offset, limit);
  ctx.body = _result;
});

module.exports = goodsParamRouter;
