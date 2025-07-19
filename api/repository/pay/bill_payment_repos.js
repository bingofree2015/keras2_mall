const { BillPayment, BillPaymentItem, User } = require('../../models');

const logger = require('tracer').colorConsole();

class BillPaymentRepos {
  constructor () {
    this._instance = null;
  }

  async create (billPayment) {
    let _result = {
      succeed: 0, // 1:成功0:失败
      code: 0, // 错误码
      description: '', // 错误信息
      data: null, // 本身就是一个json字符串
    };

    try {
      Object.keys(billPayment).forEach((field) => {
        if (!billPayment[field] && billPayment[field] != 0) {
          delete billPayment[field];
        }
      });
      if (billPayment.userId && billPayment.money) {
        _billPayment = await BillPayment.create(billPayment);
        _result = {
          succeed: 1,
          code: 200,
          description: '成功',
          data: _billPayment,
        };
      } else {
        _result = {
          succeed: 0,
          code: 100,
          description: `参数错误 -> billPayment:${JSON.stringify(billPayment)}`,
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
        const _affectedCount = await BillPayment.destroy({ where: { id: ids } });
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

  async update (id, billPayment) {
    let _result = {
      succeed: 0,
      code: 0,
      description: '',
      data: null,
    };

    try {
      Object.keys(billPayment).forEach((field) => {
        if (!billPayment[field] && billPayment[field] != 0) {
          delete billPayment[field];
        }
      });
      if (id) {
        const _ret = await BillPayment.update(billPayment, { where: { id } });
        const _affectedCount = _ret[0];
        if (_affectedCount == 0) {
          _result = { succeed: 0, code: 102, description: '记录不存在' };
        } else {
          _result = {
            succeed: 1,
            code: 200,
            description: '成功',
            data: { ...billPayment, id },
          };
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
      const _billPayment = await BillPayment.findOne({
        include: [
          {
            model: User,
            attributes: User.getAttributes(),
            as: 'user',
            require: false,
          },
          {
            model: BillPaymentItem,
            attributes: BillPaymentItem.getAttributes(),
            as: 'billPaymentItems',
            require: 'false',
          },
        ],
        where: { id },
      });
      if (_billPayment) {
        _result = {
          succeed: 1,
          code: 200,
          description: '成功',
          data: _billPayment,
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
        const _billPayments = await BillPayment.findAndCountAll({
          include: [
            {
              model: User,
              attributes: User.getAttributes(),
              as: 'user',
              require: false,
            },
            {
              model: BillPaymentItem,
              attributes: BillPaymentItem.getAttributes(),
              as: 'billPaymentItems',
              require: 'false',
            },
          ],
          where: _where,
          distinct: true,
          offset,
          limit,
        });
        for (const _billPayment of _billPayments.rows) {
          _datas.push(_billPayment);
        }
        _result = {
          succeed: 1,
          code: 200,
          description: '成功',
          data: { list: _datas, count: _billPayments.count },
        };
      } else {
        const _billPayments = await BillPayment.findAll({
          include: [
            {
              model: User,
              attributes: User.getAttributes(),
              as: 'user',
              require: false,
            },
            {
              model: BillPaymentItem,
              attributes: BillPaymentItem.getAttributes(),
              as: 'billPaymentItems',
              require: 'false',
            },
          ],
          where: _where,
        });
        for (const _billPayment of _billPayments) {
          _datas.push(_billPayment);
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
      this._instance = new BillPaymentRepos();
    }
    return this._instance;
  }
}

module.exports = BillPaymentRepos.getInstance();
