const base = require('../base');

module.exports = function (sequelize, DataTypes) {
    const Role = base(
        sequelize,
        DataTypes,
        'Role',
        {
            name: {
                type: DataTypes.STRING(100),
                allowNull: true,
                comment: '角色名称',
            },
            remark: {
                type: DataTypes.STRING(100),
                allowNull: true,
                comment: '备注',
            },
            delFlag: {
                type: DataTypes.INTEGER(4),
                allowNull: true,
                defaultValue: '0',
                field: 'del_flag',
                comment: '是否删除  -1：已删除  0：正常',
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
        { hideDefaultArribute: false, comment: '角色' },
    );

    Role.associate = (models) => {
        Role.belongsToMany(models.Menu, { through: models.RoleMenu, constraints: false, as: 'menus' });
        Role.belongsToMany(models.SysUser, {
            through: models.SysUserRole,
            constraints: false,
            as: 'sysUsers',
        });
    };

    return Role;
};
