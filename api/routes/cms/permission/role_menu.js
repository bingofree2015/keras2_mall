/**
 * 管理员权限管理 */
import Router from '@koa/router';

import roleMenuRepo from '../../../repository/permission/role_menu_repos';

const roleMenuRouter = Router({ prefix: '/role_menu' });

roleMenuRouter.get('/', (ctx) => {
  ctx.body = '角色-功能';
});
/**
 * 为角色分配功能 */
roleMenuRouter.post('/create', async (ctx) => {
  const { roleId, menuId } = ctx.request.body;

  let _result = {};
  const _roleMenu = { roleId, menuId };
  _result = await roleMenuRepo.create(_roleMenu);
  ctx.body = _result;
});
/**
 * 删除角色下的功能 */
roleMenuRouter.post('/delete', async (ctx) => {
  const { ids } = ctx.request.body;

  let _result = {};
  _result = await roleMenuRepo.delete(ids);
  ctx.body = _result;
});
/** 修改角色与功能关系 */
roleMenuRouter.post('/update', async (ctx) => {
  const { id, roleId, funcId } = ctx.request.body;

  let _result = {};
  const _roleFunc = { roleId, funcId };
  _result = await roleMenuRepo.update(id, _roleFunc);
  ctx.body = _result;
});
/**
 * 列表 */
roleMenuRouter.post('/list', async (ctx) => {
  const { searchKey, offset, limit } = ctx.request.body;

  let _result = {};
  _result = await roleMenuRepo.list(searchKey, offset, limit);
  ctx.body = _result;
});

module.exports = roleMenuRouter;
