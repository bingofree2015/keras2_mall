/**
 * 品牌接口 */
import { omit } from 'lodash';
import Router from '@koa/router';

import billDeliveryRepo from '../../../repository/order/bill_delivery_repos';

const billDeliveryRouter = Router({ prefix: '/bill_delivery' });

billDeliveryRouter.get('/', (ctx) => {
  ctx.body = '发货单接口';
});

/**
 * 保存 */
billDeliveryRouter.post('/save', async (ctx) => {
  let _billDelivery = ctx.request.body;

  let _result = {};
  if (_billDelivery.id) {
    const _id = _billDelivery.id;
    _billDelivery = omit(_billDelivery, 'id');
    _result = await billDeliveryRepo.update(_id, _billDelivery);
  } else {
    _result = await billDeliveryRepo.create(_billDelivery);
  }
  ctx.body = _result;
});

/**
 * 删除功能 */
billDeliveryRouter.post('/delete', async (ctx) => {
  const { ids } = ctx.request.body;

  const _result = await billDeliveryRepo.delete(ids);
  ctx.body = _result;
});

/**
 * 功能信息 */
billDeliveryRouter.post('/get', async (ctx) => {
  const { id } = ctx.request.body;

  const _result = await billDeliveryRepo.get(id);
  ctx.body = _result;
});

/**
 * 功能列表 */
billDeliveryRouter.post('/list', async (ctx) => {
  const { searchKey, offset, limit } = ctx.request.body;

  const _result = await billDeliveryRepo.list(searchKey, offset, limit);
  ctx.body = _result;
});

module.exports = billDeliveryRouter;
