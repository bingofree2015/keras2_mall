const logger = require('tracer').colorConsole();
const {
    Order,
    OrderItem,
    BillPayment,
    BillRefund,
    BillDelivery,
    BillLading,
    BillReship,
    OrderLog,
    User,
    Store,
    BillAfterSale,
    Setting,
} = require('../../models');
const mapAlias = require('../../config/map_alias');
const billAfterSaleRepos = require('./bill_after_sale_repos');
const userPointLogRepos = require('../log/user_point_log_repos');
const goodsRepos = require('../goods/goods_repos');


class OrderRepos {
    constructor () {
        this.ORDER_STATUS_NORMAL = 1; // 订单状态正常
        this.ORDER_STATUS_COMPLETE = 2; // 订单状态完成
        this.ORDER_STATUS_CANCEL = 3; // 订单状态取消

        this.PAY_STATUS_NO = 1; // 未付款
        this.PAY_STATUS_YES = 2; // 已付款
        this.PAY_STATUS_PARTIAL_YES = 3; // 部分付款
        this.PAY_STATUS_PARTIAL_NO = 4; // 部分退款
        this.PAY_STATUS_REFUNDED = 5; // 已退款

        this.SHIP_STATUS_NO = 1; // 未发货
        this.SHIP_STATUS_PARTIAL_YES = 2; // 部分发货
        this.SHIP_STATUS_YES = 3; // 已发货
        this.SHIP_STATUS_PARTIAL_NO = 4; // 部分退货
        this.SHIP_STATUS_RETURNED = 5; // 已退货

        this.RECEIPT_NOT_CONFIRMED = 1; // 未确认收货
        this.CONFIRM_RECEIPT = 2; // 确认收货

        this.NO_COMMENT = 1; // 没有评价
        this.ALREADY_COMMENT = 2; // 已经评价

        this.ALL_PENDING_PAYMENT = 1; // 总订单类型 待付款
        this.ALL_PENDING_DELIVERY = 2; // 待发货
        this.ALL_PENDING_RECEIPT = 3; // 待收货
        this.ALL_PENDING_EVALUATE = 4; // 待评价
        this.ALL_COMPLETED_EVALUATE = 5; // 已评价
        this.ALL_COMPLETED = 6; // 已完成
        this.ALL_CANCEL = 7; // 已取消

        this.ORDER_TYPE_COMMON = 1; // 订单类型，1普通订单，严格按照cart模型里的type_common字段来设置，是一一对应的
        this.ORDER_TYPE_PINTUAN = 2; // 订单类型，2拼团订单

        this._instance = null;
    }

    async create (order) {
        let _result = {
            succeed     : 0, // 1:成功0:失败
            code        : 0, // 错误码
            description : '', // 错误信息
            data        : null, // 本身就是一个json字符串
        };
        try {
            Object.keys(order).forEach((field) => {
                if (!order[field] && order[field] != 0) {
                    delete order[field];
                }
            });
            if (order.sellerId && order.userId && order.orderId) {
                let _order = await Order.findOne({
                    where: {
                        sellerId : order.sellerId,
                        userId   : order.userId,
                        orderId  : order.orderId,
                    },
                    raw: true,
                });
                if (_order) {
                    _result = {
                        succeed     : 0,
                        code        : 101,
                        description : '订单重复',
                    };
                } else {
                    _order = await Order.create(order);
                    _result = {
                        succeed     : 1,
                        code        : 200,
                        description : '成功',
                        data        : _order,
                    };
                }
            } else {
                _result = {
                    succeed     : 0,
                    code        : 100,
                    description : `参数错误 -> order:${JSON.stringify(order)}`,
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

    async batchDelete (ids) {
        let _result = {
            succeed     : 0,
            code        : 0,
            description : '',
            data        : null,
        };

        try {
            if (Array.isArray(ids) && ids.length > 0) {
                const _affectedCount = await Order.destroy({ where: { orderId: ids } });
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

    async update (id, order) {
        let _result = {
            succeed     : 0,
            code        : 0,
            description : '',
            data        : null,
        };

        try {
            Object.keys(order).forEach((field) => {
                if (!order[field] && order[field] != 0) {
                    delete order[field];
                }
            });
            if (id) {
                const _userId = order.userId;
                const _orderId = order.orderId;
                if (_userId && _orderId) {
                    let _order = await Order.findOne({
                        where: {
                            id,
                            userId  : _userId,
                            orderId : _orderId,
                        },
                        raw: true,
                    });
                    if (_order) {
                        const _ret = await Order.update(order, { where: { id } });
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
                                    ...order,
                                    id,
                                },
                            };
                        }
                    } else {
                        _order = await Order.findOne({
                            where: {
                                userId   : _userId,
                                sellerId : _sellerId,
                                orderId  : _orderId,
                                id       : { $ne: id },
                            },
                            raw: true,
                        });
                        if (_order) {
                            _result = {
                                succeed     : 0,
                                code        : 101,
                                description : `名称 [${_title}] 重复`,
                            };
                        } else {
                            const _ret = await Order.update(order, { where: { id } });
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
                                        ...order,
                                        id,
                                    },
                                };
                            }
                        }
                    }
                } else {
                    const _ret = await Order.update(order, { where: { id } });
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
                                ...order,
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

    async get (orderId, type = 1) {
        let _result = {
            succeed     : 0,
            code        : 0,
            description : '',
            data        : null,
        };

        try {
            let _include = [
                {
                    model      : User,
                    attributes : User.getAttributes(),
                    as         : 'user',
                    require    : false,
                },
                {
                    model      : Store,
                    attributes : Store.getAttributes(),
                    as         : 'store',
                    require    : false,
                },
                {
                    model      : OrderItem,
                    attributes : OrderItem.getAttributes(),
                    as         : 'orderItems',
                    require    : false,
                },
            ];
            if (type == 1) {
                _include = _include.concat(
                    {
                        model   : BillPayment,
                        as      : 'billPayments',
                        through : {
                            attributes: [],
                        },
                    },
                    {
                        model   : BillRefund,
                        as      : 'billRefunds',
                        require : false,
                    },
                    {
                        model      : BillDelivery,
                        attributes : BillDelivery.getAttributes(),
                        as         : 'billDeliveries',
                        require    : false,
                    },
                    {
                        model   : BillLading,
                        as      : 'billLadings',
                        require : false,
                    },
                    {
                        model   : BillReship,
                        as      : 'billReships',
                        require : false,
                    },
                    {
                        model   : OrderLog,
                        as      : 'orderLogs',
                        require : false,
                    },
                );
            }

            const _order = await Order.findOne({
                include : _include,
                where   : { orderId },
            });
            if (_order) {
                _result = {
                    succeed     : 1,
                    code        : 200,
                    description : '成功',
                    data        : _order,
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
                const _orders = await Order.findAndCountAll({
                    include: [
                        {
                            model      : User,
                            as         : 'user',
                            attributes : ['id', 'username', 'nickname'],
                            require    : false,
                        },
                    ],
                    distinct : true,
                    where    : _where,
                    offset,
                    limit,
                });
                for (const _order of _orders.rows) {
                    const _state = _order.state;
                    const _orderState = this.getOrderState(
                        _state,
                        _order.payState,
                        _order.shipState,
                        _order.confirm,
                        _order.isComment,
                    );
                    _order.setDataValue('progress', mapAlias.order.progress[_orderState]);
                    const _operations = this.getCapablePermit(_state, _order.payState, _order.shipState);
                    _order.setDataValue('operatings', _operations);

                    _order.payState = mapAlias.order.pay_state[_order.payState];
                    _order.shipState = mapAlias.order.ship_state[_order.shipState];
                    _order.source = mapAlias.order.source[_order.source];
                    // 订单售后状态
                    const _afterSaleState = await billAfterSaleRepos.getAfterSaleState(_order.orderId);
                    if (_afterSaleState.succeed == 1 && _afterSaleState.code == 200) {
                        _order.setDataValue('afterSaleState', _afterSaleState.data);
                    }

                    _datas.push(_order);
                }
                _result = {
                    succeed     : 1,
                    code        : 200,
                    description : '成功',
                    data        : {
                        list  : _datas,
                        count : _orders.count,
                    },
                };
            } else {
                const _orders = await Order.findAll({
                    include: [
                        {
                            model      : User,
                            as         : 'user',
                            attributes : ['id', 'username', 'nickname'],
                            require    : false,
                        },
                    ],
                    where: _where,
                });
                for (const _order of _orders) {
                    const _state = _order.state;
                    const _orderState = this.getOrderState(
                        _state,
                        _order.payState,
                        _order.shipState,
                        _order.confirm,
                        _order.isComment,
                    );
                    _order.setDataValue('progress', _orderState);
                    const _operations = this.getCapablePermit(_state, _order.payState, _order.shipState);
                    _order.setDataValue('operatings', _operations);

                    _order.payState = mapAlias.order.pay_state[_order.payState];
                    _order.shipState = mapAlias.order.ship_state[_order.shipState];
                    _order.source = mapAlias.order.source[_order.source];
                    // 订单售后状态
                    const _afterSaleState = await billAfterSaleRepos.getAfterSaleState(_order.orderId);
                    if (_afterSaleState.succeed == 1 && _afterSaleState.code == 200) {
                        _order.setDataValue('afterSaleState', _afterSaleState.data);
                    }

                    _datas.push(_order);
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
   * 订单数据汇总
   * @param {订单状态} state
   * @param {支付状态} payState
   * @param {发货状态} shipState
   */
    async getCount (state, payState, shipState) {
        let _result = {
            succeed     : 0,
            code        : 0,
            description : '未知错误',
            data        : null,
        };
        try {
            const _count = await Order.count({
                where: {
                    state,
                    payState,
                    shipState,
                },
            });
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
   * 获取订单状态
   * @param {当前订单状态} orderState
   * @param {支付状态} payState
   * @param {发货状态} shipState
   * @param {售后状态} confirm
   * @param {是否评论} isComment
   */
    getOrderState (orderState, payState, shipState, confirm, isComment) {
        if (orderState == this.ORDER_STATUS_NORMAL && payState == this.PAY_STATUS_NO) {
            // 待付款
            return this.ALL_PENDING_PAYMENT;
        }
        if (
            orderState == this.ORDER_STATUS_NORMAL &&
      payState == this.PAY_STATUS_YES &&
      shipState == this.SHIP_STATUS_NO
        ) {
            // 待发货
            return this.ALL_PENDING_DELIVERY;
        }
        if (
            orderState == this.ORDER_STATUS_NORMAL &&
      shipState == this.SHIP_STATUS_YES &&
      confirm == this.RECEIPT_NOT_CONFIRMED
        ) {
            // 待收货
            return this.ALL_PENDING_RECEIPT;
        }
        if (
            orderState == this.ORDER_STATUS_NORMAL &&
      payState > this.PAY_STATUS_NO &&
      shipState == this.SHIP_STATUS_YES &&
      confirm == this.CONFIRM_RECEIPT &&
      isComment == this.NO_COMMENT
        ) {
            // 待评价
            return this.ALL_PENDING_EVALUATE;
        }
        if (
            orderState == this.ORDER_STATUS_NORMAL &&
      payState > this.PAY_STATUS_NO &&
      shipState == this.SHIP_STATUS_YES &&
      confirm == this.CONFIRM_RECEIPT &&
      isComment == this.ALREADY_COMMENT
        ) {
            // 已评价
            return this.ALL_COMPLETED_EVALUATE;
        }
        if (orderState == this.ORDER_STATUS_COMPLETE) {
            // 已完成
            return this.ALL_COMPLETED;
        }
        if (orderState == this.ORDER_STATUS_CANCEL) {
            // 已取消
            return this.ALL_CANCEL;
        }
    }

    getCapablePermit (orderState, payState, shipState, from = 'seller') {
        const _permits = [
            {
                action : 'action.view',
                label  : '查看',
                icon   : 'el-icon-ali-chakan',
                perms  : 'order:view',
            },
        ];
        if (orderState == this.ORDER_STATUS_NORMAL) {
            // 正常
            if (payState == this.PAY_STATUS_NO && from == 'seller') {
                _permits.push({
                    action : 'action.pay',
                    label  : '支付',
                    icon   : 'el-icon-ali-zhifu',
                    perms  : 'order:pay',
                });
            }
            if (payState != this.PAY_STATUS_NO) {
                if (
                    (shipState == this.SHIP_STATUS_NO || shipState == this.SHIP_STATUS_PARTIAL_YES) &&
          from == 'seller'
                ) {
                    _permits.push({
                        action : 'action.edit',
                        label  : '编辑',
                        icon   : 'el-icon-ali-bianji',
                        perms  : 'order:edit',
                    });
                    _permits.push({
                        action : 'action.delivery',
                        label  : '发货',
                        icon   : 'el-icon-ali-fahuodan',
                        perms  : 'order:delivery',
                    });
                }
                _permits.push({
                    action : 'action.finished',
                    label  : '完成',
                    icon   : 'el-icon-ali-wancheng1',
                    perms  : 'order:finished',
                });
            }
            if (payState == this.PAY_STATUS_NO) {
                if (from == 'seller') {
                    _permits.push({
                        action : 'action.edit',
                        label  : '编辑',
                        icon   : 'el-icon-ali-bianji',
                        perms  : 'order:edit',
                    });
                }
                _permits.push({
                    action : 'action.cancel',
                    label  : '取消',
                    icon   : 'el-icon-ali-quxiao1',
                    perms  : 'order:cancel',
                });
            }
        }
        if (orderState == this.ORDER_STATUS_CANCEL) {
            _permits.push({
                action : 'action.delete',
                label  : '删除',
                icon   : 'el-icon-ali-quxiao',
                perms  : 'order:delete',
            });
        }
        return _permits;
    }

    /**
   * 订单完成
   * @param {订单Id} orderId
   */
    async complate (orderId) {
        let _result = {
            succeed     : 0,
            code        : 0,
            description : '未知错误',
            data        : null,
        };
        try {
            // 如果是等待售后审核的订单，则不处理
            const _billAfterSale = await BillAfterSale.findOne({
                where: {
                    orderId,
                    state: 1,
                },
            }); // 等待审核
            if (_billAfterSale) {
                Object.assign(_result, {
                    succeed     : 0,
                    code        : 301,
                    description : '等待售后审核的订单不能处理',
                });
                return _result;
            }
            // 将订单(未付款的订单)状态设置为 完成
            const _order = await Order.findOne({
                where: {
                    orderId,
                    payState: { $ne: 1 },
                },
            });
            if (_order) {
                await Order.update({ state: 2 }, {
                    where: {
                        orderId,
                        payState: { $ne: 1 },
                    },
                });
                let _money = _order.payed;
                const _billAfterSales = await BillAfterSale.findAll({
                    where: {
                        orderId,
                        state: 2,
                    },
                }); // 审核通过
                let _refundMoney = 0;
                for (const _billAfterSaleItem of _billAfterSales) {
                    _refundMoney += _billAfterSaleItem.refund;
                }
                _money -= _refundMoney;

                // 奖励积分
                const _setting = await Setting.findOne({ where: { key: 'global_variables' } });
                if (_setting && _setting.value && _setting.value.orderPointProportion) {
                    const _point = Math.floor(_money / _setting.value.orderPointProportion);

                    await userPointLogRepos.setPoint(
                        _order.userId,
                        _point,
                        2, // 购物返积分
                        `订单: ${_order.orderId} 的积分奖励`,
                    );
                }
                // 订单记录
                await OrderLog.create({
                    orderId : _order.orderId,
                    userId  : _order.userId,
                    type    : 6, // 订单完成
                    msg     : '后台订单完成操作',
                    data    : JSON.stringify({
                        orderId,
                        payState: { $ne: 1 },
                    }),
                });
                _result = {
                    succeed     : 1,
                    code        : 200,
                    description : '成功',
                };
            } else {
                _result = {
                    succeed     : 0,
                    code        : 102,
                    description : '记录不存在',
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
   * 取消订单
   * @param {订单Id} orderId
   * @param {用户Id} userId
   */
    async cancel (orderIds, userId) {
        let _result = {
            succeed     : 0,
            code        : 0,
            description : '未知错误',
            data        : null,
        };
        try {
            const _where = {
                orderId   : orderIds,
                payState  : 1,
                state     : 1,
                shipState : 1,
            }; // 未付款、未发货、正常订单
            if (userId) {
                _where.userId = userId;
            }
            //  查找符合条件的所有订单
            const _orders = await Order.findAll({ where: _where });
            const _orderIds = [];
            for (const _order of _orders) {
                _orderIds.push(_order.orderId);
                // 订单记录
                await OrderLog.create({
                    orderId : _order.orderId,
                    userId  : _order.userId,
                    type    : 7, // 订单取消
                    msg     : '订单取消操作',
                    data    : JSON.stringify(_where),
                });
                if (_order.point > 0) {
                    await userPointLogRepos.setPoint(_order.userId, _order.point, 4, '取消订单返还积分'); // 后台编辑
                }
            }
            // 状态修改
            await Order.update({ state: 3 }, { where: { orderId: _orderIds } });
            const _orderItems = await OrderItem.findAll({ where: { orderId: _orderIds } });
            for (const _orderItem of _orderItems) {
                await goodsRepos.changeStock(_orderItem.productId, 'cancel', _orderItem.num); // 改变库存
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

    /** d
   * 确认收货
   * @param {用户Id} userId
   * @param {订单Id} orderId
   */
    async confirmReceipt (userId, orderId) {
        let _result = {
            succeed     : 0,
            code        : 0,
            description : '未知错误',
            data        : null,
        };
        try {
            const _where = {
                orderId,
                payState  : { $ne: this.PAY_STATUS_NO },
                shipState : { $ne: this.SHIP_STATUS_NO },
                state     : this.ORDER_STATUS_NORMAL,
                confirm   : { $ne: this.CONFIRM_RECEIPT },
                userId,
            };
            // 修改订单
            let _ret = await Order.update(
                {
                    confirm     : this.CONFIRM_RECEIPT,
                    confirmTime : Date.now(),
                },
                { where: _where },
            );
            // 修改发货单
            _ret = await BillDelivery.update({ confirmTime: Date.now() }, { where: orderId });
            // 订单记录
            await OrderLog.create({
                orderId,
                userId,
                type : 4, // 订单签收
                msg  : '确认签收操作',
                data : JSON.stringify(_where),
            });
            _result = {
                succeed     : 1,
                code        : 200,
                description : '确认签收',
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

    // 构造一个广为人知的接口，供用户对该类进行实例化
    static getInstance () {
        if (!this._instance) {
            this._instance = new OrderRepos();
        }
        return this._instance;
    }
}

module.exports = OrderRepos.getInstance();
