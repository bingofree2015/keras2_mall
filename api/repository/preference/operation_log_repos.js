const { OperationLog, SysUser } = require('../../models');

const logger = require('tracer').colorConsole();

class OperationLogRepos {
  constructor () {
    this._instance = null;
  }

  async create (operationLog) {
    let _result = {
      succeed: 0, // 1:成功0:失败
      code: 0, // 错误码
      description: '', // 错误信息
      data: null, // 本身就是一个json字符串
    };

    try {
      Object.keys(operationLog).forEach((field) => {
        if (!operationLog[field] && operationLog[field] != 0) {
          delete operationLog[field];
        }
      });
      if (operationLog.userId && operationLog.title) {
        let _operationLog = await OperationLog.findOne({
          where: { userId: operationLog.userId, title: operationLog.title },
          raw: true,
        });
        if (_operationLog) {
          _result = { succeed: 0, code: 101, description: '名称重复' };
        } else {
          _operationLog = await OperationLog.create(operationLog);
          _result = {
            succeed: 1,
            code: 200,
            description: '成功',
            data: _operationLog,
          };
        }
      } else {
        _result = {
          succeed: 0,
          code: 100,
          description: `参数错误 -> operationLog:${JSON.stringify(operationLog)}`,
        };
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
        const _affectedCount = await OperationLog.destroy({ where: { id: ids } });
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

  async get (id) {
    let _result = {
      succeed: 0,
      code: 0,
      description: '',
      data: null,
    };

    try {
      const _operationLog = await OperationLog.findOne({
        include: [
          {
            attributes: SysUser.getAttributes(),
            model: SysUser,
            as: 'sysUser',
            require: false,
          },
        ],
        where: { id },
      });
      if (_operationLog) {
        _result = {
          succeed: 1,
          code: 200,
          description: '成功',
          data: _operationLog,
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
        const _logs = await OperationLog.findAndCountAll({
          include: [
            {
              attributes: SysUser.getAttributes(),
              model: SysUser,
              as: 'sysUser',
              require: false,
            },
          ],
          where: _where,
          offset,
          limit,
          distinct: true,
        });
        for (const _operationLog of _logs.rows) {
          _datas.push(_operationLog);
        }
        _result = {
          succeed: 1,
          code: 200,
          description: '成功',
          data: { list: _datas, count: _logs.count },
        };
      } else {
        const _logs = await OperationLog.findAll({
          include: [
            {
              attributes: SysUser.getAttributes(),
              model: SysUser,
              as: 'sysUser',
              require: false,
            },
          ],
          where: _where,
        });
        for (const _operationLog of _logs) {
          _datas.push(_operationLog);
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
      this._instance = new OperationLogRepos();
    }
    return this._instance;
  }
}

module.exports = OperationLogRepos.getInstance();
