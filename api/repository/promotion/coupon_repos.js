const uniqid = require('uniqid');
const logger = require('tracer').colorConsole();
const {
    Coupon, Promotion, SpTarget, SpRule, User,
} = require('../../models');


class CouponRepos {
    /**
    coupon_code  优惠券编码
    promotion_id 优惠券id
    is_used      1 是否使用1未使用，2已使用
    user_id      谁领取了
    used_id      被谁用了
    created_at   创建时间
    updated_at   更新时间
    */
    constructor () {
        this._instance = null;
    }

    async create (coupon) {
        let _result = {
            succeed     : 0, // 1:成功0:失败
            code        : 0, // 错误码
            description : '', // 错误信息
            data        : null, // 本身就是一个json字符串
        };

        try {
            Object.keys(coupon).forEach((field) => {
                if (!coupon[field] && coupon[field] != 0) {
                    delete coupon[field];
                }
            });
            if (coupon.name) {
                let _coupon = await Coupon.findOne({
                    where : { name: coupon.name },
                    raw   : true,
                });
                if (_coupon) {
                    _result = {
                        succeed     : 0,
                        code        : 101,
                        description : '名称重复',
                    };
                } else {
                    _coupon = await Coupon.create(coupon);
                    _result = {
                        succeed     : 1,
                        code        : 200,
                        description : '成功',
                        data        : {
                            ...coupon,
                            id: _coupon.id,
                        },
                    };
                }
            } else {
                _result = {
                    succeed     : 0,
                    code        : 100,
                    description : `参数错误 -> coupon:${JSON.stringify(coupon)}`,
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
                const _affectedCount = await Coupon.destroy({ where: { id: ids } });
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

    async update (id, coupon) {
        let _result = {
            succeed     : 0,
            code        : 0,
            description : '',
            data        : null,
        };

        try {
            Object.keys(coupon).forEach((field) => {
                if (!coupon[field] && coupon[field] != 0) {
                    delete coupon[field];
                }
            });
            if (id) {
                const _name = coupon.name;
                if (_name) {
                    let _coupon = await Coupon.findOne({
                        where: {
                            id,
                            name: _name,
                        },
                        raw: true,
                    });
                    if (_coupon) {
                        const _ret = await Coupon.update(coupon, { where: { id } });
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
                                    ...coupon,
                                    id,
                                },
                            };
                        }
                    } else {
                        _coupon = await Coupon.findOne({
                            where: {
                                name : _name,
                                id   : { $ne: id },
                            },
                            raw: true,
                        });
                        if (_coupon) {
                            _result = {
                                succeed     : 0,
                                code        : 101,
                                description : `名称 [${_name}] 重复`,
                            };
                        } else {
                            const _ret = await Coupon.update(coupon, { where: { id } });
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
                                        ...coupon,
                                        id,
                                    },
                                };
                            }
                        }
                    }
                } else {
                    const _ret = await Coupon.update(coupon, { where: { id } });
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
                                ...coupon,
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
            const _coupon = await Coupon.findOne({
                include: [
                    {
                        model   : Promotion,
                        as      : 'promotion',
                        require : false,
                    },
                    {
                        model   : User,
                        as      : 'recipients',
                        require : false,
                    },
                    {
                        model   : User,
                        as      : 'user',
                        require : false,
                    },
                ],
                where: { id },
            });
            if (_coupon) {
                _result = {
                    succeed     : 1,
                    code        : 200,
                    description : '成功',
                    data        : _coupon,
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
            if ((offset === 0 || offset) && limit) {
                const _coupons = await Coupon.findAndCountAll({
                    include: [
                        {
                            model   : Promotion,
                            as      : 'promotion',
                            require : false,
                        },
                        {
                            model   : User,
                            as      : 'recipients',
                            require : false,
                        },
                        {
                            model   : User,
                            as      : 'user',
                            require : false,
                        },
                    ],
                    distinct : true,
                    where    : _where,
                    offset,
                    limit,
                });
                for (const _coupon of _coupons.rows) {
                    _datas.push(_coupon);
                }
                _result = {
                    succeed     : 1,
                    code        : 200,
                    description : '成功',
                    data        : {
                        list  : _datas,
                        count : _coupons.count,
                    },
                };
            } else {
                const _coupons = await Coupon.findAll({
                    include: [
                        {
                            model   : Promotion,
                            as      : 'promotion',
                            require : false,
                        },
                        {
                            model   : User,
                            as      : 'recipients',
                            require : false,
                        },
                        {
                            model   : User,
                            as      : 'user',
                            require : false,
                        },
                    ],
                    where: _where,
                });
                for (const _coupon of _coupons) {
                    _datas.push(_coupon);
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

    async build (promotionId, num) {
        let _result = {
            succeed     : 0,
            code        : 0,
            description : '未知错误',
            data        : null,
        };
        try {
            const _coupons = [];
            for (let i = 0; i < num; i++) {
                const _uniqid = uniqid();
                _coupons.push({
                    promotionId,
                    couponCode: _uniqid,
                });
            }
            const _ret = await Coupon.bulkCreate(_coupons, {
                updateOnDuplicate: ['promotionId', 'couponCode'],
            });
            console.log(_ret.length);
            _result = {
                succeed     : 1,
                code        : 200,
                description : '成功',
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
   * 获取 我的优惠券
   * @param {*} userId
   * @param {*} offset
   * @param {*} limit
   * @param {*} type
   * @param {*} promotionId
   */
    async getReceivedCoupon (userId, offset, limit, type = 'all', promotionId = '') {
        let _result = {
            succeed     : 0,
            code        : 0,
            description : '未知错误',
            data        : null,
        };
        try {
            const _where = { userId };
            const _assWhere = { type: 2 };
            if (promotionId) {
                _where.promotionId = promotionId;
            } else {
                _assWhere.state = 1;
            }
            switch (type) {
            case 'no_used':
                _where.isUsed = 1;
                _assWhere.endTime = { $gte: Date.now() };
                break;
            case 'yes_used':
                _where.isUsed = 2;
                break;
            case 'invalid':
                _where.isUsed = 2;
                _assWhere.endTime = { $lt: Date.now() };
                break;
            default:
            }
            const _coupons = await Coupon.findAndCountAll({
                include: [
                    {
                        include: [
                            {
                                model   : SpTarget,
                                as      : 'spTargets',
                                require : false,
                            },
                            {
                                model   : SpRule,
                                as      : 'spRules',
                                require : false,
                            },
                        ],
                        model : Promotion,
                        as    : 'promotion',
                        where : _assWhere,
                    },
                ],
                distinct : true,
                where    : _where,
                offset,
                limit,
            });
            for (const _coupon of _coupons.rows) {
                if (_coupon.promotion && _coupon.promotion.spTargets) {
                    const _spTargets = _coupon.promotion.spTargets
                        .map((v) => {
                            let _message = '';
                            switch (v.code) {
                            case 'GOODS_ALL':
                                _message = '购买所有商品';
                                break;
                            case 'GOODS_IDS':
                                _message = '购买指定商品';
                                break;
                            case 'GOODS_CATS':
                                _message = '购买指定分类商品';
                                break;
                            case 'GOODS_BRANDS':
                                _message = '购买指定品牌商品';
                                break;
                            case 'ORDER_FULL':
                                _message = `购买订单满 ${pattern.money} 元`;
                                break;
                            case 'USER_GRADE':
                                _message = '用户符合指定等级';
                                break;
                            default:
                                break;
                            }
                            return _message;
                        })
                        .join('');
                    _coupon.setDataValue('spTargets', _spTargets);
                }
                if (coupon.promotion && coupon.promotion.spRules) {
                    const _spRules = _promotion.spRules
                        .map((v) => {
                            let _message = '';
                            switch (v.code) {
                            case 'GOODS_REDUCE':
                                _message = `减 ${pattern.money} 元`;
                                break;
                            case 'GOODS_DISCOUNT':
                                _message = `打 ${pattern.discount} 折`;
                                break;
                            case 'GOODS_ONE_PRICE':
                                _message = `一口价 ${pattern.money} 元`;
                                break;
                            case 'ORDER_REDUCE':
                                _message = `订单减 ${pattern.money} 元`;
                                break;
                            case 'ORDER_DISCOUNT':
                                _message = `订单打 ${pattern.discount} 折 `;
                                break;
                            case 'GOODS_HALF_PRICE':
                                _message = `第  ${pattern.num} 件 ${pattern.money} 元`;
                                break;
                            default:
                                break;
                            }
                            return _message;
                        })
                        .join('');
                    _coupon.setDataValue('spRules', _spRules);
                }
                _coupon.setDataValue('isExpire', coupon.promotion.endTime > Date.now() ? 1 : 2);
                _coupon.setDataValue('startTime', coupon.promotion.startTime);
                _coupon.setDataValue('endTime', coupon.promotion.endTime);
                _datas.push(_coupon);
            }
            _result = {
                succeed     : 1,
                code        : 200,
                description : '成功',
                data        : {
                    list  : _datas,
                    count : _coupons.count,
                },
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

    async receiveCoupon (userId, promotionId) {
        let _result = {
            succeed     : 0,
            code        : 0,
            description : '未知错误',
            data        : null,
        };
        try {
            // 判断优惠券是否可以领取
            const _promotion = await Promotion.findOne({
                where: {
                    endTime     : { $gt: Date.now() }, // 判断优惠券失效时间 是否可领取
                    state       : 1, // 启用状态
                    type        : 2, // 促销 类型
                    autoReceive : 1, // 自动领取状态
                    id          : promotionId,
                },
                raw: true,
            });
            if (_promotion) {
                // 判断用户是否已领取
                const _coupon = await Coupon.findOne({
                    where: {
                        userId,
                        promotionId,
                    },
                });
                if (_coupon) {
                    _result = {
                        succeed     : 0,
                        code        : 105,
                        description : '优惠券已领取过了',
                    };
                } else {
                    const _couponCode = uniqid();
                    const _ret = await Coupon.create({
                        couponCode: _couponCode,
                        promotionId,
                        userId,
                    });
                    const _affectedCount = _ret[0];
                    if (_affectedCount > 0) {
                        _result = {
                            succeed     : 1,
                            code        : 200,
                            description : '领取成功',
                        };
                    } else {
                        _result = {
                            succeed     : 0,
                            code        : 103,
                            description : '领取失败',
                        };
                    }
                }
            } else {
                _result = {
                    succeed     : 0,
                    code        : 104,
                    description : '没有可用的优惠券',
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

    async receiveCouponWithCode (userId, couponCode) {
        let _result = {
            succeed     : 0,
            code        : 0,
            description : '未知错误',
            data        : null,
        };
        try {
            // 判断用户是否已领取
            const _coupon = await Coupon.findOne({ where: { couponCode } });
            if (_coupon) {
                if (_coupon.usedId) {
                    _result = {
                        succeed     : 0,
                        code        : 105,
                        description : '该优惠券已被使用',
                    };
                } else if (_coupon.userId) {
                    if (_coupon.userId === userId) {
                        _result = {
                            succeed     : 0,
                            code        : 105,
                            description : '优惠券已被您领取过了',
                        };
                    } else if (_coupon.userId && _coupon.userId !== userId) {
                        _result = {
                            succeed     : 0,
                            code        : 105,
                            description : '优惠券已被其它用户领取过了',
                        };
                    }
                } else {
                    // 判断优惠券是否可以领取
                    const _promotion = await Promotion.findOne({
                        where: {
                            endTime     : { $gt: Date.now() }, // 判断优惠券失效时间 是否可领取
                            state       : 1, // 启用状态
                            type        : 2, // 促销 类型
                            autoReceive : 1, // 自动领取状态
                            id          : _coupon.promotionId,
                        },
                        raw: true,
                    });
                    if (_promotion) {
                        //  主要业务处理
                        const _ret = await Coupon.update({ userId }, { where: { couponCode } });
                        const _affectedCount = _ret[0];
                        if (_affectedCount > 0) {
                            _result = {
                                succeed     : 1,
                                code        : 200,
                                description : '领取成功',
                                data        : { couponName: _promotion.name },
                            };
                        } else {
                            _result = {
                                succeed     : 0,
                                code        : 103,
                                description : '领取失败',
                            };
                        }
                    } else {
                        _result = {
                            succeed     : 0,
                            code        : 104,
                            description : '没有可用的优惠券',
                        };
                    }
                }
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
            this._instance = new CouponRepos();
        }
        return this._instance;
    }
}

module.exports = CouponRepos.getInstance();
