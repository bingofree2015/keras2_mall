const base = require('../base');

module.exports = (sequelize, DataTypes) => {
    const User = base(
        sequelize,
        DataTypes,
        'User',
        {
            // 属性对象
            username: {
                type: DataTypes.STRING(20),
                allowNull: true,
                comment: '用户名',
            },
            password: {
                type: DataTypes.CHAR(32),
                allowNull: true,
                comment: '密码 md5(md5()+创建时间)',
            },
            mobile: {
                type: DataTypes.STRING(15),
                allowNull: true,
                comment: '手机号',
            },
            sex: {
                type: DataTypes.INTEGER(1),
                allowNull: true,
                defaultValue: -1,
                comment: '1:男;0:女;-1:未知',
            },
            birthday: {
                type: DataTypes.DATEONLY,
                allowNull: true,
                comment: '生日',
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
            balance: {
                type: DataTypes.DECIMAL,
                allowNull: false,
                defaultValue: '0.00',
                comment: '余额',
            },
            point: {
                type: DataTypes.INTEGER(11),
                allowNull: false,
                defaultValue: '0',
                comment: '积分',
            },
            gradeId: {
                type: DataTypes.INTEGER(11),
                allowNull: false,
                field: 'grade_id',
                defaultValue: '0',
                comment: '用户等级',
            },
            state: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: true,
                comment: 'true:正常; false:停用',
            },
            pid: {
                type: DataTypes.INTEGER(10).UNSIGNED,
                allowNull: true,
                defaultValue: '0',
                comment: '推荐人',
            },
        },
        { hideDefaultArribute: false, comment: '用户表' },
    );

    User.associate = (models) => {
        User.belongsTo(models.UserGrade, { foreignKey: 'gradeId', constraints: false, as: 'userGrade' });
        User.belongsTo(models.User, {
            foreignKey: 'pid',
            sourceKey: 'id',
            constraints: false,
            as: 'parent',
        });
    };

    return User;
};
