const base = require('../base');

module.exports = (sequelize, DataTypes) => {
  const SysUser = base(
    sequelize,
    DataTypes,
    'SysUser',
    {
      username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: '用户名',
      },
      pwd: {
        type: DataTypes.STRING(28),
        allowNull: true,
        comment: '密码',
      },
      attachmentId: {
        type: DataTypes.INTEGER,
        field: 'attachment_id',
        comment: '头像',
      },
      salt: {
        type: DataTypes.STRING(40),
        allowNull: true,
        comment: '',
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: '邮箱',
      },
      mobile: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: '手机号',
      },
      state: {
        type: DataTypes.BOOLEAN(),
        defaultValue: true,
        comment: '状态  0：禁用   1：正常',
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
    { hideDefaultArribute: true, comment: '用户' },
  );

  SysUser.associate = (models) => {
    SysUser.belongsToMany(models.Role, {
      through: models.SysUserRole,
      constraints: false,
      as: 'roles',
    });
    SysUser.belongsTo(models.Attachment, {
      foreignKey: 'attachmentId',
      constraints: false,
      as: 'attachment',
    });
  };

  return SysUser;
};
