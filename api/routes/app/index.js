/**
 * Created by bingofree.
 */

const Router = require('@koa/router');
const uploader = require('../../utils/uploader');
const settingRepos = require('../../repository/preference/setting_repos');

const router = Router({ prefix: '/app' });

router.get('/', async (ctx) => {
    ctx.body = 'app接口';
});
/**
 * 通用上传文件接口（1：图片、2：视频、3：音频）
 */
router.post('/upload', async (ctx) => {
    // 从 body 或 query 中获取参数
    const pathType = ctx.request.body.pathType || ctx.query.pathType;
    const width = parseInt(ctx.request.body.width || ctx.query.width) || 0;
    const height = parseInt(ctx.request.body.height || ctx.query.height) || 0;
    let _result = {};

    _result = await uploader.upload(ctx, pathType, width, height);

    ctx.body = _result;
});
/**
 * 获取店铺设置，此接口用于统一返回店铺的公开设置，然后本地缓存即可
 */
router.get('/get_setting', async (ctx) => {
    const _result = await settingRepos.get('global_variables');

    if (_result.succeed === 1 && _result.code === 200) {
        const _data = _.pick(_result.data, [
            'shopLogo', // 店铺logo
            'shopName', // 店铺名称
            'shopDesc', // 店铺描述
            'imageMax', // 前端上传图片最多几张
            'storeSwitch', // 开启门店自提状态
            'cateStyle', // 分类样式
            'cateType', // H5分类类型
            'tocashMoneyLow', // 最低提现
            'tocashMoneyRate', // 服务费
            'openPoint', // 是否开启积分功能
            'statisticsCode', // 获取统计代码
            'searchKeywords', // 搜索推荐关键字
            'invoicesNeed', // 发票功能开关
            'goodsStocksWarn', // 库存报警数量
            'shopDefaultImage', // 获取默认图片
            'shopMobile', // 店铺联系电话
        ]);
        _result.data = _data;
    }

    ctx.body = _result;
});
/**
 * 取省市区的详细信息
 */
router.post('/area', async (ctx) => {
    let {} = ctx.request.body;
    const _result = null;

    ctx.body = _result;
});
/**
 * 取地区的下级列表
 */
router.post('/area_children', async (ctx) => {
    let {} = ctx.request.body;
    const _result = null;

    ctx.body = _result;
});
/**
 * 获取验证码，如果登陆失败次数太多，就需要验证码了
 */
router.post('/verify', async (ctx) => {
    let {} = ctx.request.body;
    const _result = null;

    ctx.body = _result;
});

module.exports = router;
