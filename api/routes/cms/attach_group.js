/**
 * 会员等级 */
const { omit } = require('lodash');
const Router = require('@koa/router');
const {
    update, create, batchDelete, get, list,
} = require('../../repository/attach/attach_group_repos');

const attachGroupRouter = Router({ prefix: '/attach_group' });

attachGroupRouter.get('/', (ctx) => {
    ctx.body = '附件分组管理';
});

/**
 * 保存 */
attachGroupRouter.post('/save', async (ctx) => {
    let _attachGroup = ctx.request.body;

    let _result = {};
    if (_attachGroup.id) {
        const _id = _attachGroup.id;
        _attachGroup = omit(_attachGroup, 'id');
        _result = await update(_id, _attachGroup);
    } else {
        _result = await create(_attachGroup);
    }
    ctx.body = _result;
});

/**
 * 删除版本 */
attachGroupRouter.post('/delete', async (ctx) => {
    const { ids } = ctx.request.body;

    const _result = await batchDelete(ids);
    ctx.body = _result;
});

/**
 * 获取版本信息 */
attachGroupRouter.post('/get', async (ctx) => {
    const { id } = ctx.request.body;

    const _result = await get(id);
    ctx.body = _result;
});

/**
 * 版本列表 */
attachGroupRouter.post('/list', async (ctx) => {
    const { searchKey, offset, limit } = ctx.request.body;

    const _result = await list(searchKey, offset, limit);
    ctx.body = _result;
});

module.exports = attachGroupRouter;
