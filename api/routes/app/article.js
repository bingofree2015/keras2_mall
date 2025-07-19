/**
 * Created by bingofree.
 */

const Router = require('@koa/router');


const router = Router({ prefix: '/article' });

router.get('/', async (ctx) => {
    ctx.body = '文章相关接口';
});
/**
 * 获取全部文章分类列表
 */
router.post('/get_article_type', async (ctx) => {
    let {} = ctx.request.body;
    let _result = null;

    _result = await articleTypeRepo.getTree();
    ctx.body = _result;
});
/**
 * 获取文章列表
 */
router.get('/get_article_list', async (ctx) => {
    const { searchKey, offset, limit } = ctx.request.body;
    let _result = null;

    _result = await articleRepo.list(searchKey, offset, limit);
    ctx.body = _result;
});
/**
 * 获取单个文章的详细信息
 */
router.get('/get_article_info', async (ctx) => {
    const { id } = ctx.request.body;
    let _result = null;

    _result = await articleRepo.get(id);
    ctx.body = _result;
});

module.exports = router;
