/**
 * Created by bingofree.
 */
const _ = require('lodash');
const Router = require('@koa/router');
const noticeRepos = require('../../repository/system/notice_repos');

const router = Router({ prefix: '/notice' });

router.get('/', async (ctx) => {
  ctx.body = '通知相关接口';
});
/**
 * 获取通知列表
 */
router.post('/get_notice_list', async (ctx) => {
  const { searchKey, offset, limit } = ctx.request.body;
  let _result = null;

  _result = await noticeRepos.list(searchKey, offset, limit);
  ctx.body = _result;
});
/**
 * 获取公告详情
 */
router.get('/get_notice_info', async (ctx) => {
  const { id } = ctx.request.body;
  let _result = null;

  _result = await noticeRepos.get(id);
  ctx.body = _result;
});

module.exports = router;
