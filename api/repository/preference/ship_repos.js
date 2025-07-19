import _ from 'lodash';
import { Ship, Logistics } from '../../models';

const logger = require('tracer').colorConsole();

class ShipRepos {
  constructor () {
    this._instance = null;
  }

  /**
   * 配送公式
   * @param {*} firstUnit
   * @param {*} continueUnit
   * @param {*} firstUnitPrice
   * @param {*} continueUnitPrice
   */
  getExp (firstUnit, continueUnit, firstUnitPrice, continueUnitPrice) {
    const _exp = `${firstUnitPrice} + (ceil((w-${firstUnit})/${continueUnit}) * ${continueUnitPrice})`;
    return _exp;
  }

  async create (ship) {
    let _result = {
      succeed: 0, // 1:成功0:失败
      code: 0, // 错误码
      description: '', // 错误信息
      data: null, // 本身就是一个json字符串
    };

    try {
      Object.keys(ship).forEach((field) => {
        if (!ship[field] && ship[field] != 0) {
          delete ship[field];
        }
      });
      if (ship.name) {
        let _ship = await Ship.findOne({ where: { name: ship.name }, raw: true });
        if (_ship) {
          _result = { succeed: 0, code: 101, description: '名称重复' };
        } else {
          if (Array.isArray(_ship.areaFee)) {
            for (const _area of _ship.areaFee) {
              // _area = _.pick(_area, ['areas', 'firstUnitAreaPrice', 'continueUnitAreaPrice'])
              delete _area.id;
              delete _area.idx;
              _area.exp = this.getExp(
                _ship.firstUnit,
                _ship.continueUnit,
                _area.firstUnitAreaPrice,
                _area.continueUnitAreaPrice,
              );
            }
          }
          _ship = await Ship.create(ship);
          const _id = _ship.id;
          _ship = await Ship.findOne({
            where: { id: _id },
          });
          _result = {
            succeed: 1,
            code: 200,
            description: '成功',
            data: _ship,
          };
        }
      } else {
        _result = { succeed: 0, code: 100, description: `参数错误 -> ship:${JSON.stringify(ship)}` };
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
        const _affectedCount = await Ship.destroy({ where: { id: ids } });
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

  async update (id, ship) {
    let _result = {
      succeed: 0,
      code: 0,
      description: '',
      data: null,
    };

    try {
      Object.keys(ship).forEach((field) => {
        if (!ship[field] && ship[field] != 0) {
          delete ship[field];
        }
      });
      if (Array.isArray(ship.areaFee)) {
        for (const _area of ship.areaFee) {
          delete _area.id;
          delete _area.idx;
          // _area = _.pick(_area, ['areas', 'firstUnitAreaPrice', 'continueUnitAreaPrice'])
          _area.exp = this.getExp(
            ship.firstUnit,
            ship.continueUnit,
            _area.firstUnitAreaPrice,
            _area.continueUnitAreaPrice,
          );
        }
      }
      if (id) {
        const _name = ship.name;

        if (_name) {
          let _ship = await Ship.findOne({ where: { id, name: _name }, raw: true });
          if (_ship) {
            const _ret = await Ship.update(ship, { where: { id } });
            const _affectedCount = _ret[0];
            if (_affectedCount == 0) {
              _result = { succeed: 0, code: 102, description: '记录不存在' };
            } else {
              _result = {
                succeed: 1,
                code: 200,
                description: '成功',
                data: { ...ship, id },
              };
            }
          } else {
            _ship = await Ship.findOne({ where: { name: _name, id: { $ne: id } }, raw: true });
            if (_ship) {
              _result = { succeed: 0, code: 101, description: `名称 [${_name}] 重复` };
            } else {
              const _ret = await Ship.update(ship, { where: { id } });
              const _affectedCount = _ret[0];
              if (_affectedCount == 0) {
                _result = { succeed: 0, code: 102, description: '记录不存在' };
              } else {
                _result = {
                  succeed: 1,
                  code: 200,
                  description: '成功',
                  data: { ...ship, id },
                };
              }
            }
          }
        } else {
          const _ret = await Ship.update(ship, { where: { id } });
          const _affectedCount = _ret[0];
          if (_affectedCount == 0) {
            _result = { succeed: 0, code: 102, description: '记录不存在' };
          } else {
            _result = {
              succeed: 1,
              code: 200,
              description: '成功',
              data: { ...ship, id },
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
      const _ship = await Ship.findOne({
        include: [
          {
            model: Logistics,
            as: 'logistics',
            require: false,
          },
        ],
        where: { id },
      });
      if (_ship) {
        _result = {
          succeed: 1,
          code: 200,
          description: '成功',
          data: _ship,
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
        const _ships = await Ship.findAndCountAll({
          include: [
            {
              model: Logistics,
              as: 'logistics',
              require: false,
            },
          ],
          distinct: true,
          where: _where,
          offset,
          limit,
        });
        for (const _ship of _ships.rows) {
          _datas.push(_ship);
        }
        _result = {
          succeed: 1,
          code: 200,
          description: '成功',
          data: { list: _datas, count: _ships.count },
        };
      } else {
        const _ships = await Ship.findAll({
          include: [
            {
              model: Logistics,
              as: 'logistics',
              require: false,
            },
          ],
          where: _where,
        });
        for (const _ship of _ships) {
          _datas.push(_ship);
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
      this._instance = new ShipRepos();
    }
    return this._instance;
  }
}

export default ShipRepos.getInstance();
