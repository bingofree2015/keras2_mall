/**
 * Created by bingofree.
 */

const Router = require('@koa/router');

const couponRepos = require('../../repository/promotion/coupon_repos');

const router = Router({ prefix: '/coupon' });

router.get('/', async (ctx) => {
    ctx.body = '促销相关接口';
});
/**
 * 获取 商户可领取的优惠券
 */
router.post('/get_coupon_list', async (ctx) => {
    const { limit } = ctx.request.body;
    let _result = null;

    _result = promotionRepos.getCouponList(limit);

    ctx.body = _result;
});
/**
 * 获取优惠券 详情
 */
router.post('/get_coupon_info', async (ctx) => {
    const { id } = ctx.request.body;
    let _result = null;

    _result = promotionRepos.get(id);
    ctx.body = _result;
});
/**
 * 获取用户已领取的优惠券
 */
router.get('/get_received_coupon', async (ctx) => {
    const {
        offset, limit, userId, type, promotionId,
    } = ctx.request.body;
    let _result = null;

    _result = await couponRepos.getReceivedCoupon(userId, offset, limit, type, promotionId);
    ctx.body = _result;
});
/**
 * 用户领取优惠券
 */
router.get('/receive_coupon', async (ctx) => {
    const { userId, promotionId } = ctx.request.body;
    let _result = null;

    _result = await couponRepos.receiveCoupon(userId, promotionId);
    ctx.body = _result;
});
/**
 * 输入优惠券号领取优惠券
 */
router.get('/receive_coupon_with_code', async (ctx) => {
    const { userId, couponCode } = ctx.request.body;
    let _result = null;

    _result = await couponRepos.receiveCouponWithCode(userId, couponCode);
    ctx.body = _result;
});

module.exports = router;
