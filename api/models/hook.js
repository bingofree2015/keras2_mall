const base = require('./base');

module.exports = (sequelize, DataTypes) => {
  const Hook = base(
    sequelize,
    DataTypes,
    'Hook',
    {
      // 属性对象
      name: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: '钩子名称',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: '钩子描述',
      },
      type: {
        type: DataTypes.INTEGER(1),
        allowNull: true,
        defaultValue: '1',
        comment: '钩子类型,1是控制器，2是视图',
      },
      addon: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: '钩子挂载的插件，逗号分隔',
      },
    },
    { hideDefaultArribute: false, comment: '钩子表' },
  );

  Hook.associate = (models) => {};

  return Hook;
};
