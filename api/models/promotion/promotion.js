const base = require('../base');

module.exports = (sequelize, DataTypes) => {
    const Promotion = base(
        sequelize,
        DataTypes,
        'Promotion',
        {
            // 属性对象
            name: {
                type: DataTypes.STRING(40),
                allowNull: false,
                comment: '促销名称',
            },
            state: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
                comment: '启用状态，true:开启，false:关闭',
            },
            type: {
                type: DataTypes.INTEGER(1).UNSIGNED,
                allowNull: false,
                defaultValue: '1',
                comment: '类型：1促销，2优惠券，3团购，4秒杀',
            },
            sort: {
                type: DataTypes.INTEGER(5).UNSIGNED,
                allowNull: false,
                defaultValue: '100',
                comment: '排序',
            },
            exclusive: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
                comment: '排他，1不排他，2排他',
            },
            autoReceive: {
                type: DataTypes.BOOLEAN,
                field: 'auto_receive',
                allowNull: false,
                defaultValue: true,
                comment: '当时优惠券的时候，自动是否自动领取，1自动领取，2不自动领取',
            },
            params: {
                type: DataTypes.JSON(),
                allowNull: true,
                comment: '其它参数',
            },
            startTime: {
                type: DataTypes.DATE(),
                field: 'start_time',
                allowNull: false,
                comment: '开始时间',
            },
            endTime: {
                type: DataTypes.DATE(),
                field: 'end_time',
                allowNull: false,
                comment: '结束时间',
            },
        },
        { hideDefaultArribute: false, comment: '促销表' },
    );

    Promotion.associate = (models) => {
        Promotion.hasMany(models.SpTarget, {
            foreignKey: 'promotionId',
            constraints: false,
            as: 'spTargets',
        });
        Promotion.hasMany(models.SpRule, {
            foreignKey: 'promotionId',
            constraints: false,
            as: 'spRules',
        });
    };

    return Promotion;
};
