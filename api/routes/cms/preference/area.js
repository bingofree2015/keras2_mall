/**
 * 管理员权限管理 */
const { omit } = require('lodash');
const Router = require('@koa/router');

const areaRepo = require('../../../repository/preference/area_repos');

const areaRouter = Router({ prefix: '/area' });

areaRouter.get('/', (ctx) => {
    ctx.body = '功能';
});

/**
 * 保存 */
areaRouter.post('/save', async (ctx) => {
    let _area = ctx.request.body;

    let _result = {};
    if (_area.id) {
        const _id = _area.id;
        _area = omit(_area, 'id');
        _result = await areaRepo.update(_id, _area);
    } else {
        _result = await areaRepo.create(_area);
    }
    ctx.body = _result;
});

/**
 * 删除功能 */
areaRouter.post('/delete', async (ctx) => {
    const { ids } = ctx.request.body;

    const _result = await areaRepo.delete(ids);
    ctx.body = _result;
});

/**
 * 功能信息 */
areaRouter.post('/get', async (ctx) => {
    const { id } = ctx.request.body;

    const _result = await areaRepo.get(id);
    ctx.body = _result;
});

areaRouter.post('/get_tree', async (ctx) => {
    const _result = await areaRepo.getTree();
    ctx.body = _result;
});

areaRouter.post('/list', async (ctx) => {
    const { searchKey, offset, limit } = ctx.request.body;

    const _result = await areaRepo.list(searchKey, offset, limit);
    ctx.body = _result;
});

module.exports = areaRouter;
