const base = require('../base');

module.exports = (sequelize, DataTypes) => {
    const UserToCash = base(
        sequelize,
        DataTypes,
        'UserToCash',
        {
            // 属性对象
            userId: {
                type: DataTypes.INTEGER(10).UNSIGNED,
                field: 'user_id',
                allowNull: true,
                comment: '用户ID',
            },
            money: {
                type: DataTypes.DECIMAL,
                allowNull: false,
                defaultValue: '0.00',
                comment: '提现金额',
            },
            bankName: {
                type: DataTypes.STRING(60),
                field: 'bank_name',
                allowNull: true,
                comment: '银行名称',
            },
            bankCode: {
                type: DataTypes.STRING(12),
                field: 'bank_code',
                allowNull: true,
                comment: '银行缩写',
            },
            bankAreaId: {
                type: DataTypes.INTEGER(10).UNSIGNED,
                field: 'bank_area_id',
                allowNull: true,
                comment: '账号地区ID',
            },
            accountBank: {
                type: DataTypes.STRING(255),
                field: 'account_bank',
                allowNull: true,
                comment: '开户行',
            },
            accountName: {
                type: DataTypes.STRING(60),
                field: 'account_name',
                allowNull: true,
                comment: '账户名',
            },
            cardNumber: {
                type: DataTypes.STRING(30),
                field: 'card_number',
                allowNull: true,
                comment: '卡号',
            },
            withdrawal: {
                type: DataTypes.DECIMAL,
                allowNull: false,
                defaultValue: '0.00',
                comment: '提现服务费',
            },
            type: {
                type: DataTypes.INTEGER(1).UNSIGNED,
                allowNull: false,
                defaultValue: '1',
                comment: '1默认，2提现成功，3提现失败',
            },
        },
        { hideDefaultArribute: false, comment: '用户提现表' },
    );

    UserToCash.associate = (models) => {
        UserToCash.belongsTo(models.User, { foreignKey: 'userId', constraints: false, as: 'user' });
    };

    return UserToCash;
};
