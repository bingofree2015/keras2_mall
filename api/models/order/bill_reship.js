const base = require('../base');

module.exports = (sequelize, DataTypes) => {
  const BillReship = base(
    sequelize,
    DataTypes,
    'BillReship',
    {
      id: {
        // 自增ID
        type: DataTypes.BIGINT,
        autoIncrement: true,
        unique: true,
      },
      // 属性对象
      reshipId: {
        type: DataTypes.STRING(20),
        field: 'reship_id',
        allowNull: false,
        primaryKey: true,
        comment: '',
      },
      orderId: {
        type: DataTypes.STRING(20),
        field: 'order_id',
        allowNull: false,
        comment: '订单ID 关联order.id',
      },
      afterSaleId: {
        type: DataTypes.STRING(20),
        field: 'after_sale_id',
        allowNull: false,
        comment: '售后单id',
      },
      userId: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        field: 'user_id',
        allowNull: true,
        comment: '用户ID 关联user.id',
      },
      logiCode: {
        type: DataTypes.STRING(50),
        field: 'logi_code',
        allowNull: true,
        comment: '物流公司编码',
      },
      logiNo: {
        type: DataTypes.STRING(50),
        field: 'logi_no',
        allowNull: true,
        comment: '物流单号',
      },
      status: {
        type: DataTypes.INTEGER(1).UNSIGNED,
        allowNull: true,
        defaultValue: '1',
        comment: '状态 1=审核通过待发货 2=已发退货 3=已收退货',
      },
      memo: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '备注',
      },
    },
    { hideDefaultArribute: false, comment: '退货单表' },
  );

  BillReship.associate = (models) => {
    BillReship.belongsTo(models.User, { foreignKey: 'userId', constraints: false, as: 'user' });
    BillReship.belongsTo(models.Logistics, {
      foreignKey: 'logiCode',
      targetKey: 'logiCode',
      constraints: false,
      as: 'logistics',
    });
    BillReship.hasMany(models.BillReshipItem, {
      foreignKey: 'reshipId',
      constraints: false,
      as: 'billReshipItems',
    });
  };

  return BillReship;
};
