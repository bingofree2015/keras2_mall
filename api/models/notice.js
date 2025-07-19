const base = require('./base');

module.exports = (sequelize, DataTypes) => {
    const Notice = base(
        sequelize,
        DataTypes,
        'Notice',
        {
            // 属性对象
            title: {
                type      : DataTypes.STRING(200),
                allowNull : true,
                comment   : '公告标题',
            },
            content: {
                type      : DataTypes.TEXT,
                allowNull : true,
                comment   : '公告内容',
            },
            type: {
                type         : DataTypes.INTEGER(1).UNSIGNED,
                allowNull    : true,
                defaultValue : '1',
                comment      : '公告类型',
            },
            sort: {
                type         : DataTypes.INTEGER(3).UNSIGNED,
                allowNull    : true,
                defaultValue : '100',
                comment      : '排序 从小到大',
            },
        },
        {
            hideDefaultArribute : false,
            comment             : '插件表',
        },
    );

    Notice.associate = (models) => {};

    return Notice;
};
