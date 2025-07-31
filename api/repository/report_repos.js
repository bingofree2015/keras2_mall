
const moment = require('moment');
const _ = require('lodash');
const validator = require('validator');

const logger = require('tracer').colorConsole();
const { Op } = require('sequelize');
const {
    sequelize, Attachment, Goods, Order, GoodsCollection, OrderItem,
} = require('../models');


class ReportRepos {
    constructor () {
    // 报表参数模板
        this._options = {
            title: {
                text: '报表',
            },
            tooltip: {
                trigger: 'axis',
            },
            legend: {
                data: [],
            },
            grid: {
                left         : '3%',
                right        : '4%',
                bottom       : '3%',
                containLabel : true,
            },
            toolbox: {
                feature: {
                    saveAsImage: [],
                },
            },
            xAxis: {
                type        : 'category',
                boundaryGap : false,
                data        : [],
            },
            yAxis: {
                type : 'value',
                name : '元',
            },
            series: [],
        };
        this._instance = null;
    }

    /**
   * @param {开始时间} startTime
   * @param {结束时间} endTime
   * @param {单位} unit 0:小时; 1:天
   */
    async getOrderData (startTime, endTime, unit = 0) {
        let _result = {
            succeed     : 0,
            code        : 0,
            description : '未知错误',
            data        : null,
        };
        try {
            startTime = moment(startTime).format('YYYY-MM-DD HH:mm:ss');
            endTime = moment(endTime).format('YYYY-MM-DD HH:mm:ss');
            if (validator.isISO8601(startTime) && validator.isISO8601(endTime)) {
                const _startTime = moment(startTime);
                const _endTime = moment(endTime);

                let _splitNumber = 0;
                const _daySplitNumber = _endTime.diff(_startTime, 'days');
                if (_daySplitNumber < 5) {
                    unit = 0; // 自动转换为以小时为单位的时间刻度
                    _splitNumber = _endTime.diff(_startTime, 'hours');
                } else {
                    unit = 1;
                    _splitNumber = _daySplitNumber;
                }

                const _hourSplitNumber = _endTime.diff(_startTime, 'hours');
                if (_hourSplitNumber > 200) {
                    unit = 1; // 自动转换为以天为单位的时间刻度
                    _splitNumber = _endTime.diff(_startTime, 'days');
                } else {
                    unit = 0;
                    _splitNumber = _hourSplitNumber;
                }

                const _options = _.cloneDeep(this._options);

                // 生成X轴数据
                _options.title.text = '订单统计';
                const _legend = [
                    {
                        key   : 'all',
                        value : '全部',
                    },
                    {
                        key   : 'nopay',
                        value : '待付款',
                    },
                    {
                        key   : 'payed',
                        value : '已付款',
                    },
                ];
                _options.legend.data = _legend.map((v) => v.value);

                const _xAxisData = [];
                let _format = '';
                switch (unit) {
                case 0: // 小时间单位
                    if (_splitNumber <= 24) {
                        _format = 'HH时';
                    } else if (_splitNumber <= 100) {
                        _format = 'DD日HH时';
                    } else {
                        _format = 'MM月DD日H时';
                    }
                    break;
                case 1: // 天为单位
                    if (_splitNumber <= 31) {
                        _format = 'DD号';
                    } else if (_splitNumber <= 365) {
                        _format = 'MM.DD';
                    } else {
                        _format = 'YYYY.MM.DD';
                    }
                    break;
                default:
                    _format = 'MM.DD';
                    break;
                }
                for (let i = 0; i < _splitNumber; i++) {
                    if (unit === 0) {
                        _xAxisData.push(_startTime.add(1, 'hours').format(_format));
                    } else {
                        _xAxisData.push(_startTime.add(1, 'days').format(_format));
                    }
                }
                _options.xAxis.data = _xAxisData;

                for (const item of _legend) {
                    const _key = item.key;
                    if (_key) {
                        let _where = ' 1 = 1';
                        let _data = [];
                        switch (_key) {
                        case 'all':
                            _where += ` and created_at > '${startTime}' and created_at < '${endTime}'`;
                            _data = await this._orderItems(_where, 'created_at', startTime, _splitNumber, unit);
                            break;
                        case 'nopay':
                            _where += ` and created_at > '${startTime}' and created_at < '${endTime}' and pay_state = 1`;
                            _data = await this._orderItems(_where, 'created_at', startTime, _splitNumber, unit);
                            break;
                        case 'payed':
                            _where += ` and created_at > '${startTime}' and created_at < '${endTime}' and pay_state > 1`;
                            _data = await this._orderItems(
                                _where,
                                'payment_time',
                                startTime,
                                _splitNumber,
                                unit,
                            );
                            break;
                        default:
                            break;
                        }
                        const _name = item.value;
                        const _serie = {
                            name : _name,
                            type : 'line',
                            data : _data.map((v) => v.val),
                        };
                        _options.series.push(_serie);
                    }
                }
                _result = {
                    succeed     : 1,
                    code        : 200,
                    description : '成功',
                    data        : _options,
                };
            } else {
                _result = {
                    succeed     : 0,
                    code        : 102,
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

    /**
   * 订单数据
   * @param {查询条件} where
   * @param {作为x轴的字段} columm
   * @param {起点} startTime
   * @param {*} splitNumber
   * @param {*} unit
   */
    async _orderItems (where, columm, startTime, splitNumber, unit) {
        const _seconds = unit === 0 ? 60 * 60 : 24 * 60 * 60;

        const _exeSql = `
            select tmp_x.x,ifnull(sum(o.order_amount),0) as val,count(o.order_id) as num
            from
              (SELECT @xi:=@xi+1 as x from
                (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10) x1,
                (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10) x2,
                (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10) x3,
                (SELECT @xi:=-1) x0 limit 0,${splitNumber}) tmp_x
            left join (
                select * from orders
                where ${where}
            ) o on tmp_x.x = (( cast(o.${columm} as signed) - '${startTime}') div (${_seconds}))
            group by tmp_x.x
        `;
        // console.log(_exeSql)
        const _orders = await sequelize.query(_exeSql, { type: sequelize.QueryTypes.SELECT });
        return _orders;
    }

    async getPayData (startTime, endTime, unit = 0) {
        let _result = {
            succeed     : 0,
            code        : 0,
            description : '未知错误',
            data        : null,
        };
        try {
            startTime = moment(startTime).format('YYYY-MM-DD HH:mm:ss');
            endTime = moment(endTime).format('YYYY-MM-DD HH:mm:ss');
            if (validator.isISO8601(startTime) && validator.isISO8601(endTime)) {
                const _startTime = moment(startTime);
                const _endTime = moment(endTime);

                let _splitNumber = 0;
                const _daySplitNumber = _endTime.diff(_startTime, 'days');
                if (_daySplitNumber < 5) {
                    unit = 0; // 自动转换为以小时为单位的时间刻度
                    _splitNumber = _endTime.diff(_startTime, 'hours');
                } else {
                    unit = 1;
                    _splitNumber = _daySplitNumber;
                }

                const _hourSplitNumber = _endTime.diff(_startTime, 'hours');
                if (_hourSplitNumber > 200) {
                    unit = 1; // 自动转换为以天为单位的时间刻度
                    _splitNumber = _endTime.diff(_startTime, 'days');
                } else {
                    unit = 0;
                    _splitNumber = _hourSplitNumber;
                }

                const _options = _.cloneDeep(this._options);

                // 生成X轴数据
                _options.title.text = '财务统计';

                const _legend = [
                    {
                        key   : 'all',
                        value : '收款单',
                    },
                    {
                        key   : 'order',
                        value : '订单收款',
                    },
                    {
                        key   : 'refund',
                        value : '订单退款',
                    },
                    {
                        key   : 'recharge',
                        value : '充值',
                    },
                    {
                        key   : 'tocash',
                        value : '提现',
                    },
                ];
                _options.legend.data = _legend.map((v) => v.value);

                const _xAxisData = [];
                let _format = '';
                switch (unit) {
                case 0: // 小时间单位
                    if (_splitNumber <= 24) {
                        _format = 'HH时';
                    } else if (_splitNumber <= 100) {
                        _format = 'DD日HH时';
                    } else {
                        _format = 'MM月DD日H时';
                    }
                    break;
                case 1: // 天为单位
                    if (_splitNumber <= 31) {
                        _format = 'DD号';
                    } else if (_splitNumber <= 365) {
                        _format = 'MM.DD';
                    } else {
                        _format = 'YYYY.MM.DD';
                    }
                    break;
                default:
                    _format = 'MM.DD';
                    break;
                }
                for (let i = 0; i < _splitNumber; i++) {
                    if (unit === 0) {
                        _xAxisData.push(_startTime.add(1, 'hours').format(_format));
                    } else {
                        _xAxisData.push(_startTime.add(1, 'days').format(_format));
                    }
                }
                _options.xAxis.data = _xAxisData;

                for (const item of _legend) {
                    const _key = item.key;
                    if (_key) {
                        let _where = ' 1 = 1';
                        let _data = [];
                        switch (_key) {
                        case 'all':
                            _where += ` and updated_at > '${startTime}' and updated_at < '${endTime}' and state = 2`;
                            _data = await this._payItems(_where, 'updated_at', startTime, _splitNumber, unit);
                            break;
                        case 'order':
                            _where += ` and updated_at > '${startTime}' and updated_at < '${endTime}' and state = 2 and type = 1`;
                            _data = await this._payItems(_where, 'updated_at', startTime, _splitNumber, unit);
                            break;
                        case 'refund':
                            _where += ` and updated_at > '${startTime}' and updated_at < '${endTime}' and state = 2 and type = 1`;
                            _data = await this._refundItems(_where, 'updated_at', startTime, _splitNumber, unit);
                            break;
                        case 'recharge':
                            _where += ` and updated_at > '${startTime}' and updated_at < '${endTime}' and state = 2 and type = 2`;
                            _data = await this._payItems(_where, 'updated_at', startTime, _splitNumber, unit);
                            break;
                        case 'tocash':
                            _where += ` and updated_at > '${startTime}' and updated_at < '${endTime}' and type = 2`;
                            _data = await this._toCashItems(_where, 'updated_at', startTime, _splitNumber, unit);
                            break;
                        default:
                            break;
                        }
                        const _name = item.value;
                        const _serie = {
                            name : _name,
                            type : 'line',
                            data : _data.map((v) => v.val),
                        };
                        _options.series.push(_serie);
                    }
                }
                _result = {
                    succeed     : 1,
                    code        : 200,
                    description : '成功',
                    data        : _options,
                };
            } else {
                _result = {
                    succeed     : 0,
                    code        : 102,
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

    async _payItems (where, columm, startTime, splitNumber, unit) {
        const _seconds = unit === 0 ? 60 * 60 : 24 * 60 * 60;

        const _exeSql = `
            select tmp_x.x,ifnull(sum(o.money),0) as val,count(o.payment_id) as num
            from
              (SELECT @xi:=@xi+1 as x from
                (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10) x1,
                (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10) x2,
                (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10) x3,
                (SELECT @xi:=-1) x0 limit 0,${splitNumber}) tmp_x
            left join (
                select * from bill_payments
                where ${where}
            ) o on tmp_x.x = (( cast(o.${columm} as signed)  - '${startTime}') div (${_seconds}))
            group by tmp_x.x
        `;
        // console.log(_exeSql)

        const _pays = await sequelize.query(_exeSql, { type: sequelize.QueryTypes.SELECT });
        return _pays;
    }

    async _refundItems (where, columm, startTime, splitNumber, unit) {
        const _seconds = unit === 0 ? 60 * 60 : 24 * 60 * 60;

        const _exeSql = `
            select tmp_x.x,ifnull(sum(o.money),0) as val,count(o.refund_id) as num
            from
              (SELECT @xi:=@xi+1 as x from
                (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10) x1,
                (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10) x2,
                (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10) x3,
                (SELECT @xi:=-1) x0 limit 0,${splitNumber}) tmp_x
            left join (
                select * from bill_refunds
                where ${where}
            ) o on tmp_x.x = (( cast(o.${columm} as signed) - '${startTime}') div (${_seconds}))
            group by tmp_x.x
        `;
        // console.log(_exeSql)

        const _refunds = await sequelize.query(_exeSql, { type: sequelize.QueryTypes.SELECT });
        return _refunds;
    }

    async _toCashItems (where, columm, startTime, splitNumber, unit) {
        const _seconds = unit === 0 ? 60 * 60 : 24 * 60 * 60;

        const _exeSql = `
            select tmp_x.x,ifnull(sum(o.money),0) as val,count(o.id) as num
            from
              (SELECT @xi:=@xi+1 as x from
                (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10) x1,
                (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10) x2,
                (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10) x3,
                (SELECT @xi:=-1) x0 limit 0,${splitNumber}) tmp_x
            left join (
                select * from user_to_cashes
                where ${where}
            ) o on tmp_x.x = ((cast(o.${columm} as signed) - '${startTime}') div (${_seconds}))
            group by tmp_x.x
        `;
        // console.log(_exeSql)

        const _toCashes = await sequelize.query(_exeSql, { type: sequelize.QueryTypes.SELECT });
        return _toCashes;
    }

    async getGoodsCollections (searchKey) {
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
        // console.log(searchKey)

        const _datas = [];
        try {
            const _goodsCollections = await GoodsCollection.findAll({
                attributes : [[sequelize.fn('COUNT', sequelize.col('goods_id')), 'count']],
                include    : [
                    {
                        model      : Goods,
                        attributes : ['id', 'name'],
                        include    : [
                            {
                                model      : Attachment,
                                attributes : ['path'],
                                as         : 'attachment',
                                require    : false,
                            },
                        ],
                        as      : 'goods',
                        require : true,
                    },
                ],
                distinct : true,
                group    : ['goods.id', 'goods.name', 'goods->attachment.path'],
                where    : _where,
            });
            for (const _goodsCollection of _goodsCollections) {
                _datas.push(_goodsCollection);
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
                description : err,
            };
        }

        return _result;
    }

    /**
   * 商品销量查询
   * @param {查询条件} searchKey
   */
    async getGoods (searchKey, offset, limit) {
        let _result = {
            succeed     : 0,
            code        : 0,
            description : '未知错误',
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
                const _orderItems = await OrderItem.findAndCountAll({
                    attributes: [
                        'sn',
                        'name',
                        'imageUrl',
                        'specs',
                        [sequelize.fn('SUM', sequelize.col('num')), 'num'],
                        [sequelize.fn('SUM', sequelize.col('amount')), 'amount'],
                    ],
                    include: [
                        {
                            model      : Order,
                            attributes : [],
                            as         : 'order',
                            required   : true,
                        },
                    ],
                    group : ['sn', 'name', 'imageUrl', 'specs'],
                    order : [
                        [sequelize.literal('SUM(num)'), 'DESC'],
                        [sequelize.literal('SUM(amount)'), 'DESC'],
                    ],
                    offset,
                    limit,
                });

                for (const _orderItem of _orderItems.rows) {
                    _datas.push(_orderItem);
                }
                _result = {
                    succeed     : 1,
                    code        : 200,
                    description : '成功',
                    data        : {
                        list  : _datas,
                        count : _orderItems.count,
                    },
                };
            } else {
                const _orderItems = await OrderItem.findAll({
                    attributes: [
                        'sn',
                        'name',
                        'imageUrl',
                        'specs',
                        [sequelize.fn('SUM', sequelize.col('num')), 'num'],
                        [sequelize.fn('SUM', sequelize.col('amount')), 'amount'],
                    ],
                    include: [
                        {
                            model      : Order,
                            attributes : [],
                            as         : 'order',
                            required   : true,
                        },
                    ],
                    group : ['sn', 'name', 'imageUrl', 'specs'],
                    order : [
                        [sequelize.literal('SUM(num)'), 'DESC'],
                        [sequelize.literal('SUM(amount)'), 'DESC'],
                    ],
                });
                for (const _orderItem of _orderItems) {
                    _datas.push(_orderItem);
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

    // 构造一个广为人知的接口，供用户对该类进行实例化
    static getInstance () {
        if (!this._instance) {
            this._instance = new ReportRepos();
        }
        return this._instance;
    }
}

module.exports = ReportRepos.getInstance();
