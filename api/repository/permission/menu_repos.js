const { Menu, SysUserRole, RoleMenu } = require('../../models');

const logger = require('tracer').colorConsole();

class MenuRepos {
  constructor () {
    this._instance = null;
  }

  async create (menu) {
    let _result = {
      succeed: 0, // 1:成功0:失败
      code: 0, // 错误码
      description: '', // 错误信息
      data: null, // 本身就是一个json字符串
    };

    try {
      Object.keys(menu).forEach((field) => {
        if (!menu[field] && menu[field] != 0) {
          delete menu[field];
        }
      });
      if (menu.name) {
        let _menu = await Menu.findOne({
          where: { name: menu.name, parentId: menu.parentId },
          raw: true,
        });
        if (_menu) {
          _result = { succeed: 0, code: 101, description: '名称重复' };
        } else {
          _menu = await Menu.create(menu);
          _menu.setDataValue('children', []);
          _result = {
            succeed: 1,
            code: 200,
            description: '成功',
            data: _menu,
          };
        }
      } else {
        _result = { succeed: 0, code: 100, description: `参数错误 -> menu:${JSON.stringify(menu)}` };
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
        const _affectedCount = await Menu.destroy({ where: { id: ids } });
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

  async update (id, menu) {
    let _result = {
      succeed: 0,
      code: 0,
      description: '',
      data: null,
    };

    try {
      Object.keys(menu).forEach((field) => {
        if (!menu[field] && menu[field] != 0) {
          delete menu[field];
        }
      });
      if (id) {
        const _name = menu.name;
        if (_name) {
          let _menu = await Menu.findOne({ where: { id, name: _name }, raw: true });
          if (_menu) {
            const _ret = await Menu.update(menu, { where: { id } });
            const _affectedCount = _ret[0];
            if (_affectedCount == 0) {
              _result = { succeed: 0, code: 102, description: '记录不存在' };
            } else {
              _result = {
                succeed: 1,
                code: 200,
                description: '成功',
                data: { ...menu, id },
              };
            }
          } else {
            _menu = await Menu.findOne({
              where: { name: _name, parentId: menu.parentId, id: { $ne: id } },
              raw: true,
            });
            if (_menu) {
              _result = { succeed: 0, code: 101, description: `名称 [${_name}] 重复` };
            } else {
              const _ret = await Menu.update(menu, { where: { id } });
              const _affectedCount = _ret[0];
              if (_affectedCount == 0) {
                _result = { succeed: 0, code: 102, description: '记录不存在' };
              } else {
                _result = {
                  succeed: 1,
                  code: 200,
                  description: '成功',
                  data: { ...menu, id },
                };
              }
            }
          }
        } else {
          const _ret = await Menu.update(menu, { where: { id } });
          const _affectedCount = _ret[0];
          if (_affectedCount == 0) {
            _result = { succeed: 0, code: 102, description: '记录不存在' };
          } else {
            _result = {
              succeed: 1,
              code: 200,
              description: '成功',
              data: { ...menu, id },
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
      const _menu = await Menu.findOne({ where: { id }, raw: true });
      if (_menu) {
        _result = {
          succeed: 1,
          code: 200,
          description: '成功',
          data: _menu,
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

  /**
   *
   *
   * @param {*} sysUserId 1 超级管理员
   * @param {数组 [0,1,2]} [types]
   * @param {number} [isShow = 1] isShow:-1 显示全部
   * @returns
   * @memberof Menu
   */
  async getTree (sysUserId, types = [0, 1, 2], isShow = -1) {
    logger.debug(`参数: ${sysUserId} ${types} ${isShow}`);

    let _result = {
      succeed: 0,
      code: 0,
      description: '',
      data: null,
    };

    let _where = {};
    const _datas = [];
    const _getSubTrees = (id, name, datas, types, level) => {
      const _menus = [];
      ++level;
      for (const _data of datas) {
        if (_data.parentId == id && types.includes(_data.type)) {
          _data.isShow = _data.isShow == 1;
          _data.level = level;
          _menus.push({ ..._data, ...{ parentName: name } });
        }
      }
      for (const _menu of _menus) {
        _menu.children = _getSubTrees(_menu.id, _menu.name, datas, types, level);
      }
      if (_menus.length == 0) {
        return [];
      }
      return _menus;
    };

    if (sysUserId) {
      const _roleIds = [];
      const _sysUserRoles = await SysUserRole.findAll({
        attributes: ['roleId'],
        where: { sysUserId },
        raw: true,
      });
      for (const _sysUserRole of _sysUserRoles) {
        _roleIds.push(_sysUserRole.roleId);
      }

      const _menuIds = [];
      if (_roleIds.length > 0) {
        const _roleMenus = await RoleMenu.findAll({
          attributes: ['menuId'],
          where: { roleId: _roleIds },
          raw: true,
        });
        for (const _roleMenu of _roleMenus) {
          _menuIds.push(_roleMenu.menuId);
        }
      }
      if (_menuIds.length > 0) {
        _where = { id: _menuIds };
      }
    }

    if (Number.isInteger(isShow) && isShow > -1) {
      _where.isShow = isShow;
    }

    try {
      const _menus = await Menu.findAll({
        attributes: Menu.getAttributes(),
        where: _where,
        order: [['orderNum', 'ASC']],
        raw: true,
      });
      const _level = 1;
      for (const _menu of _menus) {
        if (_menu.parentId == 0) {
          _menu.isShow = _menu.isShow == 1;
          _menu.level = _level;
          _datas.push(_menu);
        }
      }
      for (const _data of _datas) {
        _data.children = _getSubTrees(_data.id, _data.name, _menus, types, _level);
      }
      _result = {
        succeed: 1,
        code: 200,
        description: '成功',
        data: { list: _datas },
      };
    } catch (err) {
      logger.error(err);
      _result = { succeed: 0, code: 500, description: err.message || err.stack || '系统错误' };
    }

    return _result;
  }

  // 构造一个广为人知的接口，供用户对该类进行实例化
  static getInstance () {
    if (!this._instance) {
      this._instance = new MenuRepos();
    }
    return this._instance;
  }
}

module.exports = MenuRepos.getInstance();
