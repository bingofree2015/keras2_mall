const _ = require('lodash');
const { GoodsCat, Attachment, GoodsType } = require('../../models');

const logger = require('tracer').colorConsole();

class GoodsCatRepos {
  constructor () {
    this._instance = null;
  }

  async create (goodsCat) {
    let _result = {
      succeed: 0, // 1:成功0:失败
      code: 0, // 错误码
      description: '', // 错误信息
      data: null, // 本身就是一个json字符串
    };

    try {
      Object.keys(goodsCat).forEach((field) => {
        if (!goodsCat[field] && goodsCat[field] != 0) {
          delete goodsCat[field];
        }
      });
      if (goodsCat.name && Number.isInteger(goodsCat.parentId)) {
        let _goodsCat = await GoodsCat.findOne({
          where: { name: goodsCat.name, parentId: goodsCat.parentId },
          raw: true,
        });
        if (_goodsCat) {
          _result = { succeed: 0, code: 101, description: '名称重复' };
        } else {
          _goodsCat = await GoodsCat.create(goodsCat);
          _goodsCat.setDataValue('children', []);
          _result = {
            succeed: 1,
            code: 200,
            description: '成功',
            data: _goodsCat,
          };
        }
      } else {
        _result = {
          succeed: 0,
          code: 100,
          description: `参数错误 -> goodsCat:${JSON.stringify(goodsCat)}`,
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
        const _affectedCount = await GoodsCat.destroy({ where: { id: ids } });
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

  async update (id, goodsCat) {
    let _result = {
      succeed: 0,
      code: 0,
      description: '',
      data: null,
    };

    try {
      Object.keys(goodsCat).forEach((field) => {
        if (!goodsCat[field] && goodsCat[field] != 0) {
          delete goodsCat[field];
        }
      });
      if (id) {
        const _name = goodsCat.name;
        if (_name) {
          let _goodsCat = await GoodsCat.findOne({ where: { id, name: _name }, raw: true });
          if (_goodsCat) {
            const _ret = await GoodsCat.update(goodsCat, { where: { id } });
            const _affectedCount = _ret[0];
            if (_affectedCount == 0) {
              _result = { succeed: 0, code: 102, description: '记录不存在' };
            } else {
              _result = {
                succeed: 1,
                code: 200,
                description: '成功',
                data: { ...goodsCat, id },
              };
            }
          } else {
            _goodsCat = await GoodsCat.findOne({
              where: { name: _name, parentId: goodsCat.parentId, id: { $ne: id } },
              raw: true,
            });
            if (_goodsCat) {
              _result = { succeed: 0, code: 101, description: `名称 [${_name}] 重复` };
            } else {
              const _ret = await GoodsCat.update(goodsCat, { where: { id } });
              const _affectedCount = _ret[0];
              if (_affectedCount == 0) {
                _result = { succeed: 0, code: 102, description: '记录不存在' };
              } else {
                _result = {
                  succeed: 1,
                  code: 200,
                  description: '成功',
                  data: { ...goodsCat, id },
                };
              }
            }
          }
        } else {
          const _ret = await GoodsCat.update(goodsCat, { where: { id } });
          const _affectedCount = _ret[0];
          if (_affectedCount == 0) {
            _result = { succeed: 0, code: 102, description: '记录不存在' };
          } else {
            _result = {
              succeed: 1,
              code: 200,
              description: '成功',
              data: { ...goodsCat, id },
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
      const _goodsCat = await GoodsCat.findOne({ where: { id }, raw: true });
      if (_goodsCat) {
        _result = {
          succeed: 1,
          code: 200,
          description: '成功',
          data: _goodsCat,
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
        const _goodsCats = await GoodsCat.findAndCountAll({
          where: _where,
          offset,
          limit,
          raw: true,
        });
        for (const _goodsCat of _goodsCats.rows) {
          _datas.push(_goodsCat);
        }
        _result = {
          succeed: 1,
          code: 200,
          description: '成功',
          data: { list: _datas, count: _goodsCats.count },
        };
      } else {
        const _goodsCats = await GoodsCat.findAll({ where: _where, raw: true });
        for (const _goodsCat of _goodsCats) {
          _datas.push(_goodsCat);
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

  /**
   * @returns
   * @memberof GoodsCat
   */
  async getTree () {
    let _result = {
      succeed: 0,
      code: 0,
      description: '',
      data: null,
    };

    const _where = {};
    const _datas = [];
    const _getSubTrees = (id, name, datas, level) => {
      const _goodsCats = [];
      ++level;
      for (const _data of datas) {
        if (_data.parentId == id) {
          _data.level = level;
          _goodsCats.push({ ..._data, ...{ parentName: name } });
        }
      }
      for (const _goodsCat of _goodsCats) {
        const _subTrees = _getSubTrees(_goodsCat.id, _goodsCat.name, datas, level);
        if (Array.isArray(_subTrees) && _subTrees.length > 0) {
          _goodsCat.children = _subTrees;
        }
      }
      if (_goodsCats.length == 0) {
        return [];
      }
      return _goodsCats;
    };
    try {
      let _goodsCats = await GoodsCat.findAll({
        attributes: GoodsCat.getAttributes(),
        include: [
          {
            model: Attachment,
            as: 'attachment',
            attributes: ['id', 'path'],
          },
          {
            model: GoodsType,
            as: 'type',
            attributes: ['id', 'name'],
          },
        ],
        where: _where,
        order: [['sort', 'ASC']],
      });
      _goodsCats = _goodsCats.map((v) => v.dataValues);
      const _level = 1;
      for (const _goodsCat of _goodsCats) {
        if (_goodsCat.parentId == 0) {
          _goodsCat.level = _level;
          _datas.push(_goodsCat);
        }
      }
      for (const _data of _datas) {
        _data.children = _getSubTrees(_data.id, _data.name, _goodsCats, _level);
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
      this._instance = new GoodsCatRepos();
    }
    return this._instance;
  }
}

module.exports = GoodsCatRepos.getInstance();
