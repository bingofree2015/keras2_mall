const base = require('../base');

module.exports = (sequelize, DataTypes) => {
  const Balance = base(
    sequelize,
    DataTypes,
    'Balance',
    {
      // 属性对象
      userId: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        field: 'user_id',
        allowNull: false,
        comment: '用户id',
      },
      type: {
        type: DataTypes.INTEGER(2).UNSIGNED,
        allowNull: false,
        comment: '类型',
      },
      money: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        comment: '金额',
      },
      balance: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        comment: '余额',
      },
      sourceId: {
        type: DataTypes.STRING(20),
        field: 'source_id',
        allowNull: false,
        comment: '资源id',
      },
      memo: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: '描述',
      },
    },
    { hideDefaultArribute: false, comment: '用户余额表' },
  );

  Balance.associate = (models) => {
    Balance.belongsTo(models.User, { foreignKey: 'userId', constraints: false, as: 'user' });
  };

  return Balance;
};
