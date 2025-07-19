const base = require('../base');

module.exports = (sequelize, DataTypes) => {
    const UserWx = base(
        sequelize,
        DataTypes,
        'UserWx',
        {
            // 属性对象
            type: {
                type         : DataTypes.INTEGER(1).UNSIGNED,
                allowNull    : true,
                defaultValue : '1',
                comment      : '第三方登录类型，1微信小程序，2微信公众号',
            },
            userId: {
                type         : DataTypes.INTEGER(10).UNSIGNED,
                field        : 'user_id',
                allowNull    : false,
                defaultValue : '0',
                comment      : '关联用户表',
            },
            openid: {
                type      : DataTypes.STRING(50),
                allowNull : true,
                comment   : '',
            },
            sessionKey: {
                type      : DataTypes.STRING(50),
                field     : 'session_key',
                allowNull : true,
                comment   : '',
            },
            unionid: {
                type      : DataTypes.STRING(50),
                allowNull : true,
                comment   : '',
            },
            avatar: {
                type      : DataTypes.STRING(255),
                allowNull : true,
                comment   : '头像',
            },
            nickname: {
                type      : DataTypes.STRING(50),
                allowNull : true,
                comment   : '昵称',
            },
            gender: {
                type         : DataTypes.INTEGER(1).UNSIGNED,
                allowNull    : false,
                defaultValue : '0',
                comment      : '性别 0：未知、1：男、2：女',
            },
            language: {
                type      : DataTypes.STRING(50),
                allowNull : true,
                comment   : '语言',
            },
            city: {
                type      : DataTypes.STRING(80),
                allowNull : true,
                comment   : '城市',
            },
            province: {
                type      : DataTypes.STRING(80),
                allowNull : true,
                comment   : '省',
            },
            country: {
                type      : DataTypes.STRING(80),
                allowNull : true,
                comment   : '国家',
            },
            countryCode: {
                type      : DataTypes.STRING(20),
                field     : 'country_code',
                allowNull : true,
                comment   : '手机号码国家编码',
            },
            mobile: {
                type      : DataTypes.STRING(20),
                allowNull : true,
                comment   : '手机号码',
            },
        },
        {
            hideDefaultArribute : false,
            comment             : '用户表',
        },
    );

    UserWx.associate = (models) => {};

    return UserWx;
};
