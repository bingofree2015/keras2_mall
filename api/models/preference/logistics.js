const base = require('../base');

module.exports = (sequelize, DataTypes) => {
    const Logistics = base(
        sequelize,
        DataTypes,
        'Logistics',
        {
            id: {
                // 自增ID
                type          : DataTypes.BIGINT,
                autoIncrement : true,
                unique        : true,
            },
            // 属性对象
            logiName: {
                type      : DataTypes.STRING(30),
                field     : 'logi_name',
                allowNull : true,
                comment   : '物流公司名称',
            },
            logiCode: {
                type       : DataTypes.STRING(50),
                field      : 'logi_code',
                allowNull  : true,
                primaryKey : true,
                comment    : '物流公司编码',
            },
            sort: {
                type         : DataTypes.INTEGER(3).UNSIGNED,
                allowNull    : true,
                defaultValue : '100',
                comment      : '排序 越小越靠前',
            },
        },
        {
            hideDefaultArribute : false,
            comment             : '物流公司表',
        },
    );

    Logistics.associate = (models) => {};

    return Logistics;
};
