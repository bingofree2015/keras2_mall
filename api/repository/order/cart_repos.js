const logger = require('tracer').colorConsole();
const { Op } = require('sequelize');
const { Cart, User } = require('../../models');


class CartRepos {
    constructor () {
        this._instance = null;
    }

    async create (cart) {
        let _result = {
            succeed     : 0, // 1:成功0:失败
            code        : 0, // 错误码
            description : '', // 错误信息
            data        : null, // 本身就是一个json字符串
        };

        try {
            Object.keys(cart).forEach((field) => {
                if (!cart[field] && cart[field] != 0) {
                    delete cart[field];
                }
            });
            if (cart.userId && cart.type) {
                const _cart = await Cart.create(cart);
                _result = {
                    succeed     : 1,
                    code        : 200,
                    description : '成功',
                    data        : _cart,
                };
            } else {
                _result = {
                    succeed     : 0,
                    code        : 100,
                    description : `参数错误 -> cart:${JSON.stringify(cart)}`,
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
                const _affectedCount = await Cart.destroy({ where: { id: ids } });
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

    async update (id, cart) {
        let _result = {
            succeed     : 0,
            code        : 0,
            description : '',
            data        : null,
        };

        try {
            Object.keys(cart).forEach((field) => {
                if (!cart[field] && cart[field] != 0) {
                    delete cart[field];
                }
            });
            if (id) {
                const _ret = await Cart.update(cart, { where: { id } });
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
                            ...cart,
                            id,
                        },
                    };
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
            const _cart = await Cart.findOne({
                where : { id },
                raw   : true,
            });
            if (_cart) {
                _result = {
                    succeed     : 1,
                    code        : 200,
                    description : '成功',
                    data        : _cart,
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
                const _carts = await Cart.findAndCountAll({
                    where : _where,
                    offset,
                    limit,
                    raw   : true,
                });
                for (const _cart of _carts.rows) {
                    _datas.push(_cart);
                }
                _result = {
                    succeed     : 1,
                    code        : 200,
                    description : '成功',
                    data        : {
                        list  : _datas,
                        count : _carts.count,
                    },
                };
            } else {
                const _carts = await Cart.findAll({
                    where : _where,
                    raw   : true,
                });
                for (const _cart of _carts) {
                    _datas.push(_cart);
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
            this._instance = new CartRepos();
        }
        return this._instance;
    }
}

module.exports = CartRepos.getInstance();
