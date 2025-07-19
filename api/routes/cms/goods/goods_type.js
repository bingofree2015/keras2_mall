/**
 * 品牌接口 */
const { omit } = require('lodash');
const Router = require('@koa/router');

const goodsTypeRepo = require('../../../repository/goods/goods_type_repos');

const goodsTypeRouter = Router({ prefix: '/goods_type' });

goodsTypeRouter.get('/', (ctx) => {
    ctx.body = '商品类型接口';
});

/**
 * 保存 */
goodsTypeRouter.post('/save', async (ctx) => {
    let _goodsParam = ctx.request.body;

    let _result = {};
    if (_goodsParam.id) {
        const _id = _goodsParam.id;
        _goodsParam = omit(_goodsParam, 'id');
        _result = await goodsTypeRepo.update(_id, _goodsParam);
    } else {
        _result = await goodsTypeRepo.create(_goodsParam);
    }
    if (_result.succeed == 1 && _result.code == 200) {
        _result.data.specValues = _result.data.specs.map((v) => v.name).join('|');
        _result.data.paramValues = _result.data.params.map((v) => v.name).join('|');
    // "specValues": "颜色|容量|产地|毛重", "paramValues": "风格|大小"
    }
    ctx.body = _result;
});

/**
 * 删除功能 */
goodsTypeRouter.post('/delete', async (ctx) => {
    const { ids } = ctx.request.body;

    const _result = await goodsTypeRepo.delete(ids);
    ctx.body = _result;
});

/**
 * 功能信息 */
goodsTypeRouter.post('/get', async (ctx) => {
    const { id } = ctx.request.body;

    const _result = await goodsTypeRepo.get(id);
    ctx.body = _result;
});

/**
 * 功能列表 */
goodsTypeRouter.post('/list', async (ctx) => {
    const { searchKey, offset, limit } = ctx.request.body;

    const _result = await goodsTypeRepo.list(searchKey, offset, limit);
    ctx.body = _result;
});

module.exports = goodsTypeRouter;
