const base = require('../base');

module.exports = (sequelize, DataTypes) => {
    const BillAfterSaleAttachment = base(
        sequelize,
        DataTypes,
        'BillAfterSaleAttachment',
        {
            // 属性对象
            afterSaleId: {
                type: DataTypes.STRING(20),
                field: 'after_sale_id',
                allowNull: false,
                comment: '售后单id',
            },
            attachmentId: {
                type: DataTypes.INTEGER,
                field: 'attachment_id',
                allowNull: false,
                comment: '图片ID',
            },
        },
        { hideDefaultArribute: false, comment: '商品图片关联表' },
    );

    BillAfterSaleAttachment.associate = (models) => {};

    return BillAfterSaleAttachment;
};
