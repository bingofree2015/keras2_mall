const base = require('../base');

module.exports = (sequelize, DataTypes) => {
  const Operation = base(
    sequelize,
    DataTypes,
    'Operation',
    {
      // 属性对象
      parentId: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        field: 'parent_id',
        allowNull: false,
        comment: '父ID',
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: '操作名称',
      },
      code: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: '操作编码',
      },
      type: {
        type: DataTypes.ENUM('m', 'c', 'a'),
        allowNull: false,
        defaultValue: 'a',
        comment: '类型',
      },
      parentMenuId: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        field: 'parent_menu_id',
        allowNull: false,
        comment: '菜单id',
      },
      permType: {
        type: DataTypes.INTEGER(1).UNSIGNED,
        field: 'perm_type',
        allowNull: false,
        defaultValue: '3',
        comment:
          '权限许可类型，如果为1就是主体权限，， 如果为2就是半主体权限，在左侧菜单不显示，但是在权限菜单上有体现，如果为3就是关联权限',
      },
      sort: {
        type: DataTypes.INTEGER(5).UNSIGNED,
        allowNull: true,
        defaultValue: '100',
        comment: '操作排序 越小越靠前',
      },
    },
    { hideDefaultArribute: false, comment: '权限表' },
  );

  Operation.associate = (models) => {};

  return Operation;
};
