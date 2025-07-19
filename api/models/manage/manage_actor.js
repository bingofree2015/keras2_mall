const base = require('../base');

module.exports = (sequelize, DataTypes) => {
    const ManageActor = base(
        sequelize,
        DataTypes,
        'ManageActor',
        {
            // 属性对象
            manageId: {
                type: DataTypes.INTEGER(10).UNSIGNED,
                field: 'manage_id',
                allowNull: false,
                comment: '管理员ID 关联manage.id',
            },
            actorId: {
                type: DataTypes.INTEGER(10).UNSIGNED,
                field: 'actor_id',
                allowNull: true,
                comment: '角色ID 关联actor.id',
            },
        },
        { hideDefaultArribute: false, comment: '管理员和角色关系表' },
    );

    ManageActor.associate = (models) => {};

    return ManageActor;
};
