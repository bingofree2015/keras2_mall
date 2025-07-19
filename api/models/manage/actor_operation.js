const base = require('../base');

module.exports = (sequelize, DataTypes) => {
    const ActorOperation = base(
        sequelize,
        DataTypes,
        'ActorOperation',
        {
            // 属性对象
            actorId: {
                type: DataTypes.INTEGER(10),
                field: 'actor_id',
                allowNull: false,
                comment: '',
            },
            operationId: {
                type: DataTypes.INTEGER(10),
                field: 'operation_id',
                allowNull: false,
                comment: '',
            },
        },
        { hideDefaultArribute: false, comment: '店铺角色操作权限关联表' },
    );

    ActorOperation.associate = (models) => {};

    return ActorOperation;
};
