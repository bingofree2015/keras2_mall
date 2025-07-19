/**
 * 任务接口 */
import { omit } from 'lodash';
import Router from '@koa/router';

import TaskRepo from '../../../repository/preference/task_repos';

const taskRouter = Router({ prefix: '/task' });

taskRouter.get('/', (ctx) => {
  ctx.body = '门店接口';
});

/**
 * 保存 */
taskRouter.post('/save', async (ctx) => {
  let _task = ctx.request.body;

  let _result = {};
  if (_task.id) {
    const _id = _task.id;
    _task = omit(_task, 'id');
    _result = await TaskRepo.update(_id, _task);
  } else {
    _result = await TaskRepo.create(_task);
  }
  ctx.body = _result;
});

/**
 * 删除功能 */
taskRouter.post('/delete', async (ctx) => {
  const { ids } = ctx.request.body;

  const _result = await TaskRepo.delete(ids);
  ctx.body = _result;
});

/**
 * 功能信息 */
taskRouter.post('/get', async (ctx) => {
  const { id } = ctx.request.body;

  const _result = await TaskRepo.get(id);
  ctx.body = _result;
});

/**
 * 功能列表 */
taskRouter.post('/list', async (ctx) => {
  const { searchKey, offset, limit } = ctx.request.body;

  const _result = await TaskRepo.list(searchKey, offset, limit);
  ctx.body = _result;
});

module.exports = taskRouter;
