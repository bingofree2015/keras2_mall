const base = require('../base');

module.exports = (sequelize, DataTypes) => {
    const TemplateOrder = base(
        sequelize,
        DataTypes,
        'TemplateOrder',
        {
            // 属性对象
            templateId: {
                type         : DataTypes.INTEGER(10).UNSIGNED,
                field        : 'template_id',
                allowNull    : true,
                defaultValue : '0',
                comment      : '模板id',
            },
            appid: {
                type      : DataTypes.STRING(50),
                allowNull : true,
                comment   : '商户appid',
            },
        },
        {
            hideDefaultArribute : false,
            comment             : '模板订购记录表',
        },
    );

    TemplateOrder.associate = (models) => {};

    return TemplateOrder;
};
