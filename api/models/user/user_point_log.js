const base = require('../base');

module.exports = (sequelize, DataTypes) => {
    const UserPointLog = base(
        sequelize,
        DataTypes,
        'UserPointLog',
        {
            // 属性对象
            userId: {
                type: DataTypes.INTEGER(10).UNSIGNED,
                field: 'user_id',
                allowNull: false,
                comment: '用户ID',
            },
            type: {
                type: DataTypes.INTEGER(1).UNSIGNED,
                allowNull: true,
                defaultValue: '1',
                comment: '类型 1=签到 2=购物返积分 3=购物使用积分',
            },
            num: {
                type: DataTypes.INTEGER(10),
                allowNull: true,
                defaultValue: '0',
                comment: '积分数量',
            },
            balance: {
                type: DataTypes.BIGINT,
                allowNull: true,
                comment: '积分余额',
            },
            remark: {
                type: DataTypes.STRING(255),
                allowNull: true,
                comment: '备注',
            },
        },
        { hideDefaultArribute: false, comment: '用户积分记录表' },
    );

    UserPointLog.associate = (models) => {};

    return UserPointLog;
};
