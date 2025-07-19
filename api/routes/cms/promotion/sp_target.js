/**
 * 品牌接口 */

const Router = require('@koa/router');

const spTargetRepo = require('../../../repository/promotion/sp_target_repos');

const spTargetRouter = Router({ prefix: '/sp_target' });

spTargetRouter.get('/', (ctx) => {
    ctx.body = '促销条件接口';
});

/**
 * 功能信息 */
spTargetRouter.post('/get_target_types', async (ctx) => {
    const _result = {
        succeed: 1,
        code: 200,
        description: '成功',
        data: {
            GOODS_ALL: {
                name: '所有商品满足条件',
                type: 'goods',
            },
            GOODS_IDS: {
                name: '指定某些商品满足条件',
                type: 'goods',
            },
            GOODS_CATS: {
                name: '指定商品分类满足条件',
                type: 'goods',
            },
            GOODS_BRANDS: {
                name: '指定商品品牌满足条件',
                type: 'goods',
            },
            ORDER_FULL: {
                name: '订单满XX金额满足条件',
                type: 'order',
            },
            USER_GRADE: {
                name: '用户符合指定等级',
                type: 'user',
            },
        },
    };
    ctx.body = _result;
});

/**
 * 保存 */
spTargetRouter.post('/save', async (ctx) => {
    let _spTarget = ctx.request.body;

    let _result = {};
    if (_spTarget.id) {
        const _id = _spTarget.id;
        _spTarget = _.omit(_spTarget, 'id');
        _result = await spTargetRepo.update(_id, _spTarget);
    } else {
        _result = await spTargetRepo.create(_spTarget);
    }
    ctx.body = _result;
});

/**
 * 删除功能 */
spTargetRouter.post('/delete', async (ctx) => {
    const { ids } = ctx.request.body;

    const _result = await spTargetRepo.delete(ids);
    ctx.body = _result;
});

/**
 * 功能信息 */
spTargetRouter.post('/get', async (ctx) => {
    const { id } = ctx.request.body;

    const _result = await spTargetRepo.get(id);
    ctx.body = _result;
});

/**
 * 功能列表 */
spTargetRouter.post('/list', async (ctx) => {
    const { searchKey, offset, limit } = ctx.request.body;

    const _result = await spTargetRepo.list(searchKey, offset, limit);
    ctx.body = _result;
});

module.exports = spTargetRouter;
