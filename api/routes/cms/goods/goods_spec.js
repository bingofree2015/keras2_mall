/**
 * 品牌接口 */
const { omit } = require('lodash');
const Router = require('@koa/router');

const goodsSpecRepo = require('../../../repository/goods/goods_spec_repos');

const goodsSpecRouter = Router({ prefix: '/goods_spec' });

goodsSpecRouter.get('/', (ctx) => {
    ctx.body = '商品规格接口';
});

/**
 * 保存 */
goodsSpecRouter.post('/save', async (ctx) => {
    let _goodsSpec = ctx.request.body;

    let _result = {};
    if (_goodsSpec.id) {
        const _id = _goodsSpec.id;
        _goodsSpec = omit(_goodsSpec, 'id');
        _result = await goodsSpecRepo.update(_id, _goodsSpec);
    } else {
        _result = await goodsSpecRepo.create(_goodsSpec);
    }
    ctx.body = _result;
});

/**
 * 删除功能 */
goodsSpecRouter.post('/delete', async (ctx) => {
    const { ids } = ctx.request.body;

    const _result = await goodsSpecRepo.delete(ids);
    ctx.body = _result;
});

/**
 * 功能信息 */
goodsSpecRouter.post('/get', async (ctx) => {
    const { id } = ctx.request.body;

    const _result = await goodsSpecRepo.get(id);
    ctx.body = _result;
});

/**
 * 功能列表 */
goodsSpecRouter.post('/list', async (ctx) => {
    const { searchKey, offset, limit } = ctx.request.body;

    const _result = await goodsSpecRepo.list(searchKey, offset, limit);
    ctx.body = _result;
});

module.exports = goodsSpecRouter;
