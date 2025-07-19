const base = require('../base');

module.exports = (sequelize, DataTypes) => {
    const GoodsSpecValue = base(
        sequelize,
        DataTypes,
        'GoodsSpecValue',
        {
            // 属性对象
            specId: {
                type      : DataTypes.INTEGER(10).UNSIGNED,
                field     : 'spec_id',
                allowNull : true,
                comment   : '属性ID 关联goods_spec.id',
            },
            value: {
                type      : DataTypes.STRING(50),
                allowNull : true,
                comment   : '属性值',
            },
            sort: {
                type         : DataTypes.INTEGER(5).UNSIGNED,
                allowNull    : true,
                defaultValue : '0',
                comment      : '排序 越小越靠前',
            },
        },
        {
            hideDefaultArribute : false,
            comment             : '商品类型属性值表',
        },
    );

    GoodsSpecValue.associate = (models) => {};

    return GoodsSpecValue;
};
