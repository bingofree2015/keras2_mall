const logger = require('tracer').colorConsole();
const {
    GoodsType,
    GoodsSpec,
    GoodsTypeSpec,
    GoodsSpecValue,
    GoodsParam,
    GoodsTypeParam,
} = require('../../models');


class GoodsTypeRepos {
    constructor () {
        this._instance = null;
    }

    async _upsetSpecParam (id, goodsType) {
    // 添加数据至 specs
        if (Array.isArray(goodsType.specs)) {
            const _goodsTypeSpecDatas = [];
            for (const _spec of goodsType.specs) {
                // 更新属性
                let _specObj = await GoodsSpec.findOne({ where: { name: _spec.name } });
                if (_specObj) {
                    await GoodsSpec.update(_spec, { where: { id: _specObj.id } });
                } else {
                    _specObj = await GoodsSpec.create(_spec);
                }
                _spec.id = _specObj.id;
                _goodsTypeSpecDatas.push({
                    goodsTypeId : id,
                    goodsSpecId : _spec.id,
                });

                // 更新属性值
                const _goodsSpecValues = [];
                if (_spec.values && _spec.values.includes(' ')) {
                    const _values = _spec.values.split(' ');
                    for (const _value of _values) {
                        const _goodsSpecValue = Array.isArray(_spec.goodsSpecValues)
                            ? _spec.goodsSpecValues.find((v) => v.value == _value)
                            : null;
                        if (_goodsSpecValue) {
                            _goodsSpecValues.push({
                                ..._goodsSpecValue,
                                specId: _spec.id,
                            });
                        } else {
                            _goodsSpecValues.push({
                                value  : _value,
                                specId : _spec.id,
                            });
                        }
                    }
                }
                // 删除数据
                await GoodsSpecValue.destroy({ where: { specId: _spec.id } });
                // 更新关联表
                if (_goodsSpecValues.length > 0) {
                    await GoodsSpecValue.bulkCreate(_goodsSpecValues, {
                        updateOnDuplicate: ['specId', 'value', 'sort'],
                    });
                }
            }
            // 删除数据
            await GoodsTypeSpec.destroy({ where: { goodsTypeId: id } });
            // 更新关联表
            if (_goodsTypeSpecDatas.length > 0) {
                await GoodsTypeSpec.bulkCreate(_goodsTypeSpecDatas, {
                    updateOnDuplicate: ['goodsTypeId', 'goodsSpecId'],
                });
            }
        }

        // 添加数据至 params
        if (Array.isArray(goodsType.params)) {
            const _goodsTypeParamDatas = [];
            for (const _param of goodsType.params) {
                // 更新参数
                if (_param.id) {
                    await GoodsParam.update(_param, { where: { id: _param.id } });
                } else {
                    let _paramObj = await GoodsParam.findOne({
                        where: {
                            name : _param.name,
                            type : _param.type,
                        },
                    });
                    if (_paramObj) {
                        await GoodsParam.update(_param, { where: { id: _paramObj.id } });
                    } else {
                        _paramObj = await GoodsParam.create(_param);
                    }
                    _param.id = _paramObj.id;
                }
                _goodsTypeParamDatas.push({
                    goodsTypeId  : id,
                    goodsParamId : _param.id,
                });
            }
            // 删除数据
            await GoodsTypeParam.destroy({ where: { goodsTypeId: id } });
            // 更新关联表
            await GoodsTypeParam.bulkCreate(_goodsTypeParamDatas, {
                updateOnDuplicate: ['goodsTypeId', 'goodsParamId'],
            });
        }
    }

    async create (goodsType) {
        let _result = {
            succeed     : 0, // 1:成功0:失败
            code        : 0, // 错误码
            description : '', // 错误信息
            data        : null, // 本身就是一个json字符串
        };

        try {
            Object.keys(goodsType).forEach((field) => {
                if (!goodsType[field] && goodsType[field] != 0) {
                    delete goodsType[field];
                }
            });
            if (goodsType.name) {
                let _goodsType = await GoodsType.findOne({
                    where : { name: goodsType.name },
                    raw   : true,
                });
                if (_goodsType) {
                    _result = {
                        succeed     : 0,
                        code        : 101,
                        description : '名称重复',
                    };
                } else {
                    _goodsType = await GoodsType.create(goodsType);
                    // 更新相关表
                    await this._upsetSpecParam(_goodsType.id, goodsType);
                    _result = {
                        succeed     : 1,
                        code        : 200,
                        description : '成功',
                        data        : {
                            ...goodsType,
                            id: _goodsType.id,
                        },
                    };
                }
            } else {
                _result = {
                    succeed     : 0,
                    code        : 100,
                    description : `参数错误 -> goodsType:${JSON.stringify(goodsType)}`,
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
                const _affectedCount = await GoodsType.destroy({ where: { id: ids } });
                if (_affectedCount == 0) {
                    _result = {
                        succeed     : 0,
                        code        : 102,
                        description : '记录不存在',
                    };
                } else {
                    // 删除关联表中的关联关系
                    await GoodsTypeSpec.destroy({ where: { goodsTypeId: ids } });
                    await GoodsTypeParam.destroy({ where: { goodsTypeId: ids } });
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

    async update (id, goodsType) {
        let _result = {
            succeed     : 0,
            code        : 0,
            description : '',
            data        : null,
        };

        try {
            Object.keys(goodsType).forEach((field) => {
                if (!goodsType[field] && goodsType[field] != 0) {
                    delete goodsType[field];
                }
            });
            if (id) {
                const _name = goodsType.name;
                if (_name) {
                    let _goodsType = await GoodsType.findOne({
                        where: {
                            id,
                            name: _name,
                        },
                        raw: true,
                    });
                    if (_goodsType) {
                        const _ret = await GoodsType.update(goodsType, { where: { id } });
                        const _affectedCount = _ret[0];
                        if (_affectedCount == 0) {
                            _result = {
                                succeed     : 0,
                                code        : 102,
                                description : '记录不存在',
                            };
                        } else {
                            // 更新相关表
                            await this._upsetSpecParam(id, goodsType);
                            _result = {
                                succeed     : 1,
                                code        : 200,
                                description : '成功',
                                data        : {
                                    ...goodsType,
                                    id,
                                },
                            };
                        }
                    } else {
                        _goodsType = await GoodsType.findOne({
                            where: {
                                name : _name,
                                id   : { $ne: id },
                            },
                            raw: true,
                        });
                        if (_goodsType) {
                            _result = {
                                succeed     : 0,
                                code        : 101,
                                description : `名称 [${_name}] 重复`,
                            };
                        } else {
                            const _ret = await GoodsType.update(goodsType, { where: { id } });
                            const _affectedCount = _ret[0];
                            if (_affectedCount == 0) {
                                _result = {
                                    succeed     : 0,
                                    code        : 102,
                                    description : '记录不存在',
                                };
                            } else {
                                // 更新相关表
                                await this._upsetSpecParam(id, goodsType);
                                _result = {
                                    succeed     : 1,
                                    code        : 200,
                                    description : '成功',
                                    data        : {
                                        ...goodsType,
                                        id,
                                    },
                                };
                            }
                        }
                    }
                } else {
                    const _ret = await GoodsType.update(goodsType, { where: { id } });
                    const _affectedCount = _ret[0];
                    if (_affectedCount == 0) {
                        _result = {
                            succeed     : 0,
                            code        : 102,
                            description : '记录不存在',
                        };
                    } else {
                        // 更新相关表
                        await this._upsetSpecParam(id, goodsType);
                        _result = {
                            succeed     : 1,
                            code        : 200,
                            description : '成功',
                            data        : {
                                ...goodsType,
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
            const _goodsType = await GoodsType.findOne({
                include: [
                    {
                        model   : GoodsSpec,
                        through : {
                            attributes: [],
                        },
                        as         : 'specs',
                        attributes : ['id', 'name', 'sort'],
                        include    : [
                            {
                                model      : GoodsSpecValue,
                                as         : 'goodsSpecValues',
                                attributes : ['id', 'value', 'sort'],
                                require    : false,
                            },
                        ],
                        require: false,
                    },
                    {
                        model   : GoodsParam,
                        through : {
                            attributes: [],
                        },
                        as         : 'params',
                        attributes : ['id', 'name', 'type', 'values'],
                        require    : false,
                    },
                ],
                where: { id },
            });
            if (_goodsType) {
                if (Array.isArray(_goodsType.specs)) {
                    _goodsType.setDataValue('specValues', _goodsType.specs.map((v) => v.name).join('|'));
                    for (const _spec of _goodsType.specs) {
                        if (Array.isArray(_spec.goodsSpecValues)) {
                            _spec.setDataValue('values', _spec.goodsSpecValues.map((v) => v.value).join(' '));
                        }
                    }
                }
                if (Array.isArray(_goodsType.params)) {
                    _goodsType.setDataValue('paramValues', _goodsType.params.map((v) => v.name).join('|'));
                }
                _result = {
                    succeed     : 1,
                    code        : 200,
                    description : '成功',
                    data        : _goodsType,
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
                const _goodsTypes = await GoodsType.findAndCountAll({
                    include: [
                        {
                            model   : GoodsSpec,
                            through : {
                                attributes: [],
                            },
                            as         : 'specs',
                            attributes : ['id', 'name', 'sort'],
                            include    : [
                                {
                                    model      : GoodsSpecValue,
                                    as         : 'goodsSpecValues',
                                    attributes : ['id', 'value', 'sort'],
                                    require    : false,
                                },
                            ],
                            require: false,
                        },
                        {
                            model   : GoodsParam,
                            through : {
                                attributes: [],
                            },
                            as         : 'params',
                            attributes : ['id', 'name', 'type', 'values'],
                            require    : false,
                        },
                    ],
                    distinct : true,
                    where    : _where,
                    offset,
                    limit,
                });
                for (const _goodsType of _goodsTypes.rows) {
                    if (Array.isArray(_goodsType.specs)) {
                        _goodsType.setDataValue('specValues', _goodsType.specs.map((v) => v.name).join('|'));
                        for (const _spec of _goodsType.specs) {
                            if (Array.isArray(_spec.goodsSpecValues)) {
                                _spec.setDataValue('values', _spec.goodsSpecValues.map((v) => v.value).join(' '));
                            }
                        }
                    }
                    if (Array.isArray(_goodsType.params)) {
                        _goodsType.setDataValue('paramValues', _goodsType.params.map((v) => v.name).join('|'));
                    }
                    _datas.push(_goodsType);
                }
                _result = {
                    succeed     : 1,
                    code        : 200,
                    description : '成功',
                    data        : {
                        list  : _datas,
                        count : _goodsTypes.count,
                    },
                };
            } else {
                const _goodsTypes = await GoodsType.findAll({
                    include: [
                        {
                            model   : GoodsSpec,
                            through : {
                                attributes: [],
                            },
                            as         : 'specs',
                            attributes : ['id', 'name', 'sort'],
                            include    : [
                                {
                                    model      : GoodsSpecValue,
                                    as         : 'goodsSpecValues',
                                    attributes : ['id', 'value', 'sort'],
                                    require    : false,
                                },
                            ],
                            require: false,
                        },
                        {
                            model   : GoodsParam,
                            through : {
                                attributes: [],
                            },
                            as         : 'params',
                            attributes : ['id', 'name', 'type', 'values'],
                            require    : false,
                        },
                    ],
                    where: _where,
                });
                for (const _goodsType of _goodsTypes) {
                    if (Array.isArray(_goodsType.specs)) {
                        _goodsType.setDataValue('specValues', _goodsType.specs.map((v) => v.name).join('|'));
                        for (const _spec of _goodsType.specs) {
                            if (Array.isArray(_spec.goodsSpecValues)) {
                                _spec.setDataValue('values', _spec.goodsSpecValues.map((v) => v.value).join(' '));
                            }
                        }
                    }
                    if (Array.isArray(_goodsType.params)) {
                        _goodsType.setDataValue('paramValues', _goodsType.params.map((v) => v.name).join('|'));
                    }
                    _datas.push(_goodsType);
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
            this._instance = new GoodsTypeRepos();
        }
        return this._instance;
    }
}

module.exports = GoodsTypeRepos.getInstance();
