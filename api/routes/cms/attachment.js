/**
 * 会员等级 */
const Router = require('@koa/router');
const { omit } = require('lodash');
const {
    update, create, batchDelete, get, list,
} = require('../../repository/attach/attachment_repos');
const { download } = require('../../utils/uploader');

const attachmentRouter = Router({ prefix: '/attachment' });

attachmentRouter.get('/', (ctx) => {
    ctx.body = '附件管理';
});

/**
 * 保存 */
attachmentRouter.post('/save', async (ctx) => {
    let _attachment = ctx.request.body;

    let _result = {};
    if (_attachment.id) {
        const _id = _attachment.id;
        _attachment = omit(_attachment, 'id');
        _result = await update(_id, _attachment);
    } else {
        _result = await create(_attachment);
    }
    ctx.body = _result;
});

/**
 * 删除版本 */
attachmentRouter.post('/delete', async (ctx) => {
    const { ids } = ctx.request.body;

    const _result = await batchDelete(ids);
    ctx.body = _result;
});

/**
    取版本信息 */
attachmentRouter.post('/get', async (ctx) => {
    const { id } = ctx.request.body;

    const _result = await get(id);
    ctx.body = _result;
});

/**
    件列表 */
attachmentRouter.post('/list', async (ctx) => {
    const { searchKey, offset, limit } = ctx.request.body;

    const _result = await list(searchKey, offset, limit);
    ctx.body = _result;
});

attachmentRouter.post('/download', async (ctx) => {
    const {
        pathType, imgUrl, attachGroupId, width, height,
    } = ctx.request.body;

    let _result = await download(pathType, imgUrl, width, height);
    if (_result.succeed == 1 && _result.code == 200) {
        const _attachment = {
            attachGroupId,
            name: _result.data.fileName,
            type: _result.data.fileType,
            path: _result.data.fileUrl,
            size: 0,
        };
        _result = await create(_attachment);
    }

    ctx.body = _result;
});

module.exports = attachmentRouter;
