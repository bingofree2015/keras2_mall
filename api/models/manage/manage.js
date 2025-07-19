const base = require('../base');

module.exports = (sequelize, DataTypes) => {
    const Manage = base(
        sequelize,
        DataTypes,
        'Manage',
        {
            // 属性对象
            username: {
                type: DataTypes.STRING(20),
                allowNull: true,
                unique: true,
                comment: '用户名',
            },
            password: {
                type: DataTypes.CHAR(32),
                allowNull: true,
                comment: '密码 md5(md5()+创建时间)',
            },
            mobile: {
                type: DataTypes.CHAR(15),
                allowNull: true,
                comment: '手机号',
            },
            avatar: {
                type: DataTypes.STRING(255),
                allowNull: true,
                comment: '头像',
            },
            nickname: {
                type: DataTypes.STRING(50),
                allowNull: true,
                comment: '昵称',
            },
            status: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: true,
                comment: '1 = 正常 2 = 停用',
            },
        },
        { hideDefaultArribute: false, comment: '管理员表' },
    );

    Manage.associate = (models) => {};

    return Manage;
};
