const base = require('./base');

module.exports = (sequelize, DataTypes) => {
    const InvoiceRecord = base(
        sequelize,
        DataTypes,
        'InvoiceRecord',
        {
            // 属性对象
            name: {
                type: DataTypes.STRING(80),
                allowNull: true,
                comment: '发票抬头',
            },
            code: {
                type: DataTypes.STRING(30),
                allowNull: true,
                comment: '发票税号',
            },
            frequency: {
                type: DataTypes.INTEGER(6).UNSIGNED,
                allowNull: true,
                defaultValue: '1',
                comment: '被使用次数',
            },
        },
        { hideDefaultArribute: false, comment: '发票信息记录' },
    );

    InvoiceRecord.associate = (models) => {};

    return InvoiceRecord;
};
