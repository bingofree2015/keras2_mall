const base = require('./base');

module.exports = (sequelize, DataTypes) => {
  const Job = base(
    sequelize,
    DataTypes,
    'Job',
    {
      // 属性对象
      queue: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: '',
      },
      payload: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: '',
      },
      attempt: {
        type: DataTypes.INTEGER(3).UNSIGNED,
        allowNull: false,
        comment: '',
      },
      reserved: {
        type: DataTypes.INTEGER(3).UNSIGNED,
        allowNull: false,
        comment: '',
      },
      reservedAt: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        field: 'reserved_at',
        allowNull: true,
        comment: '',
      },
      availableAt: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        field: 'available_at',
        allowNull: false,
        comment: '',
      },
    },
    { hideDefaultArribute: false, comment: '队列表' },
  );

  Job.associate = (models) => {};

  return Job;
};
