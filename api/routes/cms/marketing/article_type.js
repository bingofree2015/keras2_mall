/**
 * 品牌接口 */
const { omit } = require('lodash');
const Router = require('@koa/router');

const articleTypeRepo = require('../../../repository/article/article_type_repos');

const articleTypeRouter = Router({ prefix: '/article_type' });

articleTypeRouter.get('/', (ctx) => {
    ctx.body = '文章分类接口';
});

/**
 * 保存 */
articleTypeRouter.post('/save', async (ctx) => {
    let _articleType = ctx.request.body;

    let _result = {};
    if (_articleType.id) {
        const _id = _articleType.id;
        _articleType = omit(_articleType, 'id');
        _result = await articleTypeRepo.update(_id, _articleType);
    } else {
        _result = await articleTypeRepo.create(_articleType);
    }
    ctx.body = _result;
});

/**
 * 删除功能 */
articleTypeRouter.post('/delete', async (ctx) => {
    const { ids } = ctx.request.body;

    const _result = await articleTypeRepo.delete(ids);
    ctx.body = _result;
});

/**
 * 功能信息 */
articleTypeRouter.post('/get', async (ctx) => {
    const { id } = ctx.request.body;

    const _result = await articleTypeRepo.get(id);
    ctx.body = _result;
});

/**
 * 功能列表 */
articleTypeRouter.post('/get_tree', async (ctx) => {
    const _result = await articleTypeRepo.getTree();
    ctx.body = _result;
});

module.exports = articleTypeRouter;
