import base from '../base';

export default (sequelize, DataTypes) => {
  const GoodsComment = base(
    sequelize,
    DataTypes,
    'GoodsComment',
    {
      // 属性对象
      commentId: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        field: 'comment_id',
        allowNull: true,
        defaultValue: '0',
        comment: '父级评价ID',
      },
      score: {
        type: DataTypes.INTEGER(1),
        allowNull: true,
        defaultValue: '5',
        comment: '评价1-5星',
      },
      userId: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        field: 'user_id',
        allowNull: false,
        comment: '评价用户ID',
      },
      goodsId: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        field: 'goods_id',
        allowNull: true,
        comment: '商品ID 关联goods.id',
      },
      orderId: {
        type: DataTypes.BIGINT,
        field: 'order_id',
        allowNull: false,
        comment: '评价订单ID',
      },
      specs: {
        type: DataTypes.STRING(1024),
        allowNull: true,
        comment: '货品规格序列化',
      },
      imgUrls: {
        type: DataTypes.STRING(2048),
        field: 'img_urls',
        allowNull: true,
        comment: '评价图片逗号分隔最多五张',
      },
      content: {
        type: DataTypes.STRING(4096),
        allowNull: true,
        comment: '评价内容',
      },
      sellerContent: {
        type: DataTypes.STRING(4096),
        field: 'seller_content',
        allowNull: true,
        comment: '商家回复',
      },
      display: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true,
        comment: '1:显示; 0:不显示',
      },
    },
    { hideDefaultArribute: false, comment: '商品评价表' },
  );

  GoodsComment.associate = (models) => {
    GoodsComment.belongsTo(models.User, {
      foreignKey: 'userId',
      constraints: false,
      as: 'user',
    });
    GoodsComment.belongsTo(models.GoodsComment, {
      foreignKey: 'commentId',
      constraints: false,
      as: 'parent',
    });
    GoodsComment.belongsTo(models.Goods, {
      foreignKey: 'goodsId',
      constraints: false,
      as: 'goods',
    });
    GoodsComment.belongsTo(models.Order, {
      foreignKey: 'orderId',
      constraints: false,
      as: 'order',
    });
  };

  return GoodsComment;
};
