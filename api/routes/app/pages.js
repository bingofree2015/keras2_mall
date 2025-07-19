/**
 * Created by bingofree.
 */

const Router = require('@koa/router');


const router = Router({ prefix: '/pages' });

router.get('/', async (ctx) => {
    ctx.body = '订单模块相关接口';
});
/**
 * 定制页配置
 */
router.post('/getPageConfig', async (ctx) => {
    let {} = ctx.request.body;
    const _result = null;

    ctx.body = _result;
});
/**
 * 下单记录
 */
router.get('/getRecod', async (ctx) => {
    let {} = ctx.request.body;
    const _result = null;

    ctx.body = _result;
});

module.exports = router;
