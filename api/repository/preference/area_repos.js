
const logger = require('tracer').colorConsole();
const { Area } = require('../../models');


class AreaRepos {
    constructor () {
        this._instance = null;
    }

    async create (area) {
        let _result = {
            succeed     : 0, // 1:成功0:失败
            code        : 0, // 错误码
            description : '', // 错误信息
            data        : null, // 本身就是一个json字符串
        };

        try {
            Object.keys(area).forEach((field) => {
                if (!area[field] && area[field] != 0) {
                    delete area[field];
                }
            });
            if (area.name) {
                let _area = await Area.findOne({
                    where: {
                        name     : area.name,
                        parentId : area.parentId,
                    },
                    raw: true,
                });
                if (_area) {
                    _result = {
                        succeed     : 0,
                        code        : 101,
                        description : '名称重复',
                    };
                } else {
                    _area = await Area.create(area);
                    _area.setDataValue('children', []);
                    _result = {
                        succeed     : 1,
                        code        : 200,
                        description : '成功',
                        data        : _area,
                    };
                }
            } else {
                _result = {
                    succeed     : 0,
                    code        : 100,
                    description : `参数错误 -> area:${JSON.stringify(area)}`,
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
                const _affectedCount = await Area.destroy({ where: { id: ids } });
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

    async update (id, area) {
        let _result = {
            succeed     : 0,
            code        : 0,
            description : '',
            data        : null,
        };

        try {
            Object.keys(area).forEach((field) => {
                if (!area[field] && area[field] != 0) {
                    delete area[field];
                }
            });
            if (id) {
                const _name = area.name;
                if (_name) {
                    let _area = await Area.findOne({
                        where: {
                            id,
                            name: _name,
                        },
                        raw: true,
                    });
                    if (_area) {
                        const _ret = await Area.update(area, { where: { id } });
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
                                    ...area,
                                    id,
                                },
                            };
                        }
                    } else {
                        _area = await Area.findOne({
                            where: {
                                name     : _name,
                                parentId : area.parentId,
                                id       : { $ne: id },
                            },
                            raw: true,
                        });
                        if (_area) {
                            _result = {
                                succeed     : 0,
                                code        : 101,
                                description : `名称 [${_name}] 重复`,
                            };
                        } else {
                            const _ret = await Area.update(area, { where: { id } });
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
                                        ...area,
                                        id,
                                    },
                                };
                            }
                        }
                    }
                } else {
                    const _ret = await Area.update(area, { where: { id } });
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
                                ...area,
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
            const _area = await Area.findOne({
                where : { id },
                raw   : true,
            });
            if (_area) {
                _result = {
                    succeed     : 1,
                    code        : 200,
                    description : '成功',
                    data        : _area,
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

    /**
   * 异步加载调用的方法
   * @param {查询条件} searchKey
   * @param {分页参数} offset
   * @param {分页参数} limit
   */
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
                const _areas = await Area.findAndCountAll({
                    where : _where,
                    offset,
                    limit,
                    raw   : true,
                });
                for (const _area of _areas.rows) {
                    _area.leaf = _area.depth === 3;
                    _datas.push(_area);
                }
                _result = {
                    succeed     : 1,
                    code        : 200,
                    description : '成功',
                    data        : {
                        list  : _datas,
                        count : _areas.count,
                    },
                };
            } else {
                const _areas = await Area.findAll({
                    where : _where,
                    raw   : true,
                });
                for (const _area of _areas) {
                    _area.leaf = _area.depth === 3;
                    _datas.push(_area);
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
   * @returns
   * @memberof Area
   */
    async getTree () {
        let _result = {
            succeed     : 0,
            code        : 0,
            description : '',
            data        : null,
        };

        const _where = {};
        const _datas = [];
        const _getSubTrees = (id, name, datas, level) => {
            const _areas = [];
            ++level;
            for (const _data of datas) {
                if (_data.parentId == id) {
                    _data.level = level;
                    _areas.push({
                        ..._data,
                        ...{ parentName: name },
                    });
                }
            }
            for (const _area of _areas) {
                const _children = _getSubTrees(_area.id, _area.name, datas, level);
                if (_children.length > 0) {
                    _area.children = _children;
                }
            }
            return _areas;
        };

        try {
            const _areas = await Area.findAll({
                attributes : Area.getAttributes(),
                where      : _where,
                order      : [['sort', 'ASC']],
                raw        : true,
            });
            const _level = 1;
            for (const _area of _areas) {
                if (_area.parentId == 0) {
                    _area.level = _level;
                    _datas.push(_area);
                }
            }
            for (const _data of _datas) {
                _data.children = _getSubTrees(_data.id, _data.name, _areas, _level);
            }
            _result = {
                succeed     : 1,
                code        : 200,
                description : '成功',
                data        : { list: _datas },
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

    /**
   * 逆向查找区域的完整路径
   * @param {areaId} id
   */
    async getReversePath (id) {
        let _result = {
            succeed     : 0,
            code        : 0,
            description : '未知错误',
            data        : null,
        };
        const _getAreaPath = async (id) => {
            const _areaPath = [];
            const _area = await Area.findOne({
                attributes : Area.getAttributes(),
                where      : { id },
            });
            if (_area) {
                _areaPath.push(_area.name);
                if (_area.parentId > 0) {
                    await _getAreaPath(_area.parentId);
                } else {
                    return _areaPath;
                }
            }
        };

        try {
            const _areaPath = await _getAreaPath(id);
            Object.assign(_result, {
                succeed     : 1,
                code        : 200,
                description : '成功',
                data        : _areaPath,
            });
        } catch (err) {
            logger.error(err);
            _result = {
                succeed     : 0,
                code        : 500,
                description : err.message || err.stack || '系统错误',
            };
        }
    }

    // 构造一个广为人知的接口，供用户对该类进行实例化
    static getInstance () {
        if (!this._instance) {
            this._instance = new AreaRepos();
        }
        return this._instance;
    }
}

module.exports = AreaRepos.getInstance();
