const logger = require('tracer').colorConsole();
const { WeixinMessage } = require('../../models');


class WeixinMessageRepos {
    constructor () {
        this._instance = null;
    }

    async create (weixinMessage) {
        let _result = {
            succeed: 0, // 1:成功0:失败
            code: 0, // 错误码
            description: '', // 错误信息
            data: null, // 本身就是一个json字符串
        };

        try {
            Object.keys(weixinMessage).forEach((field) => {
                if (!weixinMessage[field] && weixinMessage[field] != 0) {
                    delete weixinMessage[field];
                }
            });
            if (weixinMessage.name && weixinMessage.type) {
                let _weixinMessage = await WeixinMessage.findOne({
                    where: { name: weixinMessage.name, type: weixinMessage.type },
                    raw: true,
                });
                if (_weixinMessage) {
                    _result = { succeed: 0, code: 101, description: '名称重复' };
                } else {
                    _weixinMessage = await WeixinMessage.create(weixinMessage);
                    _result = {
                        succeed: 1,
                        code: 200,
                        description: '成功',
                        data: { ...weixinMessage, id: _weixinMessage.id },
                    };
                }
            } else {
                _result = {
                    succeed: 0,
                    code: 100,
                    description: `参数错误 -> weixinMessage:${JSON.stringify(weixinMessage)}`,
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
                const _affectedCount = await WeixinMessage.destroy({ where: { id: ids } });
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

    async update (id, weixinMessage) {
        let _result = {
            succeed: 0,
            code: 0,
            description: '',
            data: null,
        };

        try {
            Object.keys(weixinMessage).forEach((field) => {
                if (!weixinMessage[field] && weixinMessage[field] != 0) {
                    delete weixinMessage[field];
                }
            });
            if (id) {
                const _name = weixinMessage.name;
                const _type = weixinMessage.type;
                if (_name) {
                    let _weixinMessage = await WeixinMessage.findOne({
                        where: { id, name: _name, type: _type },
                        raw: true,
                    });
                    if (_weixinMessage) {
                        const _ret = await WeixinMessage.update(weixinMessage, { where: { id } });
                        const _affectedCount = _ret[0];
                        if (_affectedCount == 0) {
                            _result = { succeed: 0, code: 102, description: '记录不存在' };
                        } else {
                            _result = {
                                succeed: 1,
                                code: 200,
                                description: '成功',
                                data: { ...weixinMessage, id },
                            };
                        }
                    } else {
                        _weixinMessage = await WeixinMessage.findOne({
                            where: { name: _name, type: _type, id: { $ne: id } },
                            raw: true,
                        });
                        if (_weixinMessage) {
                            _result = { succeed: 0, code: 101, description: `名称 [${_name}] 重复` };
                        } else {
                            const _ret = await WeixinMessage.update(weixinMessage, { where: { id } });
                            const _affectedCount = _ret[0];
                            if (_affectedCount == 0) {
                                _result = { succeed: 0, code: 102, description: '记录不存在' };
                            } else {
                                _result = {
                                    succeed: 1,
                                    code: 200,
                                    description: '成功',
                                    data: { ...weixinMessage, id },
                                };
                            }
                        }
                    }
                } else {
                    const _ret = await WeixinMessage.update(weixinMessage, { where: { id } });
                    const _affectedCount = _ret[0];
                    if (_affectedCount == 0) {
                        _result = { succeed: 0, code: 102, description: '记录不存在' };
                    } else {
                        _result = {
                            succeed: 1,
                            code: 200,
                            description: '成功',
                            data: { ...weixinMessage, id },
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
            const _weixinMessage = await WeixinMessage.findOne({
                where: { id },
            });
            if (_weixinMessage) {
                _result = {
                    succeed: 1,
                    code: 200,
                    description: '成功',
                    data: _weixinMessage,
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
                const _weixinMessages = await WeixinMessage.findAndCountAll({
                    where: _where,
                    offset,
                    limit,
                });
                for (const _weixinMessage of _weixinMessages.rows) {
                    _datas.push(_weixinMessage);
                }
                _result = {
                    succeed: 1,
                    code: 200,
                    description: '成功',
                    data: { list: _datas, count: _weixinMessages.count },
                };
            } else {
                const _weixinMessages = await WeixinMessage.findAll({
                    where: _where,
                });
                for (const _weixinMessage of _weixinMessages) {
                    _datas.push(_weixinMessage);
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
            this._instance = new WeixinMessageRepos();
        }
        return this._instance;
    }
}

module.exports = WeixinMessageRepos.getInstance();
