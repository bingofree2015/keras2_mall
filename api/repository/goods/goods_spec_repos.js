const logger = require('tracer').colorConsole();
const { GoodsSpec, GoodsSpecValue, sequelize } = require('../../models');


class GoodsSpecRepos {
    constructor () {
        this._instance = null;
    }

    async create (goodsSpec) {
        let _result = {
            succeed: 0, // 1:成功0:失败
            code: 0, // 错误码
            description: '', // 错误信息
            data: null, // 本身就是一个json字符串
        };

        try {
            Object.keys(goodsSpec).forEach((field) => {
                if (!goodsSpec[field] && goodsSpec[field] != 0) {
                    delete goodsSpec[field];
                }
            });
            if (goodsSpec.name) {
                let _goodsSpec = await GoodsSpec.findOne({ where: { name: goodsSpec.name }, raw: true });
                if (_goodsSpec) {
                    _result = { succeed: 0, code: 101, description: '名称重复' };
                } else {
                    _goodsSpec = await GoodsSpec.create(goodsSpec);
                    // 批量插入
                    if (Array.isArray(goodsSpec.goodsSpecValues) && goodsSpec.goodsSpecValues.length > 0) {
                        const _goodsSpecValues = [];
                        for (const _goodsSpecValue of goodsSpec.goodsSpecValues) {
                            _goodsSpecValues.push({ specId: _goodsSpec.id, value: _goodsSpecValue.value });
                        }
                        await GoodsSpecValue.bulkCreate(_goodsSpecValues, {
                            updateOnDuplicate: ['specId', 'value', 'sort'],
                        });

                        _goodsSpec.setDataValue(
                            'values',
                            goodsSpec.goodsSpecValues.map((v) => v.value).join('|'),
                        );
                    }

                    _result = {
                        succeed: 1,
                        code: 200,
                        description: '成功',
                        data: _goodsSpec,
                    };
                }
            } else {
                _result = {
                    succeed: 0,
                    code: 100,
                    description: `参数错误 -> goodsSpec:${JSON.stringify(goodsSpec)}`,
                };
            }
        } catch (err) {
            logger.error(err);
            _result = { succeed: 0, code: 500, description: err.message || err.stack || '系统错误' };
        }

        return _result;
    }

    async delete (ids) {
        let _result = {
            succeed: 0,
            code: 0,
            description: '',
            data: null,
        };

        let _trans; // 定义事务
        try {
            if (Array.isArray(ids) && ids.length > 0) {
                _trans = await sequelize.transaction();

                await GoodsSpecValue.destroy({ where: { specId: ids }, transaction: _trans });
                const _affectedCount = await GoodsSpec.destroy({ where: { id: ids }, transaction: _trans });
                await _trans.commit(); // 事务提交
                if (_affectedCount == 0) {
                    _result = { succeed: 0, code: 102, description: '记录不存在' };
                } else {
                    _result = { succeed: 1, code: 200, description: '成功' };
                }
            } else {
                _result = { succeed: 0, code: 100, description: '参数错误' };
            }
        } catch (err) {
            await _trans.rollback(); // 事务回滚
            logger.error(err);
            _result = { succeed: 0, code: 500, description: err.message || err.stack || '系统错误' };
        }

        return _result;
    }

    async update (id, goodsSpec) {
        let _result = {
            succeed: 0,
            code: 0,
            description: '',
            data: null,
        };

        const _bulkCreate = async (specId, goodsSpecValues) => {
            // 批量插入
            if (Array.isArray(goodsSpecValues) && goodsSpecValues.length > 0) {
                // 删除数据
                const _goodsSpecValues = await GoodsSpecValue.findAll({
                    attributes: ['id'],
                    where: { specId },
                    raw: true,
                });
                const _oldIds = [];
                _goodsSpecValues.forEach((v) => {
                    _oldIds.push(v.id);
                });
                const _newIds = goodsSpecValues.map((v) => v.id).filter((v) => v);
                const _delIds = _oldIds
                    .map((v) => {
                        if (!_newIds.includes(v)) {
                            return v;
                        }
                    })
                    .filter((v) => v);
                if (_delIds.length > 0) {
                    await GoodsSpecValue.destroy({ where: { id: _delIds } });
                }
                // 更新与插入
                const _goodsSpecValueDatas = [];
                for (const _goodsSpecValue of goodsSpecValues) {
                    _goodsSpecValueDatas.push({ specId, value: _goodsSpecValue.value });
                }
                await GoodsSpecValue.bulkCreate(_goodsSpecValueDatas, {
                    updateOnDuplicate: ['specId', 'value', 'sort'],
                });
            }
        };

        try {
            Object.keys(goodsSpec).forEach((field) => {
                if (!goodsSpec[field] && goodsSpec[field] != 0) {
                    delete goodsSpec[field];
                }
            });
            if (id) {
                const _name = goodsSpec.name;
                if (_name) {
                    let _goodsSpec = await GoodsSpec.findOne({ where: { id, name: _name }, raw: true });
                    if (_goodsSpec) {
                        const _ret = await GoodsSpec.update(goodsSpec, { where: { id } });
                        const _affectedCount = _ret[0];
                        if (_affectedCount == 0) {
                            _result = { succeed: 0, code: 102, description: '记录不存在' };
                        } else {
                            await _bulkCreate(id, goodsSpec.goodsSpecValues);

                            if (Array.isArray(goodsSpec.goodsSpecValues)) {
                                goodsSpec.setDataValue(
                                    'values',
                                    goodsSpec.goodsSpecValues.map((v) => v.value).join('|'),
                                );
                            }
                            _result = {
                                succeed: 1,
                                code: 200,
                                description: '成功',
                                data: { ...goodsSpec, id },
                            };
                        }
                    } else {
                        _goodsSpec = await GoodsSpec.findOne({
                            where: { name: _name, id: { $ne: id } },
                            raw: true,
                        });
                        if (_goodsSpec) {
                            _result = { succeed: 0, code: 101, description: `名称 [${_name}] 重复` };
                        } else {
                            const _ret = await GoodsSpec.update(goodsSpec, { where: { id } });
                            const _affectedCount = _ret[0];
                            if (_affectedCount == 0) {
                                _result = { succeed: 0, code: 102, description: '记录不存在' };
                            } else {
                                await _bulkCreate(id, goodsSpec.goodsSpecValues);

                                if (Array.isArray(goodsSpec.goodsSpecValues)) {
                                    goodsSpec.setDataValue(
                                        'values',
                                        goodsSpec.goodsSpecValues.map((v) => v.value).join('|'),
                                    );
                                }
                                _result = {
                                    succeed: 1,
                                    code: 200,
                                    description: '成功',
                                    data: { ...goodsSpec, id },
                                };
                            }
                        }
                    }
                } else {
                    const _ret = await GoodsSpec.update(goodsSpec, { where: { id } });
                    const _affectedCount = _ret[0];
                    if (_affectedCount == 0) {
                        _result = { succeed: 0, code: 102, description: '记录不存在' };
                    } else {
                        await _bulkCreate(id, goodsSpec.goodsSpecValues);

                        if (Array.isArray(goodsSpec.goodsSpecValues)) {
                            goodsSpec.setDataValue(
                                'values',
                                goodsSpec.goodsSpecValues.map((v) => v.value).join('|'),
                            );
                        }
                        _result = {
                            succeed: 1,
                            code: 200,
                            description: '成功',
                            data: { ...goodsSpec, id },
                        };
                    }
                }
            } else {
                _result = { succeed: 0, code: 100, description: `参数错误 -> id:${id}` };
            }
        } catch (err) {
            logger.error(err);
            _result = { succeed: 0, code: 500, description: err.message || err.stack || '系统错误' };
        }

        return _result;
    }

    async get (id) {
        let _result = {
            succeed: 0,
            code: 0,
            description: '',
            data: null,
        };

        try {
            const _goodsSpec = await GoodsSpec.findOne({
                include: [
                    {
                        model: GoodsSpecValue,
                        attributes: ['id', 'value', 'sort'],
                        as: 'goodsSpecValues',
                        require: false,
                    },
                ],
                where: { id },
            });
            if (_goodsSpec) {
                if (Array.isArray(_goodsSpec.goodsSpecValues)) {
                    _goodsSpec.setDataValue(
                        'values',
                        _goodsSpec.goodsSpecValues.map((v) => v.value).join('|'),
                    );
                }
                _result = {
                    succeed: 1,
                    code: 200,
                    description: '成功',
                    data: _goodsSpec,
                };
            } else {
                _result = { succeed: 0, code: 102, description: '数据不存在' };
            }
        } catch (err) {
            logger.error(err);
            _result = { succeed: 0, code: 500, description: err.message || err.stack || '系统错误' };
        }
        return _result;
    }

    async list (searchKey, offset, limit) {
        let _result = {
            succeed: 0,
            code: 0,
            description: '',
            data: null,
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
                const _goodsSpecs = await GoodsSpec.findAndCountAll({
                    include: [
                        {
                            model: GoodsSpecValue,
                            attributes: ['id', 'value', 'sort'],
                            as: 'goodsSpecValues',
                            require: false,
                        },
                    ],
                    distinct: true,
                    where: _where,
                    offset,
                    limit,
                });
                for (const _goodsSpec of _goodsSpecs.rows) {
                    if (Array.isArray(_goodsSpec.goodsSpecValues)) {
                        _goodsSpec.setDataValue(
                            'values',
                            _goodsSpec.goodsSpecValues.map((v) => v.value).join('|'),
                        );
                    }
                    _datas.push(_goodsSpec);
                }
                _result = {
                    succeed: 1,
                    code: 200,
                    description: '成功',
                    data: { list: _datas, count: _goodsSpecs.count },
                };
            } else {
                const _goodsSpecs = await GoodsSpec.findAll({
                    include: [
                        {
                            model: GoodsSpecValue,
                            attributes: ['id', 'value', 'sort'],
                            as: 'goodsSpecValues',
                            require: false,
                        },
                    ],
                    where: _where,
                });
                for (const _goodsSpec of _goodsSpecs) {
                    if (Array.isArray(_goodsSpec.goodsSpecValues)) {
                        _goodsSpec.setDataValue(
                            'values',
                            _goodsSpec.goodsSpecValues.map((v) => v.value).join('|'),
                        );
                    }
                    _datas.push(_goodsSpec);
                }
                _result = {
                    succeed: 1,
                    code: 200,
                    description: '成功',
                    data: { list: _datas },
                };
            }
        } catch (err) {
            logger.error(err);
            _result = { succeed: 0, code: 500, description: err };
        }

        return _result;
    }

    // 构造一个广为人知的接口，供用户对该类进行实例化
    static getInstance () {
        if (!this._instance) {
            this._instance = new GoodsSpecRepos();
        }
        return this._instance;
    }
}

module.exports = GoodsSpecRepos.getInstance();
