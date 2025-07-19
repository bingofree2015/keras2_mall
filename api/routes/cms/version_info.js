/**
 * 会员等级 */
const Router = require('@koa/router');
const {
    create, batchDelete, update, get, list,
} = require('../../repository/version_info_repos');

const versionInfoRouter = Router({ prefix: '/version_info' });

versionInfoRouter.get('/', (ctx) => {
    ctx.body = '版本管理';
});

/**
 * 新增版本 */
versionInfoRouter.post('/create', async (ctx) => {
    const {
        platform, minVersion, currentVersion, description, appUrl,
    } = ctx.request.body;

    let _result = {};
    const _versionInfo = {
        platform,
        minVersion,
        currentVersion,
        description,
        appUrl,
    };
    _result = await create(_versionInfo);
    ctx.body = _result;
});

/**
    删除版本 */
versionInfoRouter.post('/delete', async (ctx) => {
    const { ids } = ctx.request.body;

    let _result = {};
    _result = await batchDelete(ids);
    ctx.body = _result;
});

/**
 * 修改版本 */
versionInfoRouter.post('/update', async (ctx) => {
    const {
        id, platform, minVersion, currentVersion, description, appUrl,
    } = ctx.request.body;

    let _result = {};
    const _versionInfo = {
        platform,
        minVersion,
        currentVersion,
        description,
        appUrl,
    };
    _result = await update(id, _versionInfo);
    ctx.body = _result;
});

/**
 * 获取版本信息 */
versionInfoRouter.post('/get', async (ctx) => {
    const { id } = ctx.request.body;

    let _result = {};
    _result = await get(id);
    ctx.body = _result;
});

/**
版本列表 */
versionInfoRouter.post('/list', async (ctx) => {
    const { searchKey, offset, limit } = ctx.request.body;

    const _result = await list(searchKey, offset, limit);
    ctx.body = _result;
});

module.exports = versionInfoRouter;
