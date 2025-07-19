const base = require('../base');

module.exports = (sequelize, DataTypes) => {
    const Dict = base(
        sequelize,
        DataTypes,
        'Dict',
        {
            value: {
                type      : DataTypes.STRING(100),
                allowNull : false,
                comment   : '数据值',
            },
            label: {
                type      : DataTypes.STRING(100),
                allowNull : false,
                comment   : '标签名',
            },
            type: {
                type      : DataTypes.STRING(100),
                allowNull : false,
                comment   : '类型',
            },
            description: {
                type      : DataTypes.STRING(100),
                allowNull : false,
                comment   : '描述',
            },
            sort: {
                type      : DataTypes.DECIMAL,
                allowNull : false,
                comment   : '排序（升序）',
            },
            remark: {
                type      : DataTypes.STRING(255),
                allowNull : true,
                comment   : '备注信息',
            },
            delFlag: {
                type         : DataTypes.INTEGER(4),
                allowNull    : true,
                defaultValue : '0',
                field        : 'del_flag',
                comment      : '是否删除  -1：已删除  0：正常',
            },
            createdBy: {
                type      : DataTypes.STRING(50),
                allowNull : true,
                field     : 'created_by',
                comment   : '创建人',
            },
            updatedBy: {
                type      : DataTypes.STRING(50),
                allowNull : true,
                field     : 'updated_by',
                comment   : '更新人',
            },
        },
        {
            hideDefaultArribute : false,
            comment             : '字典',
        },
    );

    Dict.associate = () => {};

    return Dict;
};
