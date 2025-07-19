/**
 * Created by bingofree.
 */

const Router = require('@koa/router');


const router = Router({ prefix: '/weixinshare' });

router.get('/', async (ctx) => {
    ctx.body = '微信分享相关接口';
});
/**
 * 分享
 */
router.post('/share', async (ctx) => {
    let {} = ctx.request.body;
    const _result = null;

    ctx.body = _result;
});
/**
 * 获取公众号签名
 */
router.get('/getSignPackage', async (ctx) => {
    let {} = ctx.request.body;
    const _result = null;

    ctx.body = _result;
});
/**
 * 生成随机字符串
 */
router.get('/createNonceStr', async (ctx) => {
    let {} = ctx.request.body;
    const _result = null;

    ctx.body = _result;
});
/**
 *
 */
router.get('/getJsApiTicket', async (ctx) => {
    const _result = null;
    ctx.body = _result;
});
/**
 *
 */
router.get('/getAccessToken', async (ctx) => {
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

module.exports = router;
