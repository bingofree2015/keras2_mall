const base = require('../base');

module.exports = (sequelize, DataTypes) => {
    const FormSubmitDetail = base(
        sequelize,
        DataTypes,
        'FormSubmitDetail',
        {
            // 属性对象
            submitId: {
                type: DataTypes.BIGINT,
                field: 'submit_id',
                allowNull: true,
                defaultValue: '0',
                comment: '提交表单id',
            },
            formId: {
                type: DataTypes.BIGINT,
                field: 'form_id',
                allowNull: true,
                defaultValue: '0',
                comment: '表单id',
            },
            formItemId: {
                type: DataTypes.BIGINT,
                field: 'form_item_id',
                allowNull: true,
                comment: '表单项id',
            },
            formItemName: {
                type: DataTypes.STRING(200),
                field: 'form_item_name',
                allowNull: true,
                defaultValue: '',
                comment: '表单项名称',
            },
            formItemValue: {
                type: DataTypes.TEXT,
                field: 'form_item_value',
                allowNull: true,
                comment: '表单项值',
            },
        },
        { hideDefaultArribute: false, comment: '提交表单保存大文本值表' },
    );

    FormSubmitDetail.associate = (models) => {};

    return FormSubmitDetail;
};
