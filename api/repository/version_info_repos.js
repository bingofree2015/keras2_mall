const logger = require('tracer').colorConsole();
const { VersionInfo } = require('../models');


class VersionInfoRepos {
    constructor () {
        this._instance = null;
    }

    async create (versionInfo) {
        let _result = {
            succeed: 0, // 1:成功0:失败
            code: 0, // 错误码
            description: '', // 错误信息
            data: null, // 本身就是一个json字符串
        };

        try {
            Object.keys(versionInfo).forEach((field) => {
                if (!versionInfo[field] && versionInfo[field] != 0) {
                    delete versionInfo[field];
                }
            });
            if (versionInfo.appName) {
                let _versionInfo = await VersionInfo.findOne({
                    where: { appName: versionInfo.appName },
                    raw: true,
                });
                if (_versionInfo) {
                    _result = { succeed: 0, code: 101, description: '记录重复' };
                } else {
                    _versionInfo = await VersionInfo.create(versionInfo);
                    _result = {
                        succeed: 1,
                        code: 200,
                        description: '成功',
                        data: _versionInfo,
                    };
                }
            } else {
                _result = {
                    succeed: 0,
                    code: 100,
                    description: `参数错误 -> versionInfo:${JSON.stringify(versionInfo)}`,
                };
            }
        } catch (err) {
            logger.error(err);
            _result = { succeed: 0, code: 500, description: err.message || err.stack || '系统错误' };
        }

        return _result;
    }

    async batchDelete (ids) {
        let _result = {
            succeed: 0,
            code: 0,
            description: '',
            data: null,
        };

        try {
            if (Array.isArray(ids) && ids.length > 0) {
                const _affectedCount = await VersionInfo.destroy({ where: { id: ids } });
                if (_affectedCount == 0) {
                    _result = { succeed: 0, code: 102, description: '记录不存在' };
                } else {
                    _result = { succeed: 1, code: 200, description: '成功' };
                }
            } else {
                _result = { succeed: 0, code: 100, description: '参数错误' };
            }
        } catch (err) {
            logger.error(err);
            _result = { succeed: 0, code: 500, description: err.message || err.stack || '系统错误' };
        }

        return _result;
    }

    async update (id, versionInfo) {
        let _result = {
            succeed: 0,
            code: 0,
            description: '',
            data: null,
        };

        try {
            Object.keys(versionInfo).forEach((field) => {
                if (!versionInfo[field] && versionInfo[field] != 0) {
                    delete versionInfo[field];
                }
            });
            if (id) {
                const _ret = await VersionInfo.update(versionInfo, { where: { id } });
                const _affectedCount = _ret[0];
                if (_affectedCount == 0) {
                    _result = { succeed: 0, code: 102, description: '记录不存在' };
                } else {
                    _result = {
                        succeed: 1,
                        code: 200,
                        description: '成功',
                        data: { ...versionInfo, id },
                    };
                }
            } else {
                _result = { succeed: 0, code: 100, description: `参数错误 -> id:${id}` };
            }
        } catch (err) {
            logger.error(err);
            _result = { succeed: 0, code: 500, description: err.message || err.stack || '系统错误' };
        }

        return _result;
    }

    async get (id) {
        let _result = {
            succeed: 0,
            code: 0,
            description: '',
            data: null,
        };

        try {
            const _versionInfo = await VersionInfo.findOne({ where: { id }, raw: true });
            if (_versionInfo) {
                _result = {
                    succeed: 1,
                    code: 200,
                    description: '成功',
                    data: _versionInfo,
                };
            } else {
                _result = { succeed: 0, code: 102, description: '数据不存在' };
            }
        } catch (err) {
            logger.error(err);
            _result = { succeed: 0, code: 500, description: err.message || err.stack || '系统错误' };
        }
        return _result;
    }

    async getLastVersionInfo (appName, version) {
        let _result = {
            succeed: 0,
            code: 0,
            description: '',
            data: null,
        };

        try {
            const _versionInfo = await VersionInfo.findOne({
                where: { appName },
                order: [['id', 'DESC']],
                raw: true,
            });
            if (_versionInfo) {
                const _minVersion = _versionInfo.minVersion;
                const _currentVersion = _versionInfo.currentVersion;
                _versionInfo.update = false;
                _versionInfo.mandatory = false;
                if (version <= _minVersion) {
                    _versionInfo.update = true;
                    _versionInfo.mandatory = true;
                    _result = {
                        succeed: 1,
                        code: 200,
                        description: '强制更新',
                        data: _versionInfo,
                    };
                } else if (version > _minVersion && version < _currentVersion) {
                    _versionInfo.update = true;
                    _result = {
                        succeed: 1,
                        code: 200,
                        description: '可选更新',
                        data: _versionInfo,
                    };
                } else if (version == _currentVersion) {
                    _result = {
                        succeed: 1,
                        code: 200,
                        description: '最新版本',
                        data: _versionInfo,
                    };
                } else {
                    _result = { succeed: 0, code: 103, description: '超过当前最新版本号' };
                }
            } else {
                _result = { succeed: 0, code: 100, description: '没有可用版本信息' };
            }
        } catch (err) {
            logger.error(err);
            _result = { succeed: 0, code: 500, description: err.message || err.stack || '系统错误' };
        }
        return _result;
    }

    async list (searchKey, offset, limit) {
        let _result = {
            succeed: 0,
            code: 0,
            description: '',
            data: null,
        };

        const _where = {};
        const _excludeKeys = ['platform'];
        if (searchKey) {
            Object.keys(searchKey).forEach((field) => {
                if (!searchKey[field] && searchKey[field] != 0) {
                    delete searchKey[field];
                }
            });
            for (const _key in searchKey) {
                if (typeof searchKey[_key] === 'string' && !_excludeKeys.includes(_key)) {
                    _where[_key] = {
                        $like: `%${searchKey[_key]}%`,
                    };
                } else {
                    _where[_key] = searchKey[_key];
                }
            }
        }

        const _datas = [];
        try {
            if ((offset == 0 || offset) && limit) {
                const _versionInfos = await VersionInfo.findAndCountAll({
                    where: _where,
                    offset,
                    limit,
                    raw: true,
                });
                for (const _versionInfo of _versionInfos.rows) {
                    _datas.push(_versionInfo);
                }
                _result = {
                    succeed: 1,
                    code: 200,
                    description: '成功',
                    data: { list: _datas, count: _versionInfos.count },
                };
            } else {
                const _versionInfos = await VersionInfo.findAll({ where: _where, raw: true });
                for (const _versionInfo of _versionInfos) {
                    _datas.push(_versionInfo);
                }
                _result = {
                    succeed: 1,
                    code: 200,
                    description: '成功',
                    data: { list: _datas },
                };
            }
        } catch (err) {
            logger.error(err);
            _result = { succeed: 0, code: 500, description: err };
        }

        return _result;
    }

    // 构造一个广为人知的接口，供用户对该类进行实例化
    static getInstance () {
        if (!this._instance) {
            this._instance = new VersionInfoRepos();
        }
        return this._instance;
    }
}

module.exports = VersionInfoRepos.getInstance();
