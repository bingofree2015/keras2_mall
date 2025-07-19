/**
 * 管理员权限管理 */
import _ from 'lodash';
import Router from '@koa/router';

import paymentRepo from '../../../repository/pay/payment_repos';
import balanceRouter from './balance';
import billPaymentRouter from './bill_payment';
import billRefundRouter from './bill_refund';
import userToCashRouter from './user_to_cash';

const router = Router({ prefix: '/pay' });

router.use(balanceRouter.routes());
router.use(billPaymentRouter.routes());
router.use(billRefundRouter.routes());
router.use(userToCashRouter.routes());

router.get('/', (ctx) => {
  ctx.body = '财务管理接口';
});

/**
 * 保存 */
router.post('/save', async (ctx) => {
  let _user = ctx.request.body;

  let _result = {};
  if (_user.id) {
    const _id = _user.id;
    _user = _.omit(_user, 'id');
    _result = await paymentRepo.update(_id, _user);
  } else {
    _result = await paymentRepo.create(_user);
  }
  ctx.body = _result;
});

/**
 * 删除功能 */
router.post('/delete', async (ctx) => {
  const { ids } = ctx.request.body;

  const _result = await paymentRepo.delete(ids);
  ctx.body = _result;
});

/**
 * 功能信息 */
router.post('/get', async (ctx) => {
  const { id } = ctx.request.body;

  const _result = await paymentRepo.get(id);
  ctx.body = _result;
});

/**
 * 功能列表 */
router.post('/list', async (ctx) => {
  const { searchKey, offset, limit } = ctx.request.body;

  const _result = await paymentRepo.list(searchKey, offset, limit);
  ctx.body = _result;
});

module.exports = router;
