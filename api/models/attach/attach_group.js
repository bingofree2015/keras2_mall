const base = require('../base');

module.exports = (sequelize, DataTypes) => {
    const AttachGroup = base(
        sequelize,
        DataTypes,
        'AttachGroup',
        {
            name: {
                type: DataTypes.STRING(100),
                allowNull: false,
                comment: '分组名称',
            },
            remark: {
                type: DataTypes.STRING(255),
                allowNull: true,
                comment: '备注信息',
            },
        },
        { hideDefaultArribute: false, comment: '附件分组' },
    );

    AttachGroup.associate = (models) => {
        AttachGroup.hasMany(models.Attachment, {
            foreignKey: 'attachGroupId',
            constraints: false,
            as: 'attachments',
        });
    };

    return AttachGroup;
};
