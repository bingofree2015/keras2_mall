/**
 * Created by bingofree.
 */
const _ = require('lodash');
const Router = require('@koa/router');
const cartRepos = require('../../repository/order/cart_repos');

const router = Router({ prefix: '/cart' });

router.get('/', async (ctx) => {
  ctx.body = '购物车相关接口';
});
/**
 * 单品加入购物车
 * userId    用户Id
 * productId 商品Id
 * qty       数量
 * mode      添加方式 1:是累加; 2:是覆盖
 * type      购物车类型 1:普通类型 2:拼团
 */
router.post('/add', async (ctx) => {
  const {
    userId, productId, qty, mode, type,
  } = ctx.request.body;
  const _result = null;

  ctx.body = _result;
});
/**
 * 移除购物车
 */
router.get('/remove', async (ctx) => {
  let {} = ctx.request.body;
  const _result = null;

  ctx.body = _result;
});
/**
 * 获取购物车列表
 */
router.get('/get_list', async (ctx) => {
  let {} = ctx.request.body;
  const _result = null;

  ctx.body = _result;
});
/**
 * 设置购物车数量接口
 */
router.get('/set_nums', async (ctx) => {
  let {} = ctx.request.body;
  const _result = null;

  ctx.body = _result;
});
/**
 * 获取购物车数量
 */
router.get('/get_number', async (ctx) => {
  let {} = ctx.request.body;
  const _result = null;

  ctx.body = _result;
});

module.exports = router;
