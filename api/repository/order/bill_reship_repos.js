import {
  BillReship, User, BillReshipItem, Logistics,
} from '../../models';

const logger = require('tracer').colorConsole();
/**
 * 退货单
 */
class BillReshipRepos {
  constructor () {
    this.STATUS_WAIT_SHIP = 1; // 状态，等待发货
    this.STATUS_SHIPPED = 2; // 状态，已发货
    this.STATUS_SUCCESS = 3; // 状态，已收货

    this._instance = null;
  }

  /**
    reship_id     主键
    order_id      订单ID 关联order.id
    aftersale_id 退货单id
    user_id       用户ID 关联user.id
    logi_code     物流公司编码
    logi_no       物流单号
    status        状态 1=审核通过待发货 2=已发退货 3=已收退货
    memo          备注
    created_at    创建时间
    updated_at    更新时间
     */
  async create (billReship) {
    let _result = {
      succeed: 0, // 1:成功0:失败
      code: 0, // 错误码
      description: '', // 错误信息
      data: null, // 本身就是一个json字符串
    };

    try {
      Object.keys(billReship).forEach((field) => {
        if (!billReship[field] && billReship[field] != 0) {
          delete billReship[field];
        }
      });
      if (billReship.userId && billReship.orderId && billReship.afterSaleId) {
        let _billReship = await BillReship.findOne({
          where: {
            userId: billReship.userId,
            orderId: billReship.orderId,
            afterSaleId: billReship.afterSaleId,
          },
          raw: true,
        });
        if (_billReship) {
          _result = { succeed: 0, code: 101, description: '退货单重复' };
        } else {
          _billReship = await BillReship.create(billReship);
          _result = {
            succeed: 1,
            code: 200,
            description: '成功',
            data: _billReship,
          };
        }
      } else {
        _result = {
          succeed: 0,
          code: 100,
          description: `参数错误 -> billReship:${JSON.stringify(billReship)}`,
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
        const _affectedCount = await BillReship.destroy({ where: { id: ids } });
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

  async update (id, billReship) {
    let _result = {
      succeed: 0,
      code: 0,
      description: '',
      data: null,
    };

    try {
      Object.keys(billReship).forEach((field) => {
        if (!billReship[field] && billReship[field] != 0) {
          delete billReship[field];
        }
      });
      if (id) {
        const _userId = billReship.userId;
        const _orderId = billReship.orderId;
        const _afterSaleId = billReship.afterSaleId;
        if (_userId && _orderId) {
          let _billReship = await BillReship.findOne({
            where: {
              id,
              userId: _userId,
              orderId: _orderId,
              afterSaleId: _afterSaleId,
            },
            raw: true,
          });
          if (_billReship) {
            const _ret = await BillReship.update(billReship, { where: { id } });
            const _affectedCount = _ret[0];
            if (_affectedCount == 0) {
              _result = { succeed: 0, code: 102, description: '记录不存在' };
            } else {
              _result = {
                succeed: 1,
                code: 200,
                description: '成功',
                data: { ...billReship, id },
              };
            }
          } else {
            _billReship = await BillReship.findOne({
              where: {
                userId: _userId,
                orderId: _orderId,
                afterSaleId: _afterSaleId,
                id: { $ne: id },
              },
              raw: true,
            });
            if (_billReship) {
              _result = { succeed: 0, code: 101, description: '退货单重复' };
            } else {
              const _ret = await BillReship.update(billReship, { where: { id } });
              const _affectedCount = _ret[0];
              if (_affectedCount == 0) {
                _result = { succeed: 0, code: 102, description: '记录不存在' };
              } else {
                _result = {
                  succeed: 1,
                  code: 200,
                  description: '成功',
                  data: { ...billReship, id },
                };
              }
            }
          }
        } else {
          const _ret = await BillReship.update(billReship, { where: { id } });
          const _affectedCount = _ret[0];
          if (_affectedCount == 0) {
            _result = { succeed: 0, code: 102, description: '记录不存在' };
          } else {
            _result = {
              succeed: 1,
              code: 200,
              description: '成功',
              data: { ...billReship, id },
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
      const _billReship = await BillReship.findOne({
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'username', 'nickname'],
            require: false,
          },
          {
            model: Logistics,
            as: 'logistics',
            attributes: Logistics.getAttributes(),
            require: false,
          },
          {
            model: BillReshipItem,
            as: 'billReshipItems',
            attributes: BillReshipItem.getAttributes(),
            require: false,
          },
        ],
        where: { id },
      });
      if (_billReship) {
        _result = {
          succeed: 1,
          code: 200,
          description: '成功',
          data: _billReship,
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
        const _billReships = await BillReship.findAndCountAll({
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'username', 'nickname'],
              require: false,
            },
            {
              model: Logistics,
              as: 'logistics',
              attributes: Logistics.getAttributes(),
              require: false,
            },
            {
              model: BillReshipItem,
              as: 'billReshipItems',
              attributes: BillReshipItem.getAttributes(),
              require: false,
            },
          ],
          distinct: true,
          where: _where,
          offset,
          limit,
        });
        for (const _billReship of _billReships.rows) {
          _datas.push(_billReship);
        }
        _result = {
          succeed: 1,
          code: 200,
          description: '成功',
          data: { list: _datas, count: _billReships.count },
        };
      } else {
        const _billReships = await BillReship.findAll({
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'username', 'nickname'],
              require: false,
            },
            {
              model: Logistics,
              as: 'logistics',
              attributes: Logistics.getAttributes(),
              require: false,
            },
            {
              model: BillReshipItem,
              as: 'billReshipItems',
              attributes: BillReshipItem.getAttributes(),
              require: false,
            },
          ],
          where: _where,
        });
        for (const _billReship of _billReships) {
          _datas.push(_billReship);
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
   * 退货单状态
   * @param {售后单号} afterSaleId
   */
  async getBillReshipState (afterSaleId) {
    let _result = {
      succeed: 0,
      code: 0,
      description: '未知错误',
      data: null,
    };
    try {
      let _data = '';
      const _billReship = await BillReship.findOne({ where: { afterSaleId } });
      if (_billReship) {
        if (_billReship.status == this.STATUS_WAIT_SHIP) {
          _data = '待发退货';
        } else if (_billReship.status == this.STATUS_SHIPPED) {
          _data = '已发退货';
        } else if (_billReship.status == this.STATUS_SUCCESS) {
          _data = '已收退货';
        } else {
          _data = '状态异常';
        }
      } else {
        _data = '待发退货';
      }
      Object.assign(_result, {
        succeed: 1,
        code: 200,
        description: '成功',
        data: _data,
      });
    } catch (err) {
      logger.error(err);
      _result = { succeed: 0, code: 500, description: err.message || err.stack || '系统错误' };
    }

    return _result;
  }

  // 构造一个广为人知的接口，供用户对该类进行实例化
  static getInstance () {
    if (!this._instance) {
      this._instance = new BillReshipRepos();
    }
    return this._instance;
  }
}

export default BillReshipRepos.getInstance();
