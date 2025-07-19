/**
 * 商品分类管理 */
import { omit } from 'lodash';
import Router from '@koa/router';

import goodsCatRepo from '../../../repository/goods/goods_cat_repos';

const goodsCatRouter = Router({ prefix: '/goods_cat' });

goodsCatRouter.get('/', (ctx) => {
  ctx.body = '商品分类接口';
});

/**
 * 保存 */
goodsCatRouter.post('/save', async (ctx) => {
  let _goodsCat = ctx.request.body;

  let _result = {};
  if (_goodsCat.id) {
    const _id = _goodsCat.id;
    _goodsCat = omit(_goodsCat, 'id');
    _result = await goodsCatRepo.update(_id, _goodsCat);
  } else {
    _result = await goodsCatRepo.create(_goodsCat);
  }
  ctx.body = _result;
});

/**
 * 删除功能 */
goodsCatRouter.post('/delete', async (ctx) => {
  const { ids } = ctx.request.body;

  const _result = await goodsCatRepo.delete(ids);
  ctx.body = _result;
});

/**
 * 明细 */
goodsCatRouter.post('/get', async (ctx) => {
  const { id } = ctx.request.body;

  const _result = await goodsCatRepo.get(id);
  ctx.body = _result;
});

goodsCatRouter.post('/get_tree', async (ctx) => {
  const _result = await goodsCatRepo.getTree();
  ctx.body = _result;
});

module.exports = goodsCatRouter;
