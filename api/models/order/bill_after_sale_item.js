const base = require('../base');

module.exports = (sequelize, DataTypes) => {
  const BillAfterSaleItem = base(
    sequelize,
    DataTypes,
    'BillAfterSaleItem',
    {
      // 属性对象
      afterSaleId: {
        type: DataTypes.STRING(20),
        field: 'after_sale_id',
        allowNull: false,
        comment: '售后单id',
      },
      orderItemId: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        field: 'order_item_id',
        allowNull: true,
        comment: '订单明细ID 关联order_items.id',
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
      imageUrl: {
        type: DataTypes.STRING(100),
        field: 'image_url',
        allowNull: false,
        comment: '图片',
      },
      num: {
        type: DataTypes.INTEGER(5).UNSIGNED,
        allowNull: true,
        defaultValue: '1',
        comment: '数量',
      },
      specs: {
        type: DataTypes.STRING(1024),
        allowNull: true,
        comment: '货品规格序列化',
      },
    },
    { hideDefaultArribute: false, comment: '售后单明细表' },
  );

  BillAfterSaleItem.associate = (models) => {};

  return BillAfterSaleItem;
};
