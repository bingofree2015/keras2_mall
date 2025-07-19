const base = require('../base');

module.exports = (sequelize, DataTypes) => {
    const Form = base(
        sequelize,
        DataTypes,
        'Form',
        {
            // 属性对象
            name: {
                type: DataTypes.STRING(100),
                allowNull: true,
                comment: '表单名称',
            },
            type: {
                type: DataTypes.INTEGER(1).UNSIGNED,
                allowNull: false,
                defaultValue: 2,
                comment: '1:订单; 2:付款码; 3:留言; 4:反馈; 5:登记; 6:调研',
            },
            sort: {
                type: DataTypes.INTEGER(5).UNSIGNED,
                allowNull: true,
                defaultValue: '100',
                comment: '表单排序',
            },
            desc: {
                type: DataTypes.STRING(255),
                allowNull: true,
                comment: '表单描述',
            },
            headType: {
                type: DataTypes.INTEGER(1).UNSIGNED,
                field: 'head_type',
                allowNull: true,
                defaultValue: 1,
                comment: '1图片 2轮播 3视频',
            },
            headTypeValue: {
                type: DataTypes.STRING(512),
                field: 'head_type_value',
                allowNull: true,
                comment: '表单头值',
            },
            headTypeVideo: {
                type: DataTypes.STRING(64),
                field: 'head_type_video',
                allowNull: true,
                comment: '',
            },
            buttonName: {
                type: DataTypes.STRING(50),
                field: 'button_name',
                allowNull: true,
                comment: '表单提交按钮名称',
            },
            buttonColor: {
                type: DataTypes.STRING(30),
                field: 'button_color',
                allowNull: true,
                comment: '表单按钮颜色',
            },
            isLogin: {
                type: DataTypes.BOOLEAN,
                field: 'is_login',
                allowNull: true,
                defaultValue: false,
                comment: '是否需要登录1需要2不需要',
            },
            qrcode: {
                type: DataTypes.STRING(200),
                allowNull: true,
                comment: '二维码图片地址',
            },
            returnMsg: {
                type: DataTypes.STRING(200),
                field: 'return_msg',
                allowNull: true,
                defaultValue: '',
                comment: '提交后提示语',
            },
            endDate: {
                type: DataTypes.DATE(),
                field: 'end_date',
                allowNull: true,
                comment: '到期时间',
            },
        },
        { hideDefaultArribute: false, comment: '表单' },
    );

    Form.associate = (models) => {
        Form.hasMany(models.FormItem, { foreignKey: 'formId', constraints: false, as: 'formItems' });
    };

    return Form;
};
