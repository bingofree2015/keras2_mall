const base = require('../base');

module.exports = (sequelize, DataTypes) => {
  const Store = base(
    sequelize,
    DataTypes,
    'Store',
    {
      // 属性对象
      storeName: {
        type: DataTypes.STRING(125),
        field: 'store_name',
        allowNull: true,
        comment: '门店名称',
      },
      mobile: {
        type: DataTypes.STRING(13),
        allowNull: true,
        comment: '门店电话/手机号',
      },
      linkman: {
        type: DataTypes.STRING(32),
        allowNull: true,
        comment: '门店联系人',
      },
      attachmentId: {
        type: DataTypes.INTEGER,
        field: 'attachment_id',
        allowNull: true,
        comment: '门店logo',
      },
      areaId: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        field: 'area_id',
        allowNull: true,
        comment: '门店地区id',
      },
      address: {
        type: DataTypes.STRING(200),
        allowNull: true,
        comment: '门店详细地址',
      },
      coordinate: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: '',
      },
      latitude: {
        type: DataTypes.STRING(40),
        allowNull: true,
        comment: '纬度',
      },
      longitude: {
        type: DataTypes.STRING(40),
        allowNull: true,
        comment: '经度',
      },
    },
    { hideDefaultArribute: false, comment: '门店表' },
  );

  Store.associate = (models) => {
    Store.belongsTo(models.Attachment, {
      foreignKey: 'attachmentId',
      constraints: false,
      as: 'attachment',
    });
  };

  return Store;
};
