const base = require('../base');

module.exports = (sequelize, DataTypes) => {
  const AdvertPosition = base(
    sequelize,
    DataTypes,
    'AdvertPosition',
    {
      // 属性对象
      name: {
        type: DataTypes.STRING(120),
        allowNull: true,
        comment: '幻灯片名称',
      },
      code: {
        type: DataTypes.STRING(32),
        allowNull: true,
        comment: '广告位置编码',
      },
      state: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true,
        comment: '1 启用  2禁用',
      },
      sort: {
        type: DataTypes.INTEGER(3).UNSIGNED,
        allowNull: true,
        defaultValue: '0',
        comment: '排序',
      },
    },
    { hideDefaultArribute: false, comment: '广告位置表' },
  );

  AdvertPosition.associate = (models) => {};

  return AdvertPosition;
};
