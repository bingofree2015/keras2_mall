const base = require('../base');

module.exports = (sequelize, DataTypes) => {
  const WeixinMediaMessage = base(
    sequelize,
    DataTypes,
    'WeixinMediaMessage',
    {
      // 属性对象
      title: {
        type: DataTypes.STRING(200),
        allowNull: true,
        comment: '标题',
      },
      author: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: '作者',
      },
      brief: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '摘要',
      },
      attachmentId: {
        type: DataTypes.INTEGER,
        field: 'attachment_id',
        allowNull: true,
        comment: '封面',
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: '文章详情',
      },
      url: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '原文地址',
      },
    },
    { hideDefaultArribute: false, comment: '微信图文消息表' },
  );

  WeixinMediaMessage.associate = (models) => {};

  return WeixinMediaMessage;
};
