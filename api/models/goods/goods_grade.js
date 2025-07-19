const base = require('../base');

module.exports = (sequelize, DataTypes) => {
  const GoodsGrade = base(
    sequelize,
    DataTypes,
    'GoodsGrade',
    {
      // 属性对象
      goodsId: {
        type: DataTypes.BIGINT,
        field: 'goods_id',
        allowNull: true,
        defaultValue: '0',
        comment: '商品id',
      },
      gradeId: {
        type: DataTypes.INTEGER(2).UNSIGNED,
        field: 'grade_id',
        allowNull: true,
        defaultValue: '1',
        comment: '会员等级id',
      },
      gradePrice: {
        type: DataTypes.DECIMAL,
        field: 'grade_price',
        allowNull: true,
        defaultValue: '0.00',
        comment: '会员价',
      },
    },
    { hideDefaultArribute: false, comment: '商品会员价表' },
  );

  GoodsGrade.associate = (models) => {};

  return GoodsGrade;
};
