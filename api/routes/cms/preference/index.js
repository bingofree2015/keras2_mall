/**
 * 管理员权限管理 */
import Router from '@koa/router';

import settingRouter from './setting';
import operationLogRouter from './operation_log';
import shipRouter from './ship';
import storeRouter from './store';
import taskRouter from './task';
import messageCenterRouter from './message_center';
import areaRouter from './area';
import logisticsRouter from './logistics';

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
