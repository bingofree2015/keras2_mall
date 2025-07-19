/**
 * 品牌接口 */
const { omit } = require('lodash');
const Router = require('@koa/router');

const weixinMessageRepo = require('../../../repository/wechat/weixin_message_repos');

const weixinMessageRouter = Router({ prefix: '/weixin_message' });

weixinMessageRouter.get('/', (ctx) => {
    ctx.body = '微信消息接口';
});

/**
 * 保存 */
weixinMessageRouter.post('/save', async (ctx) => {
    let _weixinMessage = ctx.request.body;

    let _result = {};
    if (_weixinMessage.id) {
        const _id = _weixinMessage.id;
        _weixinMessage = omit(_weixinMessage, 'id');
        _result = await weixinMessageRepo.update(_id, _weixinMessage);
    } else {
        _result = await weixinMessageRepo.create(_weixinMessage);
    }
    ctx.body = _result;
});

/**
 * 删除功能 */
weixinMessageRouter.post('/delete', async (ctx) => {
    const { ids } = ctx.request.body;

    const _result = await weixinMessageRepo.delete(ids);
    ctx.body = _result;
});

/**
 * 功能信息 */
weixinMessageRouter.post('/get', async (ctx) => {
    const { id } = ctx.request.body;

    const _result = await weixinMessageRepo.get(id);
    ctx.body = _result;
});

/**
 * 功能列表 */
weixinMessageRouter.post('/list', async (ctx) => {
    const { searchKey, offset, limit } = ctx.request.body;

    const _result = await weixinMessageRepo.list(searchKey, offset, limit);
    ctx.body = _result;
});

module.exports = weixinMessageRouter;
