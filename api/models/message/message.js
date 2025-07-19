const base = require('../base');

module.exports = (sequelize, DataTypes) => {
    const Message = base(
        sequelize,
        DataTypes,
        'Message',
        {
            // 属性对象
            userId: {
                type      : DataTypes.INTEGER(10),
                field     : 'user_id',
                allowNull : false,
                comment   : '用户id',
            },
            code: {
                type      : DataTypes.STRING(60),
                allowNull : false,
                comment   : '消息编码',
            },
            params: {
                type      : DataTypes.STRING(5000),
                allowNull : false,
                comment   : '参数',
            },
            content: {
                type      : DataTypes.TEXT,
                allowNull : false,
                comment   : '内容',
            },
            status: {
                type         : DataTypes.INTEGER(1).UNSIGNED,
                allowNull    : false,
                defaultValue : '1',
                comment      : '1未查看，2已查看',
            },
        },
        {
            hideDefaultArribute : false,
            comment             : '站内信',
        },
    );

    Message.associate = (models) => {};

    return Message;
};
