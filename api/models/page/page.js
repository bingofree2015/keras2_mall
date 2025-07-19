const base = require('../base');

module.exports = (sequelize, DataTypes) => {
    const Page = base(
        sequelize,
        DataTypes,
        'Page',
        {
            // 属性对象
            code: {
                type         : DataTypes.STRING(50),
                allowNull    : true,
                defaultValue : '',
                comment      : '可视化区域编码',
            },
            name: {
                type         : DataTypes.STRING(50),
                allowNull    : true,
                defaultValue : '',
                comment      : '可编辑区域名称',
            },
            desc: {
                type         : DataTypes.STRING(255),
                allowNull    : true,
                defaultValue : '',
                comment      : '描述',
            },
            layout: {
                type         : DataTypes.INTEGER(2).UNSIGNED,
                allowNull    : true,
                defaultValue : '1',
                comment      : '布局样式编码，1，手机端',
            },
            type: {
                type         : DataTypes.INTEGER(1).UNSIGNED,
                allowNull    : true,
                defaultValue : '1',
                comment      : '1手机端，2PC端',
            },
        },
        {
            hideDefaultArribute : false,
            comment             : '页面管理表',
        },
    );

    Page.associate = (models) => {
        Page.hasMany(models.PageItem, {
            foreignKey  : 'pageCode',
            constraints : false,
            as          : 'pageItems',
        });
    };

    return Page;
};
