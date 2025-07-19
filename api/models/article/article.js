const base = require('../base');

module.exports = (sequelize, DataTypes) => {
  const Article = base(
    sequelize,
    DataTypes,
    'Article',
    {
      // 属性对象
      title: {
        type: DataTypes.STRING(200),
        allowNull: true,
        comment: '文章标题',
      },
      attachmentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '文章封面图',
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: '文章内容',
      },
      typeId: {
        type: DataTypes.INTEGER(11).UNSIGNED,
        field: 'type_id',
        allowNull: true,
        comment: '文章分类id',
      },
      sort: {
        type: DataTypes.INTEGER(5).UNSIGNED,
        allowNull: true,
        defaultValue: '100',
        comment: '文章排序  从小到大',
      },
      isPub: {
        type: DataTypes.INTEGER(1).UNSIGNED,
        field: 'is_pub',
        allowNull: true,
        comment: '1 发布  2 不发布',
      },
    },
    { hideDefaultArribute: false, comment: '文章表' },
  );

  Article.associate = (models) => {
    Article.belongsTo(models.ArticleType, {
      foreignKey: 'typeId',
      constraints: false,
      as: 'articleType',
    });
    Article.belongsTo(models.Attachment, {
      foreignKey: 'attachmentId',
      constraints: false,
      as: 'attachment',
    });
  };

  return Article;
};
