/**
 * 会员等级 */

const Router = require('@koa/router');

const orderRepo = require('../../../repository/order/order_repos');

const billDeliveryRouter = require('./bill_delivery');
const billLadingRouter = require('./bill_lading');
const billAfterSaleRouter = require('./bill_after_sale');
const billReshipRouter = require('./bill_reship');

const router = Router({ prefix: '/order' });

router.use(billDeliveryRouter.routes());
router.use(billLadingRouter.routes());
router.use(billAfterSaleRouter.routes());
router.use(billReshipRouter.routes());

router.get('/', (ctx) => {
    ctx.body = '订单接口';
});

/**
 * 保存 */
router.post('/save', async (ctx) => {
    let _order = ctx.request.body;

    let _result = {};
    if (_order.id) {
        const _id = _order.id;
        _order = _.omit(_order, 'id');
        _result = await orderRepo.update(_id, _order);
    } else {
        _result = await orderRepo.create(_order);
    }
    ctx.body = _result;
});

/**
 * 删除功能 */
router.post('/delete', async (ctx) => {
    const { ids } = ctx.request.body;

    const _result = await orderRepo.batchDelete(ids);
    ctx.body = _result;
});

/**
 * 功能信息 */
router.post('/get', async (ctx) => {
    const { orderId, type } = ctx.request.body;

    const _result = await orderRepo.get(orderId, type);
    ctx.body = _result;
});

/**
 * 功能列表 */
router.post('/list', async (ctx) => {
    const { searchKey, offset, limit } = ctx.request.body;

    const _result = await orderRepo.list(searchKey, offset, limit);
    ctx.body = _result;
});

/**
 * 完成
 */
router.post('/complate', async (ctx) => {
    const { orderId } = ctx.request.body;

    const _result = await orderRepo.complate(orderId);
    ctx.body = _result;
});

/**
 * 取消
 */
router.post('/cancel', async (ctx) => {
    const { orderIds, userId } = ctx.request.body;

    const _result = await orderRepo.cancel(orderIds, userId);
    ctx.body = _result;
});

module.exports = router;
