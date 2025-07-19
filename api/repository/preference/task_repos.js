const logger = require('tracer').colorConsole();
const { Task } = require('../../models');


class TaskRepos {
    constructor () {
        this._instance = null;
    }

    async create (task) {
        let _result = {
            succeed: 0, // 1:成功0:失败
            code: 0, // 错误码
            description: '', // 错误信息
            data: null, // 本身就是一个json字符串
        };

        try {
            Object.keys(task).forEach((field) => {
                if (!task[field] && task[field] != 0) {
                    delete task[field];
                }
            });
            if (task.name) {
                let _task = await Task.findOne({ where: { name: task.name }, raw: true });
                if (_task) {
                    _result = { succeed: 0, code: 101, description: '名称重复' };
                } else {
                    _task = await Task.create(task);
                    const _id = _task.id;
                    _task = await Task.findOne({
                        where: { id: _id },
                    });
                    _result = {
                        succeed: 1,
                        code: 200,
                        description: '成功',
                        data: _task,
                    };
                }
            } else {
                _result = { succeed: 0, code: 100, description: `参数错误 -> task:${JSON.stringify(task)}` };
            }
        } catch (err) {
            logger.error(err);
            _result = { succeed: 0, code: 500, description: err.message || err.stack || '系统错误' };
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
                const _affectedCount = await Task.destroy({ where: { id: ids } });
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

    async update (id, task) {
        let _result = {
            succeed: 0,
            code: 0,
            description: '',
            data: null,
        };

        try {
            Object.keys(task).forEach((field) => {
                if (!task[field] && task[field] != 0) {
                    delete task[field];
                }
            });
            if (id) {
                const _name = task.name;
                if (_name) {
                    let _task = await Task.findOne({ where: { id, name: _name }, raw: true });
                    if (_task) {
                        const _ret = await Task.update(task, { where: { id } });
                        const _affectedCount = _ret[0];
                        if (_affectedCount == 0) {
                            _result = { succeed: 0, code: 102, description: '记录不存在' };
                        } else {
                            _result = {
                                succeed: 1,
                                code: 200,
                                description: '成功',
                                data: { ...task, id },
                            };
                        }
                    } else {
                        _task = await Task.findOne({ where: { name: _name, id: { $ne: id } }, raw: true });
                        if (_task) {
                            _result = { succeed: 0, code: 101, description: `名称 [${_name}] 重复` };
                        } else {
                            const _ret = await Task.update(task, { where: { id } });
                            const _affectedCount = _ret[0];
                            if (_affectedCount == 0) {
                                _result = { succeed: 0, code: 102, description: '记录不存在' };
                            } else {
                                _result = {
                                    succeed: 1,
                                    code: 200,
                                    description: '成功',
                                    data: { ...task, id },
                                };
                            }
                        }
                    }
                } else {
                    const _ret = await Task.update(task, { where: { id } });
                    const _affectedCount = _ret[0];
                    if (_affectedCount == 0) {
                        _result = { succeed: 0, code: 102, description: '记录不存在' };
                    } else {
                        _result = {
                            succeed: 1,
                            code: 200,
                            description: '成功',
                            data: { ...task, id },
                        };
                    }
                }
            } else {
                _result = { succeed: 0, code: 100, description: `参数错误 -> id:${id}` };
            }
        } catch (err) {
            logger.error(err);
            _result = { succeed: 0, code: 500, description: err.message || err.stack || '系统错误' };
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
            const _task = await Task.findOne({
                where: { id },
            });
            if (_task) {
                _result = {
                    succeed: 1,
                    code: 200,
                    description: '成功',
                    data: _task,
                };
            } else {
                _result = { succeed: 0, code: 102, description: '数据不存在' };
            }
        } catch (err) {
            logger.error(err);
            _result = { succeed: 0, code: 500, description: err.message || err.stack || '系统错误' };
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
                const _tasks = await Task.findAndCountAll({
                    where: _where,
                    offset,
                    limit,
                });
                for (const _task of _tasks.rows) {
                    _datas.push(_task);
                }
                _result = {
                    succeed: 1,
                    code: 200,
                    description: '成功',
                    data: { list: _datas, count: _tasks.count },
                };
            } else {
                const _tasks = await Task.findAll({
                    where: _where,
                });
                for (const _task of _tasks) {
                    _datas.push(_task);
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
            this._instance = new TaskRepos();
        }
        return this._instance;
    }
}

module.exports = TaskRepos.getInstance();
