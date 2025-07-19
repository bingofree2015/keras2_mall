/**
 * 数据库备份 */
const { unlinkSync } = require('mz/fs');
const Router = require('@koa/router');
const { DB } = require('config');
const moment = require('moment');

const { backup, restore } = require('../../../utils/db');
const dbBackupRepo = require('../../../repository/system/db_backup_repos');

const dbRouter = Router({ prefix: '/db' });

dbRouter.get('/', (ctx) => {
    ctx.body = '数据库备份';
});

/**
 * 备份数据库 */
dbRouter.post('/backup', async (ctx) => {
    let _result = {};
    try {
        const _options = {
            host: DB.host,
            port: DB.port,
            username: DB.username,
            password: DB.password,
            database: DB.database,
        };
        const _backupPath = `./db/${_options.database}_${moment().format('YYYYMMDD-HH:mm:ss')}.sql`;
        await backup(_options, _backupPath);

        const _dbBackup = { path: _backupPath };
        _result = await dbBackupRepo.create(_dbBackup);
    } catch (err) {
        _result.succeed = -1;
        _result.code = 500;
        _result.description = err.message;
    }
    ctx.body = _result;
});

/**
 * 还原数据库 */
dbRouter.post('/restore', async (ctx) => {
    const { id } = ctx.request.body;
    let _result = {};

    try {
        _result = await dbBackupRepo.get(id);
        if (_result.succeed && _result.data) {
            const _options = {
                host: DB.host,
                port: DB.port,
                username: DB.username,
                password: DB.password,
                database: DB.database,
            };
            const _backupPath = _result.data.path;
            await restore(_options, _backupPath);
        }
    } catch (err) {
        _result.succeed = -1;
        _result.code = 500;
        _result.description = err.message;
    }
    ctx.body = _result;
});

/**
 * 删除备份文件 */
dbRouter.post('/delete', async (ctx) => {
    const { ids } = ctx.request.body;

    let _result = {};
    _result = await dbBackupRepo.list({ id: ids });
    if (_result.succeed && Array.isArray(_result.data.list)) {
        for (const item of _result.data.list) {
            try {
                unlinkSync(item.path); // 删除临时文件
            } catch (err) {
                console.info(`文件:${item.path} 不存在`);
            }
        }
    }
    _result = await dbBackupRepo.delete(ids);
    ctx.body = _result;
});

/**
 * 备份文件列表 */
dbRouter.post('/list', async (ctx) => {
    const { searchKey, offset, limit } = ctx.request.body;

    let _result = {};
    _result = await dbBackupRepo.list(searchKey, offset, limit);
    ctx.body = _result;
});

module.exports = dbRouter;
