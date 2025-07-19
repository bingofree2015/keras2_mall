const base = require('../base');

module.exports = (sequelize, DataTypes) => {
    const GoodsBrowsing = base(
        sequelize,
        DataTypes,
        'GoodsBrowsing',
        {
            // 属性对象
            goodsId: {
                type      : DataTypes.INTEGER(10).UNSIGNED,
                field     : 'goods_id',
                allowNull : true,
                comment   : '商品id 关联goods.id',
            },
            userId: {
                type      : DataTypes.INTEGER(10).UNSIGNED,
                field     : 'user_id',
                allowNull : false,
                comment   : '用户id',
            },
            goodsName: {
                type      : DataTypes.STRING(200),
                field     : 'goods_name',
                allowNull : false,
                comment   : '商品名称',
            },
        },
        {
            hideDefaultArribute : false,
            comment             : '商品浏览记录表',
        },
    );

    GoodsBrowsing.associate = (models) => {};

    return GoodsBrowsing;
};
