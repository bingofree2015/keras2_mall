/**
 * Created by bingofree.
 */
import _ from 'lodash';
import Router from '@koa/router';
import orderRepos from '../../repository/order/order_repos';

const router = Router({ prefix: '/order' });

router.get('/', async (ctx) => {
  ctx.body = '订单模块相关接口';
});
/**
 * 取消订单接口
 */
router.post('/cancel', async (ctx) => {
  const { userId, orderIds } = ctx.request.body;
  let _result = null;

  _result = await orderRepos.cancel(orderIds, userId);
  ctx.body = _result;
});
/**
 * 删除订单接口
 */
router.get('/delete', async (ctx) => {
  const { orderIds } = ctx.request.body;
  let _result = null;

  _result = await orderRepos.batchDelete(orderIds);
  ctx.body = _result;
});
/**
 * 获取订单详情
 */
router.get('/get_order_info', async (ctx) => {
  const { orderId } = ctx.request.body;
  let _result = null;

  _result = await orderRepos.get(orderId, 1);
  ctx.body = _result;
});
/**
 * 确认收货
 */
router.get('/confirm_receipt', async (ctx) => {
  const { userId, orderId } = ctx.request.body;
  let _result = null;

  _result = await orderRepos.confirmReceipt(userId, orderId);
  ctx.body = _result;
});
/**
 * 获取订单列表
 */
router.get('/get_order_list', async (ctx) => {
  const {
    orderId, payState, shipState, startTime, endTime, source, offset, limit,
  } =
    ctx.request.body;
  let _result = null;

  const _searchKey = {
    orderId,
    payState,
    shipState,
    source,
  };
  if (startTime && endTime) {
    _searchKey.createdAt = { $and: { $gt: startTime, $lt: endTime } };
  } else if (startTime) {
    _searchKey.createdAt = { $gt: startTime };
  } else if (endTime) {
    _searchKey.createdAt = { $lt: endTime };
  }
  _result = await orderRepos.list(_searchKey, offset, limit);
  ctx.body = _result;
});
/**
 * 创建订单
 */
router.get('/create', async (ctx) => {
  let {} = ctx.request.body;
  const _result = null;

  ctx.body = _result;
});
/**
 * 获取配送方式
 */
router.get('/getShip', async (ctx) => {
  let {} = ctx.request.body;
  const _result = null;

  ctx.body = _result;
});
/**
 * 获取订单列表微信小程序
 */
router.get('/getOrderList', async (ctx) => {
  let {} = ctx.request.body;
  const _result = null;

  ctx.body = _result;
});
/**
 * 获取订单不同状态的数量
 */
router.get('/getOrderStatusNum', async (ctx) => {
  let {} = ctx.request.body;
  const _result = null;

  ctx.body = _result;
});
/**
 * 售后单列表
 */
router.get('/aftersalesList', async (ctx) => {
  let {} = ctx.request.body;
  const _result = null;

  ctx.body = _result;
});
/**
 * 售后单详情
 */
router.get('/aftersalesInfo', async (ctx) => {
  let {} = ctx.request.body;
  const _result = null;

  ctx.body = _result;
});
/**
 * 查看订单售后状态
 */
router.get('/aftersalesStatus', async (ctx) => {
  let {} = ctx.request.body;
  const _result = null;

  ctx.body = _result;
});
/**
 * 添加售后单
 */
router.get('/addAftersales', async (ctx) => {
  let {} = ctx.request.body;
  const _result = null;

  ctx.body = _result;
});
/**
 * 是否可以评价
 */
router.get('/isComment', async (ctx) => {
  let {} = ctx.request.body;
  const _result = null;

  ctx.body = _result;
});
/**
 * 后台获取订单的物流信息
 */
router.get('/logistics', async (ctx) => {
  let {} = ctx.request.body;
  const _result = null;

  ctx.body = _result;
});
/**
 * 前台物流查询接口
 */
router.get('/logisticsByApi', async (ctx) => {
  let {} = ctx.request.body;
  const _result = null;

  ctx.body = _result;
});
/**
 * 获取当月的资金池
 */
router.get('/getCashPooling', async (ctx) => {
  let {} = ctx.request.body;
  const _result = null;

  ctx.body = _result;
});
/**
 * 获取税号
 */
router.get('/getTaxCode', async (ctx) => {
  let {} = ctx.request.body;
  const _result = null;

  ctx.body = _result;
});

module.exports = router;
