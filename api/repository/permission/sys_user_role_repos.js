const { SysUserRole, SysUser } = require('../../models');

const logger = require('tracer').colorConsole();

class SysUserRoleRepos {
  constructor () {
    this._instance = null;
  }

  async create (sysUserRole) {
    let _result = {
      succeed: 0, // 1:成功0:失败
      code: 0, // 错误码
      description: '', // 错误信息
      data: null, // 本身就是一个json字符串
    };

    try {
      Object.keys(sysUserRole).forEach((field) => {
        if (!sysUserRole[field] && sysUserRole[field] != 0) {
          delete sysUserRole[field];
        }
      });
      if (sysUserRole.roleId && sysUserRole.userId) {
        const _sysUserRole = await SysUserRole.create(sysUserRole);
        _result = {
          succeed: 1,
          code: 200,
          description: '成功',
          data: _sysUserRole,
        };
      } else {
        _result = {
          succeed: 0,
          code: 100,
          description: `参数错误 -> sysUserRole:${JSON.stringify(sysUserRole)}`,
        };
      }
    } catch (err) {
      logger.error(err);
      _result = { succeed: 0, code: 500, description: err.message || err.stack || '系统错误' };
    }

    return _result;
  }

  async batchDelete (ids) {
    let _result = {
      succeed: 0,
      code: 0,
      description: '',
      data: null,
    };

    try {
      if (Array.isArray(ids) && ids.length > 0) {
        const _affectedCount = await SysUserRole.destroy({ where: { id: ids } });
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

  async update (id, sysUserRole) {
    let _result = {
      succeed: 0,
      code: 0,
      description: '',
      data: null,
    };

    try {
      Object.keys(sysUserRole).forEach((field) => {
        if (!sysUserRole[field] && sysUserRole[field] != 0) {
          delete sysUserRole[field];
        }
      });
      if (id) {
        const _roleId = sysUserRole.roleId;
        const _userId = sysUserRole.userId;
        if (_roleId && _userId) {
          let _sysUserRole = await SysUserRole.findOne({
            where: { id, roleId: _roleId, userId: _userId },
            raw: true,
          });
          if (_sysUserRole) {
            const _ret = await SysUserRole.update(sysUserRole, { where: { id } });
            const _affectedCount = _ret[0];
            if (_affectedCount == 0) {
              _result = { succeed: 0, code: 102, description: '记录不存在' };
            } else {
              _result = {
                succeed: 1,
                code: 200,
                description: '成功',
                data: { ...sysUserRole, id },
              };
            }
          } else {
            _sysUserRole = await SysUserRole.findOne({
              where: { roleId: _roleId, userId: _userId, id: { $ne: id } },
              raw: true,
            });
            if (_sysUserRole) {
              _result = { succeed: 0, code: 101, description: '记录重复' };
            } else {
              const _ret = await SysUserRole.update(sysUserRole, { where: { id } });
              const _affectedCount = _ret[0];
              if (_affectedCount == 0) {
                _result = { succeed: 0, code: 102, description: '记录不存在' };
              } else {
                _result = {
                  succeed: 1,
                  code: 200,
                  description: '成功',
                  data: { ...sysUserRole, id },
                };
              }
            }
          }
        } else {
          const _ret = await SysUserRole.update(sysUserRole, { where: { id } });
          const _affectedCount = _ret[0];
          if (_affectedCount == 0) {
            _result = { succeed: 0, code: 102, description: '记录不存在' };
          } else {
            _result = {
              succeed: 1,
              code: 200,
              description: '成功',
              data: { ...sysUserRole, id },
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
      const _sysUserRole = await SysUserRole.findOne({ where: { id }, raw: true });
      if (_sysUserRole) {
        _result = {
          succeed: 1,
          code: 200,
          description: '成功',
          data: _sysUserRole,
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
    const _excludeKeys = [''];
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
        const _sysUserRoles = await SysUserRole.findAndCountAll({
          attributes: SysUserRole.getAttributes(),
          include: [
            {
              attributes: ['id', 'name'],
              model: SysUser,
              as: 'sysUser',
            },
          ],
          distinct: true,
          where: _where,
          offset,
          limit,
        });
        for (const _sysUserRole of _sysUserRoles.rows) {
          _datas.push(_sysUserRole);
        }
        _result = {
          succeed: 1,
          code: 200,
          description: '成功',
          data: { list: _datas, count: _sysUserRoles.count },
        };
      } else {
        const _sysUserRoles = await SysUserRole.findAll({ where: _where, raw: true });
        for (const _sysUserRole of _sysUserRoles) {
          _datas.push(_sysUserRole);
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
      _result = { succeed: 0, code: 500, description: err.message || err.stack || '系统错误' };
    }

    return _result;
  }

  // 构造一个广为人知的接口，供用户对该类进行实例化
  static getInstance () {
    if (!this._instance) {
      this._instance = new SysUserRoleRepos();
    }
    return this._instance;
  }
}

module.exports = SysUserRoleRepos.getInstance();
