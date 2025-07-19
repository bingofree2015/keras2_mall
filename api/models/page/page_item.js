const base = require('../base');

module.exports = (sequelize, DataTypes) => {
    const PageItem = base(
        sequelize,
        DataTypes,
        'PageItem',
        {
            // 属性对象
            widgetCode: {
                type         : DataTypes.STRING(50),
                field        : 'widget_code',
                allowNull    : false,
                defaultValue : '',
                comment      : '组件编码',
            },
            pageCode: {
                type         : DataTypes.STRING(50),
                field        : 'page_code',
                allowNull    : false,
                defaultValue : '',
                comment      : '页面编码',
            },
            positionId: {
                type         : DataTypes.INTEGER(2).UNSIGNED,
                field        : 'position_id',
                allowNull    : false,
                defaultValue : '1',
                comment      : '布局位置',
            },
            sort: {
                type         : DataTypes.INTEGER(2).UNSIGNED,
                allowNull    : false,
                defaultValue : '1',
                comment      : '排序，越小越靠前',
            },
            params: {
                type      : DataTypes.TEXT,
                allowNull : true,
                comment   : '组件配置内容',
            },
        },
        {
            hideDefaultArribute : false,
            comment             : '组件元素表',
        },
    );

    PageItem.associate = (models) => {};

    return PageItem;
};
