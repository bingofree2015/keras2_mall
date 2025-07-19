import { SpTarget } from '../../models';

const logger = require('tracer').colorConsole();

class SPTargetRepos {
  /**
    id           主键
    promotion_id 促销ID
    code         促销条件编码
    param        支付配置参数序列号存储
    created_at   创建时间
    updated_at   查看时间
     */
  constructor () {
    this._instance = null;
  }

  async create (spTarget) {
    let _result = {
      succeed: 0, // 1:成功0:失败
      code: 0, // 错误码
      description: '', // 错误信息
      data: null, // 本身就是一个json字符串
    };

    try {
      Object.keys(spTarget).forEach((field) => {
        if (!spTarget[field] && spTarget[field] != 0) {
          delete spTarget[field];
        }
      });
      if (spTarget.name) {
        let _spTarget = await SpTarget.findOne({ where: { name: spTarget.name }, raw: true });
        if (_spTarget) {
          _result = { succeed: 0, code: 101, description: '名称重复' };
        } else {
          _spTarget = await SpTarget.create(spTarget);
          _result = {
            succeed: 1,
            code: 200,
            description: '成功',
            data: { ...spTarget, id: _spTarget.id },
          };
        }
      } else {
        _result = {
          succeed: 0,
          code: 100,
          description: `参数错误 -> spTarget:${JSON.stringify(spTarget)}`,
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
        const _affectedCount = await SpTarget.destroy({ where: { id: ids } });
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

  async update (id, spTarget) {
    let _result = {
      succeed: 0,
      code: 0,
      description: '',
      data: null,
    };

    try {
      Object.keys(spTarget).forEach((field) => {
        if (!spTarget[field] && spTarget[field] != 0) {
          delete spTarget[field];
        }
      });
      if (id) {
        const _name = spTarget.name;
        if (_name) {
          let _spTarget = await SpTarget.findOne({ where: { id, name: _name }, raw: true });
          if (_spTarget) {
            const _ret = await SpTarget.update(spTarget, { where: { id } });
            const _affectedCount = _ret[0];
            if (_affectedCount == 0) {
              _result = { succeed: 0, code: 102, description: '记录不存在' };
            } else {
              _result = {
                succeed: 1,
                code: 200,
                description: '成功',
                data: { ...spTarget, id },
              };
            }
          } else {
            _spTarget = await SpTarget.findOne({
              where: { name: _name, id: { $ne: id } },
              raw: true,
            });
            if (_spTarget) {
              _result = { succeed: 0, code: 101, description: `名称 [${_name}] 重复` };
            } else {
              const _ret = await SpTarget.update(spTarget, { where: { id } });
              const _affectedCount = _ret[0];
              if (_affectedCount == 0) {
                _result = { succeed: 0, code: 102, description: '记录不存在' };
              } else {
                _result = {
                  succeed: 1,
                  code: 200,
                  description: '成功',
                  data: { ...spTarget, id },
                };
              }
            }
          }
        } else {
          const _ret = await SpTarget.update(spTarget, { where: { id } });
          const _affectedCount = _ret[0];
          if (_affectedCount == 0) {
            _result = { succeed: 0, code: 102, description: '记录不存在' };
          } else {
            _result = {
              succeed: 1,
              code: 200,
              description: '成功',
              data: { ...spTarget, id },
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
      const _spTarget = await SpTarget.findOne({
        where: { id },
      });
      if (_spTarget) {
        _result = {
          succeed: 1,
          code: 200,
          description: '成功',
          data: _spTarget,
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
        const _spTargets = await SpTarget.findAndCountAll({
          where: _where,
          offset,
          limit,
        });
        for (const _spTarget of _spTargets.rows) {
          _datas.push(_spTarget);
        }
        _result = {
          succeed: 1,
          code: 200,
          description: '成功',
          data: { list: _datas, count: _spTargets.count },
        };
      } else {
        const _spTargets = await SpTarget.findAll({
          where: _where,
        });
        for (const _spTarget of _spTargets) {
          _datas.push(_spTarget);
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
      this._instance = new SPTargetRepos();
    }
    return this._instance;
  }
}

export default SPTargetRepos.getInstance();
