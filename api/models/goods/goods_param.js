const base = require('../base');

module.exports = (sequelize, DataTypes) => {
  const GoodsParam = base(
    sequelize,
    DataTypes,
    'GoodsParam',
    {
      // 属性对象
      name: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: '参数名称',
      },
      values: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: '参数值',
      },
      type: {
        type: DataTypes.STRING(10),
        allowNull: true,
        comment: '参数类型，text文本框，radio单选，checkbox复选框',
      },
    },
    { hideDefaultArribute: false, comment: '商品参数表' },
  );

  GoodsParam.associate = (models) => {
    GoodsParam.belongsToMany(models.GoodsType, {
      through: models.GoodsTypeParam,
      constraints: false,
      as: 'types',
    });
  };

  return GoodsParam;
};
