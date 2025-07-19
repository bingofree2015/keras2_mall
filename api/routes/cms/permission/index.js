/**
 * 管理员权限管理 */
const Router = require('@koa/router');
const { omit } = require('lodash');
const { JWT } = require('config');
const { sign } = require('jsonwebtoken');

const {
    login,
    resetPwd,
    update,
    create,
    batchDelete,
    get,
    list,
    getPermits,
} = require('../../../repository/permission/sys_user_repos');

const roleRouter = require('./role');
const menuRouter = require('./menu');
const roleMenuRouter = require('./role_menu');

const router = Router({ prefix: '/permission' });

router.use(roleRouter.routes());
router.use(menuRouter.routes());
router.use(roleMenuRouter.routes());

router.get('/', (ctx) => {
    ctx.body = '权限相关接口';
});

/**
 * 管理员登录 */
router.post('/login', async (ctx) => {
    const { username, pwd } = ctx.request.body;

    let _result = {};
    _result = await login(username, pwd);
    if (_result.succeed == 1 && _result.code == 200) {
        const _payload = { username, pwd };
        const _token = sign(_payload, JWT.secret, { expiresIn: JWT.expiresIn });
        _result.data.setDataValue('token', _token);
    }

    ctx.body = _result;
});

router.post('/resetPwd', async (ctx) => {
    const { id, pwd, newPwd } = ctx.request.body;

    ctx.body = await resetPwd(id, pwd, newPwd);
});

/** 退出 */
router.post('/logout', async (ctx) => {
    const _result = {
        succeed: 1,
        code: 200,
        description: '成功',
        data: null,
    };

    ctx.body = _result;
});

/** 保存 */
router.post('/save', async (ctx) => {
    let _sysUser = ctx.request.body;

    let _result = {};
    if (_sysUser.id) {
        const _id = _sysUser.id;
        _sysUser = omit(_sysUser, 'id');
        _result = await update(_id, _sysUser);
    } else {
        _result = await create(_sysUser);
    }
    ctx.body = _result;
});

/** 删除管理员 */
router.post('/delete', async (ctx) => {
    const { ids } = ctx.request.body;

    ctx.body = await batchDelete(ids);
});

/** 管理员信息 */
router.post('/get', async (ctx) => {
    const { id } = ctx.request.body;

    ctx.body = await get(id);
});

/** 管理员列表 */
router.post('/list', async (ctx) => {
    const { searchKey, offset, limit } = ctx.request.body;

    ctx.body = await list(searchKey, offset, limit);
});

// get_permits
router.post('/get_permits', async (ctx) => {
    const { sysUserId } = ctx.request.body;

    ctx.body = await getPermits(sysUserId);
});

module.exports = router;
