/**
 * 品牌接口 */
const { omit } = require('lodash');
const Router = require('@koa/router');

const billLadingRepo = require('../../../repository/order/bill_lading_repos');

const billLadingRouter = Router({ prefix: '/bill_lading' });

billLadingRouter.get('/', (ctx) => {
    ctx.body = '提货单接口';
});

/**
 * 保存 */
billLadingRouter.post('/save', async (ctx) => {
    let _billLading = ctx.request.body;

    let _result = {};
    if (_billLading.id) {
        const _id = _billLading.id;
        _billLading = omit(_billLading, 'id');
        _result = await billLadingRepo.update(_id, _billLading);
    } else {
        _result = await billLadingRepo.create(_billLading);
    }
    ctx.body = _result;
});

/**
 * 删除功能 */
billLadingRouter.post('/delete', async (ctx) => {
    const { ids } = ctx.request.body;

    const _result = await billLadingRepo.delete(ids);
    ctx.body = _result;
});

/**
 * 功能信息 */
billLadingRouter.post('/get', async (ctx) => {
    const { id } = ctx.request.body;

    const _result = await billLadingRepo.get(id);
    ctx.body = _result;
});

/**
 * 功能列表 */
billLadingRouter.post('/list', async (ctx) => {
    const { searchKey, offset, limit } = ctx.request.body;

    const _result = await billLadingRepo.list(searchKey, offset, limit);
    ctx.body = _result;
});

module.exports = billLadingRouter;
