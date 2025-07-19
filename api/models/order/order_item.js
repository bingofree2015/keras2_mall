const base = require('../base');

module.exports = (sequelize, DataTypes) => {
  const OrderItem = base(
    sequelize,
    DataTypes,
    'OrderItem',
    {
      // 属性对象
      orderId: {
        type: DataTypes.STRING(20),
        field: 'order_id',
        allowNull: false,
        comment: '订单ID 关联order.id',
      },
      goodsId: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        field: 'goods_id',
        allowNull: true,
        comment: '商品ID 关联goods.id',
      },
      productId: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        field: 'product_id',
        allowNull: true,
        comment: '货品ID 关联products.id',
      },
      sn: {
        type: DataTypes.STRING(30),
        allowNull: true,
        comment: '货品编码',
      },
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
      price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        defaultValue: '0.00',
        comment: '货品价格单价',
      },
      costPrice: {
        type: DataTypes.DECIMAL,
        field: 'cost_price',
        allowNull: true,
        defaultValue: '0.00',
        comment: '货品成本价单价',
      },
      mktPrice: {
        type: DataTypes.DECIMAL,
        field: 'mkt_price',
        allowNull: false,
        defaultValue: '0.00',
        comment: '市场价',
      },
      imageUrl: {
        type: DataTypes.STRING(100),
        field: 'image_url',
        allowNull: false,
        comment: '图片',
      },
      num: {
        type: DataTypes.INTEGER(5).UNSIGNED,
        allowNull: true,
        comment: '数量',
      },
      amount: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        defaultValue: '0.00',
        comment: '总价',
      },
      promotionAmount: {
        type: DataTypes.DECIMAL,
        field: 'promotion_amount',
        allowNull: false,
        defaultValue: '0.00',
        comment: '商品优惠总金额',
      },
      promotionList: {
        type: DataTypes.STRING(255),
        field: 'promotion_list',
        allowNull: false,
        comment: '促销信息',
      },
      weight: {
        type: DataTypes.DECIMAL,
        allowNull: true,
        comment: '总重量',
      },
      sendNum: {
        type: DataTypes.INTEGER(5).UNSIGNED,
        field: 'send_num',
        allowNull: true,
        comment: '发货数量',
      },
      specs: {
        type: DataTypes.STRING(1024),
        allowNull: true,
        comment: '货品规格序列化',
      },
    },
    { hideDefaultArribute: false, comment: '订单明细表' },
  );

  OrderItem.associate = (models) => {
    OrderItem.belongsTo(models.Order, { foreignKey: 'orderId', constraints: false, as: 'order' });
  };

  return OrderItem;
};
