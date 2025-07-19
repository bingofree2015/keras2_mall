const base = require('../base');

module.exports = (sequelize, DataTypes) => {
    const Cart = base(
        sequelize,
        DataTypes,
        'Cart',
        {
            // 属性对象
            userId: {
                type: DataTypes.INTEGER(10).UNSIGNED,
                field: 'user_id',
                allowNull: true,
                comment: '用户ID 关联user.id',
            },
            productId: {
                type: DataTypes.INTEGER(10).UNSIGNED,
                field: 'product_id',
                allowNull: true,
                comment: '货品ID',
            },
            qty: {
                type: DataTypes.INTEGER(5).UNSIGNED,
                allowNull: true,
                defaultValue: '0',
                comment: '货品数量',
            },
            type: {
                type: DataTypes.INTEGER(2).UNSIGNED,
                allowNull: false,
                defaultValue: '1',
                comment: '购物车类型,1普通类型，2拼团类型',
            },
        },
        { hideDefaultArribute: false, comment: '购物车表（每个用户最多加100条信息）' },
    );

    Cart.associate = (models) => {};

    return Cart;
};
