const base = require('../base');

module.exports = (sequelize, DataTypes) => {
    const Menu = base(
        sequelize,
        DataTypes,
        'Menu',
        {
            name: {
                type: DataTypes.STRING(50),
                allowNull: true,
                comment: '菜单名称',
            },
            parentId: {
                type: DataTypes.BIGINT,
                allowNull: true,
                field: 'parent_id',
                comment: '父菜单ID，一级菜单为0',
            },
            url: {
                type: DataTypes.STRING(200),
                allowNull: true,
                comment:
          '菜单URL,类型：1.普通页面（如用户管理， /sys/user） 2.嵌套完整外部页面，以http(s)开头的链接 3.嵌套服务器页面，使用iframe:前缀+目标URL(如SQL监控， iframe:/druid/login.html, iframe:前缀会替换成服务器地址)',
            },
            perms: {
                type: DataTypes.STRING(500),
                allowNull: true,
                comment: '授权(多个用逗号分隔，如：sys:user:add,sys:user:edit)',
            },
            type: {
                type: DataTypes.INTEGER(11),
                allowNull: true,
                comment: '类型   0：目录   1：菜单   2：按钮',
            },
            icon: {
                type: DataTypes.STRING(50),
                allowNull: true,
                comment: '菜单图标',
            },
            orderNum: {
                type: DataTypes.INTEGER(11),
                allowNull: true,
                field: 'order_num',
                comment: '排序',
            },
            isShow: {
                type: DataTypes.BOOLEAN(),
                allowNull: false,
                field: 'is_show',
                defaultValue: true,
                comment: '显示/隐藏',
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
        { hideDefaultArribute: true, comment: '菜单' },
    );

    Menu.associate = (models) => {
        Menu.hasMany(Menu, { foreignKey: 'parentId', constraints: false, as: 'menus' });
        Menu.belongsToMany(models.Role, { through: models.RoleMenu, constraints: false, as: 'roles' });
    };

    return Menu;
};
