/**
 * Created by bingofree.
 */
const _ = require('lodash');
const Router = require('@koa/router');
const goodsCatRepos = require('../../repository/goods/goods_cat_repos');
const goodsRepos = require('../../repository/goods/goods_repos');

const router = Router({ prefix: '/goods' });

router.get('/', async (ctx) => {
  ctx.body = '智能表单相关接口';
});
/**
 * 获取商品分类列表
 */
router.post('/get_goods_category_list', async (ctx) => {
  const { parentId = 0 } = ctx.request.body;
  let _result = null;

  const _searchKey = { parentId };

  _result = await goodsCatRepos.list(_searchKey);
  ctx.body = _result;
});
/**
 * 获取商品列表
 */
router.post('/get_goods_list', async (ctx) => {
  let {} = ctx.request.body;
  const _result = null;

  ctx.body = _result;
});
/**
 * 获取商品明细
 */
router.get('/get_goods_info', async (ctx) => {
  let {} = ctx.request.body;
  const _result = null;

  ctx.body = _result;
});
/**
 * 根据sku获取相关价格，库存等信息
 */
router.get('/get_goods_with_sku', async (ctx) => {
  let {} = ctx.request.body;
  const _result = null;

  ctx.body = _result;
});
/**
 * 获取商品参数
 */
router.get('/get_goods_params', async (ctx) => {
  let {} = ctx.request.body;
  const _result = null;

  ctx.body = _result;
});
/**
 * 获取货品相关信息
 */
router.get('/get_product_info', async (ctx) => {
  let {} = ctx.request.body;
  const _result = null;

  ctx.body = _result;
});
/**
 * 获取商品评价
 */
router.get('/get_goods_comment_list', async (ctx) => {
  let {} = ctx.request.body;
  const _result = null;

  ctx.body = _result;
});
/**
 * 获取某个分类的热卖商品
 */
router.get('/get_hot_goods_with_cat', async (ctx) => {
  let {} = ctx.request.body;
  const _result = null;

  ctx.body = _result;
});
/**
 * 获取推荐商品
 */
router.get('/get_recommend_goods_list', async (ctx) => {
  let {} = ctx.request.body;
  const _result = null;

  ctx.body = _result;
});

module.exports = router;
