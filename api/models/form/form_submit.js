const base = require('../base');

module.exports = (sequelize, DataTypes) => {
  const FormSubmit = base(
    sequelize,
    DataTypes,
    'FormSubmit',
    {
      // 属性对象
      formId: {
        type: DataTypes.BIGINT,
        field: 'form_id',
        allowNull: false,
        defaultValue: '0',
        comment: '表单id',
      },
      formName: {
        type: DataTypes.STRING(255),
        field: 'form_name',
        allowNull: true,
        defaultValue: '',
        comment: '表单名称',
      },
      userId: {
        type: DataTypes.BIGINT,
        field: 'user_id',
        allowNull: true,
        defaultValue: '0',
        comment: '会员id',
      },
      money: {
        type: DataTypes.DECIMAL,
        allowNull: true,
        defaultValue: '0.00',
        comment: '总金额',
      },
      payState: {
        type: DataTypes.INTEGER(1).UNSIGNED,
        field: 'pay_state',
        allowNull: false,
        defaultValue: '2',
        comment: '2未支付，1已支付。支付状态',
      },
      state: {
        type: DataTypes.INTEGER(1),
        allowNull: true,
        defaultValue: '2',
        comment: '表单状态，1已处理，2未处理',
      },
      feedback: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '表单反馈',
      },
      ip: {
        type: DataTypes.STRING(20),
        allowNull: true,
        defaultValue: '',
        comment: '提交人ip',
      },
    },
    { hideDefaultArribute: false, comment: '用户对表的提交记录' },
  );

  FormSubmit.associate = (models) => {
    FormSubmit.belongsTo(models.User, { foreignKey: 'userId', constraints: false, as: 'user' });
    FormSubmit.belongsTo(models.Form, { foreignKey: 'formId', constraints: false, as: 'form' });
  };

  return FormSubmit;
};
