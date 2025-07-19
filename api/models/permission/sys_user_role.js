const base = require('../base');

module.exports = (sequelize, DataTypes) => {
    const SysUserRole = base(
        sequelize,
        DataTypes,
        'SysUserRole',
        {
            sysUserId: {
                type: DataTypes.BIGINT,
                allowNull: true,
                field: 'sys_user_id',
                comment: '用户ID',
            },
            roleId: {
                type: DataTypes.BIGINT,
                allowNull: true,
                field: 'role_id',
                comment: '角色ID',
            },
            createdBy: {
                type: DataTypes.STRING(50),
                allowNull: true,
                field: 'created_by',
                comment: '创建人',
            },
            updatedBy: {
                type: DataTypes.STRING(50),
                allowNull: true,
                field: 'updated_by',
                comment: '更新人',
            },
        },
        { hideDefaultArribute: true, comment: '用户角色' },
    );

    SysUserRole.associate = (models) => {
        SysUserRole.belongsTo(models.SysUser, {
            foreignKey: 'sysUserId',
            constraints: false,
            as: 'sysUser',
        });
        SysUserRole.belongsTo(models.Role, { foreignKey: 'roleId', constraints: false, as: 'role' });
    };

    return SysUserRole;
};
