const { GoodsComment, User, Goods } = require('../../models');

const logger = require('tracer').colorConsole();

class GoodsCommentRepos {
  constructor () {
    this._instance = null;
  }

  async create (goodsComment) {
    let _result = {
      succeed: 0, // 1:成功0:失败
      code: 0, // 错误码
      description: '', // 错误信息
      data: null, // 本身就是一个json字符串
    };

    try {
      Object.keys(goodsComment).forEach((field) => {
        if (!goodsComment[field] && goodsComment[field] != 0) {
          delete goodsComment[field];
        }
      });

      if (
        goodsComment.score &&
        goodsComment.userId &&
        goodsComment.goodsId &&
        goodsComment.orderId &&
        goodsComment.content
      ) {
        let _goodsComment = await GoodsComment.findOne({
          where: {
            userId: goodsComment.userId,
            goodsId: goodsComment.goodsId,
            orderId: goodsComment.orderId,
          },
          raw: true,
        });
        if (_goodsComment) {
          _result = { succeed: 0, code: 101, description: '已经评论过' };
        } else {
          _goodsComment = await GoodsComment.create(goodsComment);
          _result = {
            succeed: 1,
            code: 200,
            description: '成功',
            data: _goodsComment,
          };
        }
      } else {
        _result = {
          succeed: 0,
          code: 100,
          description: `参数错误 -> goodsComment:${JSON.stringify(goodsComment)}`,
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
        const _affectedCount = await GoodsComment.destroy({ where: { id: ids } });
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

  async update (id, goodsComment) {
    let _result = {
      succeed: 0,
      code: 0,
      description: '',
      data: null,
    };

    try {
      Object.keys(goodsComment).forEach((field) => {
        if (!goodsComment[field] && goodsComment[field] != 0) {
          delete goodsComment[field];
        }
      });
      if (id) {
        const _userId = goodsComment.userId;
        const _goodsId = goodsComment.goodsId;
        const _orderId = goodsComment.orderId;
        if (_userId && _goodsId && _orderId) {
          let _goodsComment = await GoodsComment.findOne({
            where: {
              id,
              userId: _userId,
              goodsId: _goodsId,
              orderId: _orderId,
            },
            raw: true,
          });
          if (_goodsComment) {
            const _ret = await GoodsComment.update(goodsComment, { where: { id } });
            const _affectedCount = _ret[0];
            if (_affectedCount == 0) {
              _result = { succeed: 0, code: 102, description: '记录不存在' };
            } else {
              _result = {
                succeed: 1,
                code: 200,
                description: '成功',
                data: { ...goodsComment, id },
              };
            }
          } else {
            _goodsComment = await GoodsComment.findOne({
              where: {
                userId: _userId,
                goodsId: _goodsId,
                orderId: _orderId,
                id: { $ne: id },
              },
              raw: true,
            });
            if (_goodsComment) {
              _result = { succeed: 0, code: 101, description: '已经评论过' };
            } else {
              const _ret = await GoodsComment.update(goodsComment, { where: { id } });
              const _affectedCount = _ret[0];
              if (_affectedCount == 0) {
                _result = { succeed: 0, code: 102, description: '记录不存在' };
              } else {
                _result = {
                  succeed: 1,
                  code: 200,
                  description: '成功',
                  data: { ...goodsComment, id },
                };
              }
            }
          }
        } else {
          const _ret = await GoodsComment.update(goodsComment, { where: { id } });
          const _affectedCount = _ret[0];
          if (_affectedCount == 0) {
            _result = { succeed: 0, code: 102, description: '记录不存在' };
          } else {
            _result = {
              succeed: 1,
              code: 200,
              description: '成功',
              data: { ...goodsComment, id },
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
      const _goodsComment = await GoodsComment.findOne({ where: { id }, raw: true });
      if (_goodsComment) {
        _result = {
          succeed: 1,
          code: 200,
          description: '成功',
          data: _goodsComment,
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
        const _goodsComments = await GoodsComment.findAndCountAll({
          include: [
            {
              model: User,
              attributes: ['id', 'username'],
              as: 'user',
              require: false,
            },
            {
              model: Goods,
              attributes: ['id', 'name'],
              as: 'goods',
              require: false,
            },
          ],
          where: _where,
          offset,
          limit,
        });
        for (const _goodsComment of _goodsComments.rows) {
          _datas.push(_goodsComment);
        }
        _result = {
          succeed: 1,
          code: 200,
          description: '成功',
          data: { list: _datas, count: _goodsComments.count },
        };
      } else {
        const _goodsComments = await GoodsComment.findAll({
          include: [
            {
              model: User,
              attributes: ['id', 'username'],
              as: 'user',
              require: false,
            },
            {
              model: Goods,
              attributes: ['id', 'name'],
              as: 'goods',
              require: false,
            },
          ],
          where: _where,
        });
        for (const _goodsComment of _goodsComments) {
          _datas.push(_goodsComment);
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
      this._instance = new GoodsCommentRepos();
    }
    return this._instance;
  }
}

module.exports = GoodsCommentRepos.getInstance();
