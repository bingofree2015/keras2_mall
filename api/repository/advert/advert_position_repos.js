
const logger = require('tracer').colorConsole();
const { AdvertPosition } = require('../../models');


class AdvertPositionRepos {
    constructor () {
        this._instance = null;
    }

    /**
   * 添加广告位
   * @param {广告位对象} item
   */
    async create (item) {
        const _result = {
            succeed: 0, // 1:成功0:失败
            code: 0, // 错误码
            description: '', // 错误信息
            data: null, // 本身就是一个json字符串
        };

        try {
            Object.keys(item).forEach((field) => {
                if (!item[field] && item[field] != 0) {
                    delete item[field];
                }
            });
            if (item.name && item.code) {
                let _item = await AdvertPosition.findOne({ where: { name: item.name }, raw: true });
                if (_item) {
                    Object.assign(_result, { code: 101, description: '名称重复' });
                } else {
                    _item = await AdvertPosition.create(item);
                    Object.assign(_result, {
                        succeed: 1,
                        code: 200,
                        description: '成功',
                        data: _item,
                    });
                }
            } else {
                Object.assign(_result, { code: 100, description: `参数错误 -> ${JSON.stringify(item)}` });
            }
        } catch (err) {
            logger.error(err);
            Object.assign(_result, { code: 500, description: err.message || err.stack || '系统错误' });
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

        try {
            if (Array.isArray(ids) && ids.length > 0) {
                const _affectedCount = await AdvertPosition.destroy({ where: { id: ids } });
                if (_affectedCount == 0) {
                    _result = { succeed: 0, code: 102, description: '记录不存在' };
                } else {
                    _result = { succeed: 1, code: 200, description: '成功' };
                }
            } else {
                _result = { succeed: 0, code: 100, description: '参数错误' };
            }
        } catch (err) {
            logger.error(err);
            _result = { succeed: 0, code: 500, description: err.message || err.stack || '系统错误' };
        }

        return _result;
    }

    /**
   * 广告位编辑更新
   * @param {主键} id
   * @param {数据} item
   */
    async update (id, item) {
        const _result = {
            succeed: 0,
            code: 0,
            description: '',
            data: null,
        };

        try {
            Object.keys(item).forEach((field) => {
                if (!item[field] && item[field] != 0) {
                    delete item[field];
                }
            });
            if (id) {
                const _ret = await AdvertPosition.update(item, { where: { id } });
                const _affectedCount = _ret[0];
                if (_affectedCount == 0) {
                    Object.assign(_result, { code: 102, description: '记录不存在' });
                } else {
                    Object.assign(_result, {
                        succeed: 1,
                        code: 200,
                        description: '成功',
                        data: { ...item, id },
                    });
                }
            } else {
                Object.assign(_result, { code: 100, description: `参数错误 -> id:${id}` });
            }
        } catch (err) {
            logger.error(err);
            Object.assign(_result, { code: 500, description: err.message || err.stack || '系统错误' });
        }
        return _result;
    }

    /**
   * 广告位数据
   * @param {主键} id
   */
    async get (id) {
        const _result = {
            succeed: 0,
            code: 0,
            description: '',
            data: null,
        };

        try {
            const _advertPosition = await AdvertPosition.findOne({ where: { id }, raw: true });
            if (_advertPosition) {
                Object.assign(_result, {
                    succeed: 1,
                    code: 200,
                    description: '成功',
                    data: _advertPosition,
                });
            } else {
                Object.assign(_result, { code: 102, description: '数据不存在' });
            }
        } catch (err) {
            logger.error(err);
            Object.assign(_result, { code: 500, description: err.message || err.stack || '系统错误' });
        }
        return _result;
    }

    /**
   * 广告位列表
   * @param {查询条件} searchKey
   * @param {偏移} offset
   * @param {数量} limit
   */
    async list (searchKey, offset, limit) {
        const _result = {
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
                } else if (Array.isArray(searchKey[_key]) && searchKey[_key].length === 2) {
                    const _beginValue = searchKey[_key][0];
                    const _endValue = searchKey[_key][1];
                    _where[_key] = { $gte: _beginValue, $lte: _endValue };
                } else {
                    _where[_key] = searchKey[_key];
                }
            }
        }

        const _datas = [];
        try {
            if ((offset == 0 || offset) && limit) {
                const _advertPositions = await AdvertPosition.findAndCountAll({
                    where: _where,
                    offset,
                    limit,
                    raw: true,
                    order: [['id', 'desc']],
                });
                for (const _advertPosition of _advertPositions.rows) {
                    _datas.push(_advertPosition);
                }
                Object.assign(_result, {
                    succeed: 1,
                    code: 200,
                    description: '成功',
                    data: { list: _datas, count: _advertPositions.count },
                });
            } else {
                const _advertPositions = await AdvertPosition.findAll({
                    where: _where,
                    raw: true,
                    order: [['id', 'desc']],
                });
                for (const _advertPosition of _advertPositions) {
                    _datas.push(_advertPosition);
                }
                Object.assign(_result, {
                    succeed: 1,
                    code: 200,
                    description: '成功',
                    data: { list: _datas },
                });
            }
        } catch (err) {
            logger.error(err);
            Object.assign(_result, { code: 500, description: err });
        }
        return _result;
    }

    // 构造一个广为人知的接口，供用户对该类进行实例化
    static getInstance () {
        if (!this._instance) {
            this._instance = new AdvertPositionRepos();
        }
        return this._instance;
    }
}

module.exports = AdvertPositionRepos.getInstance();
