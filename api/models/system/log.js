const base = require('../base');

module.exports = (sequelize, DataTypes) => {
    const Log = base(
        sequelize,
        DataTypes,
        'Log',
        {
            userName: {
                type      : DataTypes.STRING(50),
                allowNull : true,
                field     : 'user_name',
                comment   : '用户名',
            },
            operation: {
                type      : DataTypes.STRING(50),
                allowNull : true,
                comment   : '用户操作',
            },
            method: {
                type      : DataTypes.STRING(200),
                allowNull : true,
                comment   : '请求方法',
            },
            params: {
                type      : DataTypes.STRING(5000),
                allowNull : true,
                comment   : '请求参数',
            },
            time: {
                type      : DataTypes.BIGINT,
                allowNull : false,
                comment   : '执行时长(毫秒)',
            },
            ip: {
                type      : DataTypes.STRING(64),
                allowNull : true,
                comment   : 'IP地址',
            },
            createdBy: {
                type      : DataTypes.STRING(50),
                allowNull : true,
                field     : 'created_by',
                comment   : '创建人',
            },
            updatedBy: {
                type      : DataTypes.STRING(50),
                allowNull : true,
                field     : 'updated_by',
                comment   : '更新人',
            },
        },
        {
            hideDefaultArribute : false,
            comment             : '日志',
        },
    );

    Log.associate = () => {};

    return Log;
};
