/**
 * 任务接口 */
import { omit } from 'lodash';
import Router from '@koa/router';

import MessageCenterRepo from '../../../repository/preference/message_center_repos';

const messageCenterRouter = Router({ prefix: '/message_center' });

messageCenterRouter.get('/', (ctx) => {
  ctx.body = '消息配置接口';
});

/**
 * 保存 */
messageCenterRouter.post('/save', async (ctx) => {
  let _messageCenter = ctx.request.body;

  let _result = {};
  if (_messageCenter.id) {
    const _id = _messageCenter.id;
    _messageCenter = omit(_messageCenter, 'id');
    _result = await MessageCenterRepo.update(_id, _messageCenter);
  } else {
    _result = await MessageCenterRepo.create(_messageCenter);
  }
  ctx.body = _result;
});

/**
 * 删除功能 */
messageCenterRouter.post('/delete', async (ctx) => {
  const { ids } = ctx.request.body;

  const _result = await MessageCenterRepo.delete(ids);
  ctx.body = _result;
});

/**
 * 功能信息 */
messageCenterRouter.post('/get', async (ctx) => {
  const { id } = ctx.request.body;

  const _result = await MessageCenterRepo.get(id);
  ctx.body = _result;
});

/**
 * 功能列表 */
messageCenterRouter.post('/list', async (ctx) => {
  const { searchKey, offset, limit } = ctx.request.body;

  const _result = await MessageCenterRepo.list(searchKey, offset, limit);
  ctx.body = _result;
});

module.exports = messageCenterRouter;
