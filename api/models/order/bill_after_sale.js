const base = require('../base');

module.exports = (sequelize, DataTypes) => {
    const BillAfterSale = base(
        sequelize,
        DataTypes,
        'BillAfterSale',
        {
            id: {
                // 自增ID
                type          : DataTypes.BIGINT,
                autoIncrement : true,
                unique        : true,
            },
            // 属性对象
            orderId: {
                type      : DataTypes.STRING(20),
                field     : 'order_id',
                allowNull : true,
                comment   : '订单ID',
            },
            afterSaleId: {
                type       : DataTypes.STRING(20),
                field      : 'after_sale_id',
                allowNull  : false,
                primaryKey : true,
                comment    : '售后单id',
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
                comment      : '售后类型，1=只退款，2退款退货',
            },
            refund: {
                type         : DataTypes.DECIMAL,
                allowNull    : false,
                defaultValue : '0.00',
                comment      : '退款金额',
            },
            state: {
                type         : DataTypes.INTEGER(1).UNSIGNED,
                allowNull    : true,
                defaultValue : '1',
                comment      : '状态 1=未审核 2=审核通过 3=审核拒绝',
            },
            reason: {
                type      : DataTypes.STRING(255),
                allowNull : false,
                comment   : '退款原因',
            },
            mark: {
                type      : DataTypes.STRING(255),
                allowNull : true,
                comment   : '卖家备注，如果审核失败了，会显示到前端',
            },
        },
        {
            hideDefaultArribute : false,
            comment             : '售后单表',
        },
    );

    BillAfterSale.associate = (models) => {
        BillAfterSale.belongsTo(models.User, {
            foreignKey  : 'userId',
            constraints : false,
            as          : 'user',
        });
        BillAfterSale.hasMany(models.BillAfterSaleItem, {
            foreignKey  : 'afterSaleId',
            constraints : false,
            as          : 'billAfterSaleItems',
        });
    };

    return BillAfterSale;
};
