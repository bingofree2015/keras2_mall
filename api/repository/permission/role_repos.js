const logger = require('tracer').colorConsole();
const { Role, Menu, RoleMenu } = require('../../models');


class RoleRepos {
    constructor () {
        this._instance = null;
    }

    async create (role) {
        let _result = {
            succeed     : 0, // 1:成功0:失败
            code        : 0, // 错误码
            description : '', // 错误信息
            data        : null, // 本身就是一个json字符串
        };

        try {
            Object.keys(role).forEach((field) => {
                if (!role[field] && role[field] != 0) {
                    delete role[field];
                }
            });
            if (role.name) {
                let _role = await Role.findOne({
                    where : { name: role.name },
                    raw   : true,
                });
                if (_role) {
                    _result = {
                        succeed     : 0,
                        code        : 101,
                        description : '名称重复',
                    };
                } else {
                    _role = await Role.create(role);
                    _result = {
                        succeed     : 1,
                        code        : 200,
                        description : '成功',
                        data        : _role,
                    };
                }
            } else {
                _result = {
                    succeed     : 0,
                    code        : 100,
                    description : `参数错误 -> role:${JSON.stringify(role)}`,
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
                const _affectedCount = await Role.destroy({
                    where: {
                        id   : ids,
                        name : { $ne: 'admin' },
                    },
                });
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

    async update (id, role) {
        let _result = {
            succeed     : 0,
            code        : 0,
            description : '',
            data        : null,
        };

        try {
            Object.keys(role).forEach((field) => {
                if (!role[field] && role[field] != 0) {
                    delete role[field];
                }
            });
            if (id) {
                const _name = role.name;
                if (_name) {
                    let _role = await Role.findOne({
                        where: {
                            id,
                            name: _name,
                        },
                        raw: true,
                    });
                    if (_role) {
                        const _ret = await Role.update(role, { where: { id } });
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
                                    ...role,
                                    id,
                                },
                            };
                        }
                    } else {
                        _role = await Role.findOne({
                            where: {
                                name : _name,
                                id   : { $ne: id },
                            },
                            raw: true,
                        });
                        if (_role) {
                            _result = {
                                succeed     : 0,
                                code        : 101,
                                description : `名称 [${_name}] 重复`,
                            };
                        } else {
                            const _ret = await Role.update(role, { where: { id } });
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
                                        ...role,
                                        id,
                                    },
                                };
                            }
                        }
                    }
                } else {
                    const _ret = await Role.update(role, { where: { id } });
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
                                ...role,
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
            const _role = await Role.findOne({
                attributes : Role.getAttributes(),
                include    : [
                    {
                        model   : Menu,
                        as      : 'menus',
                        through : {
                            attributes: [],
                        },
                        attributes: ['id', 'name'],
                    },
                ],
                where: { id },
            });
            if (_role) {
                _result = {
                    succeed     : 1,
                    code        : 200,
                    description : '成功',
                    data        : _role,
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
            if ((offset === 0 || offset) && limit) {
                const _roles = await Role.findAndCountAll({
                    where : _where,
                    offset,
                    limit,
                    raw   : true,
                });
                for (const _role of _roles.rows) {
                    _datas.push(_role);
                }
                _result = {
                    succeed     : 1,
                    code        : 200,
                    description : '成功',
                    data        : {
                        list  : _datas,
                        count : _roles.count,
                    },
                };
            } else {
                const _roles = await Role.findAll({
                    where : _where,
                    raw   : true,
                });
                for (const _role of _roles) {
                    _datas.push(_role);
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
                description : err.message || err.stack || '系统错误',
            };
        }

        return _result;
    }

    async get_menus_by_roleid (roleId) {
        let _result = {
            succeed     : 0,
            code        : 0,
            description : '',
            data        : null,
        };

        try {
            let _where = {};
            if (roleId > 1) {
                const _menuIds = [];
                const _roleMenus = await RoleMenu.findAll({ where: { roleId } });
                for (const _roleMenu of _roleMenus) {
                    _menuIds.push(_roleMenu.menuId);
                }
                _where = { id: _menuIds };
            }
            const _menus = await Menu.findAll({
                attributes : Menu.getAttributes(),
                where      : _where,
                raw        : true,
            });
            _result = {
                succeed     : 1,
                code        : 200,
                description : '成功',
                data        : { list: _menus },
            };
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

    async save_role_menus (roleId, roleMenus) {
        let _result = {
            succeed     : 0,
            code        : 0,
            description : '',
            data        : null,
        };

        try {
            if (Array.isArray(roleMenus)) {
                await RoleMenu.destroy({ where: { roleId } });
                if (roleMenus.length > 0) {
                    await RoleMenu.bulkCreate(roleMenus, { ignoreDuplicates: true });
                }
                _result = {
                    succeed     : 1,
                    code        : 200,
                    description : '成功',
                    data        : '',
                };
            } else {
                _result = {
                    succeed     : 0,
                    code        : 100,
                    description : `参数错误 -> roleMenus:${JSON.stringify(roleMenus)}`,
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

    // 构造一个广为人知的接口，供用户对该类进行实例化
    static getInstance () {
        if (!this._instance) {
            this._instance = new RoleRepos();
        }
        return this._instance;
    }
}

module.exports = RoleRepos.getInstance();
