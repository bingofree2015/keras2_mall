/**
 * 品牌接口 */
import { omit } from 'lodash';
import Router from '@koa/router';

import articleRepo from '../../../repository/article/article_repos';

const articleRouter = Router({ prefix: '/article' });

articleRouter.get('/', (ctx) => {
  ctx.body = '文章接口';
});

/**
 * 保存 */
articleRouter.post('/save', async (ctx) => {
  let _article = ctx.request.body;

  let _result = {};
  if (_article.id) {
    const _id = _article.id;
    _article = omit(_article, 'id');
    _result = await articleRepo.update(_id, _article);
  } else {
    _result = await articleRepo.create(_article);
  }
  ctx.body = _result;
});

/**
 * 删除功能 */
articleRouter.post('/delete', async (ctx) => {
  const { ids } = ctx.request.body;

  const _result = await articleRepo.delete(ids);
  ctx.body = _result;
});

/**
 * 功能信息 */
articleRouter.post('/get', async (ctx) => {
  const { id } = ctx.request.body;

  const _result = await articleRepo.get(id);
  ctx.body = _result;
});

/**
 * 功能列表 */
articleRouter.post('/list', async (ctx) => {
  const { searchKey, offset, limit } = ctx.request.body;

  const _result = await articleRepo.list(searchKey, offset, limit);
  ctx.body = _result;
});

module.exports = articleRouter;
