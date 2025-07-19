const base = require('./base');

module.exports = (sequelize, DataTypes) => {
    const sms = base(
        sequelize,
        DataTypes,
        'sms',
        {
            // 属性对象
            mobile: {
                type      : DataTypes.STRING(15),
                allowNull : false,
                comment   : '手机号码',
            },
            code: {
                type      : DataTypes.STRING(60),
                allowNull : false,
                comment   : '',
            },
            params: {
                type      : DataTypes.STRING(5000),
                allowNull : false,
                comment   : '参数',
            },
            content: {
                type      : DataTypes.STRING(200),
                allowNull : false,
                comment   : '内容',
            },
            ip: {
                type      : DataTypes.STRING(50),
                allowNull : false,
                comment   : '',
            },
            status: {
                type         : DataTypes.BOOLEAN,
                allowNull    : false,
                defaultValue : false,
                comment      : '1未使用，2已使用',
            },
        },
        {
            hideDefaultArribute : false,
            comment             : '短信表',
        },
    );

    sms.associate = (models) => {};

    return sms;
};
