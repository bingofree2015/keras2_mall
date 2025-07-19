/**
 * 商品 */
import _ from 'lodash';
import Router from '@koa/router';

import goodsRepos from '../../../repository/goods/goods_repos';

import brandRouter from './brand';
import goodsCatRouter from './goods_cat';
import goodsSpecRouter from './goods_spec';
import goodsParamRouter from './goods_param';
import goodsTypeRouter from './goods_type';
import goodsCommentRouter from './goods_comment';

const router = Router({ prefix: '/goods' });

router.use(brandRouter.routes());
router.use(goodsCatRouter.routes());
router.use(goodsSpecRouter.routes());
router.use(goodsParamRouter.routes());
router.use(goodsTypeRouter.routes());
router.use(goodsCommentRouter.routes());

router.get('/', (ctx) => {
  ctx.body = '商品接口';
});

/**
 * 保存 */
router.post('/save', async (ctx) => {
  let _goods = ctx.request.body;

  let _result = {};
  if (_goods.id) {
    const _id = _goods.id;
    _goods = _.omit(_goods, 'id');
    _result = await goodsRepos.update(_id, _goods);
  } else {
    _result = await goodsRepos.create(_goods);
  }
  ctx.body = _result;
});

/**
 * 删除功能 */
router.post('/delete', async (ctx) => {
  const { ids } = ctx.request.body;

  const _result = await goodsRepos.batchDelete(ids);
  ctx.body = _result;
});

/**
 * 功能信息 */
router.post('/get', async (ctx) => {
  const { id } = ctx.request.body;

  const _result = await goodsRepos.get(id);
  ctx.body = _result;
});

/**
 * 功能列表 */
router.post('/list', async (ctx) => {
  const { searchKey, offset, limit } = ctx.request.body;

  const _result = await goodsRepos.list(searchKey, offset, limit);
  ctx.body = _result;
});

module.exports = router;
