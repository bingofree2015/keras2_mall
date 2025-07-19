const base = require('./base');

module.exports = (sequelize, DataTypes) => {
  const Label = base(
    sequelize,
    DataTypes,
    'Label',
    {
      // 属性对象
      name: {
        type: DataTypes.STRING(20),
        allowNull: true,
        comment: '标签名称',
      },
      style: {
        type: DataTypes.STRING(20),
        allowNull: true,
        defaultValue: 'hot',
        comment: '标签样式',
      },
    },
    { hideDefaultArribute: false, comment: '标签表' },
  );

  Label.associate = (models) => {};

  return Label;
};
