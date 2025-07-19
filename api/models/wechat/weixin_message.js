const base = require('../base');

module.exports = (sequelize, DataTypes) => {
  const WeixinMessage = base(
    sequelize,
    DataTypes,
    'WeixinMessage',
    {
      // 属性对象
      name: {
        type: DataTypes.STRING(200),
        allowNull: true,
        comment: '消息名称',
      },
      type: {
        type: DataTypes.INTEGER(1),
        allowNull: true,
        defaultValue: '1',
        comment: '消息类型1:文本消息，2:图文消息',
      },
      params: {
        type: DataTypes.JSON(),
        allowNull: true,
        comment: '消息参数',
      },
      isAttention: {
        type: DataTypes.BOOLEAN(),
        field: 'is_attention',
        allowNull: true,
        defaultValue: false,
        comment: '关注回复，true:是关注回复，false:不是关注回复',
      },
      isDefault: {
        type: DataTypes.BOOLEAN(),
        field: 'is_default',
        allowNull: true,
        defaultValue: false,
        comment: '是否默认回复，true:是，false:不是',
      },
      enable: {
        type: DataTypes.BOOLEAN(),
        allowNull: true,
        defaultValue: true,
        comment: 'true:启用，false:禁用',
      },
    },
    { hideDefaultArribute: false, comment: '微信消息表' },
  );

  WeixinMessage.associate = (models) => {};

  return WeixinMessage;
};
