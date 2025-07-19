const base = require('../base');

module.exports = (sequelize, DataTypes) => {
    const Attachment = base(
        sequelize,
        DataTypes,
        'Attachment',
        {
            attachGroupId: {
                type    : DataTypes.INTEGER(),
                field   : 'attach_group_id',
                comment : '分组Id',
            },
            name: {
                type      : DataTypes.STRING(64),
                allowNull : false,
                comment   : '文件名',
            },
            path: {
                type      : DataTypes.STRING(225),
                allowNull : false,
                comment   : '文件路径',
            },
            type: {
                type      : DataTypes.STRING(24),
                allowNull : false,
                comment   : '文件类型',
            },
            size: {
                type      : DataTypes.DECIMAL(8, 2),
                allowNull : true,
                comment   : '文件大小 kb',
            },
        },
        {
            hideDefaultArribute : false,
            comment             : '附件表',
        },
    );

    Attachment.associate = () => {};

    return Attachment;
};
