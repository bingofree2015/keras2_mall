/**
 * 管理员权限管理 */
const { omit } = require('lodash');
const Router = require('@koa/router');

const operationLogRepo = require('../../../repository/preference/operation_log_repos');

const operationLogRouter = Router({ prefix: '/operation_log' });

operationLogRouter.get('/', (ctx) => {
  ctx.body = '功能';
});

operationLogRouter.post('/save', async (ctx) => {
  let _operationLog = ctx.request.body;

  let _result = {};
  if (_operationLog.id) {
    const _id = _operationLog.id;
    _operationLog = omit(_operationLog, 'id');
    _result = await operationLogRepo.update(_id, _operationLog);
  } else {
    _result = await operationLogRepo.create(_operationLog);
  }
  ctx.body = _result;
});

operationLogRouter.post('/delete', async (ctx) => {
  const { ids } = ctx.request.body;

  const _result = await operationLogRepo.delete(ids);
  ctx.body = _result;
});

operationLogRouter.post('/get', async (ctx) => {
  const { id } = ctx.request.body;

  const _result = await operationLogRepo.get(id);
  ctx.body = _result;
});

operationLogRouter.post('/list', async (ctx) => {
  const { searchKey, offset, limit } = ctx.request.body;

  const _result = await operationLogRepo.list(searchKey, offset, limit);
  ctx.body = _result;
});

module.exports = operationLogRouter;
