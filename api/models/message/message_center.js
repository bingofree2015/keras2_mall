const base = require('../base');

module.exports = (sequelize, DataTypes) => {
    const MessageCenter = base(
        sequelize,
        DataTypes,
        'MessageCenter',
        {
            // 属性对象
            code: {
                type: DataTypes.STRING(32),
                allowNull: true,
                comment: '编码',
            },
            sms: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                comment: '1 启用  2禁用',
            },
            message: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                comment: '站内消息',
            },
            wxTplMessage: {
                type: DataTypes.BOOLEAN,
                field: 'wx_tpl_message',
                allowNull: false,
                comment: '微信模板消息',
            },
        },
        { hideDefaultArribute: false, comment: '消息中心表' },
    );

    MessageCenter.associate = (models) => {};

    return MessageCenter;
};
