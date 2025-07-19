const base = require('../base');

module.exports = (sequelize, DataTypes) => {
    const BillRefund = base(
        sequelize,
        DataTypes,
        'BillRefund',
        {
            // 属性对象
            refundId: {
                type: DataTypes.STRING(20),
                field: 'refund_id',
                allowNull: false,
                primaryKey: true,
                comment: '',
            },
            afterSaleId: {
                type: DataTypes.STRING(20),
                field: 'after_sale_id',
                allowNull: false,
                comment: '售后单id',
            },
            money: {
                type: DataTypes.DECIMAL,
                allowNull: true,
                comment: '退款金额',
            },
            userId: {
                type: DataTypes.INTEGER(10).UNSIGNED,
                field: 'user_id',
                allowNull: true,
                comment: '用户ID 关联user.id',
            },
            sourceId: {
                type: DataTypes.STRING(20),
                field: 'source_id',
                allowNull: false,
                comment: '资源id，根据type不同而关联不同',
            },
            type: {
                type: DataTypes.INTEGER(1).UNSIGNED,
                allowNull: false,
                defaultValue: '1',
                comment: '资源类型1=订单,2充值单',
            },
            paymentCode: {
                type: DataTypes.STRING(50),
                field: 'payment_code',
                allowNull: true,
                comment: '退款支付类型编码 默认原路返回 关联支付单表支付编码',
            },
            tradeNo: {
                type: DataTypes.STRING(50),
                field: 'trade_no',
                allowNull: true,
                comment: '第三方平台交易流水号',
            },
            state: {
                type: DataTypes.INTEGER(1).UNSIGNED,
                allowNull: true,
                defaultValue: '1',
                comment: '状态 1=未退款 2=已退款 3=退款失败，可以再次退款，4退款拒绝',
            },
            memo: {
                type: DataTypes.STRING(100),
                allowNull: false,
                defaultValue: '',
                comment: '退款失败原因',
            },
        },
        { hideDefaultArribute: false, comment: '退款单表' },
    );

    BillRefund.associate = (models) => {
        BillRefund.belongsTo(models.User, { foreignKey: 'userId', constraints: false, as: 'user' });
    };

    return BillRefund;
};
