/**
 * 品牌接口 */

const Router = require('@koa/router');
const { omit } = require('lodash');

const spRuleRepo = require('../../../repository/promotion/sp_rule_repos');

const spRuleRouter = Router({ prefix: '/sp_rule' });

spRuleRouter.get('/', (ctx) => {
    ctx.body = '促销结果接口';
});

/**
 * 功能信息 */
spRuleRouter.post('/get_rule_types', async (ctx) => {
    const _result = {
        succeed     : 1,
        code        : 200,
        description : '成功',
        data        : {
            GOODS_REDUCE: {
                name : '指定商品减固定金额',
                type : 'goods',
            },
            GOODS_DISCOUNT: {
                name : '指定商品打X折',
                type : 'goods',
            },
            GOODS_ONE_PRICE: {
                name : '指定商品一口价',
                type : 'goods',
            },
            ORDER_REDUCE: {
                name : '订单减指定金额',
                type : 'order',
            },
            ORDER_DISCOUNT: {
                name : '订单打X折',
                type : 'order',
            },
            GOODS_HALF_PRICE: {
                name : '指定商品每第几件减指定金额',
                type : 'goods',
            },
        },
    };
    ctx.body = _result;
});

/**
 * 保存 */
spRuleRouter.post('/save', async (ctx) => {
    let _spRule = ctx.request.body;

    let _result = {};
    if (_spRule.id) {
        const _id = _spRule.id;
        _spRule = omit(_spRule, 'id');
        _result = await spRuleRepo.update(_id, _spRule);
    } else {
        _result = await spRuleRepo.create(_spRule);
    }
    ctx.body = _result;
});

/**
 * 删除功能 */
spRuleRouter.post('/delete', async (ctx) => {
    const { ids } = ctx.request.body;

    const _result = await spRuleRepo.delete(ids);
    ctx.body = _result;
});

/**
 * 功能信息 */
spRuleRouter.post('/get', async (ctx) => {
    const { id } = ctx.request.body;

    const _result = await spRuleRepo.get(id);
    ctx.body = _result;
});

/**
 * 功能列表 */
spRuleRouter.post('/list', async (ctx) => {
    const { searchKey, offset, limit } = ctx.request.body;

    const _result = await spRuleRepo.list(searchKey, offset, limit);
    ctx.body = _result;
});

module.exports = spRuleRouter;
