/**
 * 会员等级 */

const Router = require('@koa/router');

const form = require('../../../repository/form/form_repos');

const formSubmitRouter = require('./form_submit');

const router = Router({ prefix: '/form' });

router.use(formSubmitRouter.routes());

router.get('/', (ctx) => {
    ctx.body = '智能表单接口';
});

/**
 * 保存 */
router.post('/save', async (ctx) => {
    let _form = ctx.request.body;
    /**
                    id: 0,                     // 主键
                    name: '',                  // 表单名称
                    type: '',                  // 1订单、2留言、3反馈、4登记、5调研
                    sort: 0,                   // 表单排序
                    desc: '',                  // 表单描述
                    headType: 1,               // 1图片2轮播3视频s
                    headTypeValues: [{ id: 0, path: '' }],        // 表单头值
                    headTypeVideo: '',         // DEFAULT NULL
                    buttonName: '',            // 表单提交按钮名称
                    buttonColor: '',           // 表单按钮颜色
                    isLogin: 1,                // 是否需要登录1需要2不需要
                    qrcode: '',                // 二维码图片地址
                    returnMsg: '',             // 提交后提示语
                    endDate: null,             // 到期时间
                    formItems: [{
                        name: '',               // 字段名称
                        type: '',               // 字段类型
                        validationType: '',     // 验证类型
                        value: '',              // 表单值
                        defaultValue: '',       // 默认值
                        required: 2,            // 是否必填，1必填，2不必填
                        sort: 0,                // 排序
                    }]
     */
    let _result = {};
    let _headTypeValue = '';
    if (_form.headType == 1 || _form.headType == 3) {
        _headTypeValue =
      Array.isArray(_form.headTypeValues) && _form.headTypeValues.length > 0
          ? _form.headTypeValues[0].id.toString()
          : '';
    } else if (_form.headType == 2) {
        _headTypeValue = Array.isArray(_form.headTypeValues)
            ? _form.headTypeValues.map((v) => v.id).join(',')
            : '';
    }
    _form.headTypeValue = _headTypeValue;

    if (_form.id) {
        const _id = _form.id;
        _form = _.omit(_form, 'id');
        _result = await form.update(_id, _form);
    } else {
        _result = await form.create(_form);
    }
    ctx.body = _result;
});

/**
 * 删除功能 */
router.post('/delete', async (ctx) => {
    const { ids } = ctx.request.body;

    const _result = await form.delete(ids);
    ctx.body = _result;
});

/**
 * 功能信息 */
router.post('/get', async (ctx) => {
    const { id } = ctx.request.body;

    const _result = await form.get(id);
    ctx.body = _result;
});

/**
 * 功能列表 */
router.post('/list', async (ctx) => {
    const { searchKey, offset, limit } = ctx.request.body;

    const _result = await form.list(searchKey, offset, limit);
    ctx.body = _result;
});

module.exports = router;
