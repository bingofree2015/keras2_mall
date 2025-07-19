const base = require('../base');

module.exports = (sequelize, DataTypes) => {
    const WeixinPublish = base(
        sequelize,
        DataTypes,
        'WeixinPublish',
        {
            // 属性对象
            templateId: {
                type         : DataTypes.INTEGER(10).UNSIGNED,
                field        : 'template_id',
                allowNull    : true,
                defaultValue : '0',
                comment      : '模板id，不是第三方平台模板id',
            },
            auditStatus: {
                type      : DataTypes.INTEGER(1),
                field     : 'audit_status',
                allowNull : true,
                comment   : '审核状态，其中0为审核成功，1为审核失败，2为审核中,-1为未提交审核',
            },
            reason: {
                type      : DataTypes.TEXT,
                allowNull : true,
                comment   : '审核反馈',
            },
            publishStatus: {
                type         : DataTypes.INTEGER(1),
                field        : 'publish_status',
                allowNull    : true,
                defaultValue : '0',
                comment      : '发布状态，0未发布，1已发布，2发布成功，3发布失败',
            },
            publishMsg: {
                type      : DataTypes.TEXT,
                field     : 'publish_msg',
                allowNull : true,
                comment   : '发布反馈',
            },
            auditId: {
                type      : DataTypes.STRING(50),
                field     : 'audit_id',
                allowNull : true,
                comment   : '审核id',
            },
            extJson: {
                type      : DataTypes.TEXT,
                field     : 'ext_json',
                allowNull : true,
                comment   : '第三方自定义的json',
            },
            userVersion: {
                type         : DataTypes.STRING(50),
                field        : 'user_version',
                allowNull    : true,
                defaultValue : '',
                comment      : '代码版本号',
            },
            userDesc: {
                type      : DataTypes.STRING(200),
                field     : 'user_desc',
                allowNull : true,
                comment   : '代码描述',
            },
            appid: {
                type      : DataTypes.STRING(100),
                allowNull : true,
                comment   : '授权appid',
            },
            qrcode: {
                type      : DataTypes.STRING(255),
                allowNull : true,
                comment   : '预览二维码',
            },
        },
        {
            hideDefaultArribute : false,
            comment             : '小程序发布审核表',
        },
    );

    WeixinPublish.associate = (models) => {};

    return WeixinPublish;
};
