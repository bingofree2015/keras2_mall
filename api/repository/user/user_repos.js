const logger = require('tracer').colorConsole();
const { User, UserGrade } = require('../../models');


class UserRepos {
    constructor () {
        this._instance = null;
    }

    async create (user) {
        let _result = {
            succeed     : 0, // 1:成功 0:失败
            code        : 0, // 错误码
            description : '', // 错误信息
            data        : null, // 本身就是一个json字符串
        };

        try {
            Object.keys(user).forEach((field) => {
                if (!user[field] && user[field] != 0) {
                    delete user[field];
                }
            });
            if (user.mobile) {
                let _user = await User.findOne({
                    where : { mobile: user.mobile },
                    raw   : true,
                });
                if (_user) {
                    _result = {
                        succeed     : 0,
                        code        : 101,
                        description : '手机号重复',
                    };
                } else {
                    _user = await User.create(user);
                    _result = {
                        succeed     : 1,
                        code        : 200,
                        description : '成功',
                        data        : _user,
                    };
                }
            } else {
                _result = {
                    succeed     : 0,
                    code        : 100,
                    description : `参数错误 -> user:${JSON.stringify(user)}`,
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

    async batchDelete (ids) {
        let _result = {
            succeed     : 0,
            code        : 0,
            description : '',
            data        : null,
        };

        try {
            if (Array.isArray(ids) && ids.length > 0) {
                const _affectedCount = await User.destroy({ where: { id: ids } });
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

    async update (id, user) {
        let _result = {
            succeed     : 0,
            code        : 0,
            description : '',
            data        : null,
        };

        try {
            Object.keys(user).forEach((field) => {
                if (!user[field] && user[field] != 0) {
                    delete user[field];
                }
            });
            if (id) {
                const _username = user.username;
                if (_username) {
                    let _user = await User.findOne({
                        where: {
                            id,
                            username: _username,
                        },
                        raw: true,
                    });
                    if (_user) {
                        const _ret = await User.update(user, { where: { id } });
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
                                    ...user,
                                    id,
                                },
                            };
                        }
                    } else {
                        _user = await User.findOne({
                            where: {
                                username : _username,
                                id       : { $ne: id },
                            },
                            raw: true,
                        });
                        if (_user) {
                            _result = {
                                succeed     : 0,
                                code        : 101,
                                description : `名称 [${_username}] 重复`,
                            };
                        } else {
                            const _ret = await User.update(user, { where: { id } });
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
                                        ...user,
                                        id,
                                    },
                                };
                            }
                        }
                    }
                } else {
                    const _ret = await User.update(user, { where: { id } });
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
                                ...user,
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
            const _user = await User.findOne({
                include: [
                    {
                        model      : UserGrade,
                        attributes : ['id', 'level', 'name'],
                        as         : 'userGrade',
                        require    : false,
                    },
                    {
                        model      : User,
                        attributes : ['id', 'username'],
                        as         : 'parent',
                        require    : false,
                    },
                ],
                where: { id },
            });
            if (_user) {
                _result = {
                    succeed     : 1,
                    code        : 200,
                    description : '成功',
                    data        : _user,
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
                const _users = await User.findAndCountAll({
                    include: [
                        {
                            model      : UserGrade,
                            attributes : ['id', 'level', 'name'],
                            as         : 'userGrade',
                            require    : false,
                        },
                        {
                            model      : User,
                            attributes : ['id', 'username'],
                            as         : 'parent',
                            require    : false,
                        },
                    ],
                    where    : _where,
                    distinct : true,
                    offset,
                    limit,
                });
                for (const _user of _users.rows) {
                    _datas.push(_user);
                }
                _result = {
                    succeed     : 1,
                    code        : 200,
                    description : '成功',
                    data        : {
                        list  : _datas,
                        count : _users.count,
                    },
                };
            } else {
                const _users = await User.findAll({
                    include: [
                        {
                            model      : UserGrade,
                            attributes : ['id', 'level', 'name'],
                            as         : 'userGrade',
                            require    : false,
                        },
                        {
                            model      : User,
                            attributes : ['id', 'username'],
                            as         : 'parent',
                            require    : false,
                        },
                    ],
                    where: _where,
                });
                for (const _user of _users) {
                    _datas.push(_user);
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
            this._instance = new UserRepos();
        }
        return this._instance;
    }
}

module.exports = UserRepos.getInstance();
