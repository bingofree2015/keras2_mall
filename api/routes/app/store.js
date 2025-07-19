/**
 * Created by bingofree.
 */

const Router = require('@koa/router');


const router = Router({ prefix: '/store' });

router.get('/', async (ctx) => {
    ctx.body = '店铺相关接口';
});
/**
 * 判断是否开启门店自提
 */
router.post('/getStoreSwitch', async (ctx) => {
    let {} = ctx.request.body;
    const _result = null;

    ctx.body = _result;
});
/**
 * 获取默认店铺
 */
router.get('/getDefaultStore', async (ctx) => {
    let {} = ctx.request.body;
    const _result = null;

    ctx.body = _result;
});
/**
 * 获取店铺列表
 */
router.get('/getStoreList', async (ctx) => {
    let {} = ctx.request.body;
    const _result = null;

    ctx.body = _result;
});
/**
 * 是否是店员
 */
router.get('/isClerk', async (ctx) => {
    let {} = ctx.request.body;
    const _result = null;

    ctx.body = _result;
});
/**
 * 店铺提货单列表
 */
router.get('/storeLadingList', async (ctx) => {
    let {} = ctx.request.body;
    const _result = null;

    ctx.body = _result;
});
/**
 * 提货单详情
 */
router.get('/ladingInfo', async (ctx) => {
    let {} = ctx.request.body;
    const _result = null;

    ctx.body = _result;
});
/**
 * 提单操作
 */
router.get('/lading', async (ctx) => {
    let {} = ctx.request.body;
    const _result = null;

    ctx.body = _result;
});
/**
 * 提货单删除
 */
router.get('/ladingDel', async (ctx) => {
    let {} = ctx.request.body;
    const _result = null;

    ctx.body = _result;
});
/**
 * 获取邀请小程序码
 */
router.get('/getInviteQRCode', async (ctx) => {
    let {} = ctx.request.body;
    const _result = null;

    ctx.body = _result;
});
/**
 *
 */
router.get('/getRecommendKeys', async (ctx) => {
    let {} = ctx.request.body;
    const _result = null;

    ctx.body = _result;
});

module.exports = router;
