const base = require('../base');

module.exports = (sequelize, DataTypes) => {
    const BillDelivery = base(
        sequelize,
        DataTypes,
        'BillDelivery',
        {
            id: {
                // 自增ID
                type: DataTypes.BIGINT,
                autoIncrement: true,
                unique: true,
            },
            // 属性对象
            deliveryId: {
                type: DataTypes.STRING(20),
                field: 'delivery_id',
                allowNull: false,
                primaryKey: true,
                comment: '',
            },
            orderId: {
                type: DataTypes.STRING(20),
                field: 'order_id',
                allowNull: false,
                comment: '订单ID 关联order.id',
            },
            userId: {
                type: DataTypes.INTEGER(10).UNSIGNED,
                field: 'user_id',
                allowNull: true,
                comment: '用户id 关联user.id',
            },
            logiCode: {
                type: DataTypes.STRING(50),
                field: 'logi_code',
                allowNull: true,
                comment: '物流公司编码',
            },
            logiNo: {
                type: DataTypes.STRING(50),
                field: 'logi_no',
                allowNull: true,
                comment: '物流单号',
            },
            logiInformation: {
                type: DataTypes.TEXT,
                field: 'logi_information',
                allowNull: true,
                comment: '快递物流信息',
            },
            logiStatus: {
                type: DataTypes.INTEGER(3).UNSIGNED,
                field: 'logi_status',
                allowNull: false,
                defaultValue: '0',
                comment: '0快递信息可能更新  1快递信息不更新了',
            },
            shipAreaId: {
                type: DataTypes.INTEGER(10).UNSIGNED,
                field: 'ship_area_id',
                allowNull: true,
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
            confirmTime: {
                type: DataTypes.BIGINT,
                field: 'confirm_time',
                allowNull: true,
                comment: '确认s收货时间',
            },
            status: {
                type: DataTypes.INTEGER(1).UNSIGNED,
                allowNull: true,
                defaultValue: '2',
                comment: '状态 1=准备发货 2=已发货 3=已确认 4=其他',
            },
            memo: {
                type: DataTypes.STRING(255),
                allowNull: true,
                comment: '备注',
            },
        },
        { hideDefaultArribute: false, comment: '发货单表' },
    );

    BillDelivery.associate = (models) => {
        BillDelivery.belongsTo(models.Order, { foreignKey: 'orderId', constraints: false, as: 'order' });
        BillDelivery.belongsTo(models.User, { foreignKey: 'userId', constraints: false, as: 'user' });
        BillDelivery.belongsTo(models.Area, {
            foreignKey: 'shipAreaId',
            constraints: false,
            as: 'area',
        });
        BillDelivery.belongsTo(models.Logistics, {
            foreignKey: 'logiCode',
            targetKey: 'logiCode',
            constraints: false,
            as: 'logistics',
        });
        BillDelivery.hasMany(models.BillDeliveryItem, {
            foreignKey: 'deliveryId',
            constraints: false,
            as: 'billDeliveryItems',
        });
    };

    return BillDelivery;
};
