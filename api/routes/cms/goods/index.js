/**
 * 商品 */

const Router = require('@koa/router');
const { omit } = require('lodash');

const goodsRepos = require('../../../repository/goods/goods_repos');

const brandRouter = require('./brand');
const goodsCatRouter = require('./goods_cat');
const goodsSpecRouter = require('./goods_spec');
const goodsParamRouter = require('./goods_param');
const goodsTypeRouter = require('./goods_type');
const goodsCommentRouter = require('./goods_comment');

const router = Router({ prefix: '/goods' });

router.use(brandRouter.routes());
router.use(goodsCatRouter.routes());
router.use(goodsSpecRouter.routes());
router.use(goodsParamRouter.routes());
router.use(goodsTypeRouter.routes());
router.use(goodsCommentRouter.routes());

router.get('/', (ctx) => {
    ctx.body = '商品接口';
});

/**
 * 保存 */
router.post('/save', async (ctx) => {
    let _goods = ctx.request.body;

    let _result = {};
    if (_goods.id) {
        const _id = _goods.id;
        _goods = omit(_goods, 'id');
        _result = await goodsRepos.update(_id, _goods);
    } else {
        _result = await goodsRepos.create(_goods);
    }
    ctx.body = _result;
});

/**
 * 删除功能 */
router.post('/delete', async (ctx) => {
    const { ids } = ctx.request.body;

    const _result = await goodsRepos.batchDelete(ids);
    ctx.body = _result;
});

/**
 * 功能信息 */
router.post('/get', async (ctx) => {
    const { id } = ctx.request.body;

    const _result = await goodsRepos.get(id);
    ctx.body = _result;
});

/**
 * 功能列表 */
router.post('/list', async (ctx) => {
    const { searchKey, offset, limit } = ctx.request.body;

    const _result = await goodsRepos.list(searchKey, offset, limit);
    ctx.body = _result;
});

module.exports = router;
