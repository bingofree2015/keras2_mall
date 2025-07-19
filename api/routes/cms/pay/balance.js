/**
 * 品牌接口 */
const { omit } = require('lodash');
const Router = require('@koa/router');

const balanceRepo = require('../../../repository/pay/balance_repos');

const balanceRouter = Router({ prefix: '/balance' });

balanceRouter.get('/', (ctx) => {
    ctx.body = '资金流水接口';
});

/**
 * 保存 */
balanceRouter.post('/save', async (ctx) => {
    let _balance = ctx.request.body;

    let _result = {};
    if (_balance.id) {
        const _id = _balance.id;
        _balance = omit(_balance, 'id');
        _result = await balanceRepo.update(_id, _balance);
    } else {
        _result = await balanceRepo.create(_balance);
    }
    ctx.body = _result;
});

/**
 * 删除功能 */
balanceRouter.post('/delete', async (ctx) => {
    const { ids } = ctx.request.body;

    const _result = await balanceRepo.delete(ids);
    ctx.body = _result;
});

/**
 * 功能信息 */
balanceRouter.post('/get', async (ctx) => {
    const { id } = ctx.request.body;

    const _result = await balanceRepo.get(id);
    ctx.body = _result;
});

/**
 * 功能列表 */
balanceRouter.post('/list', async (ctx) => {
    const { searchKey, offset, limit } = ctx.request.body;

    const _result = await balanceRepo.list(searchKey, offset, limit);
    ctx.body = _result;
});

module.exports = balanceRouter;
