/**
 * 管理员权限管理 */
const { omit } = require('lodash');
const Router = require('@koa/router');

const dictRepo = require('../../../repository/system/dict_repos');

const dictRouter = Router({ prefix: '/dict' });

dictRouter.get('/', (ctx) => {
  ctx.body = '功能';
});

/**
 * 保存 */
dictRouter.post('/save', async (ctx) => {
  let _dict = ctx.request.body;

  let _result = {};
  if (_dict.id) {
    const _id = _dict.id;
    _dict = omit(_dict, 'id');
    _result = await dictRepo.update(_id, _dict);
  } else {
    _result = await dictRepo.create(_dict);
  }
  ctx.body = _result;
});

/**
 * 删除功能 */
dictRouter.post('/delete', async (ctx) => {
  const { ids } = ctx.request.body;

  let _result = {};
  _result = await dictRepo.delete(ids);
  ctx.body = _result;
});

/**
 * 功能信息 */
dictRouter.post('/get', async (ctx) => {
  const { id } = ctx.request.body;

  let _result = {};
  _result = await dictRepo.get(id);
  ctx.body = _result;
});
/**
 * 功能列表 */
dictRouter.post('/list', async (ctx) => {
  const { searchKey, offset, limit } = ctx.request.body;

  let _result = {};
  _result = await dictRepo.list(searchKey, offset, limit);
  ctx.body = _result;
});

dictRouter.post('/find_page', async (ctx) => {
  const { pageNum, pageSize, limit = 10 } = ctx.request.body;

  let _result = {};
  const _offset = (pageNum - 1) * pageSize;
  _result = await dictRepo.list({}, _offset, limit);
  ctx.body = _result;
});

module.exports = dictRouter;
