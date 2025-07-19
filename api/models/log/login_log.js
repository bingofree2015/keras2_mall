const base = require('../base');

module.exports = (sequelize, DataTypes) => {
    const LoginLog = base(
        sequelize,
        DataTypes,
        'LoginLog',
        {
            // 属性对象
            userId: {
                type      : DataTypes.INTEGER(11).UNSIGNED,
                field     : 'user_id',
                allowNull : false,
                comment   : '用户id',
            },
            state: {
                type      : DataTypes.INTEGER(1),
                allowNull : true,
                comment   : '登录 1  退出2,3注册',
            },
            logTime: {
                type      : DataTypes.BIGINT,
                field     : 'log_time',
                allowNull : true,
                comment   : '时间',
            },
            city: {
                type      : DataTypes.STRING(100),
                allowNull : true,
                comment   : '地点城市',
            },
            ip: {
                type      : DataTypes.STRING(15),
                allowNull : true,
                comment   : 'ip地址',
            },
        },
        {
            hideDefaultArribute : false,
            comment             : '登录日志表',
        },
    );

    LoginLog.associate = (models) => {};

    return LoginLog;
};
