/**
 * 管理员权限管理 */
import _ from 'lodash';
import Router from '@koa/router';

import page from '../../../repository/page/page_repos';

const router = Router({ prefix: '/page' });

router.get('/', (ctx) => {
  ctx.body = '页面管理接口';
});

/**
 * 保存 */
router.post('/save', async (ctx) => {
  let _page = ctx.request.body;

  let _result = {};
  if (_page.id) {
    const _id = _page.id;
    _page = _.omit(_page, 'id');
    _result = await page.update(_id, _page);
  } else {
    _result = await page.create(_page);
  }
  ctx.body = _result;
});

/**
 * 删除功能 */
router.post('/delete', async (ctx) => {
  const { ids } = ctx.request.body;

  const _result = await page.delete(ids);
  ctx.body = _result;
});

/**
 * 功能信息 */
router.post('/get', async (ctx) => {
  const { id } = ctx.request.body;

  const _result = await page.get(id);
  ctx.body = _result;
});

/**
 * 功能列表 */
router.post('/list', async (ctx) => {
  const { searchKey, offset, limit } = ctx.request.body;

  const _result = await page.list(searchKey, offset, limit);
  ctx.body = _result;
});

module.exports = router;
