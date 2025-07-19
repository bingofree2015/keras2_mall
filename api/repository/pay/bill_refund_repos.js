const logger = require('tracer').colorConsole();
const { BillRefund, User } = require('../../models');

/**
 * 退款单
 */
class BillRefundRepos {
    constructor () {
        this.STATUS_NOREFUND = 1; // 退款状态 未退款
        this.STATUS_REFUND = 2; // 退款状态，已退款
        this.STATUS_FAIL = 3; // 退款状态,退款失败，可以再次退款
        this.STATUS_REFUSE = 4; // 退款拒绝

        this.TYPE_ORDER = 1; // 单据类型 订单

        this._instance = null;
    }

    async create (billRefund) {
        let _result = {
            succeed     : 0, // 1:成功0:失败
            code        : 0, // 错误码
            description : '', // 错误信息
            data        : null, // 本身就是一个json字符串
        };

        try {
            Object.keys(billRefund).forEach((field) => {
                if (!billRefund[field] && billRefund[field] != 0) {
                    delete billRefund[field];
                }
            });
            if (billRefund.userId && billRefund.afterSaleId) {
                let _billRefund = await BillRefund.findOne({
                    where: {
                        userId      : billRefund.userId,
                        afterSaleId : billRefund.afterSaleId,
                    },
                    raw: true,
                });
                if (_billRefund) {
                    _result = {
                        succeed     : 0,
                        code        : 101,
                        description : '记录重复',
                    };
                } else {
                    _billRefund = await BillRefund.create(billRefund);
                    _result = {
                        succeed     : 1,
                        code        : 200,
                        description : '成功',
                        data        : _billRefund,
                    };
                }
            } else {
                _result = {
                    succeed     : 0,
                    code        : 100,
                    description : `参数错误 -> billRefund:${JSON.stringify(billRefund)}`,
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
                const _affectedCount = await BillRefund.destroy({ where: { id: ids } });
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

    async update (id, billRefund) {
        let _result = {
            succeed     : 0,
            code        : 0,
            description : '',
            data        : null,
        };

        try {
            Object.keys(billRefund).forEach((field) => {
                if (!billRefund[field] && billRefund[field] != 0) {
                    delete billRefund[field];
                }
            });
            if (id) {
                const _userId = billRefund.userId;
                const _afterSaleId = billRefund.afterSaleId;
                if (_userId && _afterSaleId) {
                    let _billRefund = await BillRefund.findOne({
                        where: {
                            id,
                            userId      : _userId,
                            afterSaleId : _afterSaleId,
                        },
                        raw: true,
                    });
                    if (_billRefund) {
                        const _ret = await BillRefund.update(billRefund, { where: { id } });
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
                                    ...billRefund,
                                    id,
                                },
                            };
                        }
                    } else {
                        _billRefund = await BillRefund.findOne({
                            where: {
                                userId      : _userId,
                                afterSaleId : _afterSaleId,
                                id          : { $ne: id },
                            },
                            raw: true,
                        });
                        if (_billRefund) {
                            _result = {
                                succeed     : 0,
                                code        : 101,
                                description : '记录重复',
                            };
                        } else {
                            const _ret = await BillRefund.update(billRefund, { where: { id } });
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
                                        ...billRefund,
                                        id,
                                    },
                                };
                            }
                        }
                    }
                } else {
                    const _ret = await BillRefund.update(billRefund, { where: { id } });
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
                                ...billRefund,
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
            const _billRefund = await BillRefund.findOne({
                include: [
                    {
                        model      : User,
                        attributes : User.getAttributes(),
                        as         : 'user',
                        require    : false,
                    },
                ],
                where: { id },
            });
            if (_billRefund) {
                _result = {
                    succeed     : 1,
                    code        : 200,
                    description : '成功',
                    data        : _billRefund,
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
                const _billRefunds = await BillRefund.findAndCountAll({
                    include: [
                        {
                            model      : User,
                            attributes : User.getAttributes(),
                            as         : 'user',
                            require    : false,
                        },
                    ],
                    distinct : true,
                    where    : _where,
                    offset,
                    limit,
                });
                for (const _billRefund of _billRefunds.rows) {
                    _datas.push(_billRefund);
                }
                _result = {
                    succeed     : 1,
                    code        : 200,
                    description : '成功',
                    data        : {
                        list  : _datas,
                        count : _billRefunds.count,
                    },
                };
            } else {
                const _billRefunds = await BillRefund.findAll({
                    include: [
                        {
                            model      : User,
                            attributes : User.getAttributes(),
                            as         : 'user',
                            require    : false,
                        },
                    ],
                    where: _where,
                });
                for (const _billRefund of _billRefunds) {
                    _datas.push(_billRefund);
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
   * 返回退款单状态
   * @param {售后单号} afterSaleId
   */
    async getBillRefundState (afterSaleId) {
        let _result = {
            succeed     : 0,
            code        : 0,
            description : '未知错误',
            data        : null,
        };
        try {
            let _data = '';
            const _billRefund = await BillRefund.findOne({ where: { afterSaleId } });
            if (_billRefund) {
                if (_billRefund.status == this.STATUS_NOREFUND) {
                    _data = '未退款';
                } else if (_billRefund.status == this.STATUS_REFUND) {
                    _data = '已退款';
                } else if (_billRefund.status == this.STATUS_FAIL) {
                    _data = '退款失败';
                } else if (_billRefund.status == this.STATUS_REFUSE) {
                    _data = '退款拒绝';
                } else {
                    _data = '状态异常';
                }
            } else {
                _data = '未退款';
            }
            Object.assign(_result, {
                succeed     : 1,
                code        : 200,
                description : '成功',
                data        : _data,
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
            this._instance = new BillRefundRepos();
        }
        return this._instance;
    }
}

module.exports = BillRefundRepos.getInstance();
