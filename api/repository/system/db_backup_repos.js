const { DbBackup } = require('../../models');

const logger = require('tracer').colorConsole();

class DbBackupRepos {
  constructor () {
    this._instance = null;
  }

  async create (dbBackup) {
    let _result = {
      succeed: 0, // 1:成功0:失败
      code: 0, // 错误码
      description: '', // 错误信息
      data: null, // 本身就是一个json字符串
    };

    try {
      Object.keys(dbBackup).forEach((field) => {
        if (!dbBackup[field] && dbBackup[field] != 0) {
          delete dbBackup[field];
        }
      });
      if (dbBackup.path) {
        let _dbBackup = await DbBackup.findOne({ where: { path: dbBackup.path }, raw: true });
        if (_dbBackup) {
          _result = { succeed: 0, code: 101, description: '路径重复' };
        } else {
          _dbBackup = await DbBackup.create(dbBackup);
          _result = {
            succeed: 1,
            code: 200,
            description: '成功',
            data: _dbBackup,
          };
        }
      } else {
        _result = {
          succeed: 0,
          code: 100,
          description: `参数错误 -> log:${JSON.stringify(dbBackup)}`,
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
        const _affectedCount = await DbBackup.destroy({ where: { id: ids } });
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

  async update (id, dbBackup) {
    let _result = {
      succeed: 0,
      code: 0,
      description: '',
      data: null,
    };

    try {
      Object.keys(dbBackup).forEach((field) => {
        if (!dbBackup[field] && dbBackup[field] != 0) {
          delete dbBackup[field];
        }
      });
      if (id) {
        const _path = dbBackup.path;
        if (_path) {
          let _dbBackup = await DbBackup.findOne({ where: { id, path: _path }, raw: true });
          if (_dbBackup) {
            const _ret = await DbBackup.update(dbBackup, { where: { id } });
            const _affectedCount = _ret[0];
            if (_affectedCount == 0) {
              _result = { succeed: 0, code: 102, description: '记录不存在' };
            } else {
              _result = {
                succeed: 1,
                code: 200,
                description: '成功',
                data: { ...dbBackup, id },
              };
            }
          } else {
            _dbBackup = await DbBackup.findOne({
              where: { path: _path, id: { $ne: id } },
              raw: true,
            });
            if (_dbBackup) {
              _result = { succeed: 0, code: 101, description: `路径 [${_path}] 重复` };
            } else {
              const _ret = await DbBackup.update(dbBackup, { where: { id } });
              const _affectedCount = _ret[0];
              if (_affectedCount == 0) {
                _result = { succeed: 0, code: 102, description: '记录不存在' };
              } else {
                _result = {
                  succeed: 1,
                  code: 200,
                  description: '成功',
                  data: { ...dbBackup, id },
                };
              }
            }
          }
        } else {
          const _ret = await DbBackup.update(dbBackup, { where: { id } });
          const _affectedCount = _ret[0];
          if (_affectedCount == 0) {
            _result = { succeed: 0, code: 102, description: '记录不存在' };
          } else {
            _result = {
              succeed: 1,
              code: 200,
              description: '成功',
              data: { ...dbBackup, id },
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
      const _dbBackup = await DbBackup.findOne({ where: { id }, raw: true });
      if (_dbBackup) {
        _result = {
          succeed: 1,
          code: 200,
          description: '成功',
          data: _dbBackup,
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
        const _dbBackups = await DbBackup.findAndCountAll({
          where: _where,
          offset,
          limit,
          raw: true,
          order: [['id', 'desc']],
        });
        for (const _dbBackup of _dbBackups.rows) {
          _datas.push(_dbBackup);
        }
        _result = {
          succeed: 1,
          code: 200,
          description: '成功',
          data: { list: _datas, count: _dbBackups.count },
        };
      } else {
        const _dbBackups = await DbBackup.findAll({
          where: _where,
          raw: true,
          order: [['id', 'desc']],
        });
        for (const _dbBackup of _dbBackups) {
          _datas.push(_dbBackup);
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
      this._instance = new DbBackupRepos();
    }
    return this._instance;
  }
}

module.exports = DbBackupRepos.getInstance();
