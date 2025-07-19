const base = require('../base');

module.exports = (sequelize, DataTypes) => {
  const SpRule = base(
    sequelize,
    DataTypes,
    'SpRule',
    {
      // 属性对象
      promotionId: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        field: 'promotion_id',
        allowNull: true,
        comment: '促销ID',
      },
      code: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: '促销条件编码',
      },
      name: {
        type: DataTypes.STRING(120),
        allowNull: true,
        comment: '促销条件名称',
      },
      pattern: {
        type: DataTypes.JSON(),
        allowNull: true,
        comment: '支付配置参数序列号存储',
      },
    },
    { hideDefaultArribute: false, comment: '促销结果表' },
  );

  SpRule.associate = (models) => {};

  return SpRule;
};
