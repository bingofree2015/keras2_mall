const base = require('../base');

module.exports = (sequelize, DataTypes) => {
  const UserGrade = base(
    sequelize,
    DataTypes,
    'UserGrade',
    {
      level: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        comment: '编号',
      },
      // 名称
      name: {
        type: DataTypes.STRING(60),
        allowNull: false,
        comment: '名称',
      },
      isDef: {
        type: DataTypes.BOOLEAN,
        field: 'is_def',
        allowNull: false,
        defaultValue: false,
        comment: 'true:默认;false:不默认',
      },
    },
    { hideDefaultArribute: false, comment: '用户等级表' },
  );

  UserGrade.associate = (models) => {};

  return UserGrade;
};
