const base = require('./base');

module.exports = (sequelize, DataTypes) => {
    const Clerk = base(
        sequelize,
        DataTypes,
        'Clerk',
        {
            // 属性对象
            store_id: {
                type      : DataTypes.INTEGER(10).UNSIGNED,
                field     : 'store_id',
                allowNull : true,
                comment   : '店铺ID',
            },
            userId: {
                type      : DataTypes.INTEGER(10).UNSIGNED,
                field     : 'user_id',
                allowNull : true,
                comment   : '用户ID',
            },
        },
        {
            hideDefaultArribute : false,
            comment             : '店铺店员关联表',
        },
    );

    Clerk.associate = (models) => {};

    return Clerk;
};
