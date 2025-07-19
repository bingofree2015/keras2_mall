const base = require('./base');

module.exports = (sequelize, DataTypes) => {
    const Image = base(
        sequelize,
        DataTypes,
        'Image',
        {
            // 属性对象
            id: {
                type       : DataTypes.CHAR(32),
                allowNull  : false,
                primaryKey : true,
                comment    : '图片ID',
            },
            name: {
                type      : DataTypes.STRING(50),
                allowNull : true,
                comment   : '图片名称',
            },
            url: {
                type      : DataTypes.STRING(255),
                allowNull : true,
                comment   : '绝对地址',
            },
            path: {
                type      : DataTypes.STRING(255),
                allowNull : true,
                comment   : '物理地址',
            },
            type: {
                type         : DataTypes.ENUM('web', 'local'),
                allowNull    : true,
                defaultValue : 'local',
                comment      : '存储引擎',
            },
        },
        {
            hideDefaultArribute : false,
            comment             : '图片表',
        },
    );

    Image.associate = (models) => {};

    return Image;
};
