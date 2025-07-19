const base = require('../base');

module.exports = (sequelize, DataTypes) => {
    const WeixinAuthor = base(
        sequelize,
        DataTypes,
        'WeixinAuthor',
        {
            // 属性对象
            nickname: {
                type: DataTypes.STRING(255),
                allowNull: true,
                comment: '授权方昵称',
            },
            headImg: {
                type: DataTypes.STRING(255),
                field: 'head_img',
                allowNull: true,
                comment: '授权方头像',
            },
            serviceTypeInfo: {
                type: DataTypes.STRING(10),
                field: 'service_type_info',
                allowNull: true,
                defaultValue: '0',
                comment: '默认为0',
            },
            verifyTypeInfo: {
                type: DataTypes.INTEGER(1),
                field: 'verify_type_info',
                allowNull: true,
                defaultValue: '-1',
                comment: '授权方认证类型，-1代表未认证，0代表微信认证',
            },
            username: {
                type: DataTypes.STRING(200),
                allowNull: true,
                comment: '小程序的原始ID',
            },
            signature: {
                type: DataTypes.TEXT,
                allowNull: true,
                comment: '帐号介绍',
            },
            principalName: {
                type: DataTypes.STRING(255),
                field: 'principal_name',
                allowNull: true,
                comment: '小程序的主体名称',
            },
            businessInfo: {
                type: DataTypes.TEXT,
                field: 'business_info',
                allowNull: true,
                comment:
          '用以了解以下功能的开通状况（0代表未开通，1代表已开通）： open_store:是否开通微信门店功能 open_scan:是否开通微信扫商品功能 open_pay:是否开通微信支付功能 open_card:是否开通微信卡券功能 open_shake:是否开通微信摇一摇功能',
            },
            qrcodeUrl: {
                type: DataTypes.STRING(255),
                field: 'qrcode_url',
                allowNull: true,
                comment: '二维码图片的URL',
            },
            authorizationInfo: {
                type: DataTypes.TEXT,
                field: 'authorization_info',
                allowNull: true,
                comment: '授权信息',
            },
            appId: {
                type: DataTypes.STRING(255),
                field: 'app_Id',
                allowNull: true,
                comment: '授权方appid',
            },
            appSecret: {
                type: DataTypes.STRING(100),
                field: 'app_secret',
                allowNull: true,
                comment: '授权方AppSecret',
            },
            miniProgramInfo: {
                type: DataTypes.TEXT,
                field: 'mini_program_info',
                allowNull: true,
                comment: '可根据这个字段判断是否为小程序类型授权,有值为小程序',
            },
            funcInfo: {
                type: DataTypes.TEXT,
                field: 'func_info',
                allowNull: true,
                comment:
          '小程序授权给开发者的权限集列表，ID为17到19时分别代表： 17.帐号管理权限 18.开发管理权限 19.客服消息管理权限 请注意： 1）该字段的返回不会考虑小程序是否具备该权限集的权限（因为可能部分具备）',
            },
            authorizerRefreshToken: {
                type: DataTypes.STRING(200),
                field: 'authorizer_refresh_token',
                allowNull: true,
                comment: '刷新token',
            },
            authorizerAccessToken: {
                type: DataTypes.STRING(200),
                field: 'authorizer_access_token',
                allowNull: true,
                comment: 'token',
            },
            bindType: {
                type: DataTypes.INTEGER(1).UNSIGNED,
                field: 'bind_type',
                allowNull: true,
                defaultValue: '2',
                comment: '绑定类型，1为第三方授权绑定，2为自助绑定',
            },
            authorType: {
                type: DataTypes.STRING(10),
                field: 'author_type',
                allowNull: true,
                defaultValue: 'b2c',
                comment: '授权类型，默认b2c',
            },
            expiresIn: {
                type: DataTypes.INTEGER(10).UNSIGNED,
                field: 'expires_in',
                allowNull: true,
                defaultValue: '0',
                comment: '绑定授权到期时间',
            },
        },
        { hideDefaultArribute: false, comment: '获取授权方的帐号基本信息表' },
    );

    WeixinAuthor.associate = (models) => {};

    return WeixinAuthor;
};
