const base = require('../base');

module.exports = (sequelize, DataTypes) => {
    const BillReshipItem = base(
        sequelize,
        DataTypes,
        'BillReshipItem',
        {
            // 属性对象
            reshipId: {
                type: DataTypes.STRING(20),
                field: 'reship_id',
                allowNull: false,
                comment: '退款单单id',
            },
            orderItemId: {
                type: DataTypes.INTEGER(10).UNSIGNED,
                field: 'order_item_id',
                allowNull: true,
                comment: '订单明细ID 关联order_items.id',
            },
            goodsId: {
                type: DataTypes.INTEGER(10).UNSIGNED,
                field: 'goods_id',
                allowNull: true,
                comment: '商品ID 关联goods.id',
            },
            productId: {
                type: DataTypes.INTEGER(10).UNSIGNED,
                field: 'product_id',
                allowNull: true,
                comment: '货品ID 关联products.id',
            },
            sn: {
                type: DataTypes.STRING(30),
                allowNull: true,
                comment: '货品编码',
            },
            bn: {
                type: DataTypes.STRING(30),
                allowNull: true,
                comment: '商品编码',
            },
            name: {
                type: DataTypes.STRING(200),
                allowNull: true,
                comment: '商品名称',
            },
            imageUrl: {
                type: DataTypes.STRING(100),
                field: 'image_url',
                allowNull: false,
                comment: '图片',
            },
            num: {
                type: DataTypes.INTEGER(5).UNSIGNED,
                allowNull: true,
                defaultValue: '1',
                comment: '数量',
            },
            specs: {
                type: DataTypes.STRING(1024),
                allowNull: true,
                comment: '货品规格序列化',
            },
        },
        { hideDefaultArribute: false, comment: '退货单明细表' },
    );

    BillReshipItem.associate = (models) => {};

    return BillReshipItem;
};
