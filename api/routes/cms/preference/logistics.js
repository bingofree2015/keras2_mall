/**
 * 管理员权限管理 */
import { omit } from 'lodash';
import Router from '@koa/router';

import logisticsRepo from '../../../repository/preference/logistics_repos';

const logisticsRouter = Router({ prefix: '/logistics' });

logisticsRouter.get('/', (ctx) => {
  ctx.body = '功能';
});

logisticsRouter.post('/save', async (ctx) => {
  let _logistics = ctx.request.body;

  let _result = {};
  if (_logistics.id) {
    const _id = _logistics.id;
    _logistics = omit(_logistics, 'id');
    _result = await logisticsRepo.update(_id, _logistics);
  } else {
    _result = await logisticsRepo.create(_logistics);
  }
  ctx.body = _result;
});

logisticsRouter.post('/delete', async (ctx) => {
  const { ids } = ctx.request.body;

  const _result = await logisticsRepo.delete(ids);
  ctx.body = _result;
});

logisticsRouter.post('/get', async (ctx) => {
  const { id } = ctx.request.body;

  const _result = await logisticsRepo.get(id);
  ctx.body = _result;
});

logisticsRouter.post('/list', async (ctx) => {
  const { searchKey, offset, limit } = ctx.request.body;

  const _result = await logisticsRepo.list(searchKey, offset, limit);
  ctx.body = _result;
});

module.exports = logisticsRouter;
