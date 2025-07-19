const base = require('../base');

module.exports = (sequelize, DataTypes) => {
    const GoodsTypeParam = base(
        sequelize,
        DataTypes,
        'GoodsTypeParam',
        {
            // 属性对象
            goodsParamId: {
                type         : DataTypes.INTEGER(10).UNSIGNED,
                field        : 'goods_param_id',
                allowNull    : true,
                defaultValue : '0',
                comment      : '商品参数id',
            },
            goodsTypeId: {
                type         : DataTypes.INTEGER(10).UNSIGNED,
                field        : 'goods_type_id',
                allowNull    : true,
                defaultValue : '0',
                comment      : '商品类型id',
            },
        },
        {
            hideDefaultArribute : false,
            comment             : '商品类型参数表',
        },
    );

    GoodsTypeParam.associate = (models) => {
        GoodsTypeParam.belongsTo(models.GoodsParam, {
            foreignKey  : 'goodsParamId',
            constraints : false,
            as          : 'params',
        });
        GoodsTypeParam.belongsTo(models.GoodsType, {
            foreignKey  : 'goodsTypeId',
            constraints : false,
            as          : 'types',
        });
    };

    return GoodsTypeParam;
};
