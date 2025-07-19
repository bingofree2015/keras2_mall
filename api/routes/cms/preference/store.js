/**
 * 门店接口 */
const { omit } = require('lodash');
const Router = require('@koa/router');

const storeRepo = require('../../../repository/preference/store_repos');

const storeRouter = Router({ prefix: '/store' });

storeRouter.get('/', (ctx) => {
  ctx.body = '门店接口';
});

/**
 * 保存 */
storeRouter.post('/save', async (ctx) => {
  let _store = ctx.request.body;

  let _result = {};
  if (_store.id) {
    const _id = _store.id;
    _store = omit(_store, 'id');
    _result = await storeRepo.update(_id, _store);
  } else {
    _result = await storeRepo.create(_store);
  }
  ctx.body = _result;
});

/**
 * 删除功能 */
storeRouter.post('/delete', async (ctx) => {
  const { ids } = ctx.request.body;

  const _result = await storeRepo.delete(ids);
  ctx.body = _result;
});

/**
 * 功能信息 */
storeRouter.post('/get', async (ctx) => {
  const { id } = ctx.request.body;

  const _result = await storeRepo.get(id);
  ctx.body = _result;
});

/**
 * 功能列表 */
storeRouter.post('/list', async (ctx) => {
  const { searchKey, offset, limit } = ctx.request.body;

  const _result = await storeRepo.list(searchKey, offset, limit);
  ctx.body = _result;
});

module.exports = storeRouter;
