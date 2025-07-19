const base = require('../base');

module.exports = (sequelize, DataTypes) => {
    const FormItem = base(
        sequelize,
        DataTypes,
        'FormItem',
        {
            // 属性对象
            name: {
                type      : DataTypes.STRING(50),
                allowNull : true,
                comment   : '字段名称',
            },
            type: {
                type      : DataTypes.STRING(30),
                allowNull : true,
                comment   : '字段类型',
            },
            validationType: {
                type      : DataTypes.STRING(30),
                field     : 'validation_type',
                allowNull : true,
                comment   : '验证类型',
            },
            value: {
                type      : DataTypes.STRING(255),
                allowNull : true,
                comment   : '表单值',
            },
            defaultValue: {
                type      : DataTypes.STRING(255),
                field     : 'default_value',
                allowNull : true,
                comment   : '默认值',
            },
            formId: {
                type         : DataTypes.BIGINT,
                field        : 'form_id',
                allowNull    : true,
                defaultValue : '0',
                comment      : '表单id',
            },
            required: {
                type         : DataTypes.BOOLEAN,
                allowNull    : true,
                defaultValue : false,
                comment      : '是否必填，1必填，2不必填',
            },
            sort: {
                type         : DataTypes.INTEGER(5).UNSIGNED,
                allowNull    : true,
                defaultValue : '100',
                comment      : '排序',
            },
        },
        {
            hideDefaultArribute : false,
            comment             : '表单项表',
        },
    );

    FormItem.associate = (models) => {};

    return FormItem;
};
