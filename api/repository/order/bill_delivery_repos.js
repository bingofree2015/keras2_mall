const logger = require('tracer').colorConsole();
const {
    BillDelivery, BillDeliveryItem, User, Logistics, OrderItem,
} = require('../../models');

/**
 * 发货单
 */
class BillDeliveryRepos {
    constructor () {
        this._instance = null;
    }

    async create (billDelivery) {
        let _result = {
            succeed     : 0, // 1:成功0:失败
            code        : 0, // 错误码
            description : '', // 错误信息
            data        : null, // 本身就是一个json字符串
        };

        try {
            Object.keys(billDelivery).forEach((field) => {
                if (!billDelivery[field] && billDelivery[field] != 0) {
                    delete billDelivery[field];
                }
            });
            if (billDelivery.userId && billDelivery.orderId) {
                let _billDelivery = await BillDelivery.findOne({
                    where: {
                        userId  : billDelivery.userId,
                        orderId : billDelivery.orderId,
                    },
                    raw: true,
                });
                if (_billDelivery) {
                    _result = {
                        succeed     : 0,
                        code        : 101,
                        description : '发货单重复',
                    };
                } else {
                    _billDelivery = await BillDelivery.create(billDelivery);
                    _result = {
                        succeed     : 1,
                        code        : 200,
                        description : '成功',
                        data        : _billDelivery,
                    };
                }
            } else {
                _result = {
                    succeed     : 0,
                    code        : 100,
                    description : `参数错误 -> billDelivery:${JSON.stringify(billDelivery)}`,
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
                const _affectedCount = await BillDelivery.destroy({ where: { id: ids } });
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

    async update (id, billDelivery) {
        let _result = {
            succeed     : 0,
            code        : 0,
            description : '',
            data        : null,
        };

        try {
            Object.keys(billDelivery).forEach((field) => {
                if (!billDelivery[field] && billDelivery[field] != 0) {
                    delete billDelivery[field];
                }
            });
            if (id) {
                const _userId = billDelivery.userId;
                const _orderId = billDelivery.orderId;
                if (_userId && _orderId) {
                    let _billDelivery = await BillDelivery.findOne({
                        where: {
                            id,
                            userId  : _userId,
                            orderId : _orderId,
                        },
                        raw: true,
                    });
                    if (_billDelivery) {
                        const _ret = await BillDelivery.update(billDelivery, { where: { id } });
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
                                    ...billDelivery,
                                    id,
                                },
                            };
                        }
                    } else {
                        _billDelivery = await BillDelivery.findOne({
                            where: {
                                userId  : _userId,
                                orderId : _orderId,
                                id      : { $ne: id },
                            },
                            raw: true,
                        });
                        if (_billDelivery) {
                            _result = {
                                succeed     : 0,
                                code        : 101,
                                description : '发货单重复',
                            };
                        } else {
                            const _ret = await BillDelivery.update(billDelivery, { where: { id } });
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
                                        ...billDelivery,
                                        id,
                                    },
                                };
                            }
                        }
                    }
                } else {
                    const _ret = await BillDelivery.update(billDelivery, { where: { id } });
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
                                ...billDelivery,
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
            const _billDelivery = await BillDelivery.findOne({
                include: [
                    {
                        model      : User,
                        as         : 'user',
                        attributes : ['id', 'username', 'nickname'],
                        require    : false,
                    },
                    {
                        model      : Logistics,
                        as         : 'logistics',
                        attributes : Logistics.getAttributes(),
                        require    : false,
                    },
                    {
                        include: [
                            {
                                model      : OrderItem,
                                as         : 'orderItem',
                                attributes : OrderItem.getAttributes(),
                                require    : false,
                            },
                        ],
                        model      : BillDeliveryItem,
                        as         : 'billDeliveryItems',
                        attributes : BillDeliveryItem.getAttributes(),
                        require    : false,
                    },
                ],
                where: { id },
            });
            if (_billDelivery) {
                _result = {
                    succeed     : 1,
                    code        : 200,
                    description : '成功',
                    data        : _billDelivery,
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
                const _billDeliverys = await BillDelivery.findAndCountAll({
                    include: [
                        {
                            model      : User,
                            as         : 'user',
                            attributes : ['id', 'username', 'nickname'],
                            require    : false,
                        },
                        {
                            include: [
                                {
                                    model      : OrderItem,
                                    as         : 'orderItem',
                                    attributes : OrderItem.getAttributes(),
                                    require    : false,
                                },
                            ],
                            model      : BillDeliveryItem,
                            as         : 'billDeliveryItems',
                            attributes : BillDeliveryItem.getAttributes(),
                            require    : false,
                        },
                    ],
                    distinct : true,
                    where    : _where,
                    offset,
                    limit,
                });
                for (const _billDelivery of _billDeliverys.rows) {
                    _datas.push(_billDelivery);
                }
                _result = {
                    succeed     : 1,
                    code        : 200,
                    description : '成功',
                    data        : {
                        list  : _datas,
                        count : _billDeliverys.count,
                    },
                };
            } else {
                const _billDeliverys = await BillDelivery.findAll({
                    include: [
                        {
                            model      : User,
                            as         : 'user',
                            attributes : ['id', 'username', 'nickname'],
                            require    : false,
                        },
                        {
                            include: [
                                {
                                    model      : OrderItem,
                                    as         : 'orderItem',
                                    attributes : OrderItem.getAttributes(),
                                    require    : false,
                                },
                            ],
                            model      : BillDeliveryItem,
                            as         : 'billDeliveryItems',
                            attributes : BillDeliveryItem.getAttributes(),
                            require    : false,
                        },
                    ],
                    where: _where,
                });
                for (const _billDelivery of _billDeliverys) {
                    _datas.push(_billDelivery);
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
            this._instance = new BillDeliveryRepos();
        }
        return this._instance;
    }
}

module.exports = BillDeliveryRepos.getInstance();
