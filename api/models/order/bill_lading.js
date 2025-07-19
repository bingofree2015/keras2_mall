const base = require('../base');

module.exports = (sequelize, DataTypes) => {
    const BillLading = base(
        sequelize,
        DataTypes,
        'BillLading',
        {
            id: {
                // 自增ID
                type          : DataTypes.BIGINT,
                autoIncrement : true,
                unique        : true,
            },
            // 属性对象
            ladingId: {
                type       : DataTypes.STRING(20),
                field      : 'lading_id',
                allowNull  : false,
                primaryKey : true,
                comment    : '提货单号',
            },
            orderId: {
                type      : DataTypes.STRING(20),
                field     : 'order_id',
                allowNull : true,
                comment   : '订单号',
            },
            storeId: {
                type      : DataTypes.INTEGER(10).UNSIGNED,
                field     : 'store_id',
                allowNull : true,
                comment   : '提货门店ID',
            },
            name: {
                type      : DataTypes.STRING(30),
                allowNull : true,
                comment   : '提货人姓名',
            },
            mobile: {
                type      : DataTypes.STRING(15),
                allowNull : true,
                comment   : '提货手机号',
            },
            clerkId: {
                type      : DataTypes.INTEGER(10).UNSIGNED,
                field     : 'clerk_id',
                allowNull : true,
                comment   : '处理店员ID',
            },
            ptime: {
                type      : DataTypes.BIGINT,
                allowNull : true,
                comment   : '提货时间',
            },
            state: {
                type         : DataTypes.INTEGER(1).UNSIGNED,
                allowNull    : false,
                defaultValue : '1',
                comment      : '提货状态1=未提货 2=已提货',
            },
        },
        {
            hideDefaultArribute : false,
            comment             : '提货单表',
        },
    );

    BillLading.associate = (models) => {
        BillLading.belongsTo(models.Store, {
            foreignKey  : 'storeId',
            constraints : false,
            as          : 'store',
        });
    };

    return BillLading;
};
