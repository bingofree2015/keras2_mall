/**
 * 品牌接口 */
const { omit } = require('lodash');
const Router = require('@koa/router');

const billRefundRepo = require('../../../repository/pay/bill_refund_repos');

const billRefundRouter = Router({ prefix: '/bill_refund' });

billRefundRouter.get('/', (ctx) => {
    ctx.body = '退款单接口';
});

/**
 * 保存 */
billRefundRouter.post('/save', async (ctx) => {
    let _billRefund = ctx.request.body;

    let _result = {};
    if (_billRefund.id) {
        const _id = _billRefund.id;
        _billRefund = omit(_billRefund, 'id');
        _result = await billRefundRepo.update(_id, _billRefund);
    } else {
        _result = await billRefundRepo.create(_billRefund);
    }
    ctx.body = _result;
});

/**
 * 删除功能 */
billRefundRouter.post('/delete', async (ctx) => {
    const { ids } = ctx.request.body;

    const _result = await billRefundRepo.delete(ids);
    ctx.body = _result;
});

/**
 * 功能信息 */
billRefundRouter.post('/get', async (ctx) => {
    const { id } = ctx.request.body;

    const _result = await billRefundRepo.get(id);
    ctx.body = _result;
});

/**
 * 功能列表 */
billRefundRouter.post('/list', async (ctx) => {
    const { searchKey, offset, limit } = ctx.request.body;

    const _result = await billRefundRepo.list(searchKey, offset, limit);
    ctx.body = _result;
});

module.exports = billRefundRouter;
