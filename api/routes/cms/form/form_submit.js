/**
 * 会员等级 */

const Router = require('@koa/router');
const { omit } = require('lodash');

const formSubmitRepo = require('../../../repository/form/form_submit_repos');

const formSubmitRouter = Router({ prefix: '/form_submit' });

formSubmitRouter.get('/', (ctx) => {
    ctx.body = '智能表单接口';
});

/**
 * 保存 */
formSubmitRouter.post('/save', async (ctx) => {
    let _formSubmit = ctx.request.body;

    let _result = {};
    if (_formSubmit.id) {
        const _id = _formSubmit.id;
        _formSubmit = omit(_formSubmit, 'id');
        _result = await formSubmitRepo.update(_id, _formSubmit);
    } else {
        _result = await formSubmitRepo.create(_formSubmit);
    }
    ctx.body = _result;
});

/**
 * 删除功能 */
formSubmitRouter.post('/delete', async (ctx) => {
    const { ids } = ctx.request.body;

    const _result = await formSubmitRepo.delete(ids);
    ctx.body = _result;
});

/**
 * 功能信息 */
formSubmitRouter.post('/get', async (ctx) => {
    const { id } = ctx.request.body;

    const _result = await formSubmitRepo.get(id);
    ctx.body = _result;
});

/**
 * 功能列表 */
formSubmitRouter.post('/list', async (ctx) => {
    const { searchKey, offset, limit } = ctx.request.body;

    const _result = await formSubmitRepo.list(searchKey, offset, limit);
    ctx.body = _result;
});

/**
 * 报表统计
 */
formSubmitRouter.post('/report', async (ctx) => {
    const { formId, days } = ctx.request.body;

    const _result = await formSubmitRepo.report(formId, days);
    ctx.body = _result;
});

module.exports = formSubmitRouter;
