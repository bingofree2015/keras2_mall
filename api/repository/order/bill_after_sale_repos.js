const logger = require('tracer').colorConsole();
const { BillAfterSale, BillAfterSaleItem, User } = require('../../models');
const billReshipRepo = require('./bill_reship_repos');
const billRefundRepo = require('../pay/bill_refund_repos');

/**
 * 退货单
 */
class BillAfterSaleRepos {
    constructor () {
        this._instance = null;

        this.TYPE_REFUND = 1; // 售后类型 退款
        this.TYPE_RESHIP = 2; // 售后类型 退货

        this.STATUS_WAITAUDIT = 1; // 状态 等待审核
        this.STATUS_SUCCESS = 2; // 状态 审核通过
        this.STATUS_REFUSE = 3; // 状态 审核拒绝
    }

    /**
        after_sale_id 售后单id
        order_id      订单ID 关联order.id
        user_id       用户ID 关联user.id
        type          1 售后类型 ，1=只退款，2退款退货
        refund        0.00 退款金额
        status        状态 1=未审核 2=审核通过 3=审核拒绝
        reason        退款原因
        mark          卖家备注，如果审核失败了，会显示到前端
        created_at    创建时间
        updated_at    更新时间
     */
    async create (billAfterSale) {
        let _result = {
            succeed     : 0, // 1:成功0:失败
            code        : 0, // 错误码
            description : '', // 错误信息
            data        : null, // 本身就是一个json字符串
        };

        try {
            Object.keys(billAfterSale).forEach((field) => {
                if (!billAfterSale[field] && billAfterSale[field] != 0) {
                    delete billAfterSale[field];
                }
            });
            if (billAfterSale.userId && billAfterSale.orderId) {
                let _billAfterSale = await BillAfterSale.findOne({
                    where: {
                        userId  : billAfterSale.userId,
                        orderId : billAfterSale.orderId,
                    },
                    raw: true,
                });
                if (_billAfterSale) {
                    _result = {
                        succeed     : 0,
                        code        : 101,
                        description : '名称重复',
                    };
                } else {
                    _billAfterSale = await BillAfterSale.create(billAfterSale);
                    _result = {
                        succeed     : 1,
                        code        : 200,
                        description : '成功',
                        data        : _billAfterSale,
                    };
                }
            } else {
                _result = {
                    succeed     : 0,
                    code        : 100,
                    description : `参数错误 -> billAfterSale:${JSON.stringify(billAfterSale)}`,
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
                const _affectedCount = await BillAfterSale.destroy({ where: { id: ids } });
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

    async update (id, billAfterSale) {
        let _result = {
            succeed     : 0,
            code        : 0,
            description : '',
            data        : null,
        };

        try {
            Object.keys(billAfterSale).forEach((field) => {
                if (!billAfterSale[field] && billAfterSale[field] != 0) {
                    delete billAfterSale[field];
                }
            });
            if (id) {
                const _userId = billAfterSale.userId;
                const _orderId = billAfterSale.orderId;
                if (_userId && _orderId) {
                    let _billAfterSale = await BillAfterSale.findOne({
                        where: {
                            id,
                            userId  : _userId,
                            orderId : _orderId,
                        },
                        raw: true,
                    });
                    if (_billAfterSale) {
                        const _ret = await BillAfterSale.update(billAfterSale, { where: { id } });
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
                                    ...billAfterSale,
                                    id,
                                },
                            };
                        }
                    } else {
                        _billAfterSale = await BillAfterSale.findOne({
                            where: {
                                userId  : _userId,
                                orderId : _orderId,
                                id      : { $ne: id },
                            },
                            raw: true,
                        });
                        if (_billAfterSale) {
                            _result = {
                                succeed     : 0,
                                code        : 101,
                                description : '售后单重复',
                            };
                        } else {
                            const _ret = await BillAfterSale.update(billAfterSale, { where: { id } });
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
                                        ...billAfterSale,
                                        id,
                                    },
                                };
                            }
                        }
                    }
                } else {
                    const _ret = await BillAfterSale.update(billAfterSale, { where: { id } });
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
                                ...billAfterSale,
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
            const _billAfterSale = await BillAfterSale.findOne({
                include: [
                    {
                        model      : User,
                        as         : 'user',
                        attributes : User.getAttributes(),
                        require    : false,
                    },
                    {
                        model      : BillAfterSaleItem,
                        as         : 'billAfterSaleItems',
                        attributes : BillAfterSaleItem.getAttributes(),
                        require    : false,
                    },
                ],
                where: { id },
            });
            if (_billAfterSale) {
                _result = {
                    succeed     : 1,
                    code        : 200,
                    description : '成功',
                    data        : _billAfterSale,
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
                const _billAfterSales = await BillAfterSale.findAndCountAll({
                    include: [
                        {
                            model      : User,
                            as         : 'user',
                            attributes : User.getAttributes(),
                            require    : false,
                        },
                        {
                            model      : BillAfterSaleItem,
                            as         : 'billAfterSaleItems',
                            attributes : BillAfterSaleItem.getAttributes(),
                            require    : false,
                        },
                    ],
                    distinct : true,
                    where    : _where,
                    offset,
                    limit,
                });
                for (const _billAfterSale of _billAfterSales.rows) {
                    _datas.push(_billAfterSale);
                }
                _result = {
                    succeed     : 1,
                    code        : 200,
                    description : '成功',
                    data        : {
                        list  : _datas,
                        count : _billAfterSales.count,
                    },
                };
            } else {
                const _billAfterSales = await BillAfterSale.findAll({
                    include: [
                        {
                            model      : User,
                            as         : 'user',
                            attributes : User.getAttributes(),
                            require    : false,
                        },
                        {
                            model      : BillAfterSaleItem,
                            as         : 'billAfterSaleItems',
                            attributes : BillAfterSaleItem.getAttributes(),
                            require    : false,
                        },
                    ],
                    where: _where,
                });
                for (const _billAfterSale of _billAfterSales) {
                    _datas.push(_billAfterSale);
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
   * 等待审核退货单
   */
    async getCount () {
        let _result = {
            succeed     : 0,
            code        : 0,
            description : '未知错误',
            data        : null,
        };
        try {
            const _count = await BillAfterSale.count({ where: { status: this.STATUS_WAITAUDIT } });
            Object.assign(_result, {
                succeed     : 1,
                code        : 200,
                description : '成功',
                data        : _count,
            });
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
   * 获取订单的售后状态
   * @param {订单号} orderId
   */
    async getAfterSaleState (orderId) {
        let _result = {
            succeed     : 0,
            code        : 0,
            description : '未知错误',
            data        : null,
        };
        try {
            const _states = [];
            const _billAfterSale = await BillAfterSale.findOne({ where: { orderId } });
            if (_billAfterSale) {
                if (_billAfterSale.status == this.STATUS_WAITAUDIT) {
                    _states.push('待审核');
                } else if (_billAfterSale.status == this.STATUS_SUCCESS) {
                    if (_billAfterSale.type == this.TYPE_REFUND) {
                        // 从退款单表中查原因
                        const _billRefundState = await billRefundRepo.getBillRefundState(
                            _billAfterSale.afterSaleId,
                        );
                        if (_billRefundState.succeed == 1 && _billRefundState.code == 200) {
                            _states.push(_billRefundState.data);
                        }
                    } else if (_billAfterSale.type == this.TYPE_RESHIP) {
                        // 从退款、退货单表中找原因
                        const _billRefundState = await billRefundRepo.getBillRefundState(
                            _billAfterSale.afterSaleId,
                        );
                        if (_billRefundState.succeed == 1 && _billRefundState.code == 200) {
                            _states.push(_billRefundState.data);
                        }
                        const _billReshipState = await billReshipRepo.getBillReshipState(
                            _billAfterSale.afterSaleId,
                        );
                        if (_billReshipState.succeed == 1 && _billReshipState.code == 200) {
                            _states.push(_billReshipState.data);
                        }
                    } else {
                        _states.push('状态异常');
                    }
                } else if (_billAfterSale.status == this.STATUS_REFUSE) {
                    _states.push('审核拒绝');
                } else {
                    _states.push('状态异常');
                }
            }
            Object.assign(_result, {
                succeed     : 1,
                code        : 200,
                description : '成功',
                data        : _states.join(','),
            });
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
            this._instance = new BillAfterSaleRepos();
        }
        return this._instance;
    }
}

module.exports = BillAfterSaleRepos.getInstance();
