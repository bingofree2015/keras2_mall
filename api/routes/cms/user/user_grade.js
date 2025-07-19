/**
 * 品牌接口 */
import { omit } from 'lodash';
import Router from '@koa/router';

import userGradeRepo from '../../../repository/user/user_grade_repos';

const userGradeRouter = Router({ prefix: '/user_grade' });

userGradeRouter.get('/', (ctx) => {
  ctx.body = '用户等级接口';
});

/**
 * 保存 */
userGradeRouter.post('/save', async (ctx) => {
  let _userGrade = ctx.request.body;

  let _result = {};
  if (_userGrade.id) {
    const _id = _userGrade.id;
    _userGrade = omit(_userGrade, 'id');
    _result = await userGradeRepo.update(_id, _userGrade);
  } else {
    _result = await userGradeRepo.create(_userGrade);
  }
  ctx.body = _result;
});

/**
 * 删除功能 */
userGradeRouter.post('/delete', async (ctx) => {
  const { ids } = ctx.request.body;

  const _result = await userGradeRepo.delete(ids);
  ctx.body = _result;
});

/**
 * 功能信息 */
userGradeRouter.post('/get', async (ctx) => {
  const { id } = ctx.request.body;

  const _result = await userGradeRepo.get(id);
  ctx.body = _result;
});

/**
 * 功能列表 */
userGradeRouter.post('/list', async (ctx) => {
  const { searchKey, offset, limit } = ctx.request.body;

  const _result = await userGradeRepo.list(searchKey, offset, limit);
  ctx.body = _result;
});

module.exports = userGradeRouter;
