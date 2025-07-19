/**
 * 管理员权限管理 */
import { omit } from 'lodash';
import Router from '@koa/router';

import settingRepo from '../../../repository/preference/setting_repos';

const settingRouter = Router({ prefix: '/setting' });

settingRouter.get('/', (ctx) => {
  ctx.body = '功能';
});

settingRouter.post('/save', async (ctx) => {
  const { key, value } = ctx.request.body;

  const _result = await settingRepo.save(key, value);
  ctx.body = _result;
});

settingRouter.post('/get', async (ctx) => {
  const { key } = ctx.request.body;

  const _result = await settingRepo.get(key);
  ctx.body = _result;
});

module.exports = settingRouter;
