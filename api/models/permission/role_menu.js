const base = require('../base');

module.exports = (sequelize, DataTypes) => {
  const RoleMenu = base(
    sequelize,
    DataTypes,
    'RoleMenu',
    {
      roleId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        field: 'role_id',
        comment: '角色ID',
      },
      menuId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        field: 'menu_id',
        comment: '菜单ID',
      },
      createdBy: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: 'created_by',
        comment: '创建人',
      },
      updatedBy: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: 'updated_by',
        comment: '更新人',
      },
    },
    { hideDefaultArribute: true, comment: '角色菜单' },
  );

  RoleMenu.associate = (models) => {
    RoleMenu.belongsTo(models.Role, { foreignKey: 'roleId', constraints: false, as: 'role' });
    RoleMenu.belongsTo(models.Menu, { foreignKey: 'menuId', constraints: false, as: 'menu' });
  };

  return RoleMenu;
};
