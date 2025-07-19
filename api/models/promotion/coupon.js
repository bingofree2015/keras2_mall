const base = require('../base');

module.exports = (sequelize, DataTypes) => {
  const Coupon = base(
    sequelize,
    DataTypes,
    'Coupon',
    {
      // 属性对象
      couponCode: {
        type: DataTypes.STRING(20),
        field: 'coupon_code',
        allowNull: false,
        primaryKey: true,
        comment: '优惠券编码',
      },
      promotionId: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        field: 'promotion_id',
        allowNull: false,
        comment: '优惠券id',
      },
      isUsed: {
        type: DataTypes.BOOLEAN,
        field: 'is_used',
        allowNull: false,
        defaultValue: false,
        comment: '是否使用1未使用，2已使用',
      },
      userId: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        field: 'user_id',
        allowNull: true,
        comment: '谁领取了',
      },
      usedId: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        field: 'used_id',
        allowNull: true,
        comment: '被谁用了',
      },
    },
    { hideDefaultArribute: false, comment: '优惠券表' },
  );

  Coupon.associate = (models) => {
    Coupon.belongsTo(models.Promotion, {
      foreignKey: 'promotionId',
      constraints: false,
      as: 'promotion',
    });

    Coupon.belongsTo(models.User, { foreignKey: 'userId', constraints: false, as: 'recipients' });
    Coupon.belongsTo(models.User, { foreignKey: 'usedId', constraints: false, as: 'user' });
  };

  return Coupon;
};
