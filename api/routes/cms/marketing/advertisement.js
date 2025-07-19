/**
 * 品牌接口 */
import { omit } from 'lodash';
import Router from '@koa/router';

import advertisementRepo from '../../../repository/advert/advertisement_repos';

const advertisementRouter = Router({ prefix: '/advertisement' });

advertisementRouter.get('/', (ctx) => {
  ctx.body = '文章接口';
});

/**
 * 保存 */
advertisementRouter.post('/save', async (ctx) => {
  let _advertisement = ctx.request.body;

  let _result = {};
  if (_advertisement.id) {
    const _id = _advertisement.id;
    _advertisement = omit(_advertisement, 'id');
    _result = await advertisementRepo.update(_id, _advertisement);
  } else {
    _result = await advertisementRepo.create(_advertisement);
  }
  ctx.body = _result;
});

/**
 * 删除功能 */
advertisementRouter.post('/delete', async (ctx) => {
  const { ids } = ctx.request.body;

  const _result = await advertisementRepo.delete(ids);
  ctx.body = _result;
});

/**
 * 功能信息 */
advertisementRouter.post('/get', async (ctx) => {
  const { id } = ctx.request.body;

  const _result = await advertisementRepo.get(id);
  ctx.body = _result;
});

/**
 * 功能列表 */
advertisementRouter.post('/list', async (ctx) => {
  const { searchKey, offset, limit } = ctx.request.body;

  const _result = await advertisementRepo.list(searchKey, offset, limit);
  ctx.body = _result;
});

module.exports = advertisementRouter;
