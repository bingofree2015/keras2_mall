const base = require('../base');

module.exports = (sequelize, DataTypes) => {
    const BillPaymentItem = base(
        sequelize,
        DataTypes,
        'BillPaymentItem',
        {
            // 属性对象
            paymentId: {
                type      : DataTypes.STRING(20),
                field     : 'payment_id',
                allowNull : false,
                comment   : '支付单编号',
            },
            sourceId: {
                type      : DataTypes.STRING(20),
                field     : 'source_id',
                allowNull : false,
                comment   : '资源编号',
            },
            money: {
                type      : DataTypes.DECIMAL,
                allowNull : false,
                comment   : '金额',
            },
        },
        {
            hideDefaultArribute : false,
            comment             : '支付单明细表',
        },
    );

    BillPaymentItem.associate = (models) => {};

    return BillPaymentItem;
};
