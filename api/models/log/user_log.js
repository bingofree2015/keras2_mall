const base = require('../base');

module.exports = (sequelize, DataTypes) => {
  const UserLog = base(
    sequelize,
    DataTypes,
    'UserLog',
    {
      // 属性对象
      userId: {
        type: DataTypes.INTEGER(11).UNSIGNED,
        field: 'user_id',
        allowNull: false,
        comment: '用户id',
      },
      state: {
        type: DataTypes.INTEGER(1),
        allowNull: true,
        comment: '登录 1  退出2,3注册',
      },
      params: {
        type: DataTypes.STRING(200),
        allowNull: true,
        defaultValue: '',
        comment: '参数',
      },
      ip: {
        type: DataTypes.STRING(15),
        allowNull: true,
        comment: 'ip地址',
      },
    },
    { hideDefaultArribute: false, comment: '用户日志表' },
  );

  UserLog.associate = (models) => {};

  return UserLog;
};
