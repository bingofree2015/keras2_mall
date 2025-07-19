const base = require('../base');

module.exports = (sequelize, DataTypes) => {
  const Goods = base(
    sequelize,
    DataTypes,
    'Goods',
    {
      // 属性对象
      bn: {
        type: DataTypes.STRING(30),
        allowNull: true,
        comment: '商品编码',
      },
      name: {
        type: DataTypes.STRING(200),
        allowNull: true,
        comment: '商品名称',
      },
      brief: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '商品简介',
      },
      price: {
        type: DataTypes.DECIMAL,
        allowNull: true,
        comment: '商品价格',
      },
      costPrice: {
        type: DataTypes.DECIMAL,
        field: 'cost_price',
        allowNull: true,
        comment: '成本价',
      },
      mktPrice: {
        type: DataTypes.DECIMAL,
        field: 'mkt_price',
        allowNull: true,
        comment: '市场价',
      },
      attachmentId: {
        type: DataTypes.INTEGER,
        field: 'attachment_id',
        allowNull: true,
        comment: '默认图片 图片id',
      },
      goodsCatId: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        field: 'goods_cat_id',
        allowNull: true,
        comment: '商品分类ID',
      },
      goodsTypeId: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        field: 'goods_type_id',
        allowNull: true,
        comment: '商品类别ID',
      },
      brandId: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        field: 'brand_id',
        allowNull: true,
        comment: '品牌ID',
      },
      isNomalVirtual: {
        type: DataTypes.BOOLEAN,
        field: 'is_nomal_virtual',
        allowNull: true,
        defaultValue: true,
        comment: '虚拟正常商品 true 正常 false 虚拟',
      },
      marketable: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true,
        comment: '上架标志 true:上架; false:下架',
      },
      stock: {
        type: DataTypes.INTEGER(8).UNSIGNED,
        allowNull: true,
        defaultValue: '0',
        comment: '库存',
      },
      freezeStock: {
        type: DataTypes.INTEGER(8).UNSIGNED,
        field: 'freeze_stock',
        allowNull: true,
        defaultValue: '0',
        comment: '冻结库存',
      },
      weight: {
        type: DataTypes.DECIMAL,
        allowNull: true,
        comment: '重量',
      },
      unit: {
        type: DataTypes.STRING(20),
        allowNull: true,
        comment: '商品单位',
      },
      intro: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: '商品详情',
      },
      specs: {
        type: DataTypes.JSON(),
        allowNull: true,
        comment: '商品规格序列化',
      },
      params: {
        type: DataTypes.JSON(),
        allowNull: true,
        comment: '参数序列化',
      },
      commentCount: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        field: 'comment_count',
        allowNull: true,
        defaultValue: '0',
        comment: '评论次数',
      },
      viewCount: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        field: 'view_count',
        allowNull: true,
        defaultValue: '0',
        comment: '浏览次数',
      },
      buyCount: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        field: 'buy_count',
        allowNull: true,
        defaultValue: '0',
        comment: '购买次数',
      },
      upTime: {
        type: DataTypes.DATE(),
        field: 'up_time',
        allowNull: true,
        comment: '上架时间',
      },
      downTime: {
        type: DataTypes.DATE(),
        field: 'down_time',
        allowNull: true,
        comment: '下架时间',
      },
      sort: {
        type: DataTypes.INTEGER(5).UNSIGNED,
        allowNull: true,
        defaultValue: '100',
        comment: '商品排序 越小越靠前',
      },
      isRecommend: {
        type: DataTypes.BOOLEAN,
        field: 'is_recommend',
        allowNull: true,
        defaultValue: false,
        comment: '是否推荐 true:是; false:不是推荐',
      },
      isHot: {
        type: DataTypes.BOOLEAN,
        field: 'is_hot',
        allowNull: true,
        defaultValue: false,
        comment: '是否热门 true:是; false:否',
      },
      labelIds: {
        type: DataTypes.STRING(120),
        field: 'label_ids',
        allowNull: true,
        comment: '标签id逗号分隔-对应标签表',
      },
      newSpec: {
        type: DataTypes.TEXT,
        field: 'new_spec',
        allowNull: true,
        comment: '自定义规格名称',
      },
    },
    { hideDefaultArribute: false, comment: '商品表' },
  );

  Goods.associate = (models) => {
    Goods.belongsTo(models.Attachment, {
      foreignKey: 'attachmentId',
      constraints: false,
      as: 'attachment',
    });
    Goods.belongsTo(models.GoodsCat, {
      foreignKey: 'goodsCatId',
      constraints: false,
      as: 'goodsCat',
    });
    Goods.belongsTo(models.GoodsType, {
      foreignKey: 'goodsTypeId',
      constraints: false,
      as: 'goodsType',
    });
    Goods.belongsTo(models.Brand, { foreignKey: 'brandId', constraints: false, as: 'brand' });
    Goods.hasMany(models.GoodsAttachment, {
      foreignKey: 'goodsId',
      constraints: false,
      as: 'goodsAttachments',
    });
    Goods.hasMany(models.Product, { foreignKey: 'goodsId', constraints: false, as: 'products' });
    Goods.hasMany(models.GoodsGrade, {
      foreignKey: 'goodsId',
      constraints: false,
      as: 'goodsGrades',
    });
  };

  return Goods;
};
