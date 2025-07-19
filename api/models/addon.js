const base = require('./base');

module.exports = (sequelize, DataTypes) => {
    const Addon = base(
        sequelize,
        DataTypes,
        'Addon',
        {
            // 属性对象
            name: {
                type: DataTypes.STRING(40),
                allowNull: false,
                comment: '插件名或标识',
            },
            title: {
                type: DataTypes.STRING(20),
                allowNull: false,
                defaultValue: '',
                comment: '中文名',
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
                comment: '插件描述',
            },
            status: {
                type: DataTypes.INTEGER(1),
                allowNull: false,
                defaultValue: '1',
                comment: '状态',
            },
            config: {
                type: DataTypes.TEXT,
                allowNull: true,
                comment: '配置',
            },
            author: {
                type: DataTypes.STRING(40),
                allowNull: true,
                defaultValue: '',
                comment: '作者',
            },
            version: {
                type: DataTypes.STRING(20),
                allowNull: true,
                defaultValue: '',
                comment: '版本号',
            },
        },
        { hideDefaultArribute: false, comment: '插件表' },
    );

    Addon.associate = (models) => {};

    return Addon;
};
