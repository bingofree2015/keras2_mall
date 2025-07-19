/**
 * 品牌接口 */
const { omit } = require('lodash');
const Router = require('@koa/router');

const billPaymentRepo = require('../../../repository/pay/bill_payment_repos');

const billPaymentRouter = Router({ prefix: '/bill_payment' });

billPaymentRouter.get('/', (ctx) => {
  ctx.body = '支付单接口';
});

/**
 * 保存 */
billPaymentRouter.post('/save', async (ctx) => {
  let _billPayment = ctx.request.body;

  let _result = {};
  if (_billPayment.id) {
    const _id = _billPayment.id;
    _billPayment = omit(_billPayment, 'id');
    _result = await billPaymentRepo.update(_id, _billPayment);
  } else {
    _result = await billPaymentRepo.create(_billPayment);
  }
  ctx.body = _result;
});

/**
 * 删除功能 */
billPaymentRouter.post('/delete', async (ctx) => {
  const { ids } = ctx.request.body;

  const _result = await billPaymentRepo.delete(ids);
  ctx.body = _result;
});

/**
 * 功能信息 */
billPaymentRouter.post('/get', async (ctx) => {
  const { id } = ctx.request.body;

  const _result = await billPaymentRepo.get(id);
  ctx.body = _result;
});

/**
 * 功能列表 */
billPaymentRouter.post('/list', async (ctx) => {
  const { searchKey, offset, limit } = ctx.request.body;

  const _result = await billPaymentRepo.list(searchKey, offset, limit);
  ctx.body = _result;
});

module.exports = billPaymentRouter;
