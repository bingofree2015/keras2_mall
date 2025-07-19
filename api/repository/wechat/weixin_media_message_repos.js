const logger = require('tracer').colorConsole();
const { WeixinMediaMessage } = require('../../models');


class WeixinMediaMessageRepos {
    constructor () {
        this._instance = null;
    }

    async create (weixinMediaMessage) {
        let _result = {
            succeed     : 0, // 1:成功0:失败
            code        : 0, // 错误码
            description : '', // 错误信息
            data        : null, // 本身就是一个json字符串
        };

        try {
            Object.keys(weixinMediaMessage).forEach((field) => {
                if (!weixinMediaMessage[field] && weixinMediaMessage[field] != 0) {
                    delete weixinMediaMessage[field];
                }
            });
            if (weixinMediaMessage.title) {
                let _weixinMediaMessage = await WeixinMediaMessage.findOne({
                    where : { title: weixinMediaMessage.title },
                    raw   : true,
                });
                if (_weixinMediaMessage) {
                    _result = {
                        succeed     : 0,
                        code        : 101,
                        description : '标题重复',
                    };
                } else {
                    _weixinMediaMessage = await WeixinMediaMessage.create(weixinMediaMessage);
                    _result = {
                        succeed     : 1,
                        code        : 200,
                        description : '成功',
                        data        : {
                            ...weixinMediaMessage,
                            id: _weixinMediaMessage.id,
                        },
                    };
                }
            } else {
                _result = {
                    succeed     : 0,
                    code        : 100,
                    description : `参数错误 -> weixinMediaMessage:${JSON.stringify(weixinMediaMessage)}`,
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
                const _affectedCount = await WeixinMediaMessage.destroy({ where: { id: ids } });
                if (_affectedCount === 0) {
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

    async update (id, weixinMediaMessage) {
        let _result = {
            succeed     : 0,
            code        : 0,
            description : '',
            data        : null,
        };

        try {
            Object.keys(weixinMediaMessage).forEach((field) => {
                if (!weixinMediaMessage[field] && weixinMediaMessage[field] != 0) {
                    delete weixinMediaMessage[field];
                }
            });
            if (id) {
                const _title = weixinMediaMessage.title;
                if (_title) {
                    let _weixinMediaMessage = await WeixinMediaMessage.findOne({
                        where: {
                            id,
                            title: _title,
                        },
                        raw: true,
                    });
                    if (_weixinMediaMessage) {
                        const _ret = await WeixinMediaMessage.update(weixinMediaMessage, { where: { id } });
                        const _affectedCount = _ret[0];
                        if (_affectedCount === 0) {
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
                                    ...weixinMediaMessage,
                                    id,
                                },
                            };
                        }
                    } else {
                        _weixinMediaMessage = await WeixinMediaMessage.findOne({
                            where: {
                                title : _title,
                                id    : { $ne: id },
                            },
                            raw: true,
                        });
                        if (_weixinMediaMessage) {
                            _result = {
                                succeed     : 0,
                                code        : 101,
                                description : `名称 [${_title}] 重复`,
                            };
                        } else {
                            const _ret = await WeixinMediaMessage.update(weixinMediaMessage, { where: { id } });
                            const _affectedCount = _ret[0];
                            if (_affectedCount === 0) {
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
                                        ...weixinMediaMessage,
                                        id,
                                    },
                                };
                            }
                        }
                    }
                } else {
                    const _ret = await WeixinMediaMessage.update(weixinMediaMessage, { where: { id } });
                    const _affectedCount = _ret[0];
                    if (_affectedCount === 0) {
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
                                ...weixinMediaMessage,
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
            const _weixinMediaMessage = await WeixinMediaMessage.findOne({
                where: { id },
            });
            if (_weixinMediaMessage) {
                _result = {
                    succeed     : 1,
                    code        : 200,
                    description : '成功',
                    data        : _weixinMediaMessage,
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
            if ((offset === 0 || offset) && limit) {
                const _weixinMediaMessages = await WeixinMediaMessage.findAndCountAll({
                    where: _where,
                    offset,
                    limit,
                });
                for (const _weixinMediaMessage of _weixinMediaMessages.rows) {
                    _datas.push(_weixinMediaMessage);
                }
                _result = {
                    succeed     : 1,
                    code        : 200,
                    description : '成功',
                    data        : {
                        list  : _datas,
                        count : _weixinMediaMessages.count,
                    },
                };
            } else {
                const _weixinMediaMessages = await WeixinMediaMessage.findAll({
                    where: _where,
                });
                for (const _weixinMediaMessage of _weixinMediaMessages) {
                    _datas.push(_weixinMediaMessage);
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
            this._instance = new WeixinMediaMessageRepos();
        }
        return this._instance;
    }
}

module.exports = WeixinMediaMessageRepos.getInstance();
