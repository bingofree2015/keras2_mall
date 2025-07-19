const base = require('../base');

module.exports = (sequelize, DataTypes) => {
  const WeixinMenu = base(
    sequelize,
    DataTypes,
    'WeixinMenu',
    {
      // 属性对象
      menuId: {
        type: DataTypes.INTEGER(10),
        field: 'menu_id',
        allowNull: false,
        comment: '菜单id',
      },
      pid: {
        type: DataTypes.INTEGER(10),
        allowNull: false,
        defaultValue: '0',
        comment: '父级菜单',
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: '菜单名称',
      },
      type: {
        type: DataTypes.STRING(11),
        allowNull: false,
        comment: '菜单类型',
      },
      params: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: '菜单参数',
      },
    },
    { hideDefaultArribute: false, comment: '微信公众号菜单表' },
  );

  WeixinMenu.associate = (models) => {};

  return WeixinMenu;
};
