const logger = require('tracer').colorConsole();
const { Logistics } = require('../../models');


class LogisticsRepos {
    constructor () {
        this._instance = null;
    }

    async create (logistics) {
        let _result = {
            succeed: 0, // 1:成功0:失败
            code: 0, // 错误码
            description: '', // 错误信息
            data: null, // 本身就是一个json字符串
        };

        try {
            Object.keys(logistics).forEach((field) => {
                if (!logistics[field] && logistics[field] != 0) {
                    delete logistics[field];
                }
            });
            if (logistics.logiName) {
                let _logistics = await Logistics.findOne({
                    where: { logiName: logistics.logiName },
                    raw: true,
                });
                if (_logistics) {
                    _result = { succeed: 0, code: 101, description: '名称重复' };
                } else {
                    _logistics = await Logistics.create(logistics);
                    _result = {
                        succeed: 1,
                        code: 200,
                        description: '成功',
                        data: _logistics,
                    };
                }
            } else {
                _result = {
                    succeed: 0,
                    code: 100,
                    description: `参数错误 -> logistics:${JSON.stringify(logistics)}`,
                };
            }
        } catch (err) {
            logger.error(err);
            _result = { succeed: 0, code: 500, description: err.message || err.stack || '系统错误' };
        }

        return _result;
    }

    async delete (ids) {
        let _result = {
            succeed: 0,
            code: 0,
            description: '',
            data: null,
        };

        try {
            if (Array.isArray(ids) && ids.length > 0) {
                const _affectedCount = await Logistics.destroy({ where: { id: ids } });
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

    async update (id, logistics) {
        let _result = {
            succeed: 0,
            code: 0,
            description: '',
            data: null,
        };

        try {
            Object.keys(logistics).forEach((field) => {
                if (!logistics[field] && logistics[field] != 0) {
                    delete logistics[field];
                }
            });
            if (id) {
                const _logiName = logistics.logiName;
                if (_logiName) {
                    let _logistics = await Logistics.findOne({
                        where: { id, logiName: _logiName },
                        raw: true,
                    });
                    if (_logistics) {
                        const _ret = await Logistics.update(logistics, { where: { id } });
                        const _affectedCount = _ret[0];
                        if (_affectedCount == 0) {
                            _result = { succeed: 0, code: 102, description: '记录不存在' };
                        } else {
                            _result = {
                                succeed: 1,
                                code: 200,
                                description: '成功',
                                data: { ...logistics, id },
                            };
                        }
                    } else {
                        _logistics = await Logistics.findOne({
                            where: { logiName: _logiName, id: { $ne: id } },
                            raw: true,
                        });
                        if (_logistics) {
                            _result = { succeed: 0, code: 101, description: `名称 [${_title}] 重复` };
                        } else {
                            const _ret = await Logistics.update(logistics, { where: { id } });
                            const _affectedCount = _ret[0];
                            if (_affectedCount == 0) {
                                _result = { succeed: 0, code: 102, description: '记录不存在' };
                            } else {
                                _result = {
                                    succeed: 1,
                                    code: 200,
                                    description: '成功',
                                    data: { ...logistics, id },
                                };
                            }
                        }
                    }
                } else {
                    const _ret = await Logistics.update(logistics, { where: { id } });
                    const _affectedCount = _ret[0];
                    if (_affectedCount == 0) {
                        _result = { succeed: 0, code: 102, description: '记录不存在' };
                    } else {
                        _result = {
                            succeed: 1,
                            code: 200,
                            description: '成功',
                            data: { ...logistics, id },
                        };
                    }
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
            const _logistics = await Logistics.findOne({ where: { id }, raw: true });
            if (_logistics) {
                _result = {
                    succeed: 1,
                    code: 200,
                    description: '成功',
                    data: _logistics,
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

    async list (searchKey, offset, limit) {
        let _result = {
            succeed: 0,
            code: 0,
            description: '',
            data: null,
        };

        const _where = {};
        const _excludeKeys = [];
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
                const _logisticses = await Logistics.findAndCountAll({
                    where: _where,
                    offset,
                    limit,
                    raw: true,
                });
                for (const _logistics of _logisticses.rows) {
                    _datas.push(_logistics);
                }
                _result = {
                    succeed: 1,
                    code: 200,
                    description: '成功',
                    data: { list: _datas, count: _logisticses.count },
                };
            } else {
                const _logisticses = await Logistics.findAll({ where: _where, raw: true });
                for (const _logistics of _logisticses) {
                    _datas.push(_logistics);
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
            this._instance = new LogisticsRepos();
        }
        return this._instance;
    }
}

module.exports = LogisticsRepos.getInstance();
