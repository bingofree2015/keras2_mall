/**
 * 管理员权限管理 */
const { omit } = require('lodash');
const Router = require('@koa/router');

const noticeRepo = require('../../../repository/system/notice_repos');

const noticeRouter = Router({ prefix: '/notice' });

noticeRouter.get('/', (ctx) => {
  ctx.body = '功能';
});

/**
 * 保存 */
noticeRouter.post('/save', async (ctx) => {
  let _notice = ctx.request.body;

  let _result = {};
  if (_notice.id) {
    const _id = _notice.id;
    _notice = omit(_notice, 'id');
    _result = await noticeRepo.update(_id, _notice);
  } else {
    _result = await noticeRepo.create(_notice);
  }
  ctx.body = _result;
});

/**
 * 删除功能 */
noticeRouter.post('/delete', async (ctx) => {
  const { ids } = ctx.request.body;

  let _result = {};
  _result = await noticeRepo.delete(ids);
  ctx.body = _result;
});

/**
 * 功能信息 */
noticeRouter.post('/get', async (ctx) => {
  const { id } = ctx.request.body;

  let _result = {};
  _result = await noticeRepo.get(id);
  ctx.body = _result;
});
/**
 * 功能列表 */
noticeRouter.post('/list', async (ctx) => {
  const { searchKey, offset, limit } = ctx.request.body;

  let _result = {};
  _result = await noticeRepo.list(searchKey, offset, limit);
  ctx.body = _result;
});

module.exports = noticeRouter;
