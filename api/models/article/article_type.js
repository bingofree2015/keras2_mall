const base = require('../base');

module.exports = (sequelize, DataTypes) => {
  const ArticleType = base(
    sequelize,
    DataTypes,
    'ArticleType',
    {
      // 属性对象
      pid: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        comment: '父id',
      },
      typeName: {
        type: DataTypes.STRING(32),
        field: 'type_name',
        allowNull: true,
        comment: '分类名称',
      },
    },
    { hideDefaultArribute: false, comment: '文章分类表' },
  );

  ArticleType.associate = (models) => {};

  return ArticleType;
};
