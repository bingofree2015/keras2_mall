const base = require('../base');

module.exports = (sequelize, DataTypes) => {
    const Template = base(
        sequelize,
        DataTypes,
        'Template',
        {
            // 属性对象
            name: {
                type: DataTypes.STRING(200),
                allowNull: true,
                comment: '模板名称',
            },
            thTemplateId: {
                type: DataTypes.INTEGER(10).UNSIGNED,
                field: 'th_template_id',
                allowNull: true,
                comment: '模板ID，第三方平台id',
            },
            createTime: {
                type: DataTypes.INTEGER(10).UNSIGNED,
                field: 'create_time',
                allowNull: true,
                defaultValue: '0',
                comment: '创建时间',
            },
            userDesc: {
                type: DataTypes.STRING(200),
                field: 'user_desc',
                allowNull: true,
                comment: '模板描述',
            },
            sourceAppid: {
                type: DataTypes.STRING(100),
                field: 'source_appid',
                allowNull: true,
                comment: '模板APPID',
            },
            developer: {
                type: DataTypes.STRING(100),
                allowNull: true,
                comment: '模板开发者',
            },
            version: {
                type: DataTypes.STRING(100),
                allowNull: true,
                comment:
          '模板版本，总共3位，第一位表示重大版本升级，第二位表示小版本升级，第三位表示补丁或更新',
            },
            attachmentId: {
                type: DataTypes.INTEGER,
                field: 'attachment_id',
                allowNull: true,
                comment: '模板主图',
            },
            desc: {
                type: DataTypes.TEXT,
                allowNull: true,
                comment: '模板需要注意事项',
            },
            qrDemo: {
                type: DataTypes.CHAR(32),
                field: 'qr_demo',
                allowNull: true,
                comment: '二维码预览图片',
            },
            type: {
                type: DataTypes.INTEGER(1).UNSIGNED,
                allowNull: true,
                defaultValue: '1',
                comment: '模板类型，1为小程序',
            },
            extJson: {
                type: DataTypes.TEXT,
                field: 'ext_json',
                allowNull: true,
                comment: '模板增加模板配置字段',
            },
        },
        { hideDefaultArribute: false, comment: '模板列表' },
    );

    Template.associate = (models) => {};

    return Template;
};
