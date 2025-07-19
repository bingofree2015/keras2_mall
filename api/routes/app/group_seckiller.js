/**
 * Created by bingofree.
 */

const Router = require('@koa/router');


const router = Router({ prefix: '/group_seckiller' });

router.get('/', async (ctx) => {
    ctx.body = '团购秒杀活动接口';
});
/**
 * 获取团购秒杀活动列表
 */
router.post('/get_promotion_list', async (ctx) => {
    let {} = ctx.request.body;
    const _result = null;

    ctx.body = _result;
});
/**
 * 获取活动商品详情
 */
router.get('/get_promotion_goods_info', async (ctx) => {
    let {} = ctx.request.body;
    const _result = null;

    ctx.body = _result;
});

module.exports = router;
