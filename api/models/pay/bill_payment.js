const base = require('../base');

module.exports = (sequelize, DataTypes) => {
    const BillPayment = base(
        sequelize,
        DataTypes,
        'BillPayment',
        {
            id: {
                // 自增ID
                type          : DataTypes.BIGINT,
                autoIncrement : true,
                unique        : true,
            },
            // 属性对象
            paymentId: {
                type       : DataTypes.STRING(20),
                field      : 'payment_id',
                allowNull  : false,
                primaryKey : true,
                comment    : '支付单号',
            },
            money: {
                type         : DataTypes.DECIMAL,
                allowNull    : true,
                defaultValue : '0.00',
                comment      : '支付金额',
            },
            userId: {
                type      : DataTypes.INTEGER(10).UNSIGNED,
                field     : 'user_id',
                allowNull : true,
                comment   : '用户ID',
            },
            type: {
                type         : DataTypes.INTEGER(1).UNSIGNED,
                allowNull    : false,
                defaultValue : '1',
                comment      : '资源类型1=订单,2充值单',
            },
            state: {
                type         : DataTypes.INTEGER(1).UNSIGNED,
                allowNull    : true,
                defaultValue : '1',
                comment      : '支付状态 1=未支付 2=支付成功 3=其他',
            },
            paymentCode: {
                type      : DataTypes.STRING(50),
                field     : 'payment_code',
                allowNull : true,
                comment   : '支付类型编码 关联payments.code',
            },
            ip: {
                type      : DataTypes.STRING(50),
                allowNull : true,
                comment   : '支付单生成IP',
            },
            params: {
                type      : DataTypes.JSON,
                allowNull : false,
                comment   : '支付的时候需要的参数，存的是json格式的一维数组',
            },
            payedMsg: {
                type      : DataTypes.STRING(255),
                field     : 'payed_msg',
                allowNull : true,
                comment   : '支付回调后的状态描述',
            },
            tradeNo: {
                type      : DataTypes.STRING(50),
                field     : 'trade_no',
                allowNull : true,
                comment   : '第三方平台交易流水号',
            },
        },
        {
            hideDefaultArribute : false,
            comment             : '支付单表',
        },
    );

    BillPayment.associate = (models) => {
        BillPayment.belongsTo(models.User, {
            foreignKey  : 'userId',
            constraints : false,
            as          : 'user',
        });
        BillPayment.hasMany(models.BillPaymentItem, {
            foreignKey  : 'paymentId',
            sourceKey   : 'paymentId',
            constraints : false,
            as          : 'billPaymentItems',
        });
    };

    return BillPayment;
};
