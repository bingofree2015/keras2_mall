const base = require('../base');

module.exports = (sequelize, DataTypes) => {
    const DbBackup = base(
        sequelize,
        DataTypes,
        'DbBackup',
        {
            path: {
                type      : DataTypes.STRING(255),
                allowNull : true,
                comment   : '备份文件路径',
            },
        },
        {
            hideDefaultArribute : false,
            comment             : '数据库备份日志',
        },
    );

    DbBackup.associate = () => {};

    return DbBackup;
};
