const logger = require('tracer').colorConsole();
const { Notice } = require('../../models');


class NoticeRepos {
    constructor () {
        this._instance = null;
    }

    /**
    id         主键
    title      公告标题
    content    公告内容
    type2      公告类型
    sort       排序
    created_at 创建时间
    updated_at 查看时间
     * @param {*} notice
     */
    async create (notice) {
        let _result = {
            succeed     : 0, // 1:成功0:失败
            code        : 0, // 错误码
            description : '', // 错误信息
            data        : null, // 本身就是一个json字符串
        };

        try {
            Object.keys(notice).forEach((field) => {
                if (!notice[field] && notice[field] != 0) {
                    delete notice[field];
                }
            });
            if (notice.title) {
                let _notice = await Notice.findOne({
                    where : { title: notice.title },
                    raw   : true,
                });
                if (_notice) {
                    _result = {
                        succeed     : 0,
                        code        : 101,
                        description : '记录重复',
                    };
                } else {
                    _notice = await Notice.create(notice);
                    _result = {
                        succeed     : 1,
                        code        : 200,
                        description : '成功',
                        data        : _notice,
                    };
                }
            } else {
                _result = {
                    succeed     : 0,
                    code        : 100,
                    description : `参数错误 -> notice:${JSON.stringify(notice)}`,
                };
            }
        } catch (err) {
            logger.error(err);
            _result = {
                succeed     : 0,
                code        : 500,
                description : err.notice || err.stack || '系统错误',
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
                const _affectedCount = await Notice.destroy({ where: { id: ids } });
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
                description : err.notice || err.stack || '系统错误',
            };
        }

        return _result;
    }

    async update (id, notice) {
        let _result = {
            succeed     : 0,
            code        : 0,
            description : '',
            data        : null,
        };

        try {
            Object.keys(notice).forEach((field) => {
                if (!notice[field] && notice[field] != 0) {
                    delete notice[field];
                }
            });
            if (id) {
                const _title = notice.title;

                if (_title) {
                    let _notice = await Notice.findOne({
                        where: {
                            id,
                            title: _title,
                        },
                        raw: true,
                    });
                    if (_notice) {
                        const _ret = await Notice.update(notice, { where: { id } });
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
                                    ...notice,
                                    id,
                                },
                            };
                        }
                    } else {
                        _notice = await Notice.findOne({
                            where: {
                                title : _title,
                                id    : { $ne: id },
                            },
                            raw: true,
                        });
                        if (_notice) {
                            _result = {
                                succeed     : 0,
                                code        : 101,
                                description : '记录重复',
                            };
                        } else {
                            const _ret = await Notice.update(notice, { where: { id } });
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
                                        ...notice,
                                        id,
                                    },
                                };
                            }
                        }
                    }
                } else {
                    const _ret = await Notice.update(notice, { where: { id } });
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
                                ...notice,
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
                description : err.notice || err.stack || '系统错误',
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
            const _notice = await Notice.findOne({
                where : { id },
                raw   : true,
            });
            if (_notice) {
                _result = {
                    succeed     : 1,
                    code        : 200,
                    description : '成功',
                    data        : _notice,
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
                description : err.notice || err.stack || '系统错误',
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
                const _notices = await Notice.findAndCountAll({
                    where : _where,
                    offset,
                    limit,
                    raw   : true,
                });
                for (const _notice of _notices.rows) {
                    _datas.push(_notice);
                }
                _result = {
                    succeed     : 1,
                    code        : 200,
                    description : '成功',
                    data        : {
                        list  : _datas,
                        count : _notices.count,
                    },
                };
            } else {
                const _notices = await Notice.findAll({
                    where : _where,
                    raw   : true,
                });
                for (const _notice of _notices) {
                    _datas.push(_notice);
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
            this._instance = new NoticeRepos();
        }
        return this._instance;
    }
}

module.exports = NoticeRepos.getInstance();
