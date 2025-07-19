const base = require('../base');

module.exports = (sequelize, DataTypes) => {
    const UserBankcard = base(
        sequelize,
        DataTypes,
        'UserBankcard',
        {
            // 属性对象
            userId: {
                type      : DataTypes.INTEGER(10).UNSIGNED,
                field     : 'user_id',
                allowNull : true,
                comment   : '用户ID',
            },
            bankName: {
                type      : DataTypes.STRING(60),
                field     : 'bank_name',
                allowNull : true,
                comment   : '银行名称',
            },
            bankCode: {
                type      : DataTypes.STRING(12),
                field     : 'bank_code',
                allowNull : true,
                comment   : '银行缩写',
            },
            bankAreaId: {
                type      : DataTypes.INTEGER(10).UNSIGNED,
                field     : 'bank_area_id',
                allowNull : true,
                comment   : '账号地区ID',
            },
            accountBank: {
                type      : DataTypes.STRING(255),
                field     : 'account_bank',
                allowNull : true,
                comment   : '开户行',
            },
            accountName: {
                type      : DataTypes.STRING(60),
                field     : 'account_name',
                allowNull : true,
                comment   : '账户名',
            },
            cardNumber: {
                type      : DataTypes.STRING(30),
                field     : 'card_number',
                allowNull : true,
                comment   : '卡号',
            },
            cardType: {
                type         : DataTypes.INTEGER(1),
                field        : 'card_type',
                allowNull    : true,
                defaultValue : '1',
                comment      : '银行卡类型: 1=储蓄卡 2=信用卡',
            },
            isDefault: {
                type         : DataTypes.BOOLEAN,
                field        : 'is_default',
                allowNull    : true,
                defaultValue : false,
                comment      : '默认卡 1=默认 2=不默认',
            },
        },
        {
            hideDefaultArribute : false,
            comment             : '用户银行卡表',
        },
    );

    UserBankcard.associate = (models) => {};

    return UserBankcard;
};
