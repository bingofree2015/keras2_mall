const logger = require('tracer').colorConsole();
const { Op } = require('sequelize');
const { BillLading, Store } = require('../../models');

/**
 * 提货单
 */
class BillLadingRepos {
    constructor () {
        this._instance = null;
    }

    async create (billLading) {
        let _result = {
            succeed     : 0, // 1:成功0:失败
            code        : 0, // 错误码
            description : '', // 错误信息
            data        : null, // 本身就是一个json字符串
        };

        try {
            Object.keys(billLading).forEach((field) => {
                if (!billLading[field] && billLading[field] != 0) {
                    delete billLading[field];
                }
            });
            if (billLading.ladingId && billLading.orderId) {
                let _billLading = await BillLading.findOne({
                    where: {
                        ladingId : billLading.ladingId,
                        orderId  : billLading.orderId,
                    },
                    raw: true,
                });
                if (_billLading) {
                    _result = {
                        succeed     : 0,
                        code        : 101,
                        description : '提货单号重复',
                    };
                } else {
                    _billLading = await BillLading.create(billLading);
                    _result = {
                        succeed     : 1,
                        code        : 200,
                        description : '成功',
                        data        : _billLading,
                    };
                }
            } else {
                _result = {
                    succeed     : 0,
                    code        : 100,
                    description : `参数错误 -> billLading:${JSON.stringify(billLading)}`,
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
                const _affectedCount = await BillLading.destroy({ where: { id: ids } });
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

    async update (id, billLading) {
        let _result = {
            succeed     : 0,
            code        : 0,
            description : '',
            data        : null,
        };

        try {
            Object.keys(billLading).forEach((field) => {
                if (!billLading[field] && billLading[field] != 0) {
                    delete billLading[field];
                }
            });
            if (id) {
                const _ladingId = billLading.ladingId;
                const _orderId = billLading.orderId;
                if (_ladingId && _orderId) {
                    let _billLading = await BillLading.findOne({
                        where: {
                            id,
                            ladingId : _ladingId,
                            orderId  : _orderId,
                        },
                        raw: true,
                    });
                    if (_billLading) {
                        const _ret = await BillLading.update(billLading, { where: { id } });
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
                                    ...billLading,
                                    id,
                                },
                            };
                        }
                    } else {
                        _billLading = await BillLading.findOne({
                            where: {
                                ladingId : _ladingId,
                                orderId  : _orderId,
                                id       : { $ne: id },
                            },
                            raw: true,
                        });
                        if (_billLading) {
                            _result = {
                                succeed     : 0,
                                code        : 101,
                                description : '发货单重复',
                            };
                        } else {
                            const _ret = await BillLading.update(billLading, { where: { id } });
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
                                        ...billLading,
                                        id,
                                    },
                                };
                            }
                        }
                    }
                } else {
                    const _ret = await BillLading.update(billLading, { where: { id } });
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
                                ...billLading,
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
            const _billLading = await BillLading.findOne({
                include: [
                    {
                        model      : Store,
                        as         : 'store',
                        attributes : Store.getAttributes(),
                        require    : false,
                    },
                ],
                where: { id },
            });
            if (_billLading) {
                _result = {
                    succeed     : 1,
                    code        : 200,
                    description : '成功',
                    data        : _billLading,
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
                const _billLadings = await BillLading.findAndCountAll({
                    include: [
                        {
                            model      : Store,
                            as         : 'store',
                            attributes : Store.getAttributes(),
                            require    : false,
                        },
                    ],
                    distinct : true,
                    where    : _where,
                    offset,
                    limit,
                });
                for (const _billLading of _billLadings.rows) {
                    _datas.push(_billLading);
                }
                _result = {
                    succeed     : 1,
                    code        : 200,
                    description : '成功',
                    data        : {
                        list  : _datas,
                        count : _billLadings.count,
                    },
                };
            } else {
                const _billLadings = await BillLading.findAll({
                    include: [
                        {
                            model      : Store,
                            as         : 'store',
                            attributes : Store.getAttributes(),
                            require    : false,
                        },
                    ],
                    where: _where,
                });
                for (const _billLading of _billLadings) {
                    _datas.push(_billLading);
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
            this._instance = new BillLadingRepos();
        }
        return this._instance;
    }
}

module.exports = BillLadingRepos.getInstance();
