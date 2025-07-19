import {
  Goods,
  Attachment,
  GoodsAttachment,
  GoodsCat,
  GoodsType,
  Brand,
  Product,
  GoodsGrade,
  Sequelize,
  sequelize,
} from '../../models';
import couponUtil from '../../utils/coupon_util';
import setting from '../preference/setting_repos';

const logger = require('tracer').colorConsole();

class GoodsRepos {
  constructor () {
    this._instance = null;
    this.MARKETABLE_UP = 1; // 上架
    this.MARKETABLE_DOWN = 2; // 下架
    this.VIRTUAL_YES = 2; // 虚拟商品
    this.VIRTUAL_NO = 1; // 普通商品
    this.HOT_YES = 1; // 热卖
    this.HOT_NO = 2; // 非热卖
  }

  async create (goods) {
    let _result = {
      succeed: 0, // 1:成功 0:失败
      code: 0, // 错误码
      description: '', // 错误信息
      data: null, // 本身就是一个json字符串
    };

    try {
      Object.keys(goods).forEach((field) => {
        if (!goods[field] && goods[field] != 0) {
          delete goods[field];
        }
      });
      if (goods.name) {
        let _goods = await Goods.findOne({ where: { name: goods.name }, raw: true });
        if (_goods) {
          _result = { succeed: 0, code: 101, description: '名称重复' };
        } else {
          goods.specs = goods.goodsType ? goods.goodsType.specs : [];
          goods.params = goods.goodsType ? goods.goodsType.params : [];
          _goods = await Goods.create(goods);
          const _goodsId = _goods.id;

          if (Array.isArray(goods.goodsAttachments) && goods.goodsAttachments.length > 0) {
            // 批量插入  goodsAttachment 表
            const _goodsAttachments = [];
            for (const _goodsAttachment of goods.goodsAttachments) {
              _goodsAttachments.push({ goodsId: _goodsId, attachmentId: _goodsAttachment.id });
            }
            if (_goodsAttachments.length > 0) {
              await GoodsAttachment.bulkCreate(_goodsAttachments, {
                updateOnDuplicate: ['goodsId', 'attachmentId', 'sort'],
              });
            }
          }
          if (Array.isArray(goods.products) && goods.products.length) {
            // 批量插入  products 表
            const _products = [];
            for (const _product of goods.products) {
              const _sn = couponUtil.genSerialNumber(4);
              _products.push({
                goodsId: _goodsId, // 商品id
                barcode: '', // 货品条码
                sn: _product.sn ? _product.sn : _sn, // 商品编码
                price: _product.price, // 货品价格
                costPrice: _product.costPrice, // 货品成本价
                mktPrice: _product.mktPrice, // 货品市场价
                marketable: goods.marketable, // 上架标志 1:上架 2:下架
                stock: _product.stock, // 库存
                freezeStock: goods.freezeStock, // 冻结库存
                specsJson: _product.specsJson, // 规格值逗号分隔存储
                isDefalut: _product.isDefault, // 是否默认货品 1:是 2:否
                attachmentId: _product.attachment ? _product.attachment.id : 0, // 规格图片ID
              });
            }
            if (_products.length > 0) {
              await Product.bulkCreate(_products, {
                updateOnDuplicate: [
                  'goodsId',
                  'barcode',
                  'sn',
                  'price',
                  'costPrice',
                  'mktPrice',
                  'marketable',
                  'stock',
                  'freezeStock',
                  'specsJson',
                  'isDefalut',
                  'attachmentId',
                ],
              });
            }
          }
          if (goods.gradePrice && Object.keys(goods.gradePrice).length > 0) {
            // 批量插入  goodsGrade 表
            const _goodsGrades = [];
            for (const _gradeId in goods.gradePrice) {
              _goodsGrades.push({
                goodsId: _goodsId,
                gradeId: _gradeId,
                gradePrice: goods.gradePrice[_gradeId],
              });
            }
            if (_goodsGrades.length > 0) {
              await GoodsGrade.bulkCreate(_goodsGrades, {
                updateOnDuplicate: ['goodsId', 'gradeId', 'gradePrice'],
              });
            }
          }

          _result = {
            succeed: 1,
            code: 200,
            description: '成功',
            data: _goods,
          };
        }
      } else {
        _result = {
          succeed: 0,
          code: 100,
          description: `参数错误 -> goods:${JSON.stringify(goods)}`,
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
        const _affectedCount = await Goods.destroy({ where: { id: ids } });
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

  async update (id, goods) {
    let _result = {
      succeed: 0,
      code: 0,
      description: '',
      data: null,
    };

    const _bulkCreateGoodsAttachments = async (goodsId, goodsAttachments) => {
      // 批量插入
      if (Array.isArray(goodsAttachments) && goodsAttachments.length > 0) {
        // 删除数据
        const _goodsAttachments = await GoodsAttachment.findAll({
          attributes: ['id'],
          where: { goodsId },
          raw: true,
        });
        const _oldIds = [];
        _goodsAttachments.forEach((v) => {
          _oldIds.push(v.id);
        });
        const _newIds = goodsAttachments.map((v) => v.id).filter((v) => v);
        const _delIds = _oldIds
          .map((v) => {
            if (!_newIds.includes(v)) {
              return v;
            }
          })
          .filter((v) => v);
        if (_delIds.length > 0) {
          await GoodsAttachment.destroy({ where: { id: _delIds } });
        }
        // 更新与插入
        const _goodsAttachmentDatas = [];
        let _sort = 0;
        for (const _goodsAttachment of goodsAttachments) {
          _goodsAttachmentDatas.push({
            goodsId,
            attachmentId: _goodsAttachment.id,
            path: _goodsAttachment.path,
            sort: _sort,
          });
          ++_sort;
        }
        await GoodsAttachment.bulkCreate(_goodsAttachmentDatas, {
          updateOnDuplicate: ['goodsId', 'attachmentId', 'sort'],
        });
      }
    };

    const _bulkCreateProducts = async (goodsId, goods, products) => {
      // 批量插入
      if (Array.isArray(products) && products.length > 0) {
        // 删除数据
        const _products = await Product.findAll({
          attributes: ['id'],
          where: { goodsId },
          raw: true,
        });
        const _oldIds = [];
        _products.forEach((v) => {
          _oldIds.push(v.id);
        });
        const _newIds = products.map((v) => v.id).filter((v) => v);
        const _delIds = _oldIds
          .map((v) => {
            if (!_newIds.includes(v)) {
              return v;
            }
          })
          .filter((v) => v);
        if (_delIds.length > 0) {
          await Product.destroy({ where: { id: _delIds } });
        }
        // 更新与插入
        const _productDatas = [];
        for (const _product of products) {
          const _sn = couponUtil.genSerialNumber(4);
          _productDatas.push({
            goodsId, // 商品id
            barcode: '', // 货品条码
            sn: _product.sn ? _product.sn : _sn, // 商品编码
            price: _product.price, // 货品价格
            costPrice: _product.costPrice, // 货品成本价
            mktPrice: _product.mktPrice, // 货品市场价
            marketable: goods.marketable, // 上架标志 1:上架 2:下架
            stock: _product.stock, // 库存
            freezeStock: goods.freezeStock, // 冻结库存
            specsJson: _product.specsJson, // 规格值逗号分隔存储
            isDefault: _product.isDefault, // 是否默认货品 true;false
            attachmentId: _product.attachment ? _product.attachment.id : 0, // 规格图片ID
          });
        }
        await Product.bulkCreate(_productDatas, {
          updateOnDuplicate: [
            'goodsId',
            'barcode',
            'sn',
            'price',
            'costPrice',
            'mktPrice',
            'marketable',
            'stock',
            'freezeStock',
            'specsJson',
            'isDefault',
            'attachmentId',
          ],
        });
      }
    };

    const _bulkCreateGoodsGrades = async (goodsId, gradePrice) => {
      // 批量插入
      if (gradePrice && Object.keys(gradePrice).length > 0) {
        // 删除数据
        const _goodsGrades = await GoodsGrade.findAll({
          attributes: ['id'],
          where: { goodsId },
          raw: true,
        });
        const _oldIds = [];
        _goodsGrades.forEach((v) => {
          _oldIds.push(v.id);
        });
        const _newIds = Object.keys(gradePrice);
        const _delIds = _oldIds
          .map((v) => {
            if (!_newIds.includes(v)) {
              return v;
            }
          })
          .filter((v) => v);
        if (_delIds.length > 0) {
          await GoodsGrade.destroy({ where: { id: _delIds } });
        }
        // 更新与插入
        const _goodsGradeDatas = [];
        for (const _gradeId in gradePrice) {
          _goodsGradeDatas.push({
            goodsId,
            gradeId: _gradeId,
            gradePrice: gradePrice[_gradeId],
          });
        }
        if (_goodsGradeDatas.length > 0) {
          await GoodsGrade.bulkCreate(_goodsGradeDatas, {
            updateOnDuplicate: ['goodsId', 'gradeId', 'gradePrice'],
          });
        }
      }
    };

    try {
      Object.keys(goods).forEach((field) => {
        if (!goods[field] && goods[field] != 0) {
          delete goods[field];
        }
      });
      if (id) {
        goods.specs = goods.goodsType ? goods.goodsType.specs : [];
        goods.params = goods.goodsType ? goods.goodsType.params : [];

        const _name = goods.name;
        if (_name) {
          let _goods = await Goods.findOne({ where: { id, name: _name }, raw: true });
          if (_goods) {
            const _ret = await Goods.update(goods, { where: { id } });
            const _affectedCount = _ret[0];
            if (_affectedCount == 0) {
              _result = { succeed: 0, code: 102, description: '记录不存在' };
            } else {
              // 更新图片集与商品记录
              await _bulkCreateGoodsAttachments(id, goods.goodsAttachments);
              await _bulkCreateProducts(id, goods, goods.products);
              await _bulkCreateGoodsGrades(id, goods.gradePrice);
              _result = {
                succeed: 1,
                code: 200,
                description: '成功',
                data: { ...goods, id },
              };
            }
          } else {
            _goods = await Goods.findOne({ where: { name: _name, id: { $ne: id } }, raw: true });
            if (_goods) {
              _result = { succeed: 0, code: 101, description: `名称 [${_name}] 重复` };
            } else {
              const _ret = await Goods.update(goods, { where: { id } });
              const _affectedCount = _ret[0];
              if (_affectedCount == 0) {
                _result = { succeed: 0, code: 102, description: '记录不存在' };
              } else {
                // 更新图片集与商品记录
                await _bulkCreateGoodsAttachments(id, goods.goodsAttachments);
                await _bulkCreateProducts(id, goods, goods.products);
                await _bulkCreateGoodsGrades(id, goods.gradePrice);
                _result = {
                  succeed: 1,
                  code: 200,
                  description: '成功',
                  data: { ...goods, id },
                };
              }
            }
          }
        } else {
          const _ret = await Goods.update(goods, { where: { id } });
          const _affectedCount = _ret[0];
          if (_affectedCount == 0) {
            _result = { succeed: 0, code: 102, description: '记录不存在' };
          } else {
            // 更新图片集与商品记录
            await _bulkCreateGoodsAttachments(id, goods.goodsAttachments);
            await _bulkCreateProducts(id, goods, goods.products);
            await _bulkCreateGoodsGrades(id, goods.gradePrice);
            _result = {
              succeed: 1,
              code: 200,
              description: '成功',
              data: { ...goods, id },
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
      const _goods = await Goods.findOne({
        include: [
          {
            model: Attachment,
            attributes: ['id', 'path'],
            as: 'attachment',
            require: false,
          },
          {
            model: GoodsAttachment,
            attributes: GoodsAttachment.getAttributes(),
            as: 'goodsAttachments',
            include: [
              {
                model: Attachment,
                as: 'attachment',
                attributes: ['id', 'path'],
                require: false,
              },
            ],
            require: false,
          },
          {
            model: GoodsCat,
            attributes: ['id', 'name'],
            as: 'goodsCat',
            require: false,
          },
          {
            model: GoodsType,
            attributes: ['id', 'name'],
            as: 'goodsType',
            require: false,
          },
          {
            model: Brand,
            attributes: ['id', 'name'],
            as: 'brand',
            require: false,
          },
          {
            model: Product,
            attributes: Product.getAttributes(),
            as: 'products',
            include: [
              {
                model: Attachment,
                as: 'attachment',
                attributes: ['id', 'path'],
                require: false,
              },
            ],
            require: false,
          },
          {
            model: GoodsGrade,
            attributes: GoodsGrade.getAttributes(),
            as: 'goodsGrades',
            require: false,
          },
        ],
        where: { id },
      });
      if (_goods) {
        _result = {
          succeed: 1,
          code: 200,
          description: '成功',
          data: _goods,
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
        const _goods = await Goods.findAndCountAll({
          include: [
            {
              model: Attachment,
              attributes: ['id', 'path'],
              as: 'attachment',
              require: false,
            },
            {
              model: GoodsCat,
              attributes: ['id', 'name'],
              as: 'goodsCat',
              require: false,
            },
            {
              model: GoodsType,
              attributes: ['id', 'name'],
              as: 'goodsType',
              require: false,
            },
            {
              model: Brand,
              attributes: ['id', 'name'],
              as: 'brand',
              require: false,
            },
          ],
          distinct: true,
          where: _where,
          offset,
          limit,
        });
        for (const __goods of _goods.rows) {
          _datas.push(__goods);
        }
        _result = {
          succeed: 1,
          code: 200,
          description: '成功',
          data: { list: _datas, count: _goods.count },
        };
      } else {
        const _goods = await Goods.findAll({
          include: [
            {
              model: Attachment,
              attributes: ['id', 'path'],
              as: 'attachment',
              require: false,
            },
            {
              model: GoodsCat,
              attributes: ['id', 'name'],
              as: 'goodsCat',
              require: false,
            },
            {
              model: GoodsType,
              attributes: ['id', 'name'],
              as: 'goodsType',
              require: false,
            },
            {
              model: Brand,
              attributes: ['id', 'name'],
              as: 'brand',
              require: false,
            },
          ],
          where: _where,
        });
        for (const __goods of _goods) {
          _datas.push(__goods);
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
   * 商品列表页统计商品相关
   * @param {过滤条件} baseFilter
   */
  async getStatistics (baseFilter = {}) {
    let _result = {
      succeed: 0,
      code: 0,
      description: '未知错误',
      data: null,
    };
    try {
      const _total = await Goods.count({ where: baseFilter });

      baseFilter.marketable = this.MARKETABLE_UP;
      const _totalMarketableUp = await Goods.count({ where: baseFilter });

      baseFilter.marketable = this.MARKETABLE_DOWN;
      const _totalMarketableDown = await Goods.count({ where: baseFilter });
      // 警戒库存
      let _goodsStockWarn = 10;
      _result = await setting.get('goods_stocks_warn');
      if (_result.succeed == 1 && _result.code == 200) {
        _goodsStockWarn = _result.data;
      }
      const _totalWarn = await Product.findAll({
        attributes: ['goodsId', [Sequelize.literal('COUNT(id)'), 'count']],
        where: Sequelize.literal(`(stock - freeze_stock) < ${_goodsStockWarn}`),
        group: 'goodsId',
        raw: true,
      });

      Object.assign(_result, {
        succeed: 1,
        code: 200,
        description: '成功',
        data: {
          totalGoods: _total,
          totalMarketableUp: _totalMarketableUp,
          totalMarketableDown: _totalMarketableDown,
          totalWarn: _totalWarn,
        },
      });
    } catch (err) {
      logger.error(err);
      Object.assign(_result, { code: 500, description: err.message || err.stack || '系统错误' });
    }

    return _result;
  }

  /**
   * 库存改变机制
   * 商品下单:          总库存不变,冻结库存加1
   * 商品发货:          冻结库存减1,总库存减1
   * 商品退款 &取消订单: 总库存不变,冻结库存减1
   * 商品退货:          总库存加1,冻结库存不变
   * 可销售库存:        总库存-冻结库存
   * @param {商品Id} productId
   * @param {类型} type
   * @param {数量} num
   */
  async changeStock (productId, type, num) {
    let _result = {
      succeed: 0,
      code: 0,
      description: '未知错误',
      data: null,
    };
    try {
      let _ret = null;
      const _product = await Product.findOne({ where: { id: productId } });
      const _where = sequelize.literal(`id = ${productId} and (stock - freeze_stock) - ${num} > 0`);
      if (_product) {
        switch (type) {
        case 'order': // 下单
          await Goods.update(
            { buyCount: sequelize.literal(`\`buy_count\` + ${num}`) },
            { where: { id: _product.goodsId } },
          );
          _ret = await Product.update(
            { freezeStock: sequelize.literal(`\`freeze_stock\` + ${num}`) },
            { where: _where },
          );
          break;
        case 'send': // 发货
          _ret = await Product.update(
            { stock: sequelize.literal(`\`stock\` - ${num}`) },
            { where: _where },
          );
          const _affectedCount = _ret[0];
          if (_affectedCount == 0) {
            _result = { succeed: 0, code: 102, description: '库存更新失败' };
          } else {
            await Product.update(
              { freezeStock: sequelize.literal(`\`freeze_stock\` - ${num}`) },
              { where: _where },
            );
          }
          break;
        case 'refund': // 退款
          await Goods.update(
            { buyCount: sequelize.literal(`buy_count - ${num}`) },
            { where: { id: _product.goodsId } },
          );
          _ret = await Product.update(
            { freezeStock: sequelize.literal(`freeze_stock - ${num}`) },
            { where: _where },
          );
          break;
        case 'return': // 退货
          await Goods.update(
            { buyCount: sequelize.literal(`buy_count - ${num}`) },
            { where: { id: _product.goodsId } },
          );
          _ret = await Product.update(
            { stock: sequelize.literal(`stock + ${num}`) },
            { where: _where },
          );
          break;
        case 'cancel': // 取消订单
          await Goods.update(
            { buyCount: sequelize.literal(`buy_count - ${num}`) },
            { where: { id: _product.goodsId } },
          );
          _ret = await Product.update(
            { freezeStock: sequelize.literal(`freeze_stock - ${num}`) },
            { where: _where },
          );
          break;
        default:
        }
      }
      if (_ret) {
        const _affectedCount = _ret[0];
        if (_affectedCount == 0) {
          _result = { succeed: 0, code: 102, description: '库存更新失败' };
        } else {
          _result = { succeed: 1, code: 200, description: '成功' };
        }
      } else {
        _result = { succeed: 0, code: 102, description: '库存更新失败' };
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
      this._instance = new GoodsRepos();
    }
    return this._instance;
  }
}

export default GoodsRepos.getInstance();
