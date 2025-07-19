const base = require('../base');

module.exports = (sequelize, DataTypes) => {
  const UserToken = base(
    sequelize,
    DataTypes,
    'UserToken',
    {
      // 属性对象
      token: {
        type: DataTypes.CHAR(32),
        allowNull: false,
        primaryKey: true,
        comment: '',
      },
      userId: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        field: 'user_id',
        allowNull: false,
        comment: '',
      },
      platform: {
        type: DataTypes.INTEGER(2),
        allowNull: false,
        defaultValue: '1',
        comment: '平台类型，1就是默认，2就是微信小程序',
      },
    },
    { hideDefaultArribute: false, comment: '用户token表' },
  );

  UserToken.associate = (models) => {};

  return UserToken;
};
