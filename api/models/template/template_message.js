const base = require('../base');

module.exports = (sequelize, DataTypes) => {
    const TemplateMessage = base(
        sequelize,
        DataTypes,
        'TemplateMessage',
        {
            // 属性对象
            type: {
                type: DataTypes.STRING(32),
                allowNull: true,
                comment: '消息类型',
            },
            code: {
                type: DataTypes.STRING(32),
                allowNull: true,
                comment: '单号',
            },
            formId: {
                type: DataTypes.STRING(64),
                field: 'form_id',
                allowNull: true,
                comment: '要发生给的用户',
            },
            status: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: false,
                comment: '发送状态 1=未发送 2=已发送',
            },
        },
        { hideDefaultArribute: false, comment: '模板消息表' },
    );

    TemplateMessage.associate = (models) => {};

    return TemplateMessage;
};
