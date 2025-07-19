/**
 * 品牌接口 */
const { omit } = require('lodash');
const Router = require('@koa/router');

const userToCashRepo = require('../../../repository/pay/user_to_cash_repos');

const userToCashRouter = Router({ prefix: '/user_to_cash' });

userToCashRouter.get('/', (ctx) => {
  ctx.body = '用户提现接口';
});

/**
 * 保存 */
userToCashRouter.post('/save', async (ctx) => {
  let _userToCash = ctx.request.body;

  let _result = {};
  if (_userToCash.id) {
    const _id = _userToCash.id;
    _userToCash = omit(_userToCash, 'id');
    _result = await userToCashRepo.update(_id, _userToCash);
  } else {
    _result = await userToCashRepo.create(_userToCash);
  }
  ctx.body = _result;
});

/**
 * 删除功能 */
userToCashRouter.post('/delete', async (ctx) => {
  const { ids } = ctx.request.body;

  const _result = await userToCashRepo.delete(ids);
  ctx.body = _result;
});

/**
 * 功能信息 */
userToCashRouter.post('/get', async (ctx) => {
  const { id } = ctx.request.body;

  const _result = await userToCashRepo.get(id);
  ctx.body = _result;
});

/**
 * 功能列表 */
userToCashRouter.post('/list', async (ctx) => {
  const { searchKey, offset, limit } = ctx.request.body;

  const _result = await userToCashRepo.list(searchKey, offset, limit);
  ctx.body = _result;
});

module.exports = userToCashRouter;
