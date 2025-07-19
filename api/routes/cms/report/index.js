/**
 * 管理员权限管理 */
import Router from '@koa/router';

import report from '../../../repository/report_repos';

const router = Router({ prefix: '/report' });

router.get('/', (ctx) => {
  ctx.body = '统计相关接口';
});

/**
 * 用户收藏 */
router.post('/get_goods_collections', async (ctx) => {
  const { searchKey } = ctx.request.body;

  const _result = await report.getGoodsCollections(searchKey);
  ctx.body = _result;
});

/**
 * 订单统计 */
router.post('/get_order_data', async (ctx) => {
  const { startTime, endTime, unit } = ctx.request.body;

  const _result = await report.getOrderData(startTime, endTime, unit);
  ctx.body = _result;
});

/**
 * 财务统计 */
router.post('/get_pay_data', async (ctx) => {
  const { startTime, endTime, unit } = ctx.request.body;

  const _result = await report.getPayData(startTime, endTime, unit);
  ctx.body = _result;
});

/**
 * 商品销量 */
router.post('/get_goods', async (ctx) => {
  const _result = await report.getGoods();
  ctx.body = _result;
});

module.exports = router;
