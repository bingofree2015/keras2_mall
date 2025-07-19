/**
 * 品牌接口 */
const { omit } = require('lodash');
const Router = require('@koa/router');

const billReshipRepo = require('../../../repository/order/bill_reship_repos');

const billReshipRouter = Router({ prefix: '/bill_reship' });

billReshipRouter.get('/', (ctx) => {
    ctx.body = '退货单接口';
});

/**
 * 保存 */
billReshipRouter.post('/save', async (ctx) => {
    let _billReship = ctx.request.body;

    let _result = {};
    if (_billReship.id) {
        const _id = _billReship.id;
        _billReship = omit(_billReship, 'id');
        _result = await billReshipRepo.update(_id, _billReship);
    } else {
        _result = await billReshipRepo.create(_billReship);
    }
    ctx.body = _result;
});

/**
 * 删除功能 */
billReshipRouter.post('/delete', async (ctx) => {
    const { ids } = ctx.request.body;

    const _result = await billReshipRepo.delete(ids);
    ctx.body = _result;
});

/**
 * 功能信息 */
billReshipRouter.post('/get', async (ctx) => {
    const { id } = ctx.request.body;

    const _result = await billReshipRepo.get(id);
    ctx.body = _result;
});

/**
 * 功能列表 */
billReshipRouter.post('/list', async (ctx) => {
    const { searchKey, offset, limit } = ctx.request.body;

    const _result = await billReshipRepo.list(searchKey, offset, limit);
    ctx.body = _result;
});

module.exports = billReshipRouter;
