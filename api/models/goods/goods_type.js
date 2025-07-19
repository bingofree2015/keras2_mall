const base = require('../base');

module.exports = (sequelize, DataTypes) => {
  const GoodsType = base(
    sequelize,
    DataTypes,
    'GoodsType',
    {
      // 属性对象
      name: {
        type: DataTypes.STRING(20),
        allowNull: true,
        comment: '类型名称',
      },
      paramsJson: {
        type: DataTypes.TEXT,
        field: 'params_json',
        allowNull: true,
        comment: '参数序列号存储 array(参数组名=>array("参数1","参数二"))',
      },
    },
    { hideDefaultArribute: false, comment: '商品类型' },
  );

  GoodsType.associate = (models) => {
    GoodsType.belongsToMany(models.GoodsSpec, {
      through: models.GoodsTypeSpec,
      foreignKey: 'goodsTypeId',
      otherKey: 'goodsSpecId',
      constraints: false,
      as: 'specs',
    });
    GoodsType.belongsToMany(models.GoodsParam, {
      through: models.GoodsTypeParam,
      foreignKey: 'goodsTypeId',
      otherKey: 'goodsParamId',
      constraints: false,
      as: 'params',
    });
  };

  return GoodsType;
};
