const Koa = require('koa');
const convert = require('koa-convert'); // 将  koa 1.0 中间转化成 koa 2.0 中间件
const json = require('koa-json');
const bodyparser = require('koa-bodyparser');
const logger = require('tracer').colorConsole();

const { JWT } = require('config');
const cors = require('koa2-cors');
const { join } = require('path');
const serve = require('koa-static-prefix');

const { koaBody } = require('koa-body');
const Session = require('koa-session');

const koaJwt = require('koa-jwt'); // 路由权限控制
const jwt = require('jsonwebtoken');
const util = require('util');

const verify = util.promisify(jwt.verify);

const index = require('./routes');
const cms = require('./routes/cms');
const app = require('./routes/app');

const SERVER_UPLOAD_TEMP_DIR = join(process.cwd(), '/upload/temp/');
const koa = new Koa();

koa.keys = ['coupon_mall'];
koa.use(Session({ key: 'coupon_mall:sess' }, koa));
koa.use(cors());

// Custom 401 handling if you don't want to expose koa-jwt errors to users
koa.use(async (ctx, next) => {
    try {
        const _token = ctx.header.authorization; // 获取jwt
        if (_token) {
            try {
                const _payload = await verify(_token.split(' ')[1], JWT.secret); // 解密payload，获取用户名和ID

                ctx.jwtdata = {
                    username : _payload.username,
                    pwd      : _payload.pwd,
                };
            } catch (err) {
                logger.error(err.message);
            }
        }
        await next();
    } catch (err) {
        if (err.status === 401) {
            ctx.status = 401;
            ctx.body = {
                succeed     : 0,
                code        : 401,
                description : '认证失败',
            };
        } else {
            err.status = 404;
            ctx.status = 404;
            ctx.body = {
                succeed     : 0,
                code        : 404,
                description : '请求地址不存在',
            };
            logger.error(err.stack);
        }
    }
});

koa.use(
    koaJwt({
        secret : JWT.secret,
        // passthrough: true,
        key    : 'jwtdata',
    }).unless({
        path: [/^\/assets\/(.*)/, /^\/upload\/(.*)/, /^\/jwt_auth/, /^\/cms\/permission\/login/],
    }),
);

koa.use(
    koaBody({
        multipart  : true, // 允许解析'multipart/form-data'类型的文件
        formidable : {
            uploadDir: SERVER_UPLOAD_TEMP_DIR, // 设置文件上传临时保存路径
        },
    }),
);

koa.use(serve(`${__dirname}/assets`, { pathPrefix: '/assets' }));
koa.use(serve(`${__dirname}/upload`, { pathPrefix: '/upload' }));

// middlewares
koa.use(convert(bodyparser()));
koa.use(convert(json()));
koa.use(async (ctx, next) => {
    const params = ctx.request.method === 'POST'
        ? JSON.stringify(ctx.request.body)
        : JSON.stringify(ctx.query);
    logger.debug(
        `请求地址: ${ctx.request.method} ${ctx.is()} ${ctx.request.url} params:[${params}]`,
    ); // 打印URL
    await next(); // 调用下一个middleware
});
// App 路由
koa.use(index.routes(), index.allowedMethods());
// CMS 路由
koa.use(cms.routes(), cms.allowedMethods());
// app 路由
koa.use(app.routes(), app.allowedMethods());
koa.on('error', (err, ctx) => {
    logger.error('server error', err, ctx);
});

module.exports = koa;
