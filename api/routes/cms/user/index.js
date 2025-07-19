/**
 * 管理员权限管理 */

const Router = require('@koa/router');

const {
    create, batchDelete, update, get, list,
} = require('../../../repository/user/user_repos');
const userGradeRouter = require('./user_grade');

const router = Router({ prefix: '/user' });

router.use(userGradeRouter.routes());

router.get('/', (ctx) => {
    ctx.body = '会员管理接口';
});

/**
 * 保存 */
router.post('/save', async (ctx) => {
    let _user = ctx.request.body;

    let _result = {};
    if (_user.id) {
        const _id = _user.id;
        _user = _.omit(_user, 'id');
        _result = await update(_id, _user);
    } else {
        _result = await create(_user);
    }
    ctx.body = _result;
});

/**
 * 删除功能 */
router.post('/delete', async (ctx) => {
    const { ids } = ctx.request.body;

    const _result = await batchDelete(ids);
    ctx.body = _result;
});

/**
 * 功能信息 */
router.post('/get', async (ctx) => {
    const { id } = ctx.request.body;

    const _result = await get(id);
    ctx.body = _result;
});

/**
 * 功能列表 */
router.post('/list', async (ctx) => {
    const { searchKey, offset, limit } = ctx.request.body;

    const _result = await list(searchKey, offset, limit);
    ctx.body = _result;
});

module.exports = router;
