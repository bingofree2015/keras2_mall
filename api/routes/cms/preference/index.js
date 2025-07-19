/**
 * 管理员权限管理 */
const Router = require('@koa/router');

const settingRouter = require('./setting');
const operationLogRouter = require('./operation_log');
const shipRouter = require('./ship');
const storeRouter = require('./store');
const taskRouter = require('./task');
const messageCenterRouter = require('./message_center');
const areaRouter = require('./area');
const logisticsRouter = require('./logistics');

const router = Router({ prefix: '/preference' });

router.use(settingRouter.routes());
router.use(operationLogRouter.routes());
router.use(shipRouter.routes());
router.use(storeRouter.routes());
router.use(taskRouter.routes());
router.use(messageCenterRouter.routes());
router.use(areaRouter.routes());
router.use(logisticsRouter.routes());

router.get('/', (ctx) => {
  ctx.body = '配置接口';
});

module.exports = router;
