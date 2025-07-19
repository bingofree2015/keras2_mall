/**
 * 配送方式接口 */
const { omit } = require('lodash');
const Router = require('@koa/router');

const shipRepo = require('../../../repository/preference/ship_repos');

const shipRouter = Router({ prefix: '/ship' });

shipRouter.get('/', (ctx) => {
    ctx.body = '配送方式接口';
});

/**
 * 保存 */
shipRouter.post('/save', async (ctx) => {
    let _ship = ctx.request.body;

    let _result = {};
    if (_ship.id) {
        const _id = _ship.id;
        _ship = omit(_ship, 'id');
        _result = await shipRepo.update(_id, _ship);
    } else {
        _result = await shipRepo.create(_ship);
    }
    ctx.body = _result;
});

/**
 * 删除功能 */
shipRouter.post('/delete', async (ctx) => {
    const { ids } = ctx.request.body;

    const _result = await shipRepo.delete(ids);
    ctx.body = _result;
});

/**
 * 功能信息 */
shipRouter.post('/get', async (ctx) => {
    const { id } = ctx.request.body;

    const _result = await shipRepo.get(id);
    ctx.body = _result;
});

/**
 * 功能列表 */
shipRouter.post('/list', async (ctx) => {
    const { searchKey, offset, limit } = ctx.request.body;

    const _result = await shipRepo.list(searchKey, offset, limit);
    ctx.body = _result;
});

module.exports = shipRouter;
