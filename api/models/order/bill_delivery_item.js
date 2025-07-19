const base = require('../base');

module.exports = (sequelize, DataTypes) => {
    const BillDeliveryItem = base(
        sequelize,
        DataTypes,
        'BillDeliveryItem',
        {
            // 属性对象
            deliveryId: {
                type      : DataTypes.STRING(20),
                field     : 'delivery_id',
                allowNull : false,
                comment   : '发货单号 关联bill_delivery.id',
            },
            orderItemId: {
                type      : DataTypes.INTEGER(10).UNSIGNED,
                field     : 'order_item_id',
                allowNull : true,
                comment   : '订单明细ID 关联order_items.id',
            },
            num: {
                type      : DataTypes.INTEGER(5).UNSIGNED,
                allowNull : true,
                comment   : '发货数量',
            },
        },
        {
            hideDefaultArribute : false,
            comment             : '发货单详情表',
        },
    );

    BillDeliveryItem.associate = (models) => {
        BillDeliveryItem.belongsTo(models.OrderItem, {
            foreignKey  : 'orderItemId',
            targetKey   : 'id',
            constraints : false,
            as          : 'orderItem',
        });
    };

    return BillDeliveryItem;
};
