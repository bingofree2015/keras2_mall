const { Promotion, SpTarget, SpRule } = require('../../models');

const logger = require('tracer').colorConsole();

class PromotionRepos {
  /**
        name         促销名称
        state        启用状态 1:开启 2:关闭
        type         类型 1:促销 2:优惠券 3:团购 4:秒杀
        sort         排序
        exclusive    排他 1:不排他 2:排他
        auto_receive 当时优惠券的时候，自动是否自动领取，1:自动领取 2:不自动领取
        param        其它参数
        starttime        开始时间
        endtime        结束时间
     */
  constructor () {
    this._instance = null;
  }

  async create (promotion) {
    let _result = {
      succeed: 0, // 1:成功0:失败
      code: 0, // 错误码
      description: '', // 错误信息
      data: null, // 本身就是一个json字符串
    };

    try {
      Object.keys(promotion).forEach((field) => {
        if (!promotion[field] && promotion[field] != 0) {
          delete promotion[field];
        }
      });
      if (promotion.name) {
        let _promotion = await Promotion.findOne({ where: { name: promotion.name }, raw: true });
        if (_promotion) {
          _result = { succeed: 0, code: 101, description: '名称重复' };
        } else {
          _promotion = await Promotion.create(promotion);

          // 批量插入 spTarget
          if (Array.isArray(promotion.spTargets) && promotion.spTargets.length > 0) {
            const _spTargets = [];
            for (const _target of promotion.spTargets) {
              _spTargets.push({
                promotionId: _promotion.id,
                code: _target.code,
                name: _target.name,
                pattern: _target.pattern,
              });
            }
            await SpTarget.bulkCreate(_spTargets, {
              updateOnDuplicate: ['promotionId', 'code', 'name', 'pattern'],
            });
          }
          // 批量插入 spRule
          if (Array.isArray(promotion.spRules) && promotion.spRules.length > 0) {
            const _spRules = [];
            for (const _rule of promotion.spRules) {
              _spRules.push({
                promotionId: _promotion.id,
                code: _rule.code,
                name: _rule.name,
                pattern: _rule.pattern,
              });
            }
            await SpRule.bulkCreate(_spRules, {
              updateOnDuplicate: ['promotionId', 'code', 'name', 'pattern'],
            });
          }

          _result = {
            succeed: 1,
            code: 200,
            description: '成功',
            data: { ...promotion, id: _promotion.id },
          };
        }
      } else {
        _result = {
          succeed: 0,
          code: 100,
          description: `参数错误 -> promotion:${JSON.stringify(promotion)}`,
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
        const _affectedCount = await Promotion.destroy({ where: { id: ids } });
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

  async update (id, promotion) {
    let _result = {
      succeed: 0,
      code: 0,
      description: '',
      data: null,
    };

    const _bulkUpsertTarget = async (promotionId, spTargets) => {
      // 批量插入
      if (Array.isArray(spTargets) && spTargets.length > 0) {
        // 删除数据
        const _spTargets = await SpTarget.findAll({
          attributes: ['id'],
          where: { promotionId },
          raw: true,
        });
        const _oldIds = [];
        _spTargets.forEach((v) => {
          _oldIds.push(v.id);
        });
        const _newIds = spTargets.map((v) => v.id).filter((v) => v);
        const _delIds = _oldIds
          .map((v) => {
            if (!_newIds.includes(v)) {
              return v;
            }
          })
          .filter((v) => v);
        if (_delIds.length > 0) {
          await SpTarget.destroy({ where: { id: _delIds } });
        }
        // 更新与插入
        const _spTargetDatas = [];
        for (const _target of spTargets) {
          _spTargetDatas.push({
            promotionId,
            code: _target.code,
            name: _target.name,
            pattern: _target.pattern,
          });
        }
        await SpTarget.bulkCreate(_spTargetDatas, {
          updateOnDuplicate: ['promotionId', 'code', 'name', 'pattern'],
        });
      }
    };

    const _bulkUpsertRule = async (promotionId, spRules) => {
      // 批量插入
      if (Array.isArray(spRules) && spRules.length > 0) {
        // 删除数据
        const _spRules = await SpRule.findAll({
          attributes: ['id'],
          where: { promotionId },
          raw: true,
        });
        const _oldIds = [];
        _spRules.forEach((v) => {
          _oldIds.push(v.id);
        });
        const _newIds = spRules.map((v) => v.id).filter((v) => v);
        const _delIds = _oldIds
          .map((v) => {
            if (!_newIds.includes(v)) {
              return v;
            }
          })
          .filter((v) => v);
        if (_delIds.length > 0) {
          await SpRule.destroy({ where: { id: _delIds } });
        }
        // 更新与插入
        const _spRuleDatas = [];
        for (const _rule of spRules) {
          _spRuleDatas.push({
            promotionId,
            code: _rule.code,
            name: _rule.name,
            pattern: _rule.pattern,
          });
        }
        await SpRule.bulkCreate(_spRuleDatas, {
          updateOnDuplicate: ['promotionId', 'code', 'name', 'pattern'],
        });
      }
    };

    try {
      Object.keys(promotion).forEach((field) => {
        if (!promotion[field] && promotion[field] != 0) {
          delete promotion[field];
        }
      });
      if (id) {
        const _name = promotion.name;
        if (_name) {
          let _promotion = await Promotion.findOne({ where: { id, name: _name }, raw: true });
          if (_promotion) {
            const _ret = await Promotion.update(promotion, { where: { id } });
            const _affectedCount = _ret[0];
            if (_affectedCount == 0) {
              _result = { succeed: 0, code: 102, description: '记录不存在' };
            } else {
              await _bulkUpsertTarget(id, promotion.spTargets);
              await _bulkUpsertRule(id, promotion.spRules);
              _result = {
                succeed: 1,
                code: 200,
                description: '成功',
                data: { ...promotion, id },
              };
            }
          } else {
            _promotion = await Promotion.findOne({
              where: { name: _name, id: { $ne: id } },
              raw: true,
            });
            if (_promotion) {
              _result = { succeed: 0, code: 101, description: `名称 [${_name}] 重复` };
            } else {
              const _ret = await Promotion.update(promotion, { where: { id } });
              const _affectedCount = _ret[0];
              if (_affectedCount == 0) {
                _result = { succeed: 0, code: 102, description: '记录不存在' };
              } else {
                await _bulkUpsertTarget(id, promotion.spTargets);
                await _bulkUpsertRule(id, promotion.spRules);
                _result = {
                  succeed: 1,
                  code: 200,
                  description: '成功',
                  data: { ...promotion, id },
                };
              }
            }
          }
        } else {
          const _ret = await Promotion.update(promotion, { where: { id } });
          const _affectedCount = _ret[0];
          if (_affectedCount == 0) {
            _result = { succeed: 0, code: 102, description: '记录不存在' };
          } else {
            await _bulkUpsertTarget(id, promotion.spTargets);
            await _bulkUpsertRule(id, promotion.spRules);
            _result = {
              succeed: 1,
              code: 200,
              description: '成功',
              data: { ...promotion, id },
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
      const _promotion = await Promotion.findOne({
        include: [
          {
            model: SpTarget,
            attributes: SpTarget.getAttributes(),
            as: 'spTargets',
          },
          {
            model: SpRule,
            attributes: SpRule.getAttributes(),
            as: 'spRules',
          },
        ],
        where: { id },
      });
      if (_promotion) {
        _result = {
          succeed: 1,
          code: 200,
          description: '成功',
          data: _promotion,
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
        const _promotions = await Promotion.findAndCountAll({
          where: _where,
          offset,
          limit,
        });
        for (const _promotion of _promotions.rows) {
          _datas.push(_promotion);
        }
        _result = {
          succeed: 1,
          code: 200,
          description: '成功',
          data: { list: _datas, count: _promotions.count },
        };
      } else {
        const _promotions = await Promotion.findAll({
          where: _where,
        });
        for (const _promotion of _promotions) {
          _datas.push(_promotion);
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
   * 获取可领取的优惠券
   * @param {数量} limit
   */
  async getCouponList (limit) {
    let _result = {
      succeed: 0,
      code: 0,
      description: '未知错误',
      data: null,
    };
    try {
      const _where = {
        endTime: { $gt: Date.now() }, // 判断优惠券失效时间 是否可领取
        state: true, // 启用状态
        type: 2, // 促销 类型
        autoReceive: true, // 自动领取状态
      };
      const _promotions = await Promotion.findAll({
        include: [
          {
            model: SpTarget,
            as: 'spTargets',
            require: false,
          },
          {
            model: SpRule,
            as: 'spRules',
            require: false,
          },
        ],
        where: _where,
        limit,
      });
      for (const _promotion of _promotions) {
        const _spTargets = _promotion.spTargets
          .map((v) => {
            let _message = '';
            switch (v.code) {
            case 'GOODS_ALL':
              _message = '购买所有商品';
              break;
            case 'GOODS_IDS':
              _message = '购买指定商品';
              break;
            case 'GOODS_CATS':
              _message = '购买指定分类商品';
              break;
            case 'GOODS_BRANDS':
              _message = '购买指定品牌商品';
              break;
            case 'ORDER_FULL':
              _message = `购买订单满 ${pattern.money} 元`;
              break;
            case 'USER_GRADE':
              _message = '用户符合指定等级';
              break;
            default:
              break;
            }
            return _message;
          })
          .join('');
        _promotion.setDataValue('spTargets', _spTargets);

        const _spRules = _promotion.spRules
          .map((v) => {
            let _message = '';
            switch (v.code) {
            case 'GOODS_REDUCE':
              _message = `减 ${pattern.money} 元`;
              break;
            case 'GOODS_DISCOUNT':
              _message = `打 ${pattern.discount} 折`;
              break;
            case 'GOODS_ONE_PRICE':
              _message = `一口价 ${pattern.money} 元`;
              break;
            case 'ORDER_REDUCE':
              _message = `订单减 ${pattern.money} 元`;
              break;
            case 'ORDER_DISCOUNT':
              _message = `订单打 ${pattern.discount} 折 `;
              break;
            case 'GOODS_HALF_PRICE':
              _message = `第  ${pattern.num} 件 ${pattern.money} 元`;
              break;
            default:
              break;
            }
            return _message;
          })
          .join('');
        _promotion.setDataValue('spRules', _spRules);

        _datas.push(_promotion);
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
      this._instance = new PromotionRepos();
    }
    return this._instance;
  }
}

module.exports = PromotionRepos.getInstance();
