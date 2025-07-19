const logger = require('tracer').colorConsole();
const { Store, Attachment } = require('../../models');


class StoreRepos {
    constructor () {
        this._instance = null;
    }

    async create (store) {
        let _result = {
            succeed     : 0, // 1:成功0:失败
            code        : 0, // 错误码
            description : '', // 错误信息
            data        : null, // 本身就是一个json字符串
        };

        try {
            Object.keys(store).forEach((field) => {
                if (!store[field] && store[field] != 0) {
                    delete store[field];
                }
            });
            if (store.storeName) {
                let _store = await Store.findOne({
                    where : { storeName: store.storeName },
                    raw   : true,
                });
                if (_store) {
                    _result = {
                        succeed     : 0,
                        code        : 101,
                        description : '名称重复',
                    };
                } else {
                    _store = await Store.create(store);
                    const _id = _store.id;
                    _store = await Store.findOne({
                        where: { id: _id },
                    });
                    _result = {
                        succeed     : 1,
                        code        : 200,
                        description : '成功',
                        data        : _store,
                    };
                }
            } else {
                _result = {
                    succeed     : 0,
                    code        : 100,
                    description : `参数错误 -> store:${JSON.stringify(store)}`,
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
                const _affectedCount = await Store.destroy({ where: { id: ids } });
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

    async update (id, store) {
        let _result = {
            succeed     : 0,
            code        : 0,
            description : '',
            data        : null,
        };

        try {
            Object.keys(store).forEach((field) => {
                if (!store[field] && store[field] != 0) {
                    delete store[field];
                }
            });
            if (id) {
                const _name = store.name;
                if (_name) {
                    let _store = await Store.findOne({
                        where: {
                            id,
                            name: _name,
                        },
                        raw: true,
                    });
                    if (_store) {
                        const _ret = await Store.update(store, { where: { id } });
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
                                    ...store,
                                    id,
                                },
                            };
                        }
                    } else {
                        _store = await Store.findOne({
                            where: {
                                name : _name,
                                id   : { $ne: id },
                            },
                            raw: true,
                        });
                        if (_store) {
                            _result = {
                                succeed     : 0,
                                code        : 101,
                                description : `名称 [${_name}] 重复`,
                            };
                        } else {
                            const _ret = await Store.update(store, { where: { id } });
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
                                        ...store,
                                        id,
                                    },
                                };
                            }
                        }
                    }
                } else {
                    const _ret = await Store.update(store, { where: { id } });
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
                                ...store,
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
            const _store = await Store.findOne({
                include: [
                    {
                        model      : Attachment,
                        attributes : Attachment.getAttributes(),
                        as         : 'attachment',
                        require    : false,
                    },
                ],
                where: { id },
            });
            if (_store) {
                _result = {
                    succeed     : 1,
                    code        : 200,
                    description : '成功',
                    data        : _store,
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
                const _stores = await Store.findAndCountAll({
                    include: [
                        {
                            model      : Attachment,
                            attributes : Attachment.getAttributes(),
                            as         : 'attachment',
                            require    : false,
                        },
                    ],
                    distinct : true,
                    where    : _where,
                    offset,
                    limit,
                });
                for (const _store of _stores.rows) {
                    _datas.push(_store);
                }
                _result = {
                    succeed     : 1,
                    code        : 200,
                    description : '成功',
                    data        : {
                        list  : _datas,
                        count : _stores.count,
                    },
                };
            } else {
                const _stores = await Store.findAll({
                    include: [
                        {
                            model      : Attachment,
                            attributes : Attachment.getAttributes(),
                            as         : 'attachment',
                            require    : false,
                        },
                    ],
                    where: _where,
                });
                for (const _store of _stores) {
                    _datas.push(_store);
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
            this._instance = new StoreRepos();
        }
        return this._instance;
    }
}

module.exports = StoreRepos.getInstance();
