/**
 * 管理员权限管理 */
import { omit } from 'lodash';
import Router from '@koa/router';

import menuRepo from '../../../repository/permission/menu_repos';

const menuRouter = Router({ prefix: '/menu' });

menuRouter.get('/', (ctx) => {
  ctx.body = '功能';
});

/**
 * 保存 */
menuRouter.post('/save', async (ctx) => {
  let _menu = ctx.request.body;

  let _result = {};
  if (_menu.id) {
    const _id = _menu.id;
    _menu = omit(_menu, 'id');
    _result = await menuRepo.update(_id, _menu);
  } else {
    _result = await menuRepo.create(_menu);
  }
  ctx.body = _result;
});

/**
 * 删除功能 */
menuRouter.post('/delete', async (ctx) => {
  const { ids } = ctx.request.body;

  const _result = await menuRepo.delete(ids);
  ctx.body = _result;
});

/**
 * 功能信息 */
menuRouter.post('/get', async (ctx) => {
  const { id } = ctx.request.body;

  const _result = await menuRepo.get(id);
  ctx.body = _result;
});

/**
 * 只显示目录与菜单 同时包括隐藏项
 * */
menuRouter.post('/get_route_tree', async (ctx) => {
  const { sysUserId } = ctx.request.body;

  const _result = await menuRepo.getTree(sysUserId, [0, 1]);
  ctx.body = _result;
});

/**
 * 只显示目录与菜单 同时不显示隐藏项
 * */
menuRouter.post('/get_nav_tree', async (ctx) => {
  const { sysUserId } = ctx.request.body;

  const _result = await menuRepo.getTree(sysUserId, [0, 1], 1);
  ctx.body = _result;
});

/**
 * 显示全部内容,主要用于菜单编辑 type: 0:目录 1:菜单 2:按钮
 * */
menuRouter.post('/get_menu_tree', async (ctx) => {
  const _result = await menuRepo.getTree();
  ctx.body = _result;
});

module.exports = menuRouter;
