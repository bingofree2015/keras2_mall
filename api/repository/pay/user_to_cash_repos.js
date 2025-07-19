const logger = require('tracer').colorConsole();
const { UserToCash, User } = require('../../models');


class UserToCashRepos {
    constructor () {
        this._instance = null;
    }

    async create (userToCash) {
        let _result = {
            succeed     : 0, // 1:成功0:失败
            code        : 0, // 错误码
            description : '', // 错误信息
            data        : null, // 本身就是一个json字符串
        };

        try {
            Object.keys(userToCash).forEach((field) => {
                if (!userToCash[field] && userToCash[field] != 0) {
                    delete userToCash[field];
                }
            });
            if (userToCash.userId && userToCash.money) {
                _userToCash = await UserToCash.create(userToCash);
                _result = {
                    succeed     : 1,
                    code        : 200,
                    description : '成功',
                    data        : _userToCash,
                };
            } else {
                _result = {
                    succeed     : 0,
                    code        : 100,
                    description : `参数错误 -> userToCash:${JSON.stringify(userToCash)}`,
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
                const _affectedCount = await UserToCash.destroy({ where: { id: ids } });
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

    async update (id, userToCash) {
        let _result = {
            succeed     : 0,
            code        : 0,
            description : '',
            data        : null,
        };

        try {
            Object.keys(userToCash).forEach((field) => {
                if (!userToCash[field] && userToCash[field] != 0) {
                    delete userToCash[field];
                }
            });
            if (id) {
                const _ret = await UserToCash.update(userToCash, { where: { id } });
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
                            ...userToCash,
                            id,
                        },
                    };
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
            const _userToCash = await UserToCash.findOne({
                include: [
                    {
                        attributes : ['id', 'username'],
                        model      : User,
                        as         : 'user',
                        require    : false,
                    },
                ],
                where: { id },
            });
            if (_userToCash) {
                _result = {
                    succeed     : 1,
                    code        : 200,
                    description : '成功',
                    data        : _userToCash,
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
                const _userToCashs = await UserToCash.findAndCountAll({
                    include: [
                        {
                            attributes : ['id', 'username'],
                            model      : User,
                            as         : 'user',
                            require    : false,
                        },
                    ],
                    distinct : true,
                    where    : _where,
                    offset,
                    limit,
                });
                for (const _userToCash of _userToCashs.rows) {
                    _datas.push(_userToCash);
                }
                _result = {
                    succeed     : 1,
                    code        : 200,
                    description : '成功',
                    data        : {
                        list  : _datas,
                        count : _userToCashs.count,
                    },
                };
            } else {
                const _userToCashs = await UserToCash.findAll({
                    include: [
                        {
                            attributes : ['id', 'username'],
                            model      : User,
                            as         : 'user',
                            require    : false,
                        },
                    ],
                    where: _where,
                });
                for (const _userToCash of _userToCashs) {
                    _datas.push(_userToCash);
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
            this._instance = new UserToCashRepos();
        }
        return this._instance;
    }
}

module.exports = UserToCashRepos.getInstance();
