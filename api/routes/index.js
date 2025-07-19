/**
 * Created by bingofree.
 */
const Router = require('@koa/router');
const { JWT } = require('config');
const { join } = require('path');
const { getType } = require('mime');
const { exists, readFile, readFileSync } = require('mz/fs');
const { parse } = require('papaparse');
const { sign } = require('jsonwebtoken');
const { create } = require('svg-captcha');


const { upload } = require('../utils/uploader');
const { getLastVersionInfo } = require('../repository/version_info_repos');

const SERVER_UPLOAD_DIR = join(process.cwd(), '/upload/');

const router = Router();

router.get('/', async (ctx) => {
    await ctx.render('index', {
        title: '获取您的-jwtdata',
        jwtdata: ctx.state.jwtdata,
    });
});

/**
 * jwt校验(登录接口) */
router.post('/jwt_auth', (ctx) => {
    const { username, pwd } = ctx.request.body;

    if (username && pwd) {
        const payload = { username, pwd };
        const access_token = sign(payload, JWT.secret, { expiresIn: JWT.expiresIn }); // 签发token

        ctx.body = {
            success: 1,
            code: 200,
            description: '成功',
            data: { payload, access_token },
        };
    } else {
        ctx.body = { succeed: 0, code: 100, description: '参数错误' };
    }
});

router.get('/user_info', (ctx) => {
    const token = ctx.header.authorization;
    const { jwtdata } = ctx.state;
    // 使用jwt-simple自行解析数据
    // let payload = jwt.decode(token.split(' ')[1], config.JWT.secret)
    ctx.body = { token, jwtdata };
});

router.get('/download', async (ctx) => {
    let _result = {
        succeed: 0, // 1:成功0:失败
        code: 0, // 错误码
        description: '', // 错误信息
        data: null, // 本身就是一个json字符串
    };

    const _filePath = ctx.query.filePath;
    if (_filePath) {
        try {
            const _resPath = join(SERVER_UPLOAD_DIR, _filePath);
            if (await exists(_resPath)) {
                // 查找文件的mime:
                ctx.type = getType(_resPath);
                // 读取文件内容并赋值给ctx.body:
                ctx.body = await readFile(_resPath);
                return;
            }
            // 文件不存在:
            _result = {
                succeed: 0,
                code: 102,
                description: `服务器文件: [${_resPath}] 不存在`,
            };
        } catch (err) {
            _result = {
                succeed: 0,
                code: 500,
                description: err.message || err.stack || '系统错误',
            };
        }
    } else {
        _result = {
            succeed: 0,
            code: 100,
            description: `参数filePath: [${_filePath}] 为空`,
        };
    }
    ctx.body = _result;
});

/**
 * 上传文件（1：图片、2：视频、3：音频）
 */
router.post('/upload', async (ctx) => {
    let _result = {};
    const { pathType, width, height } = ctx.request.body;

    _result = upload(ctx, pathType, width, height);

    ctx.body = _result;
});

/**
 * 解析上传的帐号文件
 */
router.post('/parseTxtFile', async (ctx) => {
    let _result = {};

    ctx.set('Content-Type', 'text/json'); // 设置返回给前端的类型
    const _txtFile = ctx.request.body.files.file;
    if (_txtFile) {
        try {
            const textString = readFileSync(_txtFile.path, 'utf8');
            const results = parse(textString, {
                delimiter: '|',
            });
            _result = {
                succeed: 1,
                code: 200,
                description: '成功',
                data: results.data,
            };
        } catch (err) {
            logger.error(err);
            _result = {
                succeed: 0,
                code: 500,
                description: err.message || err.stack || '系统错误',
            };
        }
    } else {
        _result = {
            succeed: 0,
            code: 100,
            description: '请选择需要上传的文件',
        };
    }
    ctx.body = _result;
});

/**
 * 获取最新版本信息 */
router.post('/get_last_version_info', async (ctx) => {
    const { name, version } = ctx.request.body;
    let _result = {};
    _result = await getLastVersionInfo(name, version);
    ctx.body = _result;
});

/**
 * 图形验证码 */
router.get('/captcha', async (ctx) => {
    const _captcha = create({
        size: 4,
        fontSize: 42,
        width: 90,
        height: 30,
        background: '#cc9966',
    });
    ctx.session.captcha = _captcha.text;

    ctx.type = 'image/svg+xml';
    ctx.body = _captcha.data;
});

module.exports = router;
