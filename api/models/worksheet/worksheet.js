const base = require('../base');

module.exports = (sequelize, DataTypes) => {
    const Worksheet = base(
        sequelize,
        DataTypes,
        'Worksheet',
        {
            // 属性对象
            phone: {
                type      : DataTypes.CHAR(11),
                allowNull : false,
                comment   : '',
            },
            status: {
                type         : DataTypes.CHAR(10),
                allowNull    : false,
                defaultValue : '未处理',
                comment      : '',
            },
            jobNum: {
                type      : DataTypes.STRING(20),
                field     : 'job_num',
                allowNull : false,
                comment   : '工单号',
            },
            createTime: {
                type      : DataTypes.INTEGER(11),
                field     : 'create_time',
                allowNull : false,
                comment   : '提交时间',
            },
            type: {
                type      : DataTypes.CHAR(10),
                allowNull : false,
                comment   : '',
            },
            title: {
                type      : DataTypes.STRING(20),
                allowNull : false,
                comment   : '',
            },
            content: {
                type      : DataTypes.STRING(255),
                allowNull : false,
                comment   : '',
            },
        },
        {
            hideDefaultArribute : false,
            comment             : '工单表',
        },
    );

    Worksheet.associate = (models) => {};

    return Worksheet;
};
