const base = require('./base');

module.exports = (sequelize, DataTypes) => {
  const Ship = base(
    sequelize,
    DataTypes,
    'Ship',
    {
      // 属性对象
      name: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: '配送方式名称',
      },
      hasCod: {
        type: DataTypes.BOOLEAN(),
        field: 'has_cod',
        allowNull: true,
        defaultValue: false,
        comment: '是否货到付款 false:不是货到付款; true:是货到付款',
      },
      firstUnit: {
        type: DataTypes.INTEGER(8).UNSIGNED,
        field: 'first_unit',
        allowNull: true,
        comment: '首重',
      },
      continueUnit: {
        type: DataTypes.INTEGER(8).UNSIGNED,
        field: 'continue_unit',
        allowNull: true,
        comment: '续重',
      },
      defAreaFee: {
        type: DataTypes.BOOLEAN,
        field: 'def_area_fee',
        allowNull: true,
        defaultValue: true,
        comment: '按地区设置配送费用是否启用默认配送费用 true:启用; false:不启用',
      },
      type: {
        type: DataTypes.INTEGER(1).UNSIGNED,
        allowNull: true,
        defaultValue: 0,
        comment: '地区类型 0:全部地区;1:指定地区',
      },
      firstUnitPrice: {
        type: DataTypes.DECIMAL,
        field: 'first_unit_price',
        allowNull: true,
        comment: '首重费用',
      },
      continueUnitPrice: {
        type: DataTypes.DECIMAL,
        field: 'continue_unit_price',
        allowNull: true,
        comment: '续重费用',
      },
      exp: {
        type: DataTypes.STRING(),
        allowNull: true,
        comment: '配送费用计算表达式',
      },
      logiName: {
        type: DataTypes.STRING(50),
        field: 'logi_name',
        allowNull: true,
        comment: '物流公司名称',
      },
      logiCode: {
        type: DataTypes.STRING(50),
        field: 'logi_code',
        allowNull: true,
        comment: '物流公司编码',
      },
      isDef: {
        type: DataTypes.BOOLEAN,
        field: 'is_def',
        allowNull: true,
        defaultValue: false,
        comment: '是否默认 true:默认; false:不默认',
      },
      sort: {
        type: DataTypes.INTEGER(5).UNSIGNED,
        allowNull: true,
        defaultValue: '100',
        comment: '配送方式排序 越小越靠前',
      },
      state: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true,
        comment: '状态 true:正常; false:停用',
      },
      freePostage: {
        type: DataTypes.BOOLEAN,
        field: 'free_postage',
        allowNull: true,
        defaultValue: false,
        comment: '是否包邮，true:包邮; false:不包邮',
      },
      areaFee: {
        type: DataTypes.JSON(),
        field: 'area_fee',
        allowNull: true,
        comment: '地区配送费用',
      },
      goodsMoney: {
        type: DataTypes.DECIMAL,
        field: 'goods_money',
        allowNull: true,
        defaultValue: '0.00',
        comment: '商品总额满多少免运费',
      },
    },
    { hideDefaultArribute: false, comment: '配送方式表' },
  );

  Ship.associate = (models) => {
    Ship.belongsTo(models.Logistics, {
      foreignKey: 'logiCode',
      sourceKey: 'logiCode',
      constraints: false,
      as: 'logistics',
    });
  };

  return Ship;
};
