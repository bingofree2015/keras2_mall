const logger = require('tracer').colorConsole();
const { MessageCenter } = require('../../models');


class MessageCenterRepos {
    constructor () {
        this._instance = null;
    }

    async create (messageCenter) {
        let _result = {
            succeed     : 0, // 1:成功0:失败
            code        : 0, // 错误码
            description : '', // 错误信息
            data        : null, // 本身就是一个json字符串
        };

        try {
            Object.keys(messageCenter).forEach((field) => {
                if (!messageCenter[field] && messageCenter[field] != 0) {
                    delete messageCenter[field];
                }
            });
            if (messageCenter.code) {
                let _messageCenter = await MessageCenter.findOne({
                    where : { code: messageCenter.code },
                    raw   : true,
                });
                if (_messageCenter) {
                    _result = {
                        succeed     : 0,
                        code        : 101,
                        description : '名称重复',
                    };
                } else {
                    _messageCenter = await MessageCenter.create(messageCenter);
                    const _id = _messageCenter.id;
                    _messageCenter = await MessageCenter.findOne({
                        where: { id: _id },
                    });
                    _result = {
                        succeed     : 1,
                        code        : 200,
                        description : '成功',
                        data        : _messageCenter,
                    };
                }
            } else {
                _result = {
                    succeed     : 0,
                    code        : 100,
                    description : `参数错误 -> messageCenter:${JSON.stringify(messageCenter)}`,
                };
            }
        } catch (err) {
            logger.error(err);
            _result = {
                succeed     : 0,
                code        : 500,
                description : err.message || err.stack || '系统错误',
            };
        }

        return _result;
    }

    async delete (ids) {
        let _result = {
            succeed     : 0,
            code        : 0,
            description : '',
            data        : null,
        };

        try {
            if (Array.isArray(ids) && ids.length > 0) {
                const _affectedCount = await MessageCenter.destroy({ where: { id: ids } });
                if (_affectedCount == 0) {
                    _result = {
                        succeed     : 0,
                        code        : 102,
                        description : '记录不存在',
                    };
                } else {
                    _result = {
                        succeed     : 1,
                        code        : 200,
                        description : '成功',
                    };
                }
            } else {
                _result = {
                    succeed     : 0,
                    code        : 100,
                    description : '参数错误',
                };
            }
        } catch (err) {
            logger.error(err);
            _result = {
                succeed     : 0,
                code        : 500,
                description : err.message || err.stack || '系统错误',
            };
        }

        return _result;
    }

    async update (id, messageCenter) {
        let _result = {
            succeed     : 0,
            code        : 0,
            description : '',
            data        : null,
        };

        try {
            Object.keys(messageCenter).forEach((field) => {
                if (!messageCenter[field] && messageCenter[field] != 0) {
                    delete messageCenter[field];
                }
            });
            if (id) {
                const _code = messageCenter.code;
                if (_code) {
                    let _messageCenter = await MessageCenter.findOne({
                        where: {
                            id,
                            code: _code,
                        },
                        raw: true,
                    });
                    if (_messageCenter) {
                        const _ret = await MessageCenter.update(messageCenter, { where: { id } });
                        const _affectedCount = _ret[0];
                        if (_affectedCount == 0) {
                            _result = {
                                succeed     : 0,
                                code        : 102,
                                description : '记录不存在',
                            };
                        } else {
                            _result = {
                                succeed     : 1,
                                code        : 200,
                                description : '成功',
                                data        : {
                                    ...messageCenter,
                                    id,
                                },
                            };
                        }
                    } else {
                        _messageCenter = await MessageCenter.findOne({
                            where: {
                                code : _code,
                                id   : { $ne: id },
                            },
                            raw: true,
                        });
                        if (_messageCenter) {
                            _result = {
                                succeed     : 0,
                                code        : 101,
                                description : `名称 [${_code}] 重复`,
                            };
                        } else {
                            const _ret = await MessageCenter.update(messageCenter, { where: { id } });
                            const _affectedCount = _ret[0];
                            if (_affectedCount == 0) {
                                _result = {
                                    succeed     : 0,
                                    code        : 102,
                                    description : '记录不存在',
                                };
                            } else {
                                _result = {
                                    succeed     : 1,
                                    code        : 200,
                                    description : '成功',
                                    data        : {
                                        ...messageCenter,
                                        id,
                                    },
                                };
                            }
                        }
                    }
                } else {
                    const _ret = await MessageCenter.update(messageCenter, { where: { id } });
                    const _affectedCount = _ret[0];
                    if (_affectedCount == 0) {
                        _result = {
                            succeed     : 0,
                            code        : 102,
                            description : '记录不存在',
                        };
                    } else {
                        _result = {
                            succeed     : 1,
                            code        : 200,
                            description : '成功',
                            data        : {
                                ...messageCenter,
                                id,
                            },
                        };
                    }
                }
            } else {
                _result = {
                    succeed     : 0,
                    code        : 100,
                    description : `参数错误 -> id:${id}`,
                };
            }
        } catch (err) {
            logger.error(err);
            _result = {
                succeed     : 0,
                code        : 500,
                description : err.message || err.stack || '系统错误',
            };
        }

        return _result;
    }

    async get (id) {
        let _result = {
            succeed     : 0,
            code        : 0,
            description : '',
            data        : null,
        };

        try {
            const _messageCenter = await MessageCenter.findOne({
                where: { id },
            });
            if (_messageCenter) {
                _result = {
                    succeed     : 1,
                    code        : 200,
                    description : '成功',
                    data        : _messageCenter,
                };
            } else {
                _result = {
                    succeed     : 0,
                    code        : 102,
                    description : '数据不存在',
                };
            }
        } catch (err) {
            logger.error(err);
            _result = {
                succeed     : 0,
                code        : 500,
                description : err.message || err.stack || '系统错误',
            };
        }
        return _result;
    }

    async list (searchKey, offset, limit) {
        let _result = {
            succeed     : 0,
            code        : 0,
            description : '',
            data        : null,
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
                const _messageCenters = await MessageCenter.findAndCountAll({
                    where: _where,
                    offset,
                    limit,
                });
                for (const _messageCenter of _messageCenters.rows) {
                    _datas.push(_messageCenter);
                }
                _result = {
                    succeed     : 1,
                    code        : 200,
                    description : '成功',
                    data        : {
                        list  : _datas,
                        count : _messageCenters.count,
                    },
                };
            } else {
                const _messageCenters = await MessageCenter.findAll({
                    where: _where,
                });
                for (const _messageCenter of _messageCenters) {
                    _datas.push(_messageCenter);
                }
                _result = {
                    succeed     : 1,
                    code        : 200,
                    description : '成功',
                    data        : { list: _datas },
                };
            }
        } catch (err) {
            logger.error(err);
            _result = {
                succeed     : 0,
                code        : 500,
                description : err,
            };
        }

        return _result;
    }

    // 构造一个广为人知的接口，供用户对该类进行实例化
    static getInstance () {
        if (!this._instance) {
            this._instance = new MessageCenterRepos();
        }
        return this._instance;
    }
}

module.exports = MessageCenterRepos.getInstance();
