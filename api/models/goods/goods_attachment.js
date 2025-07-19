const base = require('../base');

module.exports = (sequelize, DataTypes) => {
  const GoodsAttachment = base(
    sequelize,
    DataTypes,
    'GoodsAttachment',
    {
      // 属性对象
      goodsId: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        field: 'goods_id',
        allowNull: false,
        comment: '商品ID',
      },
      attachmentId: {
        type: DataTypes.INTEGER,
        field: 'attachment_id',
        allowNull: false,
        comment: '图片ID',
      },
      sort: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
        defaultValue: '100',
        comment: '图片排序',
      },
    },
    { hideDefaultArribute: false, comment: '商品图片关联表' },
  );

  GoodsAttachment.associate = (models) => {
    GoodsAttachment.belongsTo(models.Attachment, {
      foreignKey: 'attachmentId',
      constraints: false,
      as: 'attachment',
    });
  };

  return GoodsAttachment;
};
