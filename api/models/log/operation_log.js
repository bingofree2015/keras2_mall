const base = require('../base');

module.exports = (sequelize, DataTypes) => {
    const OperationLog = base(
        sequelize,
        DataTypes,
        'OperationLog',
        {
            // 属性对象
            sysUserId: {
                type      : DataTypes.INTEGER(10).UNSIGNED,
                field     : 'sys_user_id',
                allowNull : true,
                comment   : '管理员ID',
            },
            controller: {
                type      : DataTypes.STRING(50),
                allowNull : true,
                comment   : '操作的控制器名',
            },
            method: {
                type      : DataTypes.STRING(50),
                allowNull : true,
                comment   : '操作方法名',
            },
            desc: {
                type      : DataTypes.STRING(255),
                allowNull : true,
                comment   : '操作描述',
            },
            content: {
                type      : DataTypes.JSON(),
                allowNull : true,
                comment   : '操作数据序列号存储',
            },
            ip: {
                type      : DataTypes.CHAR(50),
                allowNull : true,
                comment   : '操作IP',
            },
        },
        {
            hideDefaultArribute : false,
            comment             : '后台操作记录表',
        },
    );

    OperationLog.associate = (models) => {
        OperationLog.belongsTo(models.SysUser, {
            foreignKey  : 'sysUserId',
            constraints : false,
            as          : 'sysUser',
        });
    };

    return OperationLog;
};
