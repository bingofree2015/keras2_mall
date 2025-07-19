const logger = require('tracer').colorConsole();
const { Dict } = require('../../models');


class DictRepos {
    constructor () {
        this._instance = null;
    }

    async create (dict) {
        let _result = {
            succeed: 0, // 1:成功0:失败
            code: 0, // 错误码
            description: '', // 错误信息
            data: null, // 本身就是一个json字符串
        };

        try {
            Object.keys(dict).forEach((field) => {
                if (!dict[field] && dict[field] != 0) {
                    delete dict[field];
                }
            });
            if (dict.value && dict.label && dict.type && dict.description) {
                let _dict = await Dict.findOne({
                    where: {
                        value: dict.value,
                        label: dict.label,
                        type: dict.type,
                        description: dict.description,
                    },
                    raw: true,
                });
                if (_dict) {
                    _result = { succeed: 0, code: 101, description: '记录重复' };
                } else {
                    _dict = await Dict.create(dict);
                    _result = {
                        succeed: 1,
                        code: 200,
                        description: '成功',
                        data: _dict,
                    };
                }
            } else {
                _result = { succeed: 0, code: 100, description: `参数错误 -> dict:${JSON.stringify(dict)}` };
            }
        } catch (err) {
            logger.error(err);
            _result = { succeed: 0, code: 500, description: err.dict || err.stack || '系统错误' };
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
                const _affectedCount = await Dict.destroy({ where: { id: ids } });
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
            _result = { succeed: 0, code: 500, description: err.dict || err.stack || '系统错误' };
        }

        return _result;
    }

    async update (id, dict) {
        let _result = {
            succeed: 0,
            code: 0,
            description: '',
            data: null,
        };

        try {
            Object.keys(dict).forEach((field) => {
                if (!dict[field] && dict[field] != 0) {
                    delete dict[field];
                }
            });
            if (id) {
                const _value = dict.value;
                const _label = dict.label;
                const _type = dict.type;
                const _description = dict.description;

                if (_value && _label && _type && _description) {
                    let _dict = await Dict.findOne({
                        where: {
                            id,
                            value: _value,
                            label: _label,
                            type: _type,
                            description: _description,
                        },
                        raw: true,
                    });
                    if (_dict) {
                        const _ret = await Dict.update(dict, { where: { id } });
                        const _affectedCount = _ret[0];
                        if (_affectedCount == 0) {
                            _result = { succeed: 0, code: 102, description: '记录不存在' };
                        } else {
                            _result = {
                                succeed: 1,
                                code: 200,
                                description: '成功',
                                data: { ...dict, id },
                            };
                        }
                    } else {
                        _dict = await Dict.findOne({
                            where: {
                                value: _value,
                                label: _label,
                                type: _type,
                                description: _description,
                                id: { $ne: id },
                            },
                            raw: true,
                        });
                        if (_dict) {
                            _result = { succeed: 0, code: 101, description: '记录重复' };
                        } else {
                            const _ret = await Dict.update(dict, { where: { id } });
                            const _affectedCount = _ret[0];
                            if (_affectedCount == 0) {
                                _result = { succeed: 0, code: 102, description: '记录不存在' };
                            } else {
                                _result = {
                                    succeed: 1,
                                    code: 200,
                                    description: '成功',
                                    data: { ...dict, id },
                                };
                            }
                        }
                    }
                } else {
                    const _ret = await Dict.update(dict, { where: { id } });
                    const _affectedCount = _ret[0];
                    if (_affectedCount == 0) {
                        _result = { succeed: 0, code: 102, description: '记录不存在' };
                    } else {
                        _result = {
                            succeed: 1,
                            code: 200,
                            description: '成功',
                            data: { ...dict, id },
                        };
                    }
                }
            } else {
                _result = { succeed: 0, code: 100, description: `参数错误 -> id:${id}` };
            }
        } catch (err) {
            logger.error(err);
            _result = { succeed: 0, code: 500, description: err.dict || err.stack || '系统错误' };
        }

        return _result;
    }

    async get (id) {
        let _result = {
            succeed: 0,
            code: 0,
            description: '',
            data: null,
        };

        try {
            const _dict = await Dict.findOne({ where: { id }, raw: true });
            if (_dict) {
                _result = {
                    succeed: 1,
                    code: 200,
                    description: '成功',
                    data: _dict,
                };
            } else {
                _result = { succeed: 0, code: 102, description: '数据不存在' };
            }
        } catch (err) {
            logger.error(err);
            _result = { succeed: 0, code: 500, description: err.dict || err.stack || '系统错误' };
        }
        return _result;
    }

    async list (searchKey, offset, limit) {
        let _result = {
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
                } else {
                    _where[_key] = searchKey[_key];
                }
            }
        }

        const _datas = [];
        try {
            if ((offset == 0 || offset) && limit) {
                const _dicts = await Dict.findAndCountAll({
                    where: _where,
                    offset,
                    limit,
                    raw: true,
                });
                for (const _dict of _dicts.rows) {
                    _datas.push(_dict);
                }
                _result = {
                    succeed: 1,
                    code: 200,
                    description: '成功',
                    data: { list: _datas, count: _dicts.count },
                };
            } else {
                const _dicts = await Dict.findAll({ where: _where, raw: true });
                for (const _dict of _dicts) {
                    _datas.push(_dict);
                }
                _result = {
                    succeed: 1,
                    code: 200,
                    description: '成功',
                    data: { list: _datas },
                };
            }
        } catch (err) {
            logger.error(err);
            _result = { succeed: 0, code: 500, description: err };
        }

        return _result;
    }

    // 构造一个广为人知的接口，供用户对该类进行实例化
    static getInstance () {
        if (!this._instance) {
            this._instance = new DictRepos();
        }
        return this._instance;
    }
}

module.exports = DictRepos.getInstance();
