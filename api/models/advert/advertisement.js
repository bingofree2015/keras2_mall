const base = require('../base');

module.exports = (sequelize, DataTypes) => {
    const Advertisement = base(
        sequelize,
        DataTypes,
        'Advertisement',
        {
            // 属性对象
            positionId: {
                type: DataTypes.INTEGER(10).UNSIGNED,
                field: 'position_id',
                allowNull: true,
                defaultValue: '0',
                comment: '广告位置id',
                validate: {
                    notEmpty: { args: true, msg: '请选择要添加的广告位' },
                },
            },
            name: {
                type: DataTypes.STRING(50),
                allowNull: false,
                comment: '广告名称',
                validate: {
                    notEmpty: { args: true, msg: '请输入广告名称' },
                    max: { args: 50, msg: '广告名最多不能超过50个字符' },
                },
            },
            attachmentId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                comment: '广告图片id',
                validate: {
                    notEmpty: { args: true, msg: '请选择要上传的广告图片' },
                    isAlphanumeric: { args: true, msg: '广告图片非法' },
                },
            },
            val: {
                type: DataTypes.STRING(255),
                allowNull: true,
                comment: '链接属性值',
            },
            sort: {
                type: DataTypes.INTEGER(5).UNSIGNED,
                allowNull: true,
                defaultValue: '0',
                comment: '从小到大 越小越靠前',
                validate: {
                    isNumeric: { args: true, msg: '排序必须是数字' },
                },
            },
            code: {
                type: DataTypes.STRING(32),
                allowNull: true,
                comment: '广告位置编码',
            },
            type: {
                type: DataTypes.INTEGER(3).UNSIGNED,
                allowNull: true,
                comment: '类型  1url  2商品  3文章',
                validate: {
                    notEmpty: { args: true, msg: '请选择要添加的广告类型' },
                    isNumeric: { args: true, msg: '广告类型非法' },
                },
            },
        },
        { hideDefaultArribute: false, comment: '插件表' },
    );

    Advertisement.associate = (models) => {
        Advertisement.belongsTo(models.AdvertPosition, {
            foreignKey: 'positionId',
            constraints: false,
            as: 'advertPosition',
        });
        Advertisement.belongsTo(models.Attachment, {
            foreignKey: 'attachmentId',
            constraints: false,
            as: 'attachment',
        });
    };

    return Advertisement;
};
