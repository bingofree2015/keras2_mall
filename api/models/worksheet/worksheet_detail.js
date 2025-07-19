const base = require('../base');

module.exports = (sequelize, DataTypes) => {
    const WorksheetDetail = base(
        sequelize,
        DataTypes,
        'WorksheetDetail',
        {
            // 属性对象
            jobNum: {
                type      : DataTypes.CHAR(20),
                field     : 'job_num',
                allowNull : false,
            },
            event: {
                type      : DataTypes.TEXT,
                allowNull : false,
            },
            createTime: {
                type      : DataTypes.INTEGER(11),
                field     : 'create_time',
                allowNull : false,
            },
            picPath: {
                type      : DataTypes.STRING(255),
                field     : 'pic_path',
                allowNull : false,
            },
        },
        {
            hideDefaultArribute : false,
            comment             : '工单明细表',
        },
    );

    WorksheetDetail.associate = (models) => {};

    return WorksheetDetail;
};
