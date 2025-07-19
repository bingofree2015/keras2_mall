
const logger = require('tracer').colorConsole();
const { Advertisement, AdvertPosition, Attachment } = require('../../models');


class AdvertisementRepos {
    constructor () {
        this._instance = null;
    }

    /**
   * 广告数据
   * @param {主键} id
   */
    async get (id) {
        const _result = {
            succeed     : 0,
            code        : 0,
            description : '',
            data        : null,
        };

        try {
            const _advertisement = await Advertisement.findOne({
                include: [
                    {
                        attributes : ['id', 'name'],
                        model      : AdvertPosition,
                        as         : 'advertPosition',
                    },
                    {
                        attributes : ['id', 'path'],
                        model      : Attachment,
                        as         : 'attachment',
                    },
                ],
                where: { id },
            });
            if (_advertisement) {
                Object.assign(_result, {
                    succeed     : 1,
                    code        : 200,
                    description : '成功',
                    data        : _advertisement,
                });
            } else {
                Object.assign(_result, {
                    code        : 102,
                    description : '数据不存在',
                });
            }
        } catch (err) {
            logger.error(err);
            Object.assign(_result, {
                code        : 500,
                description : err.message || err.stack || '系统错误',
            });
        }
        return _result;
    }

    /**
   * 广告列表,支持分页
   * @param {查询条件} searchKey
   * @param {偏移} offset
   * @param {记录条数} limit
   */
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
                } else if (Array.isArray(searchKey[_key]) && searchKey[_key].length === 2) {
                    const _beginValue = searchKey[_key][0];
                    const _endValue = searchKey[_key][1];
                    _where[_key] = {
                        $gte : _beginValue,
                        $lte : _endValue,
                    };
                } else {
                    _where[_key] = searchKey[_key];
                }
            }
        }

        const _datas = [];
        try {
            if ((offset === 0 || offset) && limit) {
                const _advertisements = await Advertisement.findAndCountAll({
                    include: [
                        {
                            attributes : ['id', 'name'],
                            model      : AdvertPosition,
                            as         : 'advertPosition',
                        },
                        {
                            attributes : ['id', 'path'],
                            model      : Attachment,
                            as         : 'attachment',
                        },
                    ],
                    where    : _where,
                    distinct : true,
                    offset,
                    limit,
                });
                for (const _advertisement of _advertisements.rows) {
                    _datas.push(_advertisement);
                }
                _result = {
                    succeed     : 1,
                    code        : 200,
                    description : '成功',
                    data        : {
                        list  : _datas,
                        count : _advertisements.count,
                    },
                };
            } else {
                const _advertisements = await Advertisement.findAll({
                    include: [
                        {
                            attributes : ['id', 'name'],
                            model      : AdvertPosition,
                            as         : 'advertPosition',
                        },
                        {
                            attributes : ['id', 'path'],
                            model      : Attachment,
                            as         : 'attachment',
                        },
                    ],
                    where: _where,
                });
                for (const _advertisement of _advertisements) {
                    _datas.push(_advertisement);
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
   * 添加广告方法
   * @param {广告数据} item
   */
    async create (item) {
        const _result = {
            succeed     : 0, // 1:成功0:失败
            code        : 0, // 错误码
            description : '', // 错误信息
            data        : null, // 本身就是一个json字符串
        };
        try {
            Object.keys(item).forEach((field) => {
                if (!item[field] && item[field] != 0) {
                    delete item[field];
                }
            });
            if (item.positionId && item.name) {
                let _advertisement = await Advertisement.findOne({
                    where: {
                        positionId : item.positionId,
                        name       : item.name,
                    },
                    raw: true,
                });
                if (_advertisement) {
                    Object.assign(_result, {
                        code        : 101,
                        description : '名称重复',
                    });
                } else {
                    _advertisement = await Advertisement.create(item);
                    Object.assign(_result, {
                        succeed     : 1,
                        code        : 200,
                        description : '成功',
                        data        : _advertisement,
                    });
                }
            } else {
                Object.assign(_result, {
                    code        : 100,
                    description : `参数错误 -> ${JSON.stringify(item)}`,
                });
            }
        } catch (err) {
            logger.error(err);
            Object.assign(_result, {
                code        : 500,
                description : err.message || err.stack || '系统错误',
            });
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
                const _affectedCount = await Advertisement.destroy({ where: { id: ids } });
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

    /**
   * 修改广告信息
   * @param {主键} id
   * @param {数据} item
   */
    async update (id, item) {
        let _result = {
            succeed     : 0,
            code        : 0,
            description : '未知错误',
            data        : null,
        };
        try {
            Object.keys(item).forEach((field) => {
                if (!item[field] && item[field] != 0) {
                    delete item[field];
                }
            });
            if (id) {
                await Advertisement.update(item, { where: { id } });
                Object.assign(_result, {
                    succeed     : 1,
                    code        : 200,
                    description : '成功',
                    data        : {
                        ...item,
                        id,
                    },
                });
            } else {
                Object.assign(_result, {
                    code        : 101,
                    description : '参数错误',
                });
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
            this._instance = new AdvertisementRepos();
        }
        return this._instance;
    }
}

module.exports = AdvertisementRepos.getInstance();
