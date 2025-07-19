const logger = require('tracer').colorConsole();
const { RoleMenu, Menu } = require('../../models');


class RoleMenuRepos {
    constructor () {
        this._instance = null;
    }

    async create (roleMenu) {
        let _result = {
            succeed     : 0, // 1:成功0:失败
            code        : 0, // 错误码
            description : '', // 错误信息
            data        : null, // 本身就是一个json字符串
        };

        try {
            Object.keys(roleMenu).forEach((field) => {
                if (!roleMenu[field] && roleMenu[field] != 0) {
                    delete roleMenu[field];
                }
            });
            if (roleMenu.roleId && roleMenu.menuId) {
                const _roleMenu = await RoleMenu.create(roleMenu);
                _result = {
                    succeed     : 1,
                    code        : 200,
                    description : '成功',
                    data        : _roleMenu,
                };
            } else {
                _result = {
                    succeed     : 0,
                    code        : 100,
                    description : `参数错误 -> roleMenu:${JSON.stringify(roleMenu)}`,
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
                const _affectedCount = await RoleMenu.destroy({ where: { id: ids } });
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

    async update (id, roleMenu) {
        let _result = {
            succeed     : 0,
            code        : 0,
            description : '',
            data        : null,
        };

        try {
            Object.keys(roleMenu).forEach((field) => {
                if (!roleMenu[field] && roleMenu[field] != 0) {
                    delete roleMenu[field];
                }
            });
            if (id) {
                const _roleId = roleMenu.roleId;
                const _menuId = roleMenu.menuId;
                if (_roleId && _menuId) {
                    let _roleMenu = await RoleMenu.findOne({
                        where: {
                            id,
                            roleId : _roleId,
                            menuId : _menuId,
                        },
                        raw: true,
                    });
                    if (_roleMenu) {
                        const _ret = await RoleMenu.update(roleMenu, { where: { id } });
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
                                    ...roleMenu,
                                    id,
                                },
                            };
                        }
                    } else {
                        _roleMenu = await RoleMenu.findOne({
                            where: {
                                roleId : _roleId,
                                menuId : _menuId,
                                id     : { $ne: id },
                            },
                            raw: true,
                        });
                        if (_roleMenu) {
                            _result = {
                                succeed     : 0,
                                code        : 101,
                                description : '记录重复',
                            };
                        } else {
                            const _ret = await RoleMenu.update(roleMenu, { where: { id } });
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
                                        ...roleMenu,
                                        id,
                                    },
                                };
                            }
                        }
                    }
                } else {
                    const _ret = await RoleMenu.update(roleMenu, { where: { id } });
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
                                ...roleMenu,
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
            const _roleMenu = await RoleMenu.findOne({
                where : { id },
                raw   : true,
            });
            if (_roleMenu) {
                _result = {
                    succeed     : 1,
                    code        : 200,
                    description : '成功',
                    data        : _roleMenu,
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
        const _excludeKeys = [''];
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
                const _roleMenus = await RoleMenu.findAndCountAll({
                    attributes : RoleMenu.getAttributes(),
                    include    : [
                        {
                            attributes : ['id', 'name'],
                            model      : Menu,
                            as         : 'menu',
                        },
                    ],
                    where    : _where,
                    distinct : true,
                    offset,
                    limit,
                });
                for (const _roleMenu of _roleMenus.rows) {
                    _datas.push(_roleMenu);
                }
                _result = {
                    succeed     : 1,
                    code        : 200,
                    description : '成功',
                    data        : {
                        list  : _datas,
                        count : _roleMenus.count,
                    },
                };
            } else {
                const _roleMenus = await RoleMenu.findAll({
                    where : _where,
                    raw   : true,
                });
                for (const _roleMenu of _roleMenus) {
                    _datas.push(_roleMenu);
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
            this._instance = new RoleMenuRepos();
        }
        return this._instance;
    }
}

module.exports = RoleMenuRepos.getInstance();
