const base = require('../base');

module.exports = (sequelize, DataTypes) => {
    const GoodsSpec = base(
        sequelize,
        DataTypes,
        'GoodsSpec',
        {
            // 属性对象
            name: {
                type      : DataTypes.STRING(30),
                allowNull : true,
                comment   : '商品类型属性名称',
            },
            sort: {
                type         : DataTypes.INTEGER(5).UNSIGNED,
                allowNull    : true,
                defaultValue : '0',
                comment      : '商品类型属性排序 越小越靠前',
            },
        },
        {
            hideDefaultArribute : false,
            comment             : '商品类型属性表',
        },
    );

    GoodsSpec.associate = (models) => {
        GoodsSpec.hasMany(models.GoodsSpecValue, {
            foreignKey  : 'specId',
            constraints : false,
            as          : 'goodsSpecValues',
        });
        GoodsSpec.belongsToMany(models.GoodsType, {
            through     : models.GoodsTypeSpec,
            constraints : false,
            as          : 'types',
        });
    };

    return GoodsSpec;
};
