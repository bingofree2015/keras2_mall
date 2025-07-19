const base = require('../base');

module.exports = (sequelize, DataTypes) => {
  const Brand = base(
    sequelize,
    DataTypes,
    'Brand',
    {
      // 属性对象
      name: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: '品牌名称',
      },
      attachmentId: {
        type: DataTypes.INTEGER,
        field: 'attachment_id',
        allowNull: true,
        comment: '品牌LOGO 图片ID',
      },
      sort: {
        type: DataTypes.INTEGER(5).UNSIGNED,
        allowNull: true,
        defaultValue: '0',
        comment: '品牌排序 越小越靠前',
      },
    },
    { hideDefaultArribute: false, comment: '品牌表' },
  );

  Brand.associate = (models) => {
    Brand.belongsTo(models.Attachment, {
      foreignKey: 'attachmentId',
      constraints: false,
      as: 'attachment',
    });
  };

  return Brand;
};
