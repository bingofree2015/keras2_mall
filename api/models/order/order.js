const base = require('../base');

module.exports = (sequelize, DataTypes) => {
    const Order = base(
        sequelize,
        DataTypes,
        'Order',
        {
            id: {
                // 自增ID
                type: DataTypes.BIGINT,
                autoIncrement: true,
                unique: true,
            },
            // 属性对象
            orderId: {
                type: DataTypes.STRING(20),
                field: 'order_id',
                allowNull: false,
                primaryKey: true,
                comment: '订单号',
            },
            goodsAmount: {
                type: DataTypes.DECIMAL,
                field: 'goods_amount',
                allowNull: true,
                defaultValue: 0.0,
                comment: '商品总价',
            },
            payed: {
                type: DataTypes.DECIMAL,
                allowNull: true,
                defaultValue: 0.0,
                comment: '已支付的金额',
            },
            orderAmount: {
                type: DataTypes.DECIMAL,
                field: 'order_amount',
                allowNull: false,
                defaultValue: 0.0,
                comment: '订单实际销售总额',
            },
            payState: {
                type: DataTypes.INTEGER(1).UNSIGNED,
                field: 'pay_state',
                allowNull: true,
                defaultValue: 1,
                comment: '支付状态 1=未付款 2=已付款 3=部分付款 4=部分退款 5=已退款',
            },
            shipState: {
                type: DataTypes.INTEGER(1).UNSIGNED,
                field: 'ship_state',
                allowNull: true,
                defaultValue: 1,
                comment: '发货状态 1=未发货 2=部分发货 3=已发货 4=部分退货 5=已退货',
            },
            state: {
                type: DataTypes.INTEGER(1).UNSIGNED,
                allowNull: true,
                defaultValue: 1,
                comment: '订单状态 1=正常 2=完成 3=取消',
            },
            orderType: {
                type: DataTypes.INTEGER(2).UNSIGNED,
                field: 'order_type',
                allowNull: false,
                defaultValue: 1,
                comment: '订单类型，1是普通订单，2是拼团订单',
            },
            paymentCode: {
                type: DataTypes.STRING(20),
                field: 'payment_code',
                allowNull: true,
                comment: '支付方式代码',
            },
            paymentTime: {
                type: DataTypes.BIGINT,
                field: 'payment_time',
                allowNull: true,
                comment: '支付时间',
            },
            logisticsId: {
                type: DataTypes.INTEGER,
                field: 'logistics_id',
                allowNull: true,
                comment: '配送方式ID 关联ship.id',
            },
            logisticsName: {
                type: DataTypes.STRING(50),
                field: 'logistics_name',
                allowNull: true,
                comment: '配送方式名称',
            },
            costFreight: {
                type: DataTypes.DECIMAL,
                field: 'cost_freight',
                allowNull: true,
                defaultValue: 0.0,
                comment: '配送费用',
            },
            userId: {
                type: DataTypes.INTEGER(10).UNSIGNED,
                field: 'user_id',
                allowNull: true,
                comment: '用户ID 关联user.id',
            },
            sellerId: {
                type: DataTypes.INTEGER(10).UNSIGNED,
                field: 'seller_id',
                allowNull: true,
                comment: '店铺ID 关联seller.id',
            },
            confirm: {
                type: DataTypes.INTEGER(1).UNSIGNED,
                allowNull: true,
                defaultValue: 1,
                comment: '售后状态 1=未确认收货 2=已确认收货',
            },
            confirmTime: {
                type: DataTypes.BIGINT,
                field: 'confirm_time',
                allowNull: true,
                comment: '确认收货时间',
            },
            storeId: {
                type: DataTypes.INTEGER(10).UNSIGNED,
                field: 'store_id',
                allowNull: true,
                defaultValue: 0,
                comment: '自提门店ID，0就是不门店自提',
            },
            shipAreaId: {
                type: DataTypes.INTEGER(10).UNSIGNED,
                field: 'ship_area_id',
                allowNull: true,
                defaultValue: 0,
                comment: '收货地区ID',
            },
            shipAddress: {
                type: DataTypes.STRING(200),
                field: 'ship_address',
                allowNull: true,
                comment: '收货详细地址',
            },
            shipName: {
                type: DataTypes.STRING(50),
                field: 'ship_name',
                allowNull: true,
                comment: '收货人姓名',
            },
            shipMobile: {
                type: DataTypes.CHAR(15),
                field: 'ship_mobile',
                allowNull: true,
                comment: '收货电话',
            },
            weight: {
                type: DataTypes.DECIMAL,
                allowNull: true,
                defaultValue: 0.0,
                comment: '商品总重量',
            },
            taxType: {
                type: DataTypes.INTEGER(1).UNSIGNED,
                field: 'tax_type',
                allowNull: true,
                defaultValue: 1,
                comment: '是否开发票 1=不发票 2=个人发票 3=公司发票',
            },
            taxContent: {
                type: DataTypes.STRING(255),
                field: 'tax_content',
                allowNull: true,
                defaultValue: '',
                comment: '发票内容',
            },
            taxCode: {
                type: DataTypes.STRING(50),
                field: 'tax_code',
                allowNull: true,
                comment: '税号',
            },
            taxTitle: {
                type: DataTypes.STRING(50),
                field: 'tax_title',
                allowNull: true,
                comment: '发票抬头',
            },
            point: {
                type: DataTypes.INTEGER(10).UNSIGNED,
                allowNull: true,
                comment: '使用积分',
            },
            pointMoney: {
                type: DataTypes.DECIMAL,
                field: 'point_money',
                allowNull: true,
                comment: '积分抵扣金额',
            },
            orderPmt: {
                type: DataTypes.DECIMAL,
                field: 'order_pmt',
                allowNull: true,
                defaultValue: 0.0,
                comment: '订单优惠金额',
            },
            goodsPmt: {
                type: DataTypes.DECIMAL,
                field: 'goods_pmt',
                allowNull: true,
                defaultValue: 0.0,
                comment: '商品优惠金额',
            },
            couponPmt: {
                type: DataTypes.DECIMAL,
                field: 'coupon_pmt',
                allowNull: true,
                defaultValue: 0.0,
                comment: '优惠券优惠额度',
            },
            coupon: {
                type: DataTypes.STRING(5000),
                allowNull: true,
                comment: '优惠券信息',
            },
            promotionList: {
                type: DataTypes.STRING(255),
                field: 'promotion_list',
                allowNull: true,
                comment: '优惠信息',
            },
            memo: {
                type: DataTypes.STRING(255),
                allowNull: true,
                comment: '买家备注',
            },
            ip: {
                type: DataTypes.STRING(50),
                allowNull: true,
                comment: '下单IP',
            },
            mark: {
                type: DataTypes.STRING(510),
                allowNull: true,
                comment: '卖家备注',
            },
            source: {
                type: DataTypes.INTEGER(3).UNSIGNED,
                allowNull: false,
                defaultValue: 1,
                comment: '订单来源 1=PC页面 2=H5页面 3=微信小程序',
            },
            isComment: {
                type: DataTypes.BOOLEAN,
                field: 'is_comment',
                allowNull: false,
                defaultValue: false,
                comment: '是否评论，1未评论，2已评论',
            },
        },
        { hideDefaultArribute: false, comment: '订单表' },
    );

    Order.associate = (models) => {
        Order.belongsTo(models.User, { foreignKey: 'userId', constraints: false, as: 'user' });
        Order.belongsTo(models.Store, { foreignKey: 'storeId', constraints: false, as: 'store' });
        Order.hasMany(models.OrderItem, {
            foreignKey: 'orderId',
            sourceKey: 'orderId',
            constraints: false,
            as: 'orderItems',
        });

        Order.belongsToMany(models.BillPayment, {
            through: models.BillPaymentItem,
            foreignKey: 'sourceId',
            otherKey: 'paymentId',
            constraints: false,
            as: 'billPayments',
        });

        Order.hasMany(models.BillRefund, {
            foreignKey: 'sourceId',
            sourceKey: 'orderId',
            constraints: false,
            as: 'billRefunds',
        });
        Order.hasMany(models.BillDelivery, {
            foreignKey: 'orderId',
            sourceKey: 'orderId',
            constraints: false,
            as: 'billDeliveries',
        });
        Order.hasMany(models.BillLading, {
            foreignKey: 'orderId',
            sourceKey: 'orderId',
            constraints: false,
            as: 'billLadings',
        });
        Order.hasMany(models.BillReship, {
            foreignKey: 'orderId',
            sourceKey: 'orderId',
            constraints: false,
            as: 'billReships',
        });
        Order.hasMany(models.OrderLog, {
            foreignKey: 'orderId',
            sourceKey: 'orderId',
            constraints: false,
            as: 'orderLogs',
        });
    };

    return Order;
};
