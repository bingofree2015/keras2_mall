const logger = require('tracer').colorConsole();
const { UserPointLog, User } = require('../../models');


class UserPointLogRepos {
    constructor () {
        this._instance = null;
    }

    async create (userPointLog) {
        let _result = {
            succeed     : 0, // 1:成功0:失败
            code        : 0, // 错误码
            description : '', // 错误信息
            data        : null, // 本身就是一个json字符串
        };

        try {
            Object.keys(userPointLog).forEach((field) => {
                if (!userPointLog[field] && userPointLog[field] != 0) {
                    delete userPointLog[field];
                }
            });
            if (userPointLog.userId && userPointLog.type) {
                const _userPointLog = await UserPointLog.create(userPointLog);
                _result = {
                    succeed     : 1,
                    code        : 200,
                    description : '成功',
                    data        : _userPointLog,
                };
            } else {
                _result = {
                    succeed     : 0,
                    code        : 100,
                    description : `参数错误 -> userPointLog:${JSON.stringify(userPointLog)}`,
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
                const _affectedCount = await UserPointLog.destroy({ where: { id: ids } });
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

    async update (id, userPointLog) {
        let _result = {
            succeed     : 0,
            code        : 0,
            description : '',
            data        : null,
        };

        try {
            Object.keys(userPointLog).forEach((field) => {
                if (!userPointLog[field] && userPointLog[field] != 0) {
                    delete userPointLog[field];
                }
            });
            if (id) {
                const _ret = await UserPointLog.update(userPointLog, { where: { id } });
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
                            ...userPointLog,
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
            const _userPointLog = await UserPointLog.findOne({
                where : { id },
                raw   : true,
            });
            if (_userPointLog) {
                _result = {
                    succeed     : 1,
                    code        : 200,
                    description : '成功',
                    data        : _userPointLog,
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
                const _userPointLogs = await UserPointLog.findAndCountAll({
                    where : _where,
                    offset,
                    limit,
                    raw   : true,
                });
                for (const _userPointLog of _userPointLogs.rows) {
                    _datas.push(_userPointLog);
                }
                _result = {
                    succeed     : 1,
                    code        : 200,
                    description : '成功',
                    data        : {
                        list  : _datas,
                        count : _userPointLogs.count,
                    },
                };
            } else {
                const _userPointLogs = await UserPointLog.findAll({
                    where : _where,
                    raw   : true,
                });
                for (const _userPointLog of _userPointLogs) {
                    _datas.push(_userPointLog);
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

    /**
   * 设置积分
   * @param {用户Id} userId
   * @param {积分} point
   * @param {类型}} type
   * @param {备注} remark
   */
    async setPoint (userId, point, type, remark) {
        let _result = {
            succeed     : 0,
            code        : 0,
            description : '未知错误',
            data        : null,
        };
        try {
            if (point) {
                // 获取积分账号信息
                const _user = await User.findOne({ where: { id: userId } });
                if (_user) {
                    const _point = _user.point + point;
                    // 积分余额判断
                    if (_point < 0) {
                        Object.assign(_result, {
                            code        : 102,
                            description : '积分余额不足',
                        });
                    } else {
                        await UserPointLog.create({
                            userId,
                            type,
                            num     : point,
                            balance : _point,
                            remark,
                        });
                    }
                    // 修改用户积分
                    await User.update({ point: _user.point + point }, { where: { id: userId } });
                } else {
                    Object.assign(_result, {
                        code        : 103,
                        description : '用户不存在',
                    });
                }
            } else {
                Object.assign(_result, {
                    code        : 101,
                    description : `${point} 参数错误`,
                });
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

    // 构造一个广为人知的接口，供用户对该类进行实例化
    static getInstance () {
        if (!this._instance) {
            this._instance = new UserPointLogRepos();
        }
        return this._instance;
    }
}

module.exports = UserPointLogRepos.getInstance();
