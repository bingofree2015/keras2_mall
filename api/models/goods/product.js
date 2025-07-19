const base = require('../base');

module.exports = (sequelize, DataTypes) => {
    const Product = base(
        sequelize,
        DataTypes,
        'Product',
        {
            // 属性对象
            goodsId: {
                type      : DataTypes.INTEGER(10).UNSIGNED,
                field     : 'goods_id',
                allowNull : true,
                comment   : '商品id',
            },
            barcode: {
                type      : DataTypes.STRING(128),
                allowNull : true,
                comment   : '货品条码',
            },
            sn: {
                type      : DataTypes.STRING(30),
                allowNull : true,
                comment   : '商品编码',
            },
            price: {
                type      : DataTypes.DECIMAL,
                allowNull : true,
                comment   : '货品价格',
            },
            costPrice: {
                type      : DataTypes.DECIMAL,
                field     : 'cost_price',
                allowNull : true,
                comment   : '货品成本价',
            },
            mktPrice: {
                type      : DataTypes.DECIMAL,
                field     : 'mkt_price',
                allowNull : true,
                comment   : '货品市场价',
            },
            marketable: {
                type      : DataTypes.INTEGER(1).UNSIGNED,
                allowNull : true,
                comment   : '上架标志 1=上架 2=下架',
            },
            stock: {
                type         : DataTypes.INTEGER(11).UNSIGNED,
                allowNull    : true,
                defaultValue : '0',
                comment      : '库存',
            },
            freezeStock: {
                type         : DataTypes.INTEGER(11).UNSIGNED,
                field        : 'freeze_stock',
                allowNull    : true,
                defaultValue : '0',
                comment      : '冻结库存',
            },
            specs: {
                type      : DataTypes.STRING(1024),
                field     : 'specs',
                allowNull : true,
                comment   : '规格值逗号分隔存储',
            },
            isDefault: {
                type         : DataTypes.BOOLEAN,
                field        : 'is_default',
                allowNull    : true,
                defaultValue : false,
                comment      : '是否默认货品 true:是 false:否',
            },
            attachmentId: {
                type      : DataTypes.INTEGER,
                field     : 'attachment_id',
                allowNull : true,
                comment   : '规格图片ID',
            },
        },
        {
            hideDefaultArribute : false,
            comment             : '货品表',
        },
    );

    Product.associate = (models) => {
        Product.belongsTo(models.Attachment, {
            foreignKey  : 'attachmentId',
            constraints : false,
            as          : 'attachment',
        });
    };

    return Product;
};
