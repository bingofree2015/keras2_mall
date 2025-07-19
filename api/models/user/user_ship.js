const base = require('../base');

module.exports = (sequelize, DataTypes) => {
  const UserShip = base(
    sequelize,
    DataTypes,
    'UserShip',
    {
      // 属性对象
      userId: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        field: 'user_id',
        allowNull: true,
        comment: '用户id 关联user.id',
      },
      areaId: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        field: 'area_id',
        allowNull: true,
        comment: '收货地区ID',
      },
      address: {
        type: DataTypes.STRING(200),
        allowNull: true,
        comment: '收货详细地址',
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: '收货人姓名',
      },
      mobile: {
        type: DataTypes.CHAR(15),
        allowNull: true,
        comment: '收货电话',
      },
      isDef: {
        type: DataTypes.BOOLEAN,
        field: 'is_def',
        allowNull: true,
        comment: '是否默认 1=默认 2=不默认',
      },
    },
    { hideDefaultArribute: false, comment: '插件表' },
  );

  UserShip.associate = (models) => {};

  return UserShip;
};
