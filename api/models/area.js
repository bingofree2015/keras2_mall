const base = require('./base');

module.exports = (sequelize, DataTypes) => {
  const Area = base(
    sequelize,
    DataTypes,
    'Area',
    {
      // 属性对象
      parentId: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        field: 'parent_id',
        allowNull: true,
        defaultValue: 0,
        comment: '父级ID',
      },
      depth: {
        type: DataTypes.INTEGER(1).UNSIGNED,
        allowNull: true,
        defaultValue: 0,
        comment: '地区深度',
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: '地区名称',
      },
      postalCode: {
        type: DataTypes.STRING(10),
        field: 'postal_code',
        allowNull: false,
        defaultValue: '',
        comment: '邮编',
      },
      sort: {
        type: DataTypes.INTEGER(10),
        allowNull: false,
        defaultValue: '100',
        comment: '地区排序',
      },
    },
    { hideDefaultArribute: false, comment: '地区表' },
  );

  Area.associate = (models) => {
    Area.hasMany(Area, { foreignKey: 'parentId', constraints: false, as: 'areas' });
  };

  return Area;
};
