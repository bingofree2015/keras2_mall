/**
 * 管理员权限管理 */
const { omit } = require('lodash');
const Router = require('@koa/router');

const roleRepo = require('../../../repository/permission/role_repos');

const roleRouter = Router({ prefix: '/role' });

roleRouter.get('/', (ctx) => {
    ctx.body = '权限';
});
/** 保存 */
roleRouter.post('/save', async (ctx) => {
    let _role = ctx.request.body;

    let _result = {};
    if (_role.id) {
        const _id = _role.id;
        _role = omit(_role, 'id');
        _result = await roleRepo.update(_id, _role);
    } else {
        _result = await roleRepo.create(_role);
    }
    ctx.body = _result;
});

/**
 * 删除角色 */
roleRouter.post('/delete', async (ctx) => {
    const { ids } = ctx.request.body;

    let _result = {};
    _result = await roleRepo.delete(ids);
    ctx.body = _result;
});

/**
 * 角色信息 */
roleRouter.post('/get', async (ctx) => {
    const { id } = ctx.request.body;

    let _result = {};
    _result = await roleRepo.get(id);
    ctx.body = _result;
});

/**
 * 角色分页列表 */
roleRouter.post('/list', async (ctx) => {
    const { searchKey, offset, limit } = ctx.request.body;

    let _result = {};
    _result = await roleRepo.list(searchKey, offset, limit);
    ctx.body = _result;
});

roleRouter.post('/get_menus_by_roleid', async (ctx) => {
    const { roleId } = ctx.request.body;

    const _result = await roleRepo.get_menus_by_roleid(roleId);

    ctx.body = _result;
});

roleRouter.post('/save_role_menus', async (ctx) => {
    const { roleId, roleMenus } = ctx.request.body;

    const _result = await roleRepo.save_role_menus(roleId, roleMenus);
    ctx.body = _result;
});

module.exports = roleRouter;
