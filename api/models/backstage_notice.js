const base = require('./base');

module.exports = (sequelize, DataTypes) => {
    const BackstageNotice = base(
        sequelize,
        DataTypes,
        'BackstageNotice',
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
            sort: {
                type         : DataTypes.INTEGER(5).UNSIGNED,
                allowNull    : true,
                defaultValue : '100',
                comment      : '文章排序  从小到大',
            },
            isPub: {
                type      : DataTypes.INTEGER(1).UNSIGNED,
                field     : 'is_pub',
                allowNull : true,
                comment   : '1 发布  2 不发布',
            },
        },
        {
            hideDefaultArribute : false,
            comment             : '公告表',
        },
    );

    BackstageNotice.associate = (models) => {};

    return BackstageNotice;
};
