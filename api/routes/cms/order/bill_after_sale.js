/**
 * 品牌接口 */
import { omit } from 'lodash';
import Router from '@koa/router';

import billAfterSaleRepo from '../../../repository/order/bill_after_sale_repos';

const billAfterSaleRouter = Router({ prefix: '/bill_after_sale' });

billAfterSaleRouter.get('/', (ctx) => {
  ctx.body = '售后单接口';
});

/**
 * 保存 */
billAfterSaleRouter.post('/save', async (ctx) => {
  let _billAfterSale = ctx.request.body;

  let _result = {};
  if (_billAfterSale.id) {
    const _id = _billAfterSale.id;
    _billAfterSale = omit(_billAfterSale, 'id');
    _result = await billAfterSaleRepo.update(_id, _billAfterSale);
  } else {
    _result = await billAfterSaleRepo.create(_billAfterSale);
  }
  ctx.body = _result;
});

/**
 * 删除功能 */
billAfterSaleRouter.post('/delete', async (ctx) => {
  const { ids } = ctx.request.body;

  const _result = await billAfterSaleRepo.delete(ids);
  ctx.body = _result;
});

/**
 * 功能信息 */
billAfterSaleRouter.post('/get', async (ctx) => {
  const { id } = ctx.request.body;

  const _result = await billAfterSaleRepo.get(id);
  ctx.body = _result;
});

/**
 * 功能列表 */
billAfterSaleRouter.post('/list', async (ctx) => {
  const { searchKey, offset, limit } = ctx.request.body;

  const _result = await billAfterSaleRepo.list(searchKey, offset, limit);
  ctx.body = _result;
});

module.exports = billAfterSaleRouter;
