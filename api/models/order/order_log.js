const base = require('../base');

module.exports = (sequelize, DataTypes) => {
  const OrderLog = base(
    sequelize,
    DataTypes,
    'OrderLog',
    {
      // 属性对象
      orderId: {
        type: DataTypes.STRING(20),
        field: 'order_id',
        allowNull: true,
        comment: '订单ID',
      },
      userId: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        field: 'user_id',
        allowNull: true,
        comment: '用户ID',
      },
      type: {
        type: DataTypes.INTEGER(2).UNSIGNED,
        allowNull: true,
        defaultValue: '1',
        comment: '类型',
      },
      msg: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: '描述介绍',
      },
      data: {
        type: DataTypes.STRING(1000),
        allowNull: true,
        comment: '请求的数据json',
      },
    },
    { hideDefaultArribute: false, comment: '订单记录表' },
  );

  OrderLog.associate = (models) => {};

  return OrderLog;
};
