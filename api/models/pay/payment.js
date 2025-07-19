const base = require('../base');

module.exports = (sequelize, DataTypes) => {
  const Payment = base(
    sequelize,
    DataTypes,
    'Payment',
    {
      // 属性对象
      code: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: '支付类型编码',
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: '支付类型名称',
      },
      isOnline: {
        type: DataTypes.BOOLEAN,
        field: 'is_online',
        allowNull: true,
        defaultValue: true,
        comment: '是否线上支付 true:线上支付 false:线下支付',
      },
      params: {
        type: DataTypes.JSON,
        allowNull: false,
        comment: '参数',
      },
      sort: {
        type: DataTypes.INTEGER(5).UNSIGNED,
        allowNull: false,
        defaultValue: '100',
        comment: '排序',
      },
      memo: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: '支付方式描述',
      },
      state: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: '启用状态 true:启用 false:停用',
      },
    },
    { hideDefaultArribute: false, comment: '支付方式表' },
  );

  Payment.associate = (models) => {};

  return Payment;
};
