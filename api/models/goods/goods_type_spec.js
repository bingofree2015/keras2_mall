const base = require('../base');

module.exports = (sequelize, DataTypes) => {
    const GoodsTypeSpec = base(
        sequelize,
        DataTypes,
        'GoodsTypeSpec',
        {
            // 属性对象
            goodsSpecId: {
                type      : DataTypes.INTEGER(10).UNSIGNED,
                field     : 'goods_spec_id',
                allowNull : false,
                comment   : '属性ID',
            },
            goodsTypeId: {
                type      : DataTypes.INTEGER(10).UNSIGNED,
                field     : 'goods_type_id',
                allowNull : true,
                comment   : '类型ID',
            },
        },
        {
            hideDefaultArribute : false,
            comment             : '商品类型和属性关联表',
        },
    );

    GoodsTypeSpec.associate = (models) => {
        GoodsTypeSpec.belongsTo(models.GoodsSpec, {
            foreignKey  : 'goodsSpecId',
            constraints : false,
            as          : 'specs',
        });
        GoodsTypeSpec.belongsTo(models.GoodsType, {
            foreignKey  : 'goodsTypeId',
            constraints : false,
            as          : 'types',
        });
    };

    return GoodsTypeSpec;
};
