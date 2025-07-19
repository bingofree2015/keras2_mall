/**
 * 品牌接口 */
import { omit } from 'lodash';
import Router from '@koa/router';

import weixinMediaMessageRepo from '../../../repository/wechat/weixin_media_message_repos';

const weixinMediaMessageRouter = Router({ prefix: '/weixin_media_message' });

weixinMediaMessageRouter.get('/', (ctx) => {
  ctx.body = '微信消息接口';
});

/**
 * 保存 */
weixinMediaMessageRouter.post('/save', async (ctx) => {
  let _weixinMediaMessage = ctx.request.body;

  let _result = {};
  if (_weixinMediaMessage.id) {
    const _id = _weixinMediaMessage.id;
    _weixinMediaMessage = omit(_weixinMediaMessage, 'id');
    _result = await weixinMediaMessageRepo.update(_id, _weixinMediaMessage);
  } else {
    _result = await weixinMediaMessageRepo.create(_weixinMediaMessage);
  }
  ctx.body = _result;
});

/**
 * 删除功能 */
weixinMediaMessageRouter.post('/delete', async (ctx) => {
  const { ids } = ctx.request.body;

  const _result = await weixinMediaMessageRepo.delete(ids);
  ctx.body = _result;
});

/**
 * 功能信息 */
weixinMediaMessageRouter.post('/get', async (ctx) => {
  const { id } = ctx.request.body;

  const _result = await weixinMediaMessageRepo.get(id);
  ctx.body = _result;
});

/**
 * 功能列表 */
weixinMediaMessageRouter.post('/list', async (ctx) => {
  const { searchKey, offset, limit } = ctx.request.body;

  const _result = await weixinMediaMessageRepo.list(searchKey, offset, limit);
  ctx.body = _result;
});

module.exports = weixinMediaMessageRouter;
