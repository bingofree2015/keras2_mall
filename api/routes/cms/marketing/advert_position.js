/**
 * 品牌接口 */
const { omit } = require('lodash');
const Router = require('@koa/router');

const advertPositionRepo = require('../../../repository/advert/advert_position_repos');

const advertPositionRouter = Router({ prefix: '/advert_position' });

advertPositionRouter.get('/', (ctx) => {
    ctx.body = '广告位接口';
});

/**
 * 保存 */
advertPositionRouter.post('/save', async (ctx) => {
    let _articleType = ctx.request.body;

    let _result = {};
    if (_articleType.id) {
        const _id = _articleType.id;
        _articleType = omit(_articleType, 'id');
        _result = await advertPositionRepo.update(_id, _articleType);
    } else {
        _result = await advertPositionRepo.create(_articleType);
    }
    ctx.body = _result;
});

/**
 * 删除功能 */
advertPositionRouter.post('/delete', async (ctx) => {
    const { ids } = ctx.request.body;

    const _result = await advertPositionRepo.delete(ids);
    ctx.body = _result;
});

/**
 * 功能信息 */
advertPositionRouter.post('/get', async (ctx) => {
    const { id } = ctx.request.body;

    const _result = await advertPositionRepo.get(id);
    ctx.body = _result;
});

/**
 * 功能列表 */
advertPositionRouter.post('/list', async (ctx) => {
    const { searchKey, offset, limit } = ctx.request.body;

    const _result = await advertPositionRepo.list(searchKey, offset, limit);
    ctx.body = _result;
});

module.exports = advertPositionRouter;
