/**
 * 管理员权限管理 */
import { omit } from 'lodash';
import Router from '@koa/router';

import logRepo from '../../../repository/system/log_repos';

const logRouter = Router({ prefix: '/log' });

logRouter.get('/', (ctx) => {
  ctx.body = '功能';
});

logRouter.post('/save', async (ctx) => {
  let _log = ctx.request.body;

  let _result = {};
  if (_log.id) {
    const _id = _log.id;
    _log = omit(_log, 'id');
    _result = await logRepo.update(_id, _log);
  } else {
    _result = await logRepo.create(_log);
  }
  ctx.body = _result;
});

logRouter.post('/delete', async (ctx) => {
  const { ids } = ctx.request.body;

  let _result = {};
  _result = await logRepo.delete(ids);
  ctx.body = _result;
});

logRouter.post('/get', async (ctx) => {
  const { id } = ctx.request.body;

  let _result = {};
  _result = await logRepo.get(id);
  ctx.body = _result;
});

logRouter.post('/list', async (ctx) => {
  const { searchKey, offset, limit } = ctx.request.body;

  let _result = {};
  _result = await logRepo.list(searchKey, offset, limit);
  ctx.body = _result;
});

module.exports = logRouter;
