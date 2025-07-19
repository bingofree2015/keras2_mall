/**
 * Created by bingofree.
 */
const Router = require('@koa/router');
const orderRepo = require('../../repository/order/order_repos');
const { getCount } = require('../../repository/order/bill_after_sale_repos');
const { getStatistics } = require('../../repository/goods/goods_repos');
const { upload } = require('../../utils/uploader');
const systemRouter = require('./system');
const logRouter = require('./log');
const permissionRouter = require('./permission');
const preferenceRouter = require('./preference');
const versionInfoRouter = require('./version_info');
const attachGroupRouter = require('./attach_group');
const attachmentRouter = require('./attachment');
const goodsRouter = require('./goods');
const userRouter = require('./user');
const orderRouter = require('./order');
const payRouter = require('./pay');
const marketingRouter = require('./marketing');
const promotionRouter = require('./promotion');
const reportRouter = require('./report');

const wechatRouter = require('./wechat');
const form = require('./form');
const page = require('./page');

const mapAlias = require('../../config/map_alias');

const router = Router({ prefix: '/cms' });
router.use(systemRouter.routes());
router.use(logRouter.routes());
router.use(permissionRouter.routes());
router.use(preferenceRouter.routes());
router.use(versionInfoRouter.routes());
router.use(attachGroupRouter.routes());
router.use(attachmentRouter.routes());
router.use(goodsRouter.routes());
router.use(userRouter.routes());
router.use(orderRouter.routes());
router.use(payRouter.routes());
router.use(marketingRouter.routes());
router.use(promotionRouter.routes());
router.use(reportRouter.routes());

router.use(wechatRouter.routes());
router.use(page.routes());

router.use(form.routes());

router.get('/map_alias', async (ctx) => {
    ctx.body = mapAlias;
});

router.get('/', async (ctx) => {
    ctx.body = 'cms后台接口';
});

/**
 * 通用上传文件接口（1：图片、2：视频、3：音频）
 */
router.post('/upload', async (ctx) => {
    const { pathType, width, height } = ctx.request.body;
    let _result = {};

    _result = await upload(ctx, pathType, width, height);

    ctx.body = _result;
});

/**
 * 面板 */
router.post('/welcome', async (ctx) => {
    let _result = {};
    const _items = {};

    // 未发货数量
    _result = await orderRepo.getCount(1, 1, 1);
    if (_result.succeed == 1 && _result.code == 200) {
        _items.unpaidCount = _result.data;
    }
    // 待发货数量
    _result = await orderRepo.getCount(1, 2, 1);
    if (_result.succeed == 1 && _result.code == 200) {
        _items.unshipCount = _result.data;
    }
    // 待售后数量
    _result = await getCount();
    if (_result.succeed == 1 && _result.code == 200) {
        _items.afterSalesCount = _result.data;
    }
    _result = await getStatistics();
    if (_result.succeed == 1 && _result.code == 200) {
        _items.goodsStatistics = _result.data;
    }
    Object.assign(_result, { data: _items });

    ctx.body = _result;
});

module.exports = router;
