/**
 * 品牌接口 */
const { omit } = require('lodash');
const Router = require('@koa/router');

const goodsCommentRepo = require('../../../repository/goods/goods_comment_repos');

const goodsCommentRouter = Router({ prefix: '/goods_comment' });

goodsCommentRouter.get('/', (ctx) => {
    ctx.body = '商品评价接口';
});

/**
 * 保存 */
goodsCommentRouter.post('/save', async (ctx) => {
    let _goodsComment = ctx.request.body;

    let _result = {};
    if (_goodsComment.id) {
        const _id = _goodsComment.id;
        _goodsComment = omit(_goodsComment, 'id');
        _result = await goodsCommentRepo.update(_id, _goodsComment);
    } else {
        _result = await goodsCommentRepo.create(_goodsComment);
    }
    ctx.body = _result;
});

/**
 * 删除功能 */
goodsCommentRouter.post('/delete', async (ctx) => {
    const { ids } = ctx.request.body;

    const _result = await goodsCommentRepo.delete(ids);
    ctx.body = _result;
});

/**
 * 功能信息 */
goodsCommentRouter.post('/get', async (ctx) => {
    const { id } = ctx.request.body;

    const _result = await goodsCommentRepo.get(id);
    ctx.body = _result;
});

/**
 * 功能列表 */
goodsCommentRouter.post('/list', async (ctx) => {
    const { searchKey, offset, limit } = ctx.request.body;

    const _result = await goodsCommentRepo.list(searchKey, offset, limit);
    ctx.body = _result;
});

module.exports = goodsCommentRouter;
