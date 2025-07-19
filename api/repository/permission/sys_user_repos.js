import {
  sequelize, SysUser, Role, Menu, SysUserRole, RoleMenu, Attachment,
} from '../../models';

const logger = require('tracer').colorConsole();

class SysUserRepos {
  constructor () {
    this._instance = null;
  }

  async create (sysUser) {
    let _result = {
      succeed: 0, // 1:成功0:失败
      code: 0, // 错误码
      description: '', // 错误信息
      data: null, // 本身就是一个json字符串
    };

    try {
      Object.keys(sysUser).forEach((field) => {
        if (!sysUser[field] && sysUser[field] != 0) {
          delete sysUser[field];
        }
      });
      if (sysUser.username) {
        let _sysUser = await SysUser.findOne({
          where: {
            username: sysUser.username,
          },
          raw: true,
        });
        if (_sysUser) {
          _result = { succeed: 0, code: 101, description: '帐号重复' };
        } else {
          _sysUser = await SysUser.create(sysUser);
          if (Array.isArray(sysUser.roles) && sysUser.roles.length > 0) {
            const _sysUserRoles = [];
            for (const _role of sysUser.roles) {
              _sysUserRoles.push({ sysUserId: _sysUser.id, roleId: _role.id });
            }
            await SysUserRole.bulkCreate(_sysUserRoles, {
              updateOnDuplicate: ['sysUserId', 'roleId'],
            });
          }
          _result = {
            succeed: 1,
            code: 200,
            description: '成功',
            data: { ...sysUser, id: _sysUser.id },
          };
        }
      } else {
        _result = {
          succeed: 0,
          code: 100,
          description: `参数错误 -> sysUser:${JSON.stringify(sysUser)}`,
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
    let _trans; // 定义事务
    try {
      if (Array.isArray(ids) && ids.length > 0) {
        _trans = await sequelize.transaction();

        await SysUserRole.destroy({ where: { sysUserId: ids }, transaction: _trans });
        const _affectedCount = await SysUser.destroy({
          where: { id: ids },
          transaction: _trans,
        });
        await _trans.commit(); // 事务提交
        if (_affectedCount == 0) {
          _result = { succeed: 0, code: 102, description: '记录不存在' };
        } else {
          _result = { succeed: 1, code: 200, description: '成功' };
        }
      } else {
        _result = { succeed: 0, code: 100, description: '参数错误' };
      }
    } catch (err) {
      await _trans.rollback(); // 事务回滚
      logger.error(err);
      _result = { succeed: 0, code: 500, description: err.message || err.stack || '系统错误' };
    }

    return _result;
  }

  async update (id, sysUser) {
    let _result = {
      succeed: 0,
      code: 0,
      description: '',
      data: null,
    };

    const _bulkCreate = async (sysUserId, roles) => {
      // 批量插入
      if (Array.isArray(roles) && roles.length > 0) {
        // 删除数据
        const _sysUserRoles = await SysUserRole.findAll({
          attributes: ['id', 'roleId'],
          where: { sysUserId },
          raw: true,
        });

        const _newIds = roles.map((v) => v.id).filter((v) => v);
        const _delIds = [];
        _sysUserRoles.forEach((v) => {
          if (!_newIds.includes(v.roleId)) {
            _delIds.push(v.id);
          }
        });
        if (_delIds.length > 0) {
          await SysUserRole.destroy({ where: { id: _delIds } });
        }
        // 更新与插入
        const _sysUserRoleDatas = [];
        for (const _role of roles) {
          _sysUserRoleDatas.push({ sysUserId, roleId: _role.id });
        }
        await SysUserRole.bulkCreate(_sysUserRoleDatas, {
          updateOnDuplicate: ['sysUserId', 'roleId'],
        });
      }
    };

    try {
      Object.keys(sysUser).forEach((field) => {
        if (!sysUser[field] && sysUser[field] != 0) {
          delete sysUser[field];
        }
      });
      if (id) {
        const _username = sysUser.username;
        if (_username) {
          let _sysUser = await SysUser.findOne({
            where: { id, username: _username },
            raw: true,
          });
          if (_sysUser) {
            const _ret = await SysUser.update(sysUser, { where: { id } });
            const _affectedCount = _ret[0];
            if (_affectedCount == 0) {
              _result = { succeed: 0, code: 102, description: '记录不存在' };
            } else {
              await _bulkCreate(id, sysUser.roles);
              _result = {
                succeed: 1,
                code: 200,
                description: '成功',
                data: { ...sysUser, id },
              };
            }
          } else {
            _sysUser = await SysUser.findOne({
              where: {
                username: _username,
                id: { $ne: id },
              },
              raw: true,
            });
            if (_sysUser) {
              _result = {
                succeed: 0,
                code: 101,
                description: '修改时帐号冲突',
              };
            } else {
              const _ret = await SysUser.update(sysUser, {
                where: { id },
              });
              const _affectedCount = _ret[0];
              if (_affectedCount == 0) {
                _result = { succeed: 0, code: 102, description: '记录不存在' };
              } else {
                await _bulkCreate(id, sysUser.roles);
                _result = {
                  succeed: 1,
                  code: 200,
                  description: '成功',
                  data: { ...sysUser, id },
                };
              }
            }
          }
        } else {
          const _ret = await SysUser.update(sysUser, {
            where: { id },
          });
          const _affectedCount = _ret[0];
          if (_affectedCount == 0) {
            _result = { succeed: 0, code: 102, description: '记录不存在' };
          } else {
            await _bulkCreate(id, sysUser.roles);
            _result = {
              succeed: 1,
              code: 200,
              description: '成功',
              data: { ...sysUser, id },
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
      const _sysUser = await SysUser.findOne({
        include: [
          {
            model: Attachment,
            as: 'attachment',
            attributes: ['id', 'path'],
          },
          {
            model: Role,
            through: {
              attributes: [],
            },
            as: 'roles',
            attributes: ['id', 'name', 'remark'],
            require: false,
          },
        ],
        where: { id },
      });
      if (_sysUser) {
        _result = {
          succeed: 1,
          code: 200,
          description: '成功',
          data: _sysUser,
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

  async login (username, pwd) {
    let _result = {
      succeed: 0,
      code: 0,
      description: '',
      data: null,
    };

    try {
      const _sysUser = await SysUser.findOne({
        include: [
          {
            model: Attachment,
            as: 'attachment',
            attributes: ['id', 'path'],
          },
          {
            model: Role,
            through: {
              attributes: [],
            },
            as: 'roles',
            attributes: ['id', 'name', 'remark'],
            require: false,
          },
        ],
        where: { username, pwd },
      });
      if (_sysUser) {
        _result = {
          succeed: 1,
          code: 200,
          description: '成功',
          data: _sysUser,
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

  async resetPwd (id, pwd, newPwd) {
    let _result = {
      succeed: 0,
      code: 0,
      description: '',
      data: null,
    };

    try {
      if (id && pwd && newPwd) {
        const _sysUser = await SysUser.findOne({ where: { id, pwd }, raw: true });
        if (_sysUser) {
          const _ret = await SysUser.update({ pwd: newPwd }, { where: { id } });
          const _affectedCount = _ret[0];
          if (_affectedCount == 0) {
            _result = { succeed: 0, code: 102, description: '记录不存在' };
          } else {
            _result = {
              succeed: 1,
              code: 200,
              description: '成功',
              data: { ..._sysUser, ...{ pwd: newPwd } },
            };
          }
        } else {
          _result = { succeed: 0, code: 102, description: '原密码错误' };
        }
      } else {
        _result = {
          succeed: 0,
          code: 100,
          description: `参数错误 -> id:${id}pwd:${pwd}newPwd:${newPwd}`,
        };
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
        const _sysUsers = await SysUser.findAndCountAll({
          include: [
            {
              model: Attachment,
              as: 'attachment',
              attributes: ['id', 'path'],
            },
            {
              model: Role,
              through: {
                attributes: [],
              },
              as: 'roles',
              attributes: ['id', 'name', 'remark'],
              require: false,
            },
          ],
          distinct: true,
          where: _where,
          offset,
          limit,
        });
        for (const _sysUser of _sysUsers.rows) {
          _datas.push(_sysUser);
        }
        _result = {
          succeed: 1,
          code: 200,
          description: '成功',
          data: {
            list: _datas,
            count: _sysUsers.count,
          },
        };
      } else {
        const _sysUsers = await SysUser.findAll({
          include: [
            {
              model: Attachment,
              as: 'attachment',
              attributes: ['id', 'path'],
            },
            {
              model: Role,
              through: {
                attributes: [],
              },
              as: 'roles',
              attributes: ['id', 'name', 'remark'],
              require: false,
            },
          ],
          where: _where,
        });
        for (const _sysUser of _sysUsers) {
          _datas.push(_sysUser);
        }
        _result = {
          succeed: 1,
          code: 200,
          description: '成功',
          data: {
            list: _datas,
          },
        };
      }
    } catch (err) {
      logger.error(err);
      _result = { succeed: 0, code: 500, description: err.message || err.stack || '系统错误' };
    }

    return _result;
  }

  async getPermits (sysUserId) {
    let _result = {
      succeed: 0,
      code: 0,
      description: '',
      data: null,
    };

    try {
      const _perms = [];
      if (sysUserId == 1) {
        const _menus = await Menu.findAll({ raw: true });
        for (const _menu of _menus) {
          if (_menu.perms && !_perms.includes(_menu.perms)) {
            _perms.push(_menu.perms);
          }
        }
      } else {
        const _roleIds = [];
        const _sysUserRoles = await SysUserRole.findAll({ where: { sysUserId }, raw: true });
        for (const _sysUserRole of _sysUserRoles) {
          _roleIds.push(_sysUserRole.roleId);
        }

        const _roleMenus = await RoleMenu.findAll({
          include: [
            {
              model: Menu,
              as: 'menu',
              attributes: ['id', 'perms'],
              require: true,
            },
          ],
          where: { roleId: _roleIds },
        });

        for (const _roleMenu of _roleMenus) {
          if (_roleMenu.menu) {
            _perms.push(_roleMenu.menu.perms);
          }
        }
      }

      _result = {
        succeed: 1,
        code: 200,
        description: '成功',
        data: _perms,
      };
    } catch (err) {
      logger.error(err);
      _result = {
        succeed: 0,
        code: 500,
        description: err.message || err.stack || '系统错误',
      };
    }
    return _result;
  }

  // 构造一个广为人知的接口，供用户对该类进行实例化
  static getInstance () {
    if (!this._instance) {
      this._instance = new SysUserRepos();
    }
    return this._instance;
  }
}

export default SysUserRepos.getInstance();
