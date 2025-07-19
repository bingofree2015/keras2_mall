const base = require('../base');

module.exports = (sequelize, DataTypes) => {
    const GoodsCat = base(
        sequelize,
        DataTypes,
        'GoodsCat',
        {
            // 属性对象
            parentId: {
                type         : DataTypes.INTEGER(10).UNSIGNED,
                field        : 'parent_id',
                allowNull    : false,
                defaultValue : '0',
                comment      : '上级分类id',
            },
            name: {
                type      : DataTypes.STRING(20),
                allowNull : true,
                comment   : '分类名称',
            },
            typeId: {
                type         : DataTypes.INTEGER(10).UNSIGNED,
                field        : 'type_id',
                allowNull    : true,
                defaultValue : '0',
                comment      : '类型ID 关联 goods_type.id',
            },
            sort: {
                type         : DataTypes.INTEGER(5).UNSIGNED,
                allowNull    : true,
                defaultValue : '100',
                comment      : '分类排序 越小越靠前',
            },
            attachmentId: {
                type      : DataTypes.INTEGER,
                field     : 'attachment_id',
                allowNull : true,
                comment   : '分类图片ID',
            },
        },
        {
            hideDefaultArribute : false,
            comment             : '商品分类',
        },
    );

    GoodsCat.associate = (models) => {
        GoodsCat.belongsTo(models.Attachment, {
            foreignKey  : 'attachmentId',
            constraints : false,
            as          : 'attachment',
        });
        GoodsCat.belongsTo(models.GoodsType, {
            foreignKey  : 'typeId',
            constraints : false,
            as          : 'type',
        });
    };

    return GoodsCat;
};
