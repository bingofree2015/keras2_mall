/**
 * 日志管理 */
const Router = require('@koa/router');

const router = Router({ prefix: '/log' });

router.get('/', (ctx) => {
    ctx.body = '配置接口';
});

module.exports = router;
