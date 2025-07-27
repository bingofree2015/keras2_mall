const logger = require('tracer').colorConsole();
const { Op } = require('sequelize');
const { UserGrade } = require('../../models');


class UserGradeRepos {
    constructor () {
        this._instance = null;
    }

    async create (userGrade) {
        let _result = {
            succeed     : 0, // 1:成功0:失败
            code        : 0, // 错误码
            description : '', // 错误信息
            data        : null, // 本身就是一个json字符串
        };

        try {
            Object.keys(userGrade).forEach((field) => {
                if (!userGrade[field] && userGrade[field] != 0) {
                    delete userGrade[field];
                }
            });
            if (userGrade.name) {
                let _userGrade = await UserGrade.findOne({
                    where : { name: userGrade.name },
                    raw   : true,
                });
                if (_userGrade) {
                    _result = {
                        succeed     : 0,
                        code        : 101,
                        description : '名称重复',
                    };
                } else {
                    _userGrade = await UserGrade.create(userGrade);
                    if (userGrade.isDef === true) {
                        await UserGrade.update({ isDef: false }, { where: { id: { $ne: _userGrade.id } } });
                    }
                    _result = {
                        succeed     : 1,
                        code        : 200,
                        description : '成功',
                        data        : _userGrade,
                    };
                }
            } else {
                _result = {
                    succeed     : 0,
                    code        : 100,
                    description : `参数错误 -> userGrade:${JSON.stringify(userGrade)}`,
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
                const _affectedCount = await UserGrade.destroy({ where: { id: ids } });
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

    async update (id, userGrade) {
        let _result = {
            succeed     : 0,
            code        : 0,
            description : '',
            data        : null,
        };

        try {
            Object.keys(userGrade).forEach((field) => {
                if (!userGrade[field] && userGrade[field] != 0) {
                    delete userGrade[field];
                }
            });
            if (id) {
                const _userId = userGrade.userId;
                const _title = userGrade.title;
                if (_userId && _title) {
                    let _userGrade = await UserGrade.findOne({
                        where: {
                            id,
                            userId : _userId,
                            title  : _title,
                        },
                        raw: true,
                    });
                    if (_userGrade) {
                        const _ret = await UserGrade.update(userGrade, { where: { id } });
                        if (userGrade.isDef === true) {
                            await UserGrade.update({ isDef: false }, { where: { id: { $ne: id } } });
                        }
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
                                    ...userGrade,
                                    id,
                                },
                            };
                        }
                    } else {
                        _userGrade = await UserGrade.findOne({
                            where: {
                                userId : _userId,
                                title  : _title,
                                id     : { $ne: id },
                            },
                            raw: true,
                        });
                        if (_userGrade) {
                            _result = {
                                succeed     : 0,
                                code        : 101,
                                description : `名称 [${_title}] 重复`,
                            };
                        } else {
                            const _ret = await UserGrade.update(userGrade, { where: { id } });
                            if (userGrade.isDef === true) {
                                await UserGrade.update({ isDef: false }, { where: { id: { $ne: id } } });
                            }
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
                                        ...userGrade,
                                        id,
                                    },
                                };
                            }
                        }
                    }
                } else {
                    const _ret = await UserGrade.update(userGrade, { where: { id } });
                    if (userGrade.isDef === true) {
                        await UserGrade.update({ isDef: false }, { where: { id: { $ne: id } } });
                    }
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
                                ...userGrade,
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
            const _userGrade = await UserGrade.findOne({
                where : { id },
                raw   : true,
            });
            if (_userGrade) {
                _result = {
                    succeed     : 1,
                    code        : 200,
                    description : '成功',
                    data        : _userGrade,
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
                        [Op.like]: `%${searchKey[_key]}%`,
                    };
                } else {
                    _where[_key] = searchKey[_key];
                }
            }
        }

        const _datas = [];
        try {
            if ((offset === 0 || offset) && limit) {
                const _userGrades = await UserGrade.findAndCountAll({
                    where : _where,
                    offset,
                    limit,
                    raw   : true,
                });
                for (const _userGrade of _userGrades.rows) {
                    _datas.push(_userGrade);
                }
                _result = {
                    succeed     : 1,
                    code        : 200,
                    description : '成功',
                    data        : {
                        list  : _datas,
                        count : _userGrades.count,
                    },
                };
            } else {
                const _userGrades = await UserGrade.findAll({
                    where : _where,
                    raw   : true,
                });
                for (const _userGrade of _userGrades) {
                    _datas.push(_userGrade);
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
            this._instance = new UserGradeRepos();
        }
        return this._instance;
    }
}

module.exports = UserGradeRepos.getInstance();
