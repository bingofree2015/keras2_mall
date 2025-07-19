const base = require('./base');

module.exports = (sequelize, DataTypes) => {
  const File = base(
    sequelize,
    DataTypes,
    'File',
    {
      // 属性对象
      id: {
        type: DataTypes.CHAR(32),
        allowNull: false,
        primaryKey: true,
        comment: '视频ID',
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: '视频名称',
      },
      url: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '绝对地址',
      },
      path: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '物理地址',
      },
      type: {
        type: DataTypes.ENUM('web', 'local'),
        allowNull: true,
        defaultValue: 'local',
        comment: '存储引擎',
      },
      fileType: {
        type: DataTypes.ENUM('video'),
        field: 'file_type',
        allowNull: true,
        defaultValue: 'video',
        comment: '文件类型',
      },
    },
    { hideDefaultArribute: false, comment: '文件表' },
  );

  File.associate = (models) => {};

  return File;
};
