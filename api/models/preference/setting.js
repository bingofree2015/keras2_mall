const base = require('../base');

module.exports = (sequelize, DataTypes) => {
    const Setting = base(
        sequelize,
        DataTypes,
        'Setting',
        {
            // 属性对象
            key: {
                type         : DataTypes.STRING(50),
                allowNull    : false,
                defaultValue : '',
                primaryKey   : true,
                comment      : '键',
            },
            value: {
                type      : DataTypes.JSON,
                allowNull : true,
                comment   : '值',
            },
        },
        {
            hideDefaultArribute : false,
            comment             : '系统变量设置表',
        },
    );

    Setting.associate = (models) => {};

    return Setting;
};
