/**
 * 品牌接口 */
const { omit } = require('lodash');
const Router = require('@koa/router');

const brandRepo = require('../../../repository/goods/brand_repos');

const brandRouter = Router({ prefix: '/brand' });

brandRouter.get('/', (ctx) => {
  ctx.body = '品牌接口';
});

/**
 * 保存 */
brandRouter.post('/save', async (ctx) => {
  let _brand = ctx.request.body;

  let _result = {};
  if (_brand.id) {
    const _id = _brand.id;
    _brand = omit(_brand, 'id');
    _result = await brandRepo.update(_id, _brand);
  } else {
    _result = await brandRepo.create(_brand);
  }
  ctx.body = _result;
});

/**
 * 删除功能 */
brandRouter.post('/delete', async (ctx) => {
  const { ids } = ctx.request.body;

  const _result = await brandRepo.delete(ids);
  ctx.body = _result;
});

/**
 * 功能信息 */
brandRouter.post('/get', async (ctx) => {
  const { id } = ctx.request.body;

  const _result = await brandRepo.get(id);
  ctx.body = _result;
});

/**
 * 功能列表 */
brandRouter.post('/list', async (ctx) => {
  const { searchKey, offset, limit } = ctx.request.body;

  const _result = await brandRepo.list(searchKey, offset, limit);
  ctx.body = _result;
});

module.exports = brandRouter;
